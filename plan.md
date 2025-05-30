Here’s an improved, highly detailed, and structured step-by-step plan for the **Engram Project Development**, tailored for clarity, precision, and actionable guidance for an AI or development team. The plan is broken into phases with detailed tasks, dependencies, timelines, and success metrics to ensure smooth execution. It also incorporates best practices for modern web development, with a focus on modularity, scalability, and user experience.

---

# Engram Development Plan

## 📋 Project Overview
**Goal**: Build **Engram**, a centralized, open-source web application for IPU (Indraprastha University) student notes, featuring a minimal, space-themed dark UI. The app will be desktop and mobile-friendly, built with React, ShadCN, and Tailwind CSS, and will support all engineering branches and 6 semesters. Key features include branch/semester selection with LocalStorage persistence, a subject grid, tabbed subject details, downloadable resources, and contributor attribution.

**Tech Stack**:
- **Frontend**: Next.js (React framework), ShadCN UI components, Tailwind CSS.  
- **Storage**: LocalStorage for user preferences; **all study materials (notes, PDFs, books, etc.) will be stored directly in the GitHub repository under a structured `/materials` directory**.  
- **Styling**: Space-themed dark UI with animations.  
- **Deployment**: Vercel (Next.js default) or GitHub Pages (with static export).
- **Language**: TypeScript (recommended for Next.js and ShadCN UI).
- **Testing & Linting**: Jest and React Testing Library for unit/integration tests; ESLint and Prettier for code quality and formatting.
- **CI/CD**: GitHub Actions for automated builds, tests, and deployment.
- **Project Management**: GitHub Issues and Projects for tracking tasks, bugs, and features.

---

## 📅 Development Phases

### Phase 1: Setup & Initial Configuration
**Objective**: Establish the project foundation, set up dependencies, and initialize version control.

#### Tasks:
- [x] **Project Initialization**:
    - [x] Create project directory: `d:\\Projects\\ENGRAM-PROJECT`.
    - [x] Set up basic file structure: Next.js app with TypeScript (`npx create-next-app@latest --typescript`), and a `/materials` directory for all study resources.
    - [x] Remove default boilerplate and set up a minimal Next.js page that renders "Hello, Engram!".
    - [x] **Success Metric**: A blank Next.js app renders "Hello, Engram!" on the browser.

- [x] **Dependencies Setup**:
    - [x] Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`.
    - [x] Install ShadCN UI: `npx shadcn-ui@latest init` and add required components.
    - [x] Configure Tailwind and ShadCN in the Next.js project.
    - [x] Install and configure TypeScript, ESLint, and Prettier.
    - [x] **Success Metric**: All dependencies install without errors; a basic Tailwind-styled ShadCN component renders correctly.

- [ ] **Testing & CI/CD Setup**:
    - [x] Set up Jest and React Testing Library for unit/integration tests.
    - [x] Add sample test for a simple component.
    - [x] Set up GitHub Actions for automated builds, linting, and tests on pull requests.
    - [ ] **Success Metric**: Tests and linting run automatically on GitHub Actions.

- [ ] **Documentation & Project Management**:
    - [x] Create `README.md` with project overview, setup instructions, and contribution guidelines, including how to add new materials to the `/materials` directory (file naming, directory structure, etc.).
    - [x] Add MIT License file (`LICENSE`).
    - [ ] Set up GitHub Issues and Projects for tracking tasks and bugs.
    - [ ] **Success Metric**: README includes setup steps, project description, and clear instructions for contributing materials. Issues and Projects are enabled.

**Dependencies**: None.  
**Estimated Time**: 8 hours (4 hours/day).  
**Risks**: Dependency or install issues; mitigate by following official Next.js, Tailwind, and ShadCN docs.

---

### Phase 2: Design & Theme Implementation
**Objective**: Build the space-themed dark UI with responsive layouts and animations.

#### Tasks:
- [ ] **Dark Theme Setup**:
    - [ ] Define color scheme in `tailwind.config.js` and global CSS:
        - Primary background: `#1a1a1a` (dark gray-black).
        - Primary text: `#ffffff` (white).
        - Secondary text: `#a1a1a1` (light gray).
        - Accent color: `#3b82f6` (blue).
    - [ ] Apply to the root element: `body { background: #1a1a1a; color: #ffffff; }` in `globals.css`.
    - [ ] **Success Metric**: Page background and text colors match the dark theme.

