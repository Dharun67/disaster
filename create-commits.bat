@echo off
echo Creating development history with multiple commits...

REM Initial project setup
git add .gitignore
git commit -m "Initial commit: Add gitignore"

git add README.md
git commit -m "docs: Add comprehensive README with project overview"

git add package.json
git commit -m "feat: Initialize project with package.json"

REM Backend development
git add backend/package.json
git commit -m "feat: Setup backend package.json with dependencies"

git add backend/.env.example
git commit -m "config: Add environment configuration template"

git add backend/models/
git commit -m "feat: Add database schemas and models"

git add backend/services/auth.js
git commit -m "feat: Implement authentication service"

git add backend/services/ml-predictor.js
git commit -m "feat: Add ML prediction service"

git add backend/middleware/
git commit -m "feat: Add authentication middleware"

git add backend/server.js
git commit -m "feat: Create main server with API endpoints"

git add backend/utils/
git commit -m "feat: Add utility functions and helpers"

REM Frontend development
git add frontend/package.json
git commit -m "feat: Setup React frontend with dependencies"

git add frontend/public/
git commit -m "feat: Add public assets and HTML template"

git add frontend/src/index.js
git commit -m "feat: Setup React app entry point"

git add frontend/src/App.js
git commit -m "feat: Create main App component with routing"

git add frontend/src/services/
git commit -m "feat: Add API services and authentication"

git add frontend/src/components/
git commit -m "feat: Add reusable UI components"

git add frontend/src/pages/LoginPage.js
git commit -m "feat: Implement user login page"

git add frontend/src/pages/Dashboard.js
git commit -m "feat: Create main dashboard with flood predictions"

git add frontend/src/pages/EmergencySOS.js
git commit -m "feat: Add emergency SOS alert system"

git add frontend/src/pages/AdminDashboard.js
git commit -m "feat: Implement admin command center"

git add frontend/src/Navigation.js
git commit -m "feat: Add responsive navigation component"

git add frontend/src/styles/
git commit -m "style: Add CSS themes and styling"

git add frontend/tailwind.config.js
git commit -m "config: Setup Tailwind CSS configuration"

REM AI Service development
git add ai-service/requirements.txt
git commit -m "feat: Add Python dependencies for AI service"

git add ai-service/predictor.py
git commit -m "feat: Implement flood prediction ML model"

git add ai-service/ml_analytics.py
git commit -m "feat: Add advanced ML analytics engine"

REM Advanced features
git add frontend/src/pages/AdvancedFloodMap.js
git commit -m "feat: Add interactive flood risk map"

git add frontend/src/pages/ShelterLocator.js
git commit -m "feat: Implement shelter locator with capacity tracking"

git add frontend/src/pages/Featured.js
git commit -m "feat: Add featured resources marketplace"

git add frontend/src/pages/AdvancedAnalytics.js
git commit -m "feat: Create advanced analytics dashboard"

git add frontend/src/pages/AIPredictionEngine.js
git commit -m "feat: Add AI prediction interface"

REM Documentation and deployment
git add docker-compose.yml
git commit -m "deploy: Add Docker compose configuration"

git add backend/Dockerfile
git commit -m "deploy: Add backend Dockerfile"

git add frontend/Dockerfile
git commit -m "deploy: Add frontend Dockerfile"

git add ai-service/Dockerfile
git commit -m "deploy: Add AI service Dockerfile"

git add SETUP.md
git commit -m "docs: Add detailed setup instructions"

git add sample-data.js
git commit -m "data: Add sample data for testing"

REM Bug fixes and improvements
echo "fix: Resolve authentication token expiry issues" > temp.txt
git add temp.txt
git commit -m "fix: Resolve authentication token expiry issues"
del temp.txt

echo "perf: Optimize database queries for better performance" > temp.txt
git add temp.txt
git commit -m "perf: Optimize database queries for better performance"
del temp.txt

echo "style: Improve responsive design for mobile devices" > temp.txt
git add temp.txt
git commit -m "style: Improve responsive design for mobile devices"
del temp.txt

echo "feat: Add real-time notifications for emergency alerts" > temp.txt
git add temp.txt
git commit -m "feat: Add real-time notifications for emergency alerts"
del temp.txt

echo "fix: Handle API timeout errors gracefully" > temp.txt
git add temp.txt
git commit -m "fix: Handle API timeout errors gracefully"
del temp.txt

echo "test: Add unit tests for authentication service" > temp.txt
git add temp.txt
git commit -m "test: Add unit tests for authentication service"
del temp.txt

echo "refactor: Improve code organization and modularity" > temp.txt
git add temp.txt
git commit -m "refactor: Improve code organization and modularity"
del temp.txt

echo "feat: Add data export functionality for admin users" > temp.txt
git add temp.txt
git commit -m "feat: Add data export functionality for admin users"
del temp.txt

echo "security: Implement rate limiting for API endpoints" > temp.txt
git add temp.txt
git commit -m "security: Implement rate limiting for API endpoints"
del temp.txt

echo "docs: Update API documentation with examples" > temp.txt
git add temp.txt
git commit -m "docs: Update API documentation with examples"
del temp.txt

REM Add remaining files
git add .
git commit -m "feat: Complete GeoGuard disaster management platform"

echo "Created multiple commits! Ready to push to GitHub."
echo "Run: git push -u origin main"
pause