const fs = require('fs');
const path = require('path');

class MultiBranchSem3Integrator {
    constructor() {
        this.sem3File = path.join(__dirname, '../public/Content-Meta/Sem3Notes.json');
        this.unifiedFile = path.join(__dirname, '../public/Content-Meta/UnifiedContent.json');
        this.backupDir = path.join(__dirname, 'backups');
        
        // Subject to branch mapping based on curriculum relevance
        this.subjectBranchMapping = {
            'CRST': {
                name: 'Computer Science and Technology',
                branches: ['CSE', 'IT', 'CST', 'ITE', 'AIDS', 'AIML', 'CIVIL', 'MECH'], // CS fundamentals for all
                category: 'core'
            },
            'DLD': {
                name: 'Digital Logic Design',
                branches: ['CSE', 'IT', 'CST', 'ITE', 'AIDS', 'AIML', 'ECE', 'EEE'], // Hardware-related branches + AIDS/AIML
                category: 'core'
            },
            'DS': {
                name: 'Data Structures',
                branches: ['CSE', 'IT', 'CST', 'ITE', 'AIDS', 'AIML'], // Programming-heavy branches
                category: 'core'
            },
            'FODS': {
                name: 'Fundamentals of Data Science',
                branches: ['AIDS', 'AIML', 'CSE', 'IT'], // Data science specific
                category: 'core'
            },
            'PAI': {
                name: 'Principles of Artificial Intelligence',
                branches: ['AIDS', 'AIML', 'CSE', 'IT'], // AI/ML specific
                category: 'core'
            },
            'PSLA': {
                name: 'Probability Statistics and Linear Algebra',
                branches: ['CSE', 'IT', 'CST', 'ITE', 'AIDS', 'AIML'], // Programming branches
                category: 'core'
            },
            'UHV': {
                name: 'Universal Human Values',
                branches: ['CSE', 'IT', 'CST', 'ITE', 'AIDS', 'AIML', 'CIVIL', 'ECE', 'EEE', 'MECH'], // Common to all
                category: 'humanities'
            },
            'WEB_PROG': {
                name: 'Web Programming',
                branches: ['CSE', 'IT', 'CST', 'ITE'], // Web development branches
                category: 'elective'
            },
            'SYLLABUS': {
                name: 'Syllabus Collection',
                branches: ['CSE', 'IT', 'CST', 'ITE', 'AIDS', 'AIML', 'CIVIL', 'ECE', 'EEE', 'MECH'], // Reference for all
                category: 'reference'
            }
        };
    }

    ensureBackupDir() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    loadSem3Data() {
        console.log('📖 Loading Sem 3 data...');
        try {
            const data = fs.readFileSync(this.sem3File, 'utf8');
            const parsed = JSON.parse(data);
            console.log(`✅ Loaded Sem 3 data: ${parsed.metadata.totalSubjects} subjects, ${parsed.metadata.totalFiles} files`);
            return parsed;
        } catch (error) {
            console.error('❌ Error loading Sem 3 data:', error.message);
            return null;
        }
    }

    loadUnifiedContent() {
        console.log('📖 Loading Unified Content...');
        try {
            const data = fs.readFileSync(this.unifiedFile, 'utf8');
            const parsed = JSON.parse(data);
            console.log(`✅ Loaded existing unified content`);
            return parsed;
        } catch (error) {
            console.error('❌ Error loading unified content:', error.message);
            return null;
        }
    }

    integrateAcrossMultipleBranches(unifiedContent, sem3Data) {
        console.log('🔄 Integrating Sem 3 data across multiple branches...');

        // Create backup
        this.ensureBackupDir();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `unified-content-multibranch-backup-${timestamp}.json`);
        fs.writeFileSync(backupPath, JSON.stringify(unifiedContent, null, 2));
        console.log(`💾 Backup created: ${backupPath}`);

        let totalAddedSubjects = 0;
        let totalAddedMaterials = 0;
        const branchStats = {};

        // Initialize branch stats
        Object.keys(this.subjectBranchMapping).forEach(subjectCode => {
            this.subjectBranchMapping[subjectCode].branches.forEach(branch => {
                if (!branchStats[branch]) {
                    branchStats[branch] = { subjects: 0, materials: 0 };
                }
            });
        });

