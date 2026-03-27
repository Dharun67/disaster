#!/bin/bash

# Add frontend pages one by one
git add frontend/src/pages/LoginPage.js
git commit -m "feat: Implement user login page with validation"

git add frontend/src/pages/Dashboard.js  
git commit -m "feat: Create main dashboard with flood predictions"

git add frontend/src/pages/EmergencySOS.js
git commit -m "feat: Add emergency SOS alert system"

git add frontend/src/pages/AdminDashboard.js
git commit -m "feat: Implement admin command center"

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

git add frontend/src/pages/EnhancedEmergencySOS.js
git commit -m "feat: Enhanced emergency SOS with geolocation"

git add frontend/src/pages/Marketplace.js
git commit -m "feat: Add disaster supplies marketplace"

git add frontend/src/pages/SmartRouting.js
git commit -m "feat: Implement smart evacuation routing"

# Add components
git add frontend/src/components/
git commit -m "feat: Add reusable UI components"

# Add styles
git add frontend/src/styles/
git commit -m "style: Add comprehensive CSS themes"

git add frontend/src/*.css
git commit -m "style: Add global styles and themes"

# Add configuration files
git add frontend/tailwind.config.js
git commit -m "config: Setup Tailwind CSS configuration"

git add docker-compose.yml
git commit -m "deploy: Add Docker compose configuration"

git add backend/Dockerfile
git commit -m "deploy: Add backend Dockerfile"

git add frontend/Dockerfile  
git commit -m "deploy: Add frontend Dockerfile"

# Add documentation
git add *.md
git commit -m "docs: Add comprehensive documentation"

# Add sample data
git add sample-data.js init-db.js
git commit -m "data: Add sample data and database initialization"

# Add remaining files
git add .
git commit -m "feat: Complete GeoGuard disaster management platform"

echo "All commits created successfully!"