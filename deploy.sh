#!/usr/bin/env bash
# ============================================================================
# WaveForge Studio v5.0 Ultra — 1-Command GitHub Codespaces Auto-Deploy Script
# Usage inside GitHub Codespaces terminal:
#   unzip -o WaveForge-v5.0-Ultra.zip && bash deploy.sh
# ============================================================================
set -e

echo "🎵 Starting WaveForge Studio v5.0 Ultra Automated Deployment..."

if [ ! -d ".git" ] && [ -d "../.git" ]; then
    echo "📂 Copying upgraded files into repository root..."
    cp -Rf ./* ../
    cd ..
fi

# Clean up any uploaded zip archives so they do not bloat the Git repository
rm -f WaveForge-v5.0-Ultra.zip WaveForge-v4*.zip WaveForge-v3*.zip WaveForge-main.zip

echo "✅ Verifying WaveForge Studio v5.0 files..."
for req in index.html visualizer.html sw.js sitemap.xml assets/js/app.js assets/js/ads.js assets/css/landing.css assets/css/app.css Visualizers/bars.js Visualizers/wave.js Visualizers/radial.js Visualizers/particles.js Visualizers/tunnel.js Visualizers/trapnation.js Visualizers/synthwave.js; do
    if [ ! -f "$req" ]; then
        echo "❌ Missing expected file: $req"
        exit 1
    fi
done

echo "📦 Staging all redesigned v5.0 files..."
git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No file changes detected to commit."
else
    COMMIT_MSG="feat(v5.0): overhaul all 12 visualizer engines, add studio onboarding, quick-mode strip & 3D spotlight UX"
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🚀 Pushing to origin/$BRANCH..."
    git push origin "$BRANCH"
    echo "🎉 SUCCESS! WaveForge Studio v5.0 Ultra is now live and pushed to GitHub ($BRANCH)!"
fi