        // Process each subject and distribute to appropriate branches
        if (sem3Data.branches && sem3Data.branches.CSE && sem3Data.branches.CSE["3rd"]) {
            Object.entries(sem3Data.branches.CSE["3rd"]).forEach(([subjectCode, subjectData]) => {
                const mapping = this.subjectBranchMapping[subjectCode];
                
                if (!mapping) {
                    console.warn(`⚠️  No mapping found for ${subjectCode}, skipping`);
                    return;
                }

                console.log(`📚 Processing ${subjectCode} - ${mapping.name}`);
                console.log(`   🎯 Target branches: ${mapping.branches.join(', ')}`);

                // Count materials in this subject
                const materialCount = Object.values(subjectData)
                    .filter(val => Array.isArray(val))
                    .reduce((sum, arr) => sum + arr.length, 0);

                // Add to each relevant branch
                mapping.branches.forEach(branch => {
                    // Initialize branch structure if needed
                    if (!unifiedContent.materials[branch]) {
                        unifiedContent.materials[branch] = {};
                    }
                    if (!unifiedContent.materials[branch].SEM3) {
                        unifiedContent.materials[branch].SEM3 = { subjects: {} };
                    }

                    const subjectKey = subjectCode.toLowerCase().replace(/_/g, '-');
                    
                    // Add subject to this branch
                    unifiedContent.materials[branch].SEM3.subjects[subjectKey] = {
                        name: mapping.name,
                        code: subjectCode,
                        category: mapping.category,
                        materials: {
                            syllabus: subjectData.syllabus || [],
                            notes: subjectData.notes || [],
                            pyqs: subjectData.pyqs || [],
                            books: subjectData.books || [],
                            lab: subjectData.lab || [],
                            akash: subjectData.akash || [],
                            videos: subjectData.videos || [],
                            viva: subjectData.viva || [],
                            midsem: subjectData.midsem || []
                        },
                        units: subjectData.units || [],
                        lastUpdated: new Date().toISOString(),
                        source: "google-drive-sem3",
                        appliedToBranch: branch
                    };

                    // Update branch stats
                    branchStats[branch].subjects++;
                    branchStats[branch].materials += materialCount;

                    console.log(`     ✅ Added to ${branch}: ${materialCount} materials`);
                });

                totalAddedSubjects++;
                totalAddedMaterials += materialCount;
            });
        }

        // Update metadata
        unifiedContent.metadata.lastUpdated = new Date().toISOString();
        unifiedContent.metadata.totalSubjects += totalAddedSubjects * Object.keys(branchStats).length; // Each subject added to multiple branches
        unifiedContent.metadata.totalMaterials += totalAddedMaterials * Object.keys(branchStats).length;

        // Ensure SEM3 is in semesters list
        if (!unifiedContent.metadata.semesters.includes('SEM3')) {
            unifiedContent.metadata.semesters.push('SEM3');
        }

        console.log(`✅ Multi-branch integration completed:`);
        console.log(`   📚 Subjects processed: ${totalAddedSubjects}`);
        console.log(`   🌐 Branches updated: ${Object.keys(branchStats).length}`);
        console.log(`   📁 Total materials distributed: ${totalAddedMaterials * Object.keys(branchStats).length}`);

        console.log('\n📊 Branch Distribution:');
        Object.entries(branchStats).forEach(([branch, stats]) => {
            console.log(`   ${branch}: ${stats.subjects} subjects, ${stats.materials} materials`);
        });

