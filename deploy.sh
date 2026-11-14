#!/usr/bin/env bash
# ============================================================================
# WaveForge Studio v7.0 PhonkTemplates — 1-Command Codespaces Auto-Deploy
# Usage inside GitHub Codespaces terminal:
#   unzip -o WaveForge-v7.0-PhonkTemplates.zip && bash deploy.sh
# ============================================================================
set -e

echo "🎵 Starting WaveForge Studio v7.0 Automated Deployment..."

if [ ! -d ".git" ] && [ -d "../.git" ]; then
    echo "📂 Copying upgraded files into repository root..."
    cp -Rf ./* ../
    cd ..
fi

rm -f WaveForge-v7.0-PhonkTemplates.zip WaveForge-v6*.zip WaveForge-v5*.zip WaveForge-v4*.zip WaveForge-v3*.zip WaveForge-main.zip

echo "✅ Verifying WaveForge Studio v7.0 files..."
for req in index.html visualizer.html sw.js sitemap.xml assets/js/app.js assets/js/ads.js assets/css/landing.css assets/css/app.css Visualizers/phonk.js Visualizers/bars.js Visualizers/spectrogram.js; do
    if [ ! -f "$req" ]; then
        echo "❌ Missing expected file: $req"
        exit 1
    fi
done

echo "📦 Staging all updated v7.0 files..."
git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No file changes detected to commit."
else
    COMMIT_MSG="feat(v7.0): add Hardtekk/Phonk templates, AirPods volume intro, liquid plasma ring & 8s ad-unlock download"
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🚀 Pushing to origin/$BRANCH..."
    git push origin "$BRANCH"
    echo "🎉 SUCCESS! WaveForge Studio v7.0 is now live and pushed to GitHub ($BRANCH)!"
fi
