# ENGRAM Materials Distribution Guide

## 🎯 Problem Solved
- ✅ Git repository is now clean (no more 34GB of PDFs causing push failures)
- ✅ Materials are properly excluded from version control
- ✅ Codebase can be pushed and deployed without issues

## 🗂️ Materials Distribution Strategy

### JSDelivr CDN + GitHub Repository (Chosen Solution)

**Why This is Perfect:**
- ✅ **100% Free** - No paid services required
- ✅ **100% Open Source** - No environment variables or API keys
- ✅ **Global CDN** - JSDelivr provides worldwide fast access
- ✅ **Automatic Caching** - Files cached globally for 1 year
- ✅ **High Bandwidth** - Can handle massive traffic without costs
- ✅ **Version Control** - Full Git history for materials
- ✅ **Easy Updates** - Just push to GitHub, CDN auto-updates

**Architecture:**
```
Main Repo (engram) 
├── Source code (~50MB)
├── No materials
└── References engram-files repo

Materials Repo (engram-files)
├── All PDFs organized by branch/semester  
├── Up to 100MB per file (GitHub limit)
├── Served via JSDelivr CDN
└── Direct URL access
```

**URL Pattern:**
```
Primary CDN:   https://cdn.jsdelivr.net/gh/kuberwastaken/engram-files@main/
Fallback 1:    https://raw.githubusercontent.com/kuberwastaken/engram-files/main/
Fallback 2:    https://gitcdn.xyz/repo/kuberwastaken/engram-files/main/

Example file:  https://cdn.jsdelivr.net/gh/kuberwastaken/engram-files@main/CSE/SEM3/Data%20Structures/notes/DSA_Complete_Notes.pdf
```

## 🔧 Implementation Steps

### 1. Create the Materials Repository
```powershell
# Create engram-files repository on GitHub
gh repo create engram-files --public --description "Study materials for ENGRAM - PDFs organized by branch and semester"
```

### 2. Set Up Local Materials Repository
```powershell
# Clone the new repository
git clone https://github.com/kuberwastaken/engram-files.git
cd engram-files

# Copy materials from main project
Copy-Item -Recurse "d:\Projects\ENGRAM-PROJECT\materials\*" "."

# Create README
@"
# ENGRAM Files Repository

This repository contains all study materials for the ENGRAM platform, organized by branch and semester.

## Structure
```
Branch/
├── SEM1/
│   ├── Subject1/
│   │   ├── notes/
│   │   ├── pyqs/
│   │   ├── lab/
│   │   ├── books/
│   │   └── syllabus/
│   └── Subject2/
└── SEM2/
```

## Access
Files are served via JSDelivr CDN:
- Primary: https://cdn.jsdelivr.net/gh/kuberwastaken/engram-files@main/
- Fallback: https://raw.githubusercontent.com/kuberwastaken/engram-files/main/

## Contributing
1. Fork this repository
2. Add materials in the correct folder structure
3. Create a pull request
4. Materials will be automatically available via CDN after merge

## File Limits
- Maximum file size: 100MB (GitHub limit)
- For larger files, split into parts or compress
"@ | Out-File -FilePath "README.md" -Encoding UTF8

# Commit and push
git add .
git commit -m "Initial materials upload - complete IPU study materials"
git push origin main
```

### 3. Update ENGRAM App (Already Done)
The materials configuration is already set up in `src/lib/materials-config.ts` to use JSDelivr CDN.

### 4. Test the Integration
```powershell
# Build and test locally
cd "d:\Projects\ENGRAM-PROJECT"
npm run dev
```

Visit a subject page and test downloading materials. The app will automatically fetch from the CDN.

## 📊 Benefits Comparison

| Feature | This Solution | GitHub Releases | Paid CDN |
|---------|---------------|-----------------|----------|
| Cost | **Free** | Free | $5-50/month |
| Setup Time | **10 minutes** | 30 minutes | 2 hours |
| File Size Limit | **100MB** | 2GB | Unlimited |
| Global CDN | **✅ JSDelivr** | ❌ | ✅ |
| Version Control | **✅ Git** | ✅ | ❌ |
| No API Keys | **✅** | ✅ | ❌ |
| Auto Caching | **✅ 1 year** | ❌ | ✅ |
| Bandwidth Limit | **Unlimited** | Fair use | Paid |

## 🚀 Deployment Steps

1. **Create engram-files repository** (5 minutes)
2. **Copy materials** (10 minutes - depends on upload speed)
3. **Test CDN access** (2 minutes)
4. **Deploy ENGRAM** (3 minutes to Vercel/Netlify)
5. **Verify downloads** (5 minutes)

**Total Setup Time: ~25 minutes**

## 🔄 Maintenance Workflow

### Adding New Materials
```powershell
# In engram-files repository
git pull origin main
# Add new files in correct structure
git add .
git commit -m "Add new materials for CSE SEM5"
git push origin main
# Files automatically available via CDN within 24 hours (usually instant)
```

### For Contributors
1. Fork `engram-files` repository
2. Add materials in correct folder structure
3. Create pull request
4. After merge, materials automatically available via CDN

## 🎯 Why This Solution Wins

1. **Zero Infrastructure Costs** - Everything runs on free services
2. **Global Performance** - JSDelivr has 100+ global edge locations
3. **Developer Friendly** - Clean separation, easy local development
4. **Contributor Friendly** - Simple Git workflow for adding materials
5. **Future Proof** - Can easily migrate if needed
6. **High Availability** - Multiple CDN fallbacks built-in

This setup gives you enterprise-grade performance with zero costs! 🌟