        return { unifiedContent, branchStats, totalAddedSubjects, totalAddedMaterials };
    }

    generateMultiBranchReport(integrationResult) {
        console.log('📊 Generating multi-branch integration report...');

        const { unifiedContent, branchStats, totalAddedSubjects, totalAddedMaterials } = integrationResult;

        const report = {
            generatedAt: new Date().toISOString(),
            integrationStrategy: "Multi-Branch Distribution",
            summary: {
                totalBranches: unifiedContent.metadata.branches.length,
                branchesUpdated: Object.keys(branchStats).length,
                totalSemesters: unifiedContent.metadata.semesters.length,
                totalSubjects: unifiedContent.metadata.totalSubjects,
                totalMaterials: unifiedContent.metadata.totalMaterials
            },
            subjectDistribution: {},
            branchBreakdown: branchStats,
            newlyAdded: {
                semester: "SEM3",
                subjectsProcessed: totalAddedSubjects,
                materialsDistributed: totalAddedMaterials,
                distributionStrategy: "Subject-specific branch mapping based on curriculum relevance"
            }
        };

        // Document which branches each subject was added to
        Object.entries(this.subjectBranchMapping).forEach(([subjectCode, mapping]) => {
            report.subjectDistribution[subjectCode] = {
                name: mapping.name,
                category: mapping.category,
                distributedToBranches: mapping.branches,
                branchCount: mapping.branches.length
            };
        });

        return report;
    }

    saveResults(unifiedContent, report) {
        console.log('💾 Saving multi-branch integration results...');

        try {
            // Save unified content
            fs.writeFileSync(this.unifiedFile, JSON.stringify(unifiedContent, null, 2));
            console.log(`✅ Unified content saved to: ${this.unifiedFile}`);

            // Save integration report
            const reportPath = path.join(__dirname, 'multi-branch-integration-report.json');
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`📊 Multi-branch integration report saved to: ${reportPath}`);

            // Create updated manifest
            const manifest = {
                lastUpdated: new Date().toISOString(),
                version: unifiedContent.metadata.version,
                integrationStrategy: "Multi-Branch Distribution",
                availableBranches: unifiedContent.metadata.branches,
                availableSemesters: unifiedContent.metadata.semesters,
                totalContent: {
                    branches: unifiedContent.metadata.branches.length,
                    semesters: unifiedContent.metadata.semesters.length,
                    subjects: unifiedContent.metadata.totalSubjects,
                    materials: unifiedContent.metadata.totalMaterials
                },
                sem3Integration: {
                    strategy: "Subject-specific branch mapping",
                    branchesUpdated: Object.keys(report.branchBreakdown),
                    subjectsDistributed: report.newlyAdded.subjectsProcessed,
                    materialsDistributed: report.newlyAdded.materialsDistributed
                },
                files: {
                    unifiedContent: this.unifiedFile,
                    sem3Notes: this.sem3File,
                    integrationReport: reportPath
                }
            };

            const manifestPath = path.join(__dirname, '../public/Content-Meta/content-manifest.json');
            fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
            console.log(`📋 Updated content manifest saved to: ${manifestPath}`);

        } catch (error) {
            console.error('❌ Error saving results:', error.message);
        }
    }

    displayMultiBranchSummary(report) {
        console.log('\n' + '='.repeat(80));
        console.log('🎯 MULTI-BRANCH SEM 3 INTEGRATION SUMMARY');
        console.log('='.repeat(80));
        console.log(`📚 Total Branches: ${report.summary.totalBranches}`);
        console.log(`🌐 Branches Updated: ${report.summary.branchesUpdated}`);
        console.log(`📖 Total Semesters: ${report.summary.totalSemesters}`);
        console.log(`📋 Total Subjects: ${report.summary.totalSubjects}`);
        console.log(`📁 Total Materials: ${report.summary.totalMaterials}`);

        console.log('\n📊 Subject Distribution Strategy:');
        Object.entries(report.subjectDistribution).forEach(([code, subject]) => {
            console.log(`   ${code}: ${subject.name} (${subject.category})`);
            console.log(`      🎯 Distributed to: ${subject.distributedToBranches.join(', ')}`);
            console.log(`      📊 Branch count: ${subject.branchCount}`);
        });

        console.log('\n🌐 Branch Breakdown:');
        Object.entries(report.branchBreakdown).forEach(([branch, stats]) => {
            console.log(`   ${branch}: ${stats.subjects} subjects, ${stats.materials} materials`);
        });

        console.log('\n🆕 Integration Summary:');
        console.log(`   📚 Subjects Processed: ${report.newlyAdded.subjectsProcessed}`);
        console.log(`   📁 Materials Distributed: ${report.newlyAdded.materialsDistributed}`);
        console.log(`   🎯 Strategy: ${report.newlyAdded.distributionStrategy}`);

        console.log('='.repeat(80));
    }

    async run() {
        console.log('🎯 Starting Multi-Branch Sem 3 Integration...');
        console.log('📅 Timestamp:', new Date().toISOString());
        console.log('🌐 Strategy: Subject-specific branch mapping based on curriculum relevance');
        console.log('─'.repeat(60));

        try {
            // Load data
            const sem3Data = this.loadSem3Data();
            if (!sem3Data) {
                throw new Error('Failed to load Sem 3 data');
            }

            const unifiedContent = this.loadUnifiedContent();
            if (!unifiedContent) {
                throw new Error('Failed to load unified content');
            }

            // Integrate across multiple branches
            const integrationResult = this.integrateAcrossMultipleBranches(unifiedContent, sem3Data);

            // Generate report
            const report = this.generateMultiBranchReport(integrationResult);

            // Save results
            this.saveResults(integrationResult.unifiedContent, report);

            // Display summary
            this.displayMultiBranchSummary(report);

            console.log('\n🎉 Multi-branch integration completed successfully!');
            console.log('\n📋 Key Files Updated:');
            console.log(`   📄 Unified Content: ${this.unifiedFile}`);
            console.log(`   📄 Content Manifest: ${path.join(__dirname, '../public/Content-Meta/content-manifest.json')}`);
            console.log(`   📄 Integration Report: ${path.join(__dirname, 'multi-branch-integration-report.json')}`);

            return true;

        } catch (error) {
            console.error('💥 Fatal error:', error.message);
            console.error(error.stack);
            return false;
        }
    }
}

// Run the multi-branch integrator
if (require.main === module) {
    const integrator = new MultiBranchSem3Integrator();
    integrator.run().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = MultiBranchSem3Integrator;
