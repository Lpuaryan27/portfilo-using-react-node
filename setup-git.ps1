# Setup script for Aryan Kumar's React & Node.js Portfolio Repository
Write-Host "Initializing Git Repository for your portfolio..." -ForegroundColor Cyan

# Init git if not already present
if (!(Test-Path .git)) {
    git init
    Write-Host "Initialized empty Git repository." -ForegroundColor Green
} else {
    Write-Host "Git repository already exists." -ForegroundColor Yellow
}

# Create .gitignore for parent if not present
$gitignoreContent = @"
node_modules/
dist/
.env
messages.json
.DS_Store
*.log
"@

Set-Content -Path .gitignore -Value $gitignoreContent
Write-Host "Created .gitignore file." -ForegroundColor Green

# Add files
git add .
git commit -m "Initial commit: Stunning React + Node.js portfolio with premium graphics and contact database integration"
Write-Host "Committed files to local Git repository." -ForegroundColor Green

Write-Host "`nTo create a GitHub repository, follow these steps:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Create a repository named: portfolio-react-node" -ForegroundColor Yellow
Write-Host "3. Run the following commands in your shell to push the code:" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git remote add origin https://github.com/Lpuaryan27/YOUR-REPO-NAME.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
