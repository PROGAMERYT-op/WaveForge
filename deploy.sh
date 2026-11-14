#!/usr/bin/env bash
# ============================================================================
# WaveForge Studio v7.1 PhonkTemplates — 1-Command Codespaces Auto-Deploy
# Usage inside GitHub Codespaces terminal:
#   unzip -o WaveForge-v7.1-Fixed.zip && bash deploy.sh
# ============================================================================
set -e

echo "🎵 Starting WaveForge Studio v7.1 Automated Deployment..."

if [ ! -d ".git" ] && [ -d "../.git" ]; then
    echo "📂 Copying upgraded files into repository root..."
    cp -Rf ./* ../
    cp -Rf ./.gitignore ./.nojekyll ./.github ../ 2>/dev/null || true
    cd ..
fi

echo "🧹 Cleaning up temporary ZIP archives..."
rm -f ./*.zip WaveForge*.zip

echo "✅ Verifying WaveForge Studio v7.1 files..."
for req in index.html visualizer.html sw.js sitemap.xml assets/js/app.js assets/js/ads.js assets/css/landing.css assets/css/app.css Visualizers/phonk.js Visualizers/bars.js Visualizers/spectrogram.js; do
    if [ ! -f "$req" ]; then
        echo "❌ Missing expected file: $req"
        exit 1
    fi
done

echo "📦 Staging all updated v7.1 files..."
git add -A

if git diff --cached --quiet; then
    echo "ℹ️ No file changes detected to commit."
else
    COMMIT_MSG="fix(v7.1): fix Phonk intro timing, 4K export scaling & glow, mobile H.264 negotiation, mic release & SW caching"
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "🚀 Pushing to origin/$BRANCH..."
    git push origin "$BRANCH"
    echo "🎉 SUCCESS! WaveForge Studio v7.1 is now live and pushed to GitHub ($BRANCH)!"
fi
