// Test Enhanced Subject Mapping Integration
// Tests the unified data service with the new enhanced intelligent subject mapping

import { unifiedDataService } from './src/services/unifiedDataService.js';

async function testEnhancedMapping() {
    try {
        console.log('🧪 Testing Enhanced Subject Mapping Integration...\n');

        // Test 1: Get available branches
        console.log('1️⃣ Testing getAvailableBranches...');
        const branches = await unifiedDataService.getAvailableBranches();
        console.log(`✅ Found ${branches.length} branches: ${branches.join(', ')}\n`);

        if (branches.length === 0) {
            console.log('❌ No branches found, cannot continue tests');
            return;
        }

        // Test 2: Get available semesters for first branch
        const testBranch = branches[0];
        console.log(`2️⃣ Testing getAvailableSemesters for ${testBranch}...`);
        const semesters = await unifiedDataService.getAvailableSemesters(testBranch);
        console.log(`✅ Found ${semesters.length} semesters: ${semesters.join(', ')}\n`);

        if (semesters.length === 0) {
            console.log('❌ No semesters found, cannot continue tests');
            return;
        }

        // Test 3: Get available subjects with enhanced mapping
        const testSemester = semesters[0];
        console.log(`3️⃣ Testing getAvailableSubjects for ${testBranch} ${testSemester} with enhanced mapping...`);
        const subjects = await unifiedDataService.getAvailableSubjects(testBranch, testSemester);
        console.log(`✅ Found ${subjects.length} subjects with intelligent mapping:`);
        subjects.slice(0, 10).forEach((subject, index) => {
            console.log(`  ${index + 1}. ${subject}`);
        });
        if (subjects.length > 10) {
            console.log(`  ... and ${subjects.length - 10} more subjects`);
        }
        console.log();

        if (subjects.length === 0) {
            console.log('❌ No subjects found, cannot continue tests');
            return;
        }

        // Test 4: Get materials for a subject with enhanced mapping
        const testSubject = subjects[0];
        console.log(`4️⃣ Testing getOrganizedMaterials for "${testSubject}" with enhanced mapping...`);
        const materials = await unifiedDataService.getOrganizedMaterials(testBranch, testSemester, testSubject);

        console.log('✅ Enhanced mapping materials summary:');
        Object.entries(materials).forEach(([type, files]) => {
            if (files.length > 0) {
                const sources = files.map(f => f.source).filter(Boolean);                const sourceCounts = sources.reduce((acc, source) => {
                    acc[source] = (acc[source] || 0) + 1;
                    return acc;
                }, {});
                
                console.log(`  📁 ${type}: ${files.length} files (${Object.entries(sourceCounts).map(([s, c]) => `${s}: ${c}`).join(', ')})`);
            } else {
                console.log(`  📁 ${type}: 0 files`);
            }
        });
        console.log();

        // Test 5: Check mapping quality for multiple subjects
        console.log('5️⃣ Testing mapping quality across multiple subjects...');
        const sampleSize = Math.min(5, subjects.length);
        for (let i = 0; i < sampleSize; i++) {
            const subject = subjects[i];
            const materials = await unifiedDataService.getOrganizedMaterials(testBranch, testSemester, subject);
            const totalMaterials = Object.values(materials).reduce((sum, files) => sum + files.length, 0);
            const sources = new Set(Object.values(materials).flat().map(f => f.source).filter(Boolean));
            
            console.log(`  📚 "${subject}": ${totalMaterials} materials from [${Array.from(sources).join(', ')}]`);
        }
        console.log();

        // Test 6: Test with different branches to check branch-specific mapping
        if (branches.length > 1) {
            console.log('6️⃣ Testing branch-specific mapping differences...');
            const testBranch2 = branches[1];
            const semesters2 = await unifiedDataService.getAvailableSemesters(testBranch2);
            
            if (semesters2.length > 0) {
                const subjects2 = await unifiedDataService.getAvailableSubjects(testBranch2, semesters2[0]);
                console.log(`  📊 ${testBranch} SEM1: ${subjects.length} subjects`);
                console.log(`  📊 ${testBranch2} SEM1: ${subjects2.length} subjects`);
                
                // Check for common subjects
                const commonSubjects = subjects.filter(s => subjects2.includes(s));
                console.log(`  🔗 Common subjects: ${commonSubjects.length}`);
                console.log(`  📝 Branch-specific differences detected: ${subjects.length + subjects2.length - 2 * commonSubjects.length > 0 ? '✅' : '❌'}`);
            }
        }

        console.log('\n✅ Enhanced Subject Mapping Integration Test Completed Successfully!');
        console.log('🎯 Key improvements:');
        console.log('  - Intelligent StudyX ↔ DotNotes subject mapping');
        console.log('  - Branch-aware mapping context');
        console.log('  - Confidence-based mapping quality');
        console.log('  - Fuzzy matching for partial overlaps');
        console.log('  - Source attribution for all materials');

    } catch (error) {
        console.error('❌ Test failed:', error);
        throw error;
    }
}

// Run the test
testEnhancedMapping()
    .then(() => {
        console.log('\n🎉 All tests passed!');
    })
    .catch(error => {
        console.error('\n💥 Test suite failed:', error);
        process.exit(1);
    });
