# GeoGuard - Complete Testing Guide

## 🎯 Pre-Testing Checklist

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB Atlas connected
- [ ] Database initialized with sample data
- [ ] All environment variables set in .env

---

## 📋 Test Cases

### 1. Landing Page (http://localhost:3000/)

**Test 1.1: Page Load**
- [ ] Page loads without errors
- [ ] All sections visible
- [ ] System status indicator shows "System Online"
- [ ] Navigation links work

**Test 1.2: Feature Cards**
- [ ] All 6 feature cards display
- [ ] Icons visible
- [ ] Descriptions readable
- [ ] Hover effects work

**Test 1.3: Risk Categories**
- [ ] All 4 risk categories display
- [ ] Color coding correct (Green, Yellow, Orange, Red)
- [ ] Score ranges correct

**Test 1.4: Navigation**
- [ ] "View Live Dashboard" button works
- [ ] "Emergency SOS" button works
- [ ] All page links in "Available Pages" section work

---

### 2. Live Dashboard (http://localhost:3000/dashboard)

**Test 2.1: Map Display**
- [ ] Map loads with OpenStreetMap tiles
- [ ] All zones visible as circles
- [ ] Zone circles color-coded by risk level
- [ ] Map is interactive (pan, zoom)

**Test 2.2: Zone Selection**
- [ ] Click zone circle to select
- [ ] Zone details panel updates
- [ ] Selected zone highlighted
- [ ] Details show: Name, Risk Level, Risk Score, Rainfall, Water Level, Elevation

**Test 2.3: Stats Cards**
- [ ] Active SOS Alerts count displays
- [ ] Available Rescue Teams count displays
- [ ] Shelter Occupancy percentage displays
- [ ] High Risk Zones count displays

**Test 2.4: Zones Grid**
- [ ] All zones display in grid
- [ ] Each zone card shows: Name, Risk Level, Risk Score
- [ ] Cards color-coded by risk level
- [ ] Click card to select zone

**Test 2.5: Refresh Button**
- [ ] Refresh button works
- [ ] Data updates after refresh
- [ ] Loading state shows during refresh

---

### 3. Emergency SOS (http://localhost:3000/sos)

**Test 3.1: Form Validation**
- [ ] Name field required (shows error if empty)
- [ ] Phone field required (shows error if empty)
- [ ] Message field required (shows error if empty)
- [ ] Submit button disabled until all fields filled

**Test 3.2: Location Capture**
- [ ] Browser asks for location permission
- [ ] Location coordinates display after permission granted
- [ ] Location format: latitude, longitude (4 decimal places)

**Test 3.3: Alert Submission**
- [ ] Click "SEND SOS ALERT" button
- [ ] Loading state shows
- [ ] Success message displays
- [ ] Form clears after submission
- [ ] Data saved to database

**Test 3.4: Error Handling**
- [ ] Error message shows if location unavailable
- [ ] Error message shows if submission fails
- [ ] User can retry after error

---

### 4. Shelter Locator (http://localhost:3000/shelters)

**Test 4.1: Map Display**
- [ ] Map loads with all shelters
- [ ] Shelter markers visible
- [ ] Click marker to see popup with shelter info

**Test 4.2: Shelter Details**
- [ ] Click shelter to show details panel
- [ ] Details show: Name, Address, Contact, Capacity
- [ ] Capacity bar shows occupancy percentage
- [ ] Capacity color-coded (Green < 50%, Yellow 50-75%, Red > 75%)

**Test 4.3: Sorting**
- [ ] "Sort by Distance" works (if location available)
- [ ] "Sort by Available Capacity" works
- [ ] Shelters reorder correctly

**Test 4.4: Distance Calculation**
- [ ] Distance displays in km
- [ ] Distance calculated from user location
- [ ] Distance updates when sorting

**Test 4.5: Capacity Tracking**
- [ ] Occupancy/Capacity ratio displays
- [ ] Progress bar shows percentage
- [ ] Color changes based on occupancy level