- [ ] **Space Theme Implementation**:
    - [ ] Create a starry gradient background: Linear gradient from `#1a1a1a` to `#1e3a8a` (dark blue) with a starry overlay.
    - [ ] Add twinkling stars using CSS and Next.js custom components.
    - [ ] Dynamically generate 50-100 stars of varying sizes (1px-3px) and positions using React/JSX.
    - [ ] **Success Metric**: Background displays a starry gradient with twinkling stars.

- [ ] **Responsive Layout Design**:
    - [ ] Use Tailwind CSS for responsive grids:
        - Desktop: 3-column grid (`grid grid-cols-3 gap-4`).
        - Tablet (md breakpoint): 2-column grid (`md:grid-cols-2`).
        - Mobile (sm breakpoint): 1-column grid (`sm:grid-cols-1`).
    - [ ] Ensure buttons are touch-friendly: `min-h-[48px]`.
    - [ ] Test on Chrome DevTools for screen sizes: 320px (mobile), 768px (tablet), 1280px (desktop).
    - [ ] **Success Metric**: Grid layout adjusts correctly across breakpoints.

- [ ] **Animations**:
    - [ ] Add orbital ring animation for hover effects using CSS modules or global CSS.
    - [ ] Implement fade-in for page loads: `animation: fadeIn 0.5s ease-in`.
    - [ ] **Success Metric**: Hovering on elements triggers orbital animation; page loads with fade-in.

**Dependencies**: Phase 1 (project setup).  
**Estimated Time**: 12 hours (4 hours/day).  
**Risks**: Animation performance on low-end devices; mitigate by testing on multiple devices and optimizing keyframes.

---

### Phase 3: Hero Page Development
**Objective**: Build the homepage with branch/semester dropdowns and a space-themed layout.

#### Tasks:
- [ ] **Header Section**:
    - [ ] Create a fixed navigation bar using a Next.js component: `fixed top-0 w-full bg-[#1a1a1a]/90 backdrop-blur-md`.
    - [ ] Add Engram logo (text-based for simplicity: "ENGRAM") on the left: `text-2xl font-bold`.
    - [ ] Add GitHub link on the right using an SVG icon: Link to `http://github.com/kuberwastaken/engram`.
    - [ ] Add tagline below the nav: "The centralized, No BS Open-Source hub for IP University Material" (`text-center text-lg text-[#a1a1a1]`).
    - [ ] **Success Metric**: Header renders with logo, GitHub link, and tagline.

- [ ] **Main Interface**:
    - [ ] Add space-themed background (from Phase 2).
    - [ ] Create a centered container for dropdowns: `max-w-md mx-auto mt-10`.
    - [ ] Implement branch dropdown using ShadCN `<Select>` component.
    - [ ] Options: AIDS, AIML, CIVIL, CSE, ECE, EEE, IT, MECH.
    - [ ] Implement semester dropdown similarly: Options: 1st to 6th.
    - [ ] Style dropdowns for responsiveness: Horizontal on desktop (`flex gap-4`), vertical on mobile (`flex flex-col gap-4 sm:flex-row`).
    - [ ] **Success Metric**: Dropdowns render and allow selection.

**Dependencies**: Phase 2 (theme setup).  
**Estimated Time**: 8 hours (4 hours/day).  
**Risks**: Dropdown styling inconsistencies; mitigate by testing across browsers.

---

### Phase 4: Core Functionality
**Objective**: Implement branch/semester selection, LocalStorage persistence, and subject grid rendering.

#### Tasks:
- [ ] **Branch & Semester Selection Logic**:
    - [ ] Create state for selections in React (Next.js page or component):
        ```jsx
        const [branch, setBranch] = React.useState('');
        const [semester, setSemester] = React.useState('');
        ```
    - [ ] Add change handlers for dropdowns: `setBranch(value)` and `setSemester(value)`.
    - [ ] Validate combinations (e.g., ensure branch and semester are selected before rendering subjects).
    - [ ] **Success Metric**: Selecting a branch and semester updates the state correctly.

- [ ] **LocalStorage Integration**:
    - [ ] Save selections on change using `useEffect`:
        ```jsx
        React.useEffect(() => {
          if (branch && semester) {
            localStorage.setItem('preferences', JSON.stringify({ branch, semester }));
          }
        }, [branch, semester]);
        ```
    - [ ] Retrieve on app load:
        ```jsx
        React.useEffect(() => {
          const saved = JSON.parse(localStorage.getItem('preferences'));
          if (saved) {
            setBranch(saved.branch);
            setSemester(saved.semester);
          }
        }, []);
        ```
    - [ ] Add a "Reset Preferences" button: `localStorage.removeItem('preferences'); setBranch(''); setSemester('');`.
    - [ ] Handle errors (e.g., LocalStorage disabled): Display a fallback message.
    - [ ] **Success Metric**: Selections persist across page reloads; reset button clears preferences.

