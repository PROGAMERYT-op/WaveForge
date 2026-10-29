#!/usr/bin/env bash
# ============================================================================
# WaveForge v3.1 — 1-Command GitHub Codespaces Auto-Deploy Script
# Usage inside GitHub Codespaces terminal:
#   unzip -o WaveForge-v3.1-Final.zip && bash deploy.sh
# ============================================================================
set -e

echo "🎵 Starting WaveForge v3.1 Automated Deployment..."

if [ ! -d ".git" ] && [ -d "../.git" ]; then
    echo "📂 Copying upgraded files into repository root..."
    cp -Rf ./* ../
    cd ..
fi

# Clean up any uploaded zip archives so they do not bloat the Git repository
rm -f WaveForge-v3.1-Final.zip WaveForge-v3-Upgraded*.zip WaveForge-main.zip

echo "✅ Verifying WaveForge v3.1 files..."
for req in index.html visualizer.html sw.js sitemap.xml assets/js/app.js assets/js/ads.js Visualizers/tunnel.js Visualizers/trapnation.js Visualizers/synthwave.js; do
    if [ ! -f "$req" ]; then
        echo "❌ Missing expected file: $req"
        exit 1
    fi
done

echo "📦 Staging all updated files (including visualizer.html, index.html, sw.js)..."
git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No file changes detected to commit."
else
    COMMIT_MSG="feat(v3.1): update visualizer.html, remove fake gift buttons, and force cache refresh"
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🚀 Pushing to origin/$BRANCH..."
    git push origin "$BRANCH"
    echo "🎉 SUCCESS! WaveForge v3.1 (including visualizer.html) is now live and pushed to GitHub ($BRANCH)!"
fi
