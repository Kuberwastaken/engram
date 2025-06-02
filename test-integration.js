// Test script to verify DotNotes and unified data service integration
console.log('Testing DotNotes and Unified Data Service integration...');

// Test the services directly
Promise.all([
  import('./src/services/dotNotesDataService.js'),
  import('./src/services/unifiedDataService.js')
]).then(async ([dotNotesModule, unifiedModule]) => {
  const { dotNotesDataService } = dotNotesModule;
  const { unifiedDataService } = unifiedModule;
  
  try {
    console.log('\n=== DotNotes Service Test ===');
    
    console.log('1. Testing DotNotes data loading...');
    const dotNotesBranches = await dotNotesDataService.getAvailableBranches();
    console.log(`✅ DotNotes branches: ${dotNotesBranches.join(', ')}`);
    
    if (dotNotesBranches.length > 0) {
      const firstBranch = dotNotesBranches[0];
      console.log(`2. Testing semesters for ${firstBranch}...`);
      const semesters = await dotNotesDataService.getAvailableSemesters(firstBranch);
      console.log(`✅ ${firstBranch} semesters: ${semesters.join(', ')}`);
      
      if (semesters.length > 0) {
        const firstSemester = semesters[0];
        console.log(`3. Testing subjects for ${firstBranch} ${firstSemester}...`);
        const subjects = await dotNotesDataService.getAvailableSubjects(firstBranch, firstSemester);
        console.log(`✅ ${firstBranch} ${firstSemester} subjects: ${subjects.length} found`);
        if (subjects.length > 0) {
          console.log(`   First few: ${subjects.slice(0, 3).join(', ')}`);
          
          console.log(`4. Testing materials for first subject...`);
          const materials = await dotNotesDataService.getOrganizedMaterials(firstBranch, firstSemester, subjects[0]);
          console.log(`✅ DotNotes materials for "${subjects[0]}":`);
          Object.keys(materials).forEach(type => {
            if (materials[type].length > 0) {
              console.log(`   ${type}: ${materials[type].length} files`);
            }
          });
        }
      }
    }
    
    console.log('\n=== Unified Service Test ===');
    
    console.log('1. Testing unified branches...');
    const unifiedBranches = await unifiedDataService.getAvailableBranches();
    console.log(`✅ Unified branches: ${unifiedBranches.join(', ')}`);
    
    console.log('2. Testing unified CSE SEM1 subjects...');
    const unifiedSubjects = await unifiedDataService.getAvailableSubjects('CSE', 'SEM1');
    console.log(`✅ Unified CSE SEM1 subjects: ${unifiedSubjects.length} found`);
    if (unifiedSubjects.length > 0) {
      console.log(`   First few: ${unifiedSubjects.slice(0, 3).join(', ')}`);
      
      console.log('3. Testing unified materials for first subject...');
      const unifiedMaterials = await unifiedDataService.getOrganizedMaterials('CSE', 'SEM1', unifiedSubjects[0]);
      console.log(`✅ Unified materials for "${unifiedSubjects[0]}":`);
      Object.keys(unifiedMaterials).forEach(type => {
        if (unifiedMaterials[type].length > 0) {
          console.log(`   ${type}: ${unifiedMaterials[type].length} files`);
        }
      });
    }
    
    console.log('\n🎉 Integration test completed successfully!');
    console.log('\n=== Summary ===');
    console.log(`DotNotes branches: ${dotNotesBranches.length}`);
    console.log(`Unified branches: ${unifiedBranches.length}`);
    console.log(`Unified CSE SEM1 subjects: ${unifiedSubjects.length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}).catch(error => {
  console.error('❌ Failed to load modules:', error);
});