- [ ] **Subject Grid Rendering**:
    - [ ] Create a mock data structure (JSON or JS object):
        ```js
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
    - [ ] Render subjects as a grid when branch and semester are selected using Tailwind and Next.js components:
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
    - [ ] Add hover effects (scale-up) and orbital ring animation (from Phase 2).
    - [ ] **Success Metric**: Subjects render in a responsive grid based on selections.

- [ ] **Resource Linking**:
    - [ ] All downloadable resources will be stored in the `/materials` directory in the repository, organized by branch, semester, and subject.
    - [ ] When rendering downloadable resources, generate links that point to the correct path in the `/materials` directory:
        ```js
        const handleDownload = (fileName) => {
          const url = `/materials/${branch}/${semester}/${subject}/${fileName}`;
          window.open(url, '_blank');
        };
        ```
    - [ ] The mock data for resources should include the actual file names present in the repo.
    - [ ] **Success Metric**: Download links point to files in the `/materials` directory and work on deployed site.

**Dependencies**: Phase 3 (hero page).  
**Estimated Time**: 16 hours (4 hours/day).  
**Risks**: Routing issues; mitigate by testing navigation thoroughly.

---

### Phase 5: Subject Details Page
**Objective**: Build the subject details page with tabbed navigation and resource links.

#### Tasks:
- [ ] **Routing Setup**:
    - [ ] Use Next.js file-based routing for pages (e.g., `/subject/[name].tsx`).
    - [ ] Add navigation from subject cards using Next.js `<Link>` component.
    - [ ] Add breadcrumb navigation on the subject page: `Home > {subject}`.
    - [ ] **Success Metric**: Clicking a subject card navigates to `/subject/<subject-name>`.

- [ ] **Tabbed Interface**:
    - [ ] Use ShadCN `<Tabs>` component for tabbed navigation.
    - [ ] Define tabs: `["Syllabus", "Notes", "PYQs", "Lab", "Books", "Akash", "Videos"]`.
    - [ ] Implement tab switching with fade-in animation using Tailwind or CSS modules.
    - [ ] **Success Metric**: Tabs render and switch with animation.

- [ ] **Content Implementation**:
    - [ ] **Syllabus Tab**: Display static text (e.g., "Syllabus for Applied Chemistry: Unit I - Basics...").
    - [ ] **Other Tabs**: Render downloadable resources:
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
                  <Button onClick={() => handleDownload(resource.name)} className="p-2 bg-[#3b82f6] rounded-md hover:ring-2 hover:ring-[#3b82f6] transition-all">
                    Download
                  </Button>
                  {activeTab !== "Syllabus" && (
                    <p className="text-sm text-[#a1a1a1] mt-1">Contributed by: {resource.contributor}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
        ```
    - [ ] **Success Metric**: Resources render with contributor info (except for Syllabus), and download links point to files in `/materials`.

**Dependencies**: Phase 4 (core functionality).  
**Estimated Time**: 16 hours (4 hours/day).  
**Risks**: Routing issues; mitigate by testing navigation thoroughly.

---

### Phase 6: Download Functionality & Animations
**Objective**: Implement downloadable resources and enhance UX with animations.

#### Tasks:
- [ ] **Download Functionality**:
    - [ ] All resource files are stored in the `/materials` directory in the repository.
    - [ ] Download logic uses direct links to these files:
        ```js
        const handleDownload = (fileName) => {
          const link = document.createElement('a');
          link.href = `/materials/${branch}/${semester}/${subject}/${fileName}`;
          link.download = fileName;
          link.click();
        };
        ```
    - [ ] Add orbiting spinner animation during download using a ShadCN or custom spinner component.
    - [ ] Handle errors: Display a toast message if the download fails (use ShadCN Toast component).
    - [ ] **Success Metric**: Clicking "Download" triggers a browser download action from the `/materials` directory.

- [ ] **Animations & Interactions**:
    - [ ] Add slide-in animation for tab content (from Phase 5) using Tailwind or CSS modules.
    - [ ] Implement loading spinners for page transitions: Use the orbiting spinner style.
    - [ ] Optimize animations: Use `will-change: transform, opacity` to improve performance.
    - [ ] Test on low-end devices (e.g., throttle CPU in Chrome DevTools).
    - [ ] **Success Metric**: Animations run smoothly without lag.

