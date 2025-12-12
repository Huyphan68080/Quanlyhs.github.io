# GitHub Pages Setup Instructions

## Required: Enable GitHub Pages

1. Go to: https://github.com/Huyphan68080/Quanlyhs.github.io/settings/pages
2. Under "Source", select:
   - **Branch:** `master`
   - **Folder:** `/(root)`
3. Save

## Or if you want to use GitHub Actions (Recommended):

1. Go to: https://github.com/Huyphan68080/Quanlyhs.github.io/settings/pages
2. Under "Source", select:
   - **Deploy from a branch:** 
   - **Branch:** `gh-pages` (GitHub Actions will create this)
   - **Folder:** `/(root)`
3. The GitHub Actions workflow will automatically deploy to `gh-pages` branch

The workflow is already configured and will trigger on every push to master.
