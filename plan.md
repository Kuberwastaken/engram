Here’s an improved, highly detailed, and structured step-by-step plan for the **Engram Project Development**, tailored for clarity, precision, and actionable guidance for an AI or development team. The plan is broken into phases with detailed tasks, dependencies, timelines, and success metrics to ensure smooth execution. It also incorporates best practices for modern web development, with a focus on modularity, scalability, and user experience.

---

# Engram Project Development Plan

## 📋 Project Overview
**Goal**: Build **Engram**, a centralized, open-source web application for IPU (Indraprastha University) student notes, featuring a minimal, space-themed dark UI. The app will be desktop and mobile-friendly, built with React, ShadCN, and Tailwind CSS, and will support all engineering branches and 6 semesters. Key features include branch/semester selection with LocalStorage persistence, a subject grid, tabbed subject details, downloadable resources, and contributor attribution.

**Tech Stack**:
- **Frontend**: React (via CDN), React Router, ShadCN components (mocked), Tailwind CSS (via CDN).
- **Storage**: LocalStorage for user preferences; **all study materials (notes, PDFs, books, etc.) will be stored directly in the GitHub repository under a structured `/materials` directory**.
- **Styling**: Space-themed dark UI with animations.
- **Deployment**: GitHub Pages.

---

## 📅 Development Phases

### Phase 1: Setup & Initial Configuration
**Objective**: Establish the project foundation, set up dependencies, and initialize version control.

#### Tasks:
1. **Project Initialization**:
   - Create project directory: `d:\Projects\ENGRAM-PROJECT`.
   - Set up basic file structure: `index.html`, `app.js`, `styles.css`, and a `/materials` directory for all study resources.
   - Initialize a basic React app structure within `index.html` using CDN imports.
   - **Success Metric**: A blank React app renders "Hello, Engram!" on the browser.

2. **CDN Dependencies Setup**:
   - Import React and ReactDOM: `https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js` and `https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js`.
   - Import React Router: `https://cdn.jsdelivr.net/npm/react-router-dom@6.3.0/dist/umd/react-router-dom.min.js`.
   - Import Tailwind CSS: `https://cdn.tailwindcss.com`.
   - Mock ShadCN components (e.g., `<Select>`, `<Card>`, `<Tabs>`, `<Button>`) as custom React components with Tailwind styling, since ShadCN isn't directly available via CDN.
   - **Success Metric**: All CDNs load without errors; a basic Tailwind-styled div renders correctly.

3. **Version Control Setup**:
   - Initialize Git: `git init`.
   - Create a GitHub repository: `http://github.com/kuberwastaken/engram`.
   - Add initial commit with project structure, including the `/materials` directory.
   - Push to GitHub: `git push origin main`.
   - **Success Metric**: GitHub repo is live with initial files.

4. **Documentation**:
   - Create `README.md` with project overview, setup instructions, and contribution guidelines, including how to add new materials to the `/materials` directory (file naming, directory structure, etc.).
   - Add MIT License file (`LICENSE`).
   - **Success Metric**: README includes setup steps, project description, and clear instructions for contributing materials.

**Dependencies**: None.  
**Estimated Time**: 8 hours (4 hours/day).  
**Risks**: CDN availability issues; mitigate by having fallback local copies of scripts.

---

### Phase 2: Design & Theme Implementation
**Objective**: Build the space-themed dark UI with responsive layouts and animations.

#### Tasks:
1. **Dark Theme Setup**:
   - Define color scheme in `styles.css`:
     - Primary background: `#1a1a1a` (dark gray-black).
     - Primary text: `#ffffff` (white).
     - Secondary text: `#a1a1a1` (light gray).
     - Accent color: `#3b82f6` (blue).
   - Apply to the root element: `body { background: #1a1a1a; color: #ffffff; }`.
   - **Success Metric**: Page background and text colors match the dark theme.

