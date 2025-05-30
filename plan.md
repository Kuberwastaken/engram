# Engram Project Development Checklist

## 📋 Project Overview
**Goal**: Develop Engram - a centralized, open-source web application for IPU student notes with a space-themed dark UI.

---

## 🚀 Setup & Initial Configuration

### Project Foundation
- [ ] Initialize project structure in `d:\Projects\ENGRAM-PROJECT`
- [ ] Set up basic HTML file structure (`index.html`)
- [ ] Configure CDN dependencies:
  - [ ] React and ReactDOM via `cdn.jsdelivr.net`
  - [ ] React Router for navigation
  - [ ] Tailwind CSS for styling
  - [ ] ShadCN components (custom implementation)
- [ ] Create basic project README.md
- [ ] Set up version control (Git) and link to GitHub repo

---

## 🎨 Design & Theme Implementation

### Space Theme & Dark UI
- [ ] Implement dark theme color scheme:
  - [ ] Primary background: `#1a1a1a` (dark gray-black)
  - [ ] Primary text: `#ffffff` (white)
  - [ ] Secondary text: `#a1a1a1` (light gray)
  - [ ] Accent color: `#3b82f6` (blue)
- [ ] Create starry gradient background (black to dark blue)
- [ ] Add twinkling star animations using CSS keyframes
- [ ] Design space-themed visual elements
- [ ] Implement orbital ring animations for hover effects

### Responsive Design
- [ ] Desktop layout (3-column grid for subjects)
- [ ] Tablet layout (2-column grid, adjusted font sizes)
- [ ] Mobile layout (1-column grid, vertical dropdowns)
- [ ] Touch-friendly buttons (min-height: 48px)
- [ ] Test across different screen sizes

---

## 🏠 Hero Page Development

### Header Section
- [ ] Create top navigation bar
- [ ] Add ENGRAM logo and title (top left)
- [ ] Implement GitHub link (top right) → `http://github.com/kuberwastaken/engram` (make SVG)
- [ ] Add tagline: "The centralized, No BS Open-Source hub for IP University Material"

### Main Interface
- [ ] Design space-themed background
- [ ] Create branch dropdown selector using ShadCN `<Select>`
- [ ] Create semester dropdown selector using ShadCN `<Select>`
- [ ] Style dropdowns with dark theme
- [ ] Implement responsive dropdown layout (horizontal on desktop, vertical on mobile)

---

## 🔧 Core Functionality

### Branch & Semester Selection
- [ ] Implement branch options: AIDS, AIML, CIVIL, CSE, ECE, EEE, IT, MECH
- [ ] Implement semester options: 1st to 6th
- [ ] Create dropdown change handlers
- [ ] Validate selection combinations

### LocalStorage Integration
- [ ] Implement LocalStorage save functionality for selections
- [ ] Create LocalStorage retrieval on app load
- [ ] Preselect dropdowns based on stored values
- [ ] Add "Reset Preferences" button
- [ ] Handle LocalStorage error cases (storage disabled, etc.)

### Subject Display System
- [ ] Create subject data structure for all branches/semesters
- [ ] Implement dynamic subject grid rendering
- [ ] Create subject cards using ShadCN `<Card>` component
- [ ] Add hover effects (scale-up animation)
- [ ] Apply responsive grid layout (3/2/1 columns)
- [ ] Add proper spacing with Tailwind CSS (`gap-4`)

---

## 📚 Subject Details Page

### Navigation & Routing
- [ ] Set up React Router for navigation
- [ ] Create route for subject details page
- [ ] Implement navigation from subject cards
- [ ] Add breadcrumb navigation

### Tabbed Interface
- [ ] Implement ShadCN `<Tabs>` component
- [ ] Create tabs: Syllabus, Notes, PYQs, Lab, Books, Akash, Videos
- [ ] Add blue underline for active tab
- [ ] Implement fade-in animation for tab content
- [ ] Handle tab switching logic

### Content Implementation
- [ ] **Syllabus Tab**: Create static text-based syllabus display
- [ ] **Notes Tab**: Implement downloadable PDF links
- [ ] **PYQs Tab**: Add previous year question papers
- [ ] **Lab Tab**: Include lab manuals and resources
- [ ] **Books Tab**: List recommended textbooks
- [ ] **Akash Tab**: Add Akash-specific materials
- [ ] **Videos Tab**: Include video lecture links

