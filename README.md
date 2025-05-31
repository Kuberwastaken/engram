
# Engram - IPU Study Materials Hub

The centralized, No BS Open-Source hub for IP University study materials.

## 🚀 Features

- **Branch & Semester Selection**: Choose from 8 engineering branches (AIDS, AIML, CIVIL, CSE, ECE, EEE, IT, MECH) and 6 semesters
- **Space-themed Dark UI**: Beautiful cosmic interface with animated starfields and orbital effects
- **Persistent Preferences**: Your selections are saved locally and restored on revisit
- **Comprehensive Resources**: Access to SYLLABUS, NOTES, PYQS, LAB materials, BOOKS, AKASH notes, and VIDEOS
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Contributor Attribution**: Every resource shows who contributed it to help the community

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: ShadCN UI components
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Hooks + LocalStorage

## 🎨 Design Philosophy

Engram features a space-themed dark interface inspired by the cosmos:
- **Deep space backgrounds** with gradient overlays
- **Twinkling star animations** for ambient atmosphere
- **Orbital ring effects** on interactive elements
- **Cosmic color palette** with blues, purples, and stellar whites
- **Smooth animations** and transitions throughout

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── StarField.tsx   # Animated starry background
│   └── SubjectGrid.tsx # Subject cards grid
├── pages/              # Application pages
│   ├── Index.tsx       # Homepage with selection interface
│   ├── Subject.tsx     # Subject details with tabs
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kuberwastaken/engram.git
cd engram
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 📚 Adding Study Materials

Engram uses a file-based system for study materials. All resources should be added to the `/materials` directory with the following structure:

```
materials/
├── AIDS/
│   ├── 1st/
│   │   ├── Applied Mathematics I/
│   │   │   ├── notes/
│   │   │   ├── pyqs/
│   │   │   ├── lab/
│   │   │   └── books/
│   │   └── ...
│   └── ...
├── CSE/
└── ...
```

### File Naming Convention
- Use descriptive names: `Chapter_1_Introduction.pdf`
- Include version/year when applicable: `PYQ_2023.pdf`
- Avoid spaces in filenames, use underscores: `Lab_Manual_v2.pdf`

### Contribution Guidelines
1. Ensure files are properly named and organized
2. Update the resource data in `SubjectGrid.tsx` if adding new subjects
3. Include contributor attribution when adding resources
4. Test download links before submitting

## 🎯 Usage

1. **Select Branch**: Choose your engineering branch from the dropdown
2. **Select Semester**: Pick your current semester
3. **Browse Subjects**: View all subjects for your branch/semester combination
4. **Access Resources**: Click on any subject to view available materials
5. **Download Materials**: Use the tabbed interface to find and download resources

## 🌟 Contributing

We welcome contributions from the IPU community! Here's how you can help:

### Adding Study Materials
1. Fork the repository
2. Add your materials to the appropriate `/materials` directory
3. Update resource listings if needed
4. Submit a pull request with description of added materials

### Code Contributions
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a pull request

### Reporting Issues
- Use GitHub Issues to report bugs or request features
- Provide detailed descriptions and steps to reproduce
- Include screenshots for UI-related issues

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- IPU student community for their contributions
- ShadCN for the excellent UI components
- All contributors who help make study materials accessible

## 📞 Support

- Create an issue on GitHub for bug reports or feature requests
- Join our community discussions for general questions
- Check existing issues before creating new ones

---

**Built with ❤️ for the IPU student community**