**Dependencies**: Phase 5 (subject details).  
**Estimated Time**: 12 hours (4 hours/day).  
**Risks**: Download failures due to mock URLs; mitigate by ensuring proper file naming and browser compatibility.

---

### Phase 7: Testing & Quality Assurance
**Objective**: Ensure the app is bug-free, performant, and accessible.

#### Tasks:
- [ ] **Functionality Testing**:
    - [ ] Test dropdown selections and LocalStorage persistence.
    - [ ] Verify navigation between pages (Next.js routing).
    - [ ] Test download functionality across tabs.
    - [ ] Check contributor attribution display.
    - [ ] **Success Metric**: All core features work as expected.

- [ ] **Automated Testing & Linting**:
    - [ ] Run unit and integration tests using Jest and React Testing Library.
    - [ ] Run ESLint and Prettier to ensure code quality and formatting.
    - [ ] **Success Metric**: All tests pass and code is linted/formatted on CI.

- [ ] **Browser Compatibility**:
    - [ ] Test on Chrome, Firefox, Safari, Edge.
    - [ ] Test on mobile browsers: iOS Safari, Chrome Mobile.
    - [ ] Verify all dependencies load correctly.
    - [ ] **Success Metric**: App renders consistently across browsers.

- [ ] **Performance & Accessibility**:
    - [ ] Measure page load time: Target < 2 seconds.
    - [ ] Test animation performance: Target 60 FPS.
    - [ ] Ensure accessibility: Add `aria-label` to buttons, ensure keyboard navigation, and use semantic HTML.
    - [ ] Use tools like axe or Lighthouse for accessibility checks.
    - [ ] **Success Metric**: App meets performance and accessibility standards.

**Dependencies**: Phase 6 (download functionality).  
**Estimated Time**: 8 hours (4 hours/day).  
**Risks**: Browser-specific bugs; mitigate by using polyfills if needed.

---

### Phase 8: Deployment & Documentation
**Objective**: Deploy the app, finalize documentation, and share with stakeholders.

#### Tasks:
- [ ] **Final Polish**:
    - [ ] Review and clean up code: Remove console logs, unused variables.
    - [ ] Minify CSS/JS: Use Next.js build and minification (`next build`).
    - [ ] Final responsive design test.
    - [ ] **Success Metric**: Code is clean and optimized.

- [ ] **Documentation**:
    - [ ] Update `README.md` with setup instructions, features, and screenshots.
    - [ ] Document component usage and animations.
    - [ ] Add contribution guidelines and license information.
    - [ ] **Add detailed instructions for contributors on how to add new materials to the `/materials` directory, including directory structure, file naming, and updating resource lists if needed.**
    - [ ] **Success Metric**: Documentation is comprehensive and user-friendly, and contributors can easily add new materials.

- [ ] **Deployment**:
    - [ ] Deploy to Vercel (recommended for Next.js) or GitHub Pages (using `next export`).
    - [ ] Test the deployed version: Ensure all features work, including resource downloads from `/materials`.
    - [ ] Update GitHub repository with final changes.
    - [ ] Share the live URL with stakeholders.
    - [ ] **Success Metric**: App is live and accessible, and all materials are downloadable from the deployed site.

**Dependencies**: Phase 7 (testing).  
**Estimated Time**: 4 hours.  
**Risks**: Deployment failures; mitigate by following Next.js and Vercel documentation.

---

## ✅ Success Criteria
- [ ] App loads seamlessly on desktop and mobile browsers.
- [ ] Branch and semester selections persist across sessions via LocalStorage.
- [ ] UI components (dropdowns, cards, tabs, buttons) are styled consistently with ShadCN and the space theme.
- [ ] Animations (fade-in, slide-in, orbital rings) enhance UX without performance issues.
- [ ] Users can navigate, view, and download resources intuitively.
- [ ] Dark theme and space-themed elements (starry background, cosmic animations) are implemented throughout.
- [ ] All 8 branches and 6 semesters are supported with mock data.
- [ ] **All resource downloads work via direct links to files in the `/materials` directory in the GitHub repository or deployed site.**
- [ ] GitHub repository link is functional: `http://github.com/kuberwastaken/engram`.
- [ ] ShadCN UI components are used natively via Next.js, not mocked.

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