---

## 💾 Download Functionality

### Resource Management
- [ ] Create mock URL structure: `/assets/branch/semester/subject/resource.pdf`
- [ ] Implement download button using ShadCN `<Button>`
- [ ] Add hover effects (glowing border)
- [ ] Create orbiting spinner animation for downloads
- [ ] Implement proper file naming (e.g., `CHL_Unit_I.pdf`)
- [ ] Handle download errors gracefully

### Contributor Attribution
- [ ] Add contributor names below each resource
- [ ] Style contributor text (smaller font, secondary color)
- [ ] Create mock contributor data
- [ ] Exclude contributors from Syllabus tab

---

## 📱 Animations & Interactions

### Page Transitions
- [ ] Implement fade-in animations for page loads
- [ ] Add slide-in animations for tab switches
- [ ] Create smooth transitions between pages

### Interactive Elements
- [ ] Scale-up animation for subject card hover
- [ ] Orbital ring animation for planet-like effects
- [ ] Button hover animations
- [ ] Loading spinners that resemble orbiting planets
- [ ] Twinkling star background animation

### Performance Optimization
- [ ] Optimize animation performance
- [ ] Ensure animations don't cause UI lag
- [ ] Test on lower-end devices

---

## 📊 Data Structure & Content

### Mock Data Creation
- [ ] Create comprehensive subject lists for all branch/semester combinations
- [ ] **AIDS 2nd Semester**: Applied Chemistry, Applied Mathematics II, Applied Physics II, Communication Skills, Engineering Graphics, Engineering Mechanics, Electrical Science, Environmental Science, Human Values and Professional Ethics, Indian Constitution, Manufacturing Processes, Programming in C, Workshop Practice
- [ ] Populate data for all other branches and semesters
- [ ] Create mock resource files for each subject
- [ ] Generate mock contributor names

### Data Organization
- [ ] Structure data in logical JSON format
- [ ] Implement data validation
- [ ] Create data access utilities
- [ ] Handle missing data scenarios

---

## 🧪 Testing & Quality Assurance

### Functionality Testing
- [ ] Test dropdown selections and persistence
- [ ] Verify LocalStorage functionality across browser sessions
- [ ] Test navigation between pages
- [ ] Validate download functionality
- [ ] Test responsive design on multiple devices

### Browser Compatibility
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Verify CDN dependencies load correctly
- [ ] Test offline functionality (if applicable)

### Performance Testing
- [ ] Measure page load times
- [ ] Test animation performance
- [ ] Optimize asset loading
- [ ] Validate accessibility features

---

## 🚀 Deployment & Documentation

### Final Polish
- [ ] Code review and cleanup
- [ ] Optimize file structure
- [ ] Minify CSS/JS if needed
- [ ] Final responsive design testing

### Documentation
- [ ] Update README.md with setup instructions
- [ ] Document component usage
- [ ] Create contribution guidelines
- [ ] Add license information

### Deployment
- [ ] Deploy to GitHub Pages (or chosen hosting)
- [ ] Test deployed version
- [ ] Update GitHub repository
- [ ] Share with stakeholders

---

## ✅ Success Criteria Validation

### Final Checklist
- [ ] App loads seamlessly on desktop and mobile browsers
- [ ] Branch and semester selections persist across sessions
- [ ] All UI components styled consistently with ShadCN and space theme
- [ ] Animations enhance UX without performance issues
- [ ] Users can navigate, view, and download resources intuitively
- [ ] Dark theme implemented throughout the application
- [ ] Space theme with starry backgrounds and cosmic elements
- [ ] All 8 branches and 6 semesters supported
- [ ] Resource downloads work correctly
- [ ] GitHub repository link functional

---

## 📝 Notes & Considerations

### Technical Decisions
- [ ] Document why certain technical choices were made
- [ ] List any limitations or future improvements
- [ ] Note browser-specific implementations

### Future Enhancements
- [ ] List potential features for future versions
- [ ] Document scalability considerations
- [ ] Plan for real PDF integration

---

*This checklist serves as a comprehensive guide for developing the Engram application. Check off items as they are completed and update the document as needed throughout the development process.*
