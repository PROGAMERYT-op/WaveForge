#!/usr/bin/env bash
# ============================================================================
# WaveForge v3.0 — 1-Command GitHub Codespaces Auto-Deploy Script
# Usage inside GitHub Codespaces terminal:
#   unzip -o WaveForge-v3-Upgraded.zip && bash deploy.sh
# ============================================================================
set -e

echo "🎵 Starting WaveForge v3.0 Automated Deployment..."

# If extracted inside a subfolder by mistake, sync files up to the git root
if [ ! -d ".git" ] && [ -d "../.git" ]; then
    echo "📂 Copying upgraded files into repository root..."
    cp -Rf ./* ../
    cd ..
fi

# Clean up any uploaded zip archive so it does not bloat the Git repository
rm -f WaveForge-v3-Upgraded.zip WaveForge-main.zip

echo "✅ Verifying WaveForge v3.0 files..."
for req in index.html visualizer.html sw.js sitemap.xml assets/js/app.js assets/js/ads.js Visualizers/tunnel.js Visualizers/trapnation.js Visualizers/synthwave.js; do
    if [ ! -f "$req" ]; then
        echo "❌ Missing expected file: $req"
        exit 1
    fi
done

echo "📦 Staging all updated and new files..."
git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No file changes detected to commit."
else
    COMMIT_MSG="feat(v3.0): add 12 modes, 3-band EQ, 9:16 export, text overlays & smart Adsterra suite"
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🚀 Pushing to origin/$BRANCH..."
    git push origin "$BRANCH"
    echo "🎉 SUCCESS! WaveForge v3.0 is now live and pushed to GitHub ($BRANCH)!"
fi