---

### 5. Admin Dashboard (http://localhost:3000/admin)

**Test 5.1: Stats Cards**
- [ ] Active SOS Alerts count correct
- [ ] User Reports count correct
- [ ] Rescue Teams count correct
- [ ] Shelters count correct
- [ ] High Risk Zones count correct

**Test 5.2: SOS Alerts Tab**
- [ ] Tab loads with all active SOS alerts
- [ ] Each alert shows: Name, Phone, Message, Location, Status
- [ ] Status badge color-coded

**Test 5.3: User Reports Tab**
- [ ] Tab loads with all user reports
- [ ] Each report shows: Type, Description, Location
- [ ] Report type icon displays correctly

**Test 5.4: Rescue Teams Tab**
- [ ] Tab loads with all rescue teams
- [ ] Each team shows: Name, Members, Status, Zone, Equipment
- [ ] Status badge color-coded

**Test 5.5: Shelters Tab**
- [ ] Tab loads with all shelters
- [ ] Each shelter shows: Name, Address, Capacity, Occupancy
- [ ] Capacity bar displays correctly

**Test 5.6: Zones Tab**
- [ ] Tab loads with all zones
- [ ] Each zone shows: Name, Area, Risk Level, Risk Score
- [ ] Risk level color-coded
- [ ] Rainfall, Water Level, Elevation display

**Test 5.7: Refresh**
- [ ] Refresh button updates all data
- [ ] Loading state shows during refresh

---

### 6. Command Center Pro (http://localhost:3000/command-center-pro)

**Test 6.1: Dashboard Load**
- [ ] Page loads without errors
- [ ] All sections visible

**Test 6.2: Real-time Data**
- [ ] Stats update in real-time
- [ ] Heatmap displays zones
- [ ] Critical zones highlighted

---

### 7. Emergency Contacts (http://localhost:3000/emergency-contacts)

**Test 7.1: Zone Selection**
- [ ] Zone dropdown loads with all zones
- [ ] Select zone to view emergency contacts

**Test 7.2: Emergency Services**
- [ ] Police stations display
- [ ] Ambulance services display
- [ ] Hospitals display
- [ ] Rescue teams display

**Test 7.3: Contact Information**
- [ ] Phone numbers display
- [ ] Addresses display
- [ ] Status displays

---

### 8. Flood Detection (http://localhost:3000/flood-detection)

**Test 8.1: Page Load**
- [ ] Page loads without errors
- [ ] Detection interface visible

**Test 8.2: Detection Features**
- [ ] Can input detection parameters
- [ ] Results display correctly
- [ ] Risk assessment shows

---

### 9. Flood Simulation (http://localhost:3000/flood-simulation)

**Test 9.1: Simulation Load**
- [ ] Page loads without errors
- [ ] Simulation interface visible

**Test 9.2: Simulation Controls**
- [ ] Can start simulation
- [ ] Can pause simulation
- [ ] Can reset simulation
- [ ] Animation plays smoothly

---

### 10. Digital Twin (http://localhost:3000/digital-twin)

**Test 10.1: 3D Visualization**
- [ ] 3D scene loads
- [ ] Can rotate view
- [ ] Can zoom in/out
- [ ] Can pan

---

### 11. Digital Twin Pro (http://localhost:3000/digital-twin-pro)

**Test 11.1: Advanced 3D**
- [ ] 3D scene loads with advanced features
- [ ] Lighting works
- [ ] Shadows render correctly
- [ ] Performance is smooth

---

### 12. Drainage Overflow (http://localhost:3000/drainage-overflow)

**Test 12.1: Drainage Analysis**
- [ ] Page loads without errors
- [ ] Drainage data displays
- [ ] Overflow risk shows

---

### 13. Hyperlocal Dashboard (http://localhost:3000/hyperlocal-dashboard)

**Test 13.1: Hyperlocal Data**
- [ ] Page loads without errors
- [ ] Hyperlocal predictions display
- [ ] Zone-specific data shows

