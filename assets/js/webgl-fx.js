/**
 * WaveForge Studio v10.2 — WebGL2 Beat-Synced Post-FX Shader Engine
 * Zero-dependency GPU fragment shader pass for:
 *  - Chromatic Aberration (RGB Split)
 *  - Digital Glitch & Block Stutter
 *  - VHS / Analog Tape Drift & Grain
 *  - Radial Kick Zoom-Blur
 * Automatically disables heavy ReadPixels pass on software WebGL renderers
 * (SwiftShader / llvmpipe / Basic Render) to prevent GPU stalls and export freezes.
 */
(function (global) {
    'use strict';

    const VERT_SRC = `#version 300 es
        in vec2 a_pos;
        out vec2 v_uv;
        void main() {
            v_uv = a_pos * 0.5 + 0.5;
            v_uv.y = 1.0 - v_uv.y;
            gl_Position = vec4(a_pos, 0.0, 1.0);
        }
    `;

    const FRAG_SRC = `#version 300 es
        precision highp float;
        uniform sampler2D u_tex;
        uniform float u_time;
        uniform float u_chromatic;
        uniform float u_glitch;
        uniform float u_vhs;
        uniform float u_zoomblur;
        uniform float u_kick;
        in vec2 v_uv;
        out vec4 outColor;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
            vec2 uv = v_uv;

            // 1. VHS Analog Tape Wave & Tracking Jitter
            if (u_vhs > 0.001) {
                float wave = sin(uv.y * 42.0 + u_time * 9.0) * 0.0022 * u_vhs;
                float band = smoothstep(0.92, 1.0, sin(uv.y * 5.0 - u_time * 2.4)) * 0.007 * u_vhs;
                uv.x += wave + band;
            }

            // 2. Beat-Synced Digital Glitch Block Displacement
            if (u_glitch > 0.001) {
                float gTrigger = u_glitch * (0.35 + u_kick * 1.15);
                float sliceY = floor(uv.y * 22.0);
                float rnd = hash(vec2(sliceY, floor(u_time * 18.0)));
                if (rnd > 1.0 - min(0.55, gTrigger * 0.45)) {
                    float shift = (hash(vec2(sliceY * 3.1, floor(u_time * 24.0))) - 0.5) * 0.09 * gTrigger;
                    uv.x = fract(uv.x + shift);
                }
            }

            // 3. Radial Kick Zoom-Blur + Chromatic Aberration (RGB Split)
            vec2 dir = uv - vec2(0.5);
            float dist = length(dir);
            float caAmt = u_chromatic * (0.004 + u_kick * 0.018) * (0.4 + dist * 1.2);
            vec2 caOff = normalize(dir + vec2(0.0001)) * caAmt;

            vec3 col;
            if (u_zoomblur > 0.001 && u_kick > 0.05) {
                float zb = u_zoomblur * u_kick * 0.032;
                vec3 acc = vec3(0.0);
                for (int i = 0; i < 6; i++) {
                    float f = float(i) / 5.0;
                    vec2 sampleUv = clamp(uv - dir * zb * f, 0.001, 0.999);
                    acc.r += texture(u_tex, clamp(sampleUv + caOff, 0.001, 0.999)).r;
                    acc.g += texture(u_tex, sampleUv).g;
                    acc.b += texture(u_tex, clamp(sampleUv - caOff, 0.001, 0.999)).b;
                }
                col = acc / 6.0;
            } else {
                col.r = texture(u_tex, clamp(uv + caOff, 0.001, 0.999)).r;
                col.g = texture(u_tex, clamp(uv, 0.001, 0.999)).g;
                col.b = texture(u_tex, clamp(uv - caOff, 0.001, 0.999)).b;
            }

            // 4. VHS Subtle Grain & Scanline Tint
            if (u_vhs > 0.001) {
                float grain = (hash(uv * 500.0 + fract(u_time * 13.7)) - 0.5) * 0.12 * u_vhs;
                float scan = sin(uv.y * 420.0) * 0.045 * u_vhs;
                col += grain - scan;
            }

            outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
        }
    `;

    class WebGLPostFX {
        constructor() {
            this.supported = false;
            this.isSoftwareRenderer = false;
            this.canvas = document.createElement('canvas');
            try {
                const gl = this.canvas.getContext('webgl2', {
                    alpha: false,
                    antialias: false,
                    depth: false,
                    stencil: false,
                    preserveDrawingBuffer: false,
                    powerPreference: 'high-performance',
                    failIfMajorPerformanceCaveat: true
                });
                if (!gl) return;

                // Detect software rasterizers (SwiftShader, llvmpipe, Basic Render) where ReadPixels causes severe stalls
                try {
                    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
                    const renderer = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER) || '').toLowerCase();
                    if (/swiftshader|llvmpipe|software|basic render|subzero|mesa offscreen/.test(renderer)) {
                        this.isSoftwareRenderer = true;
                        this.supported = false;
                        return;
                    }
                } catch (e) {}

                this.gl = gl;
                this._initPipeline();
            } catch (e) {
                this.supported = false;
            }
        }

        _compile(type, src) {
            const gl = this.gl;
            const sh = gl.createShader(type);
            gl.shaderSource(sh, src);
            gl.compileShader(sh);
            if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
                gl.deleteShader(sh);
                return null;
            }
            return sh;
        }

        _initPipeline() {
            const gl = this.gl;
            const vs = this._compile(gl.VERTEX_SHADER, VERT_SRC);
            const fs = this._compile(gl.FRAGMENT_SHADER, FRAG_SRC);
            if (!vs || !fs) return;

            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

            this.program = prog;
            gl.useProgram(prog);

            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

            const loc = gl.getAttribLocation(prog, 'a_pos');
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

            this.tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            this.u = {
                time: gl.getUniformLocation(prog, 'u_time'),
                chromatic: gl.getUniformLocation(prog, 'u_chromatic'),
                glitch: gl.getUniformLocation(prog, 'u_glitch'),
                vhs: gl.getUniformLocation(prog, 'u_vhs'),
                zoomblur: gl.getUniformLocation(prog, 'u_zoomblur'),
                kick: gl.getUniformLocation(prog, 'u_kick')
            };

            this.supported = true;
        }

        apply(targetCtx, srcCanvas, w, h, params) {
            if (!this.supported || this.isSoftwareRenderer || !srcCanvas) return false;
            const ca = Math.max(0, (params.chromatic || 0) / 100);
            const glt = Math.max(0, (params.glitch || 0) / 100);
            const vhs = Math.max(0, (params.vhs || 0) / 100);
            const zb = Math.max(0, (params.zoomBlur || 0) / 100);
            const kick = Math.max(0, Math.min(1.5, params.kick || 0));

            // Skip GPU readback pass completely if no visible shader effect will be rendered
            if (ca < 0.005 && glt < 0.005 && vhs < 0.005 && (zb < 0.005 || kick <= 0.05)) return false;

            const gl = this.gl;
            if (gl.isContextLost && gl.isContextLost()) {
                this.supported = false;
                return false;
            }
            const cw = srcCanvas.width;
            const ch = srcCanvas.height;
            if (cw < 2 || ch < 2) return false;
            if (this.canvas.width !== cw || this.canvas.height !== ch) {
                this.canvas.width = cw;
                this.canvas.height = ch;
                gl.viewport(0, 0, cw, ch);
            }

            gl.useProgram(this.program);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, srcCanvas);

            gl.uniform1f(this.u.time, params.time || 0);
            gl.uniform1f(this.u.chromatic, ca);
            gl.uniform1f(this.u.glitch, glt);
            gl.uniform1f(this.u.vhs, vhs);
            gl.uniform1f(this.u.zoomblur, zb);
            gl.uniform1f(this.u.kick, kick);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            targetCtx.save();
            targetCtx.setTransform(1, 0, 0, 1, 0, 0);
            targetCtx.drawImage(this.canvas, 0, 0, cw, ch);
            targetCtx.restore();
            return true;
        }
    }

    global.WaveForgeFX = new WebGLPostFX();
})(window);