2. **Space Theme Implementation**:
   - Create a starry gradient background: Linear gradient from `#1a1a1a` to `#1e3a8a` (dark blue) with a starry overlay.
   - Add twinkling stars using CSS:
     ```css
     .stars {
       position: fixed;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       background: transparent;
       z-index: -1;
     }
     .star {
       position: absolute;
       background: #ffffff;
       border-radius: 50%;
       animation: twinkle 3s infinite;
     }
     @keyframes twinkle {
       0%, 100% { opacity: 0.3; }
       50% { opacity: 1; }
     }
     ```
   - Dynamically generate 50-100 stars of varying sizes (1px-3px) and positions using JavaScript.
   - **Success Metric**: Background displays a starry gradient with twinkling stars.

3. **Responsive Layout Design**:
   - Use Tailwind CSS for responsive grids:
     - Desktop: 3-column grid (`grid grid-cols-3 gap-4`).
     - Tablet (md breakpoint): 2-column grid (`md:grid-cols-2`).
     - Mobile (sm breakpoint): 1-column grid (`sm:grid-cols-1`).
   - Ensure buttons are touch-friendly: `min-h-[48px]`.
   - Test on Chrome DevTools for screen sizes: 320px (mobile), 768px (tablet), 1280px (desktop).
   - **Success Metric**: Grid layout adjusts correctly across breakpoints.

4. **Animations**:
   - Add orbital ring animation for hover effects:
     ```css
     .orbital-ring {
       position: relative;
       transition: all 0.3s ease;
     }
     .orbital-ring:hover::after {
       content: '';
       position: absolute;
       width: 100%;
       height: 100%;
       border: 1px solid #3b82f6;
       border-radius: 12px;
       animation: orbit 2s infinite linear;
     }
     @keyframes orbit {
       0% { transform: rotate(0deg); }
       100% { transform: rotate(360deg); }
     }
     ```
   - Implement fade-in for page loads: `animation: fadeIn 0.5s ease-in`.
   - **Success Metric**: Hovering on elements triggers orbital animation; page loads with fade-in.

**Dependencies**: Phase 1 (project setup).  
**Estimated Time**: 12 hours (4 hours/day).  
**Risks**: Animation performance on low-end devices; mitigate by testing on multiple devices and optimizing keyframes.

---

### Phase 3: Hero Page Development
**Objective**: Build the homepage with branch/semester dropdowns and a space-themed layout.

#### Tasks:
1. **Header Section**:
   - Create a fixed navigation bar: `fixed top-0 w-full bg-[#1a1a1a]/90 backdrop-blur-md`.
   - Add Engram logo (text-based for simplicity: "ENGRAM") on the left: `text-2xl font-bold`.
   - Add GitHub link on the right using an SVG icon (mock SVG as `<svg>` tag): Link to `http://github.com/kuberwastaken/engram`.
   - Add tagline below the nav: "The centralized, No BS Open-Source hub for IP University Material" (`text-center text-lg text-[#a1a1a1]`).
   - **Success Metric**: Header renders with logo, GitHub link, and tagline.

2. **Main Interface**:
   - Add space-themed background (from Phase 2).
   - Create a centered container for dropdowns: `max-w-md mx-auto mt-10`.
   - Implement branch dropdown using a mock ShadCN `<Select>` component:
     ```jsx
     const Select = ({ options, value, onChange, placeholder }) => (
       <select
         value={value}
         onChange={(e) => onChange(e.target.value)}
         className="w-full p-2 bg-[#2a2a2a] text-white border border-[#3b82f6] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
       >
         <option value="">{placeholder}</option>
         {options.map((opt) => (
           <option key={opt} value={opt}>{opt}</option>
         ))}
       </select>
     );
     ```
   - Options: AIDS, AIML, CIVIL, CSE, ECE, EEE, IT, MECH.
   - Implement semester dropdown similarly: Options: 1st to 6th.
   - Style dropdowns for responsiveness: Horizontal on desktop (`flex gap-4`), vertical on mobile (`flex flex-col gap-4 sm:flex-row`).
   - **Success Metric**: Dropdowns render and allow selection.

