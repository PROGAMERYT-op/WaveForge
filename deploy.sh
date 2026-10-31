#!/usr/bin/env bash
# ============================================================================
# WaveForge Studio v4.0 — 1-Command GitHub Codespaces Auto-Deploy Script
# Usage inside GitHub Codespaces terminal:
#   unzip -o WaveForge-v4.0-Premium.zip && bash deploy.sh
# ============================================================================
set -e

echo "🎵 Starting WaveForge Studio v4.0 Automated Deployment..."

if [ ! -d ".git" ] && [ -d "../.git" ]; then
    echo "📂 Copying upgraded files into repository root..."
    cp -Rf ./* ../
    cd ..
fi

# Clean up any uploaded zip archives so they do not bloat the Git repository
rm -f WaveForge-v4.0-Premium.zip WaveForge-v3*.zip WaveForge-main.zip

echo "✅ Verifying WaveForge Studio v4.0 files..."
for req in index.html visualizer.html sw.js sitemap.xml assets/js/app.js assets/js/ads.js assets/css/landing.css assets/css/app.css Visualizers/tunnel.js Visualizers/trapnation.js Visualizers/synthwave.js; do
    if [ ! -f "$req" ]; then
        echo "❌ Missing expected file: $req"
        exit 1
    fi
done

echo "📦 Staging all redesigned v4.0 files..."
git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No file changes detected to commit."
else
    COMMIT_MSG="feat(v4.0): complete premium UI redesign for landing & studio, ad-free home page"
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🚀 Pushing to origin/$BRANCH..."
    git push origin "$BRANCH"
    echo "🎉 SUCCESS! WaveForge Studio v4.0 is now live and pushed to GitHub ($BRANCH)!"
fi