---

### 14. Command Center (http://localhost:3000/command-center)

**Test 14.1: Command Interface**
- [ ] Page loads without errors
- [ ] All controls visible
- [ ] Real-time updates work

---

## 🔌 API Testing

### Test API Endpoints

**Health Check**
```bash
curl http://localhost:5000/api/health
# Expected: { status: "GeoGuard Backend Running", database: "Connected" }
```

**Database Status**
```bash
curl http://localhost:5000/api/db-status
# Expected: Collections list with document counts
```

**Get Zones**
```bash
curl http://localhost:5000/api/zones
# Expected: Array of 5 zones
```

**Get Shelters**
```bash
curl http://localhost:5000/api/shelters
# Expected: Array of 5 shelters
```

**Get Rescue Teams**
```bash
curl http://localhost:5000/api/rescue-teams
# Expected: Array of 4 rescue teams
```

**Get SOS Alerts**
```bash
curl http://localhost:5000/api/sos-alerts
# Expected: Array of active SOS alerts
```

**Create SOS Alert**
```bash
curl -X POST http://localhost:5000/api/sos-alert \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "9876543210",
    "message": "Test alert",
    "lat": 12.9750,
    "lng": 80.2207,
    "location": "Test Location"
  }'
# Expected: { success: true, alertId: "..." }
```

---

## 📊 Database Testing

### Verify Collections

```bash
# Run verification script
cd backend
node verify-db.js
```

Expected output:
- ✓ MongoDB Atlas connected
- ✓ All 11 collections present
- ✓ Document counts for each collection

### Check Document Counts

After initialization, expected counts:
- zones: 5
- flood_predictions: 5
- shelters: 5
- rescue_teams: 4
- police_stations: 4
- ambulance_services: 4
- hospitals: 4
- sos_alerts: 2
- user_reports: 2
- disaster_alerts: 2
- users: 0

---

## 🎨 UI/UX Testing

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All elements visible and functional

### Color Scheme
- [ ] Risk levels color-coded correctly
- [ ] Professional blue (#2563eb) used for primary actions
- [ ] Red (#ef4444) used for emergency/critical
- [ ] Green (#10b981) used for safe/available
- [ ] Amber (#f59e0b) used for caution

### Typography
- [ ] Headings readable
- [ ] Body text readable
- [ ] Font sizes appropriate for screen size

### Accessibility
- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Form labels associated with inputs
- [ ] Error messages clear

---

## ⚡ Performance Testing

### Page Load Times
- [ ] Landing Page: < 2 seconds
- [ ] Dashboard: < 3 seconds
- [ ] Admin Dashboard: < 3 seconds
- [ ] Shelter Locator: < 3 seconds

### API Response Times
- [ ] GET /api/zones: < 500ms
- [ ] GET /api/shelters: < 500ms
- [ ] POST /api/sos-alert: < 1000ms
- [ ] GET /api/command-center-data: < 1000ms

### Browser Performance
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] No lag on interactions

---

## 🔒 Security Testing

### Input Validation
- [ ] XSS prevention (special characters escaped)
- [ ] SQL injection prevention (parameterized queries)
- [ ] CSRF protection (if applicable)

### Authentication
- [ ] JWT tokens validated
- [ ] Expired tokens rejected
- [ ] Invalid tokens rejected

### Data Protection
- [ ] Sensitive data not logged
- [ ] Passwords hashed
- [ ] HTTPS ready (for production)

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________
Environment: Development / Staging / Production

Page: ___________
Status: ✓ PASS / ✗ FAIL

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## ✅ Sign-Off Checklist

- [ ] All 14 pages tested and working
- [ ] All API endpoints tested and working
- [ ] Database connection verified
- [ ] All features functional
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] UI/UX meets standards
- [ ] Responsive design verified
- [ ] Accessibility verified
- [ ] Security verified

**Ready for Production: YES / NO**

---

**GeoGuard Testing Complete** ✅