**Dependencies**: Phase 2 (theme setup).  
**Estimated Time**: 8 hours (4 hours/day).  
**Risks**: Dropdown styling inconsistencies; mitigate by testing across browsers.

---

### Phase 4: Core Functionality
**Objective**: Implement branch/semester selection, LocalStorage persistence, and subject grid rendering.

#### Tasks:
1. **Branch & Semester Selection Logic**:
   - Create a state for selections in React:
     ```jsx
     const [branch, setBranch] = React.useState('');
     const [semester, setSemester] = React.useState('');
     ```
   - Add change handlers for dropdowns: `setBranch(value)` and `setSemester(value)`.
   - Validate combinations (e.g., ensure branch and semester are selected before rendering subjects).
   - **Success Metric**: Selecting a branch and semester updates the state correctly.

2. **LocalStorage Integration**:
   - Save selections on change:
     ```jsx
     React.useEffect(() => {
       if (branch && semester) {
         localStorage.setItem('preferences', JSON.stringify({ branch, semester }));
       }
     }, [branch, semester]);
     ```
   - Retrieve on app load:
     ```jsx
     React.useEffect(() => {
       const saved = JSON.parse(localStorage.getItem('preferences'));
       if (saved) {
         setBranch(saved.branch);
         setSemester(saved.semester);
       }
     }, []);
     ```
   - Add a "Reset Preferences" button: `localStorage.removeItem('preferences'); setBranch(''); setSemester('');`.
   - Handle errors (e.g., LocalStorage disabled): Display a fallback message.
   - **Success Metric**: Selections persist across page reloads; reset button clears preferences.

3. **Subject Grid Rendering**:
   - Create a mock data structure (JSON):
     ```json
     const subjectsData = {
       "AIDS": {
         "2nd": [
           "Applied Chemistry",
           "Applied Mathematics II",
           "Applied Physics II",
           // ... other subjects
         ],
         // ... other semesters
       },
       // ... other branches
     };
     ```
   - Render subjects as a grid when branch and semester are selected:
     ```jsx
     const subjects = subjectsData[branch]?.[semester] || [];
     return (
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
         {subjects.map((subject) => (
           <div
             key={subject}
             className="p-4 bg-[#2a2a2a]/80 rounded-lg hover:scale-105 transition-transform orbital-ring"
           >
             {subject}
           </div>
         ))}
       </div>
     );
     ```
   - Add hover effects (scale-up) and orbital ring animation (from Phase 2).
   - **Success Metric**: Subjects render in a responsive grid based on selections.

4. **Resource Linking**:
   - All downloadable resources will be stored in the `/materials` directory in the repository, organized by branch, semester, and subject:
     ```
     /materials/
       ├── AIDS/
       │   ├── 1st/
       │   │   ├── Applied Chemistry/
       │   │   │   ├── notes.pdf
       │   │   │   └── pyqs.pdf
       │   │   └── ...
       ├── CSE/
       └── ...
     ```
   - When rendering downloadable resources, generate links that point to the correct path in the `/materials` directory:
     ```jsx
     const handleDownload = (fileName) => {
       const url = `/materials/${branch}/${semester}/${subject}/${fileName}`;
       window.open(url, '_blank');
     };
     ```
   - The mock data for resources should include the actual file names present in the repo.
   - **Success Metric**: Download links point to files in the `/materials` directory and work on GitHub Pages.

**Dependencies**: Phase 3 (hero page).  
**Estimated Time**: 16 hours (4 hours/day).  
**Risks**: Routing issues; mitigate by testing navigation thoroughly.

---

### Phase 5: Subject Details Page
**Objective**: Build the subject details page with tabbed navigation and resource links.

#### Tasks:
1. **Routing Setup**:
   - Configure React Router:
     ```jsx
     const { BrowserRouter, Routes, Route, Link } = ReactRouterDOM;
     const App = () => (
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/subject/:name" element={<SubjectDetails />} />
         </Routes>
       </BrowserRouter>
     );
     ```
   - Add navigation from subject cards: `<Link to={`/subject/${subject}`}>`.
   - Add breadcrumb navigation on the subject page: `Home > {subject}`.
   - **Success Metric**: Clicking a subject card navigates to `/subject/<subject-name>`.

