#!/usr/bin/env bash
# ============================================================================
# WaveForge Studio v5.1 Turbo — 1-Command GitHub Codespaces Auto-Deploy Script
# Usage inside GitHub Codespaces terminal:
#   unzip -o WaveForge-v5.1-Turbo.zip && bash deploy.sh
# ============================================================================
set -e

echo "🎵 Starting WaveForge Studio v5.1 Turbo Automated Deployment..."

if [ ! -d ".git" ] && [ -d "../.git" ]; then
    echo "📂 Copying upgraded files into repository root..."
    cp -Rf ./* ../
    cd ..
fi

# Clean up any uploaded zip archives so they do not bloat the Git repository
rm -f WaveForge-v5.1-Turbo.zip WaveForge-v5*.zip WaveForge-v4*.zip WaveForge-v3*.zip WaveForge-main.zip

echo "✅ Verifying WaveForge Studio v5.1 files..."
for req in index.html visualizer.html sw.js sitemap.xml assets/js/app.js assets/js/ads.js assets/css/landing.css assets/css/app.css Visualizers/bars.js Visualizers/spectrogram.js; do
    if [ ! -f "$req" ]; then
        echo "❌ Missing expected file: $req"
        exit 1
    fi
done

echo "📦 Staging all updated v5.1 files..."
git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No file changes detected to commit."
else
    COMMIT_MSG="perf(v5.1): add zero-suspend Radix-2 FFT Turbo MP4 export engine & clean Bar/Spectrogram modes"
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🚀 Pushing to origin/$BRANCH..."
    git push origin "$BRANCH"
    echo "🎉 SUCCESS! WaveForge Studio v5.1 Turbo is now live and pushed to GitHub ($BRANCH)!"
fi
