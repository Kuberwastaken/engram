// Quick test script to verify StudyX data loading
console.log('Testing StudyX data loading...');

// Test the data service directly
import('./src/services/studyXDataService.js').then(async (module) => {
  const { studyXDataService } = module;
  
  try {
    console.log('1. Loading metadata...');
    const metadata = await studyXDataService.getMetadata();
    console.log(`✅ Metadata loaded: ${metadata.totalSubjects} subjects, ${metadata.totalMaterials} materials`);
    
    console.log('2. Getting available branches...');
    const branches = await studyXDataService.getAvailableBranches();
    console.log(`✅ Available branches: ${branches.join(', ')}`);
    
    console.log('3. Getting CSE semesters...');
    const cseSemesters = await studyXDataService.getAvailableSemesters('CSE');
    console.log(`✅ CSE semesters: ${cseSemesters.join(', ')}`);
    
    console.log('4. Getting SEM1 subjects...');
    const sem1Subjects = await studyXDataService.getAvailableSubjects('CSE', 'SEM1');
    console.log(`✅ SEM1 subjects: ${sem1Subjects.length} found`);
    if (sem1Subjects.length > 0) {
      console.log(`   First few: ${sem1Subjects.slice(0, 3).join(', ')}`);
      
      console.log('5. Testing materials for first subject...');
      const materials = await studyXDataService.getOrganizedMaterials('CSE', 'SEM1', sem1Subjects[0]);
      console.log(`✅ Materials for "${sem1Subjects[0]}":`);
      Object.keys(materials).forEach(type => {
        if (materials[type].length > 0) {
          console.log(`   ${type}: ${materials[type].length} files`);
        }
      });
    }
    
    console.log('\n🎉 StudyX integration test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}).catch(error => {
  console.error('❌ Failed to load module:', error);
});