2. **Tabbed Interface**:
   - Mock ShadCN `<Tabs>` component:
     ```jsx
     const Tabs = ({ tabs, activeTab, onTabChange }) => (
       <div className="flex gap-4 border-b border-[#3b82f6]">
         {tabs.map((tab) => (
           <button
             key={tab}
             onClick={() => onTabChange(tab)}
             className={`p-2 ${activeTab === tab ? 'border-b-2 border-[#3b82f6] text-[#3b82f6]' : 'text-[#a1a1a1]'}`}
           >
             {tab}
           </button>
         ))}
       </div>
     );
     ```
   - Define tabs: `["Syllabus", "Notes", "PYQs", "Lab", "Books", "Akash", "Videos"]`.
   - Implement tab switching with fade-in animation:
     ```css
     .tab-content {
       animation: fadeIn 0.5s ease-in;
     }
     ```
   - **Success Metric**: Tabs render and switch with animation.

3. **Content Implementation**:
   - **Syllabus Tab**: Display static text (e.g., "Syllabus for Applied Chemistry: Unit I - Basics...").
   - **Other Tabs**: Render downloadable resources:
     ```jsx
     const resources = {
       "Applied Chemistry": {
         "Notes": [
           { name: "notes.pdf", contributor: "John Doe" },
           { name: "pyqs.pdf", contributor: "Jane Smith" },
         ],
         // ... other tabs
       },
     };
     return (
       <div className="mt-4">
         {resources[subject]?.[activeTab]?.map((resource) => (
           <div key={resource.name} className="flex justify-between items-center p-2 bg-[#2a2a2a] rounded-md mb-2">
             <span>{resource.name}</span>
             <div>
               <button onClick={() => handleDownload(resource.name)} className="p-2 bg-[#3b82f6] rounded-md hover:ring-2 hover:ring-[#3b82f6] transition-all">
                 Download
               </button>
               {activeTab !== "Syllabus" && (
                 <p className="text-sm text-[#a1a1a1] mt-1">Contributed by: {resource.contributor}</p>
               )}
             </div>
           </div>
         ))}
       </div>
     );
     ```
   - **Success Metric**: Resources render with contributor info (except for Syllabus), and download links point to files in `/materials`.

**Dependencies**: Phase 4 (core functionality).  
**Estimated Time**: 16 hours (4 hours/day).  
**Risks**: Routing issues; mitigate by testing navigation thoroughly.

---

### Phase 6: Download Functionality & Animations
**Objective**: Implement downloadable resources and enhance UX with animations.

#### Tasks:
1. **Download Functionality**:
   - All resource files are stored in the `/materials` directory in the repository.
   - Download logic uses direct links to these files:
     ```jsx
     const handleDownload = (fileName) => {
       const link = document.createElement('a');
       link.href = `/materials/${branch}/${semester}/${subject}/${fileName}`;
       link.download = fileName;
       link.click();
     };
     ```
   - Add orbiting spinner animation during download.
   - Handle errors: Display a toast message if the download fails.
   - **Success Metric**: Clicking "Download" triggers a browser download action from the `/materials` directory.

2. **Animations & Interactions**:
   - Add slide-in animation for tab content (from Phase 5).
   - Implement loading spinners for page transitions: Use the orbiting spinner style.
   - Optimize animations: Use `will-change: transform, opacity` to improve performance.
   - Test on low-end devices (e.g., throttle CPU in Chrome DevTools).
   - **Success Metric**: Animations run smoothly without lag.

**Dependencies**: Phase 5 (subject details).  
**Estimated Time**: 12 hours (4 hours/day).  
**Risks**: Download failures due to mock URLs; mitigate by ensuring proper file naming and browser compatibility.

---

### Phase 7: Testing & Quality Assurance
**Objective**: Ensure the app is bug-free, performant, and accessible.

#### Tasks:
1. **Functionality Testing**:
   - Test dropdown selections and LocalStorage persistence.
   - Verify navigation between pages.
   - Test download functionality across tabs.
   - Check contributor attribution display.
   - **Success Metric**: All core features work as expected.

2. **Browser Compatibility**:
   - Test on Chrome, Firefox, Safari, Edge.
   - Test on mobile browsers: iOS Safari, Chrome Mobile.
   - Verify CDN dependencies load correctly.
   - **Success Metric**: App renders consistently across browsers.

3. **Performance & Accessibility**:
   - Measure page load time: Target < 2 seconds.
   - Test animation performance: Target 60 FPS.
   - Ensure accessibility: Add `aria-label` to buttons, ensure keyboard navigation.
   - **Success Metric**: App meets performance and accessibility standards.

**Dependencies**: Phase 6 (download functionality).  
**Estimated Time**: 8 hours (4 hours/day).  
**Risks**: Browser-specific bugs; mitigate by using polyfills if needed.

---

### Phase 8: Deployment & Documentation
**Objective**: Deploy the app, finalize documentation, and share with stakeholders.

#### Tasks:
1. **Final Polish**:
   - Review and clean up code: Remove console logs, unused variables.
   - Minify CSS/JS: Use an online minifier if needed.
   - Final responsive design test.
   - **Success Metric**: Code is clean and optimized.

2. **Documentation**:
   - Update `README.md` with setup instructions, features, and screenshots.
   - Document component usage and animations.
   - Add contribution guidelines and license information.
   - **Add detailed instructions for contributors on how to add new materials to the `/materials` directory, including directory structure, file naming, and updating resource lists if needed.**
   - **Success Metric**: Documentation is comprehensive and user-friendly, and contributors can easily add new materials.

3. **Deployment**:
   - Deploy to GitHub Pages: `gh-pages` branch.
   - Test the deployed version: Ensure all features work, including resource downloads from `/materials`.
   - Update GitHub repository with final changes.
   - Share the live URL with stakeholders.
   - **Success Metric**: App is live and accessible, and all materials are downloadable from the deployed site.

**Dependencies**: Phase 7 (testing).  
**Estimated Time**: 4 hours.  
**Risks**: Deployment failures; mitigate by following GitHub Pages documentation.

---

## ✅ Success Criteria
- App loads seamlessly on desktop and mobile browsers.
- Branch and semester selections persist across sessions via LocalStorage.
- UI components (dropdowns, cards, tabs, buttons) are styled consistently with ShadCN and the space theme.
- Animations (fade-in, slide-in, orbital rings) enhance UX without performance issues.
- Users can navigate, view, and download resources intuitively.
- Dark theme and space-themed elements (starry background, cosmic animations) are implemented throughout.
- All 8 branches and 6 semesters are supported with mock data.
- **All resource downloads work via direct links to files in the `/materials` directory in the GitHub repository.**
- GitHub repository link is functional: `http://github.com/kuberwastaken/engram`.

---

## 📝 Additional Notes
### Technical Decisions:
- **CDN Usage**: Chosen for simplicity and faster setup; future iterations can use a proper build tool like Vite.
- **Mock ShadCN**: Since ShadCN isn't available via CDN, components are mocked with Tailwind CSS for this prototype.
- **All study materials are stored and versioned in the `/materials` directory of the GitHub repository.**
- **Animations**: CSS-based for performance; consider Framer Motion for more complex animations in the future.

### Future Enhancements:
- Integrate real PDFs and a backend (e.g., Firebase) for resource storage if GitHub file size limits are reached.
- Add user authentication for contributors to upload resources.
- Implement search functionality for subjects and resources.
- Add light theme toggle for accessibility.

---

This plan provides a clear, actionable roadmap for developing Engram, ensuring all requirements are met while maintaining a high-quality user experience. Each phase builds on the previous one, with regular testing to catch issues early. Update this document as development progresses, checking off tasks and noting any deviations or challenges encountered.