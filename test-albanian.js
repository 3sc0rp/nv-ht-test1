// Albanian Language Integration Test Script
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🇦🇱 Testing Albanian Language Integration...\n');

// Test 1: Verify Albanian is in language configuration
console.log('1. Testing language configuration...');
const i18nContent = fs.readFileSync('./lib/i18n.js', 'utf8');
if (i18nContent.includes("sq: { name: 'Shqip'") && i18nContent.includes("flag: '🇦🇱'")) {
  console.log('   ✅ Albanian language properly configured');
} else {
  console.log('   ❌ Albanian language not found in configuration');
}

// Test 2: Check menu items have Albanian translations
console.log('\n2. Testing menu Albanian translations...');
const menuContent = fs.readFileSync('./pages/menu.js', 'utf8');
const albanianMatches = (menuContent.match(/sq:/g) || []).length;
const nameBlocks = (menuContent.match(/name: {/g) || []).length;
const needed = nameBlocks * 2; // names + descriptions

console.log(`   - Menu items found: ${nameBlocks}`);
console.log(`   - Albanian translations found: ${albanianMatches}`);
console.log(`   - Required translations: ${needed}`);

if (albanianMatches === needed) {
  console.log('   ✅ All menu items have Albanian translations');
} else {
  console.log(`   ❌ Missing ${needed - albanianMatches} Albanian translations`);
}

// Test 3: Check for authentic Albanian terms
console.log('\n3. Testing Albanian culinary terms...');
const albanianTerms = [
  'Pica', 'Kabab', 'Sallatë', 'Çaj', 'Kafe', 
  'Akullore', 'Patate të Skuqura', 'Ujë', 'Supë'
];

let foundTerms = 0;
albanianTerms.forEach(term => {
  if (menuContent.includes(term)) {
    foundTerms++;
  }
});

console.log(`   - Found ${foundTerms}/${albanianTerms.length} Albanian culinary terms`);
if (foundTerms >= albanianTerms.length * 0.8) {
  console.log('   ✅ Authentic Albanian culinary terms detected');
} else {
  console.log('   ❌ Missing key Albanian culinary terms');
}

// Test 4: Check other components have Albanian
console.log('\n4. Testing other components...');
const components = ['./components/Header.js', './components/Footer.js', './components/NatureVillageWebsite.js'];
let componentsPassed = 0;

components.forEach(component => {
  if (fs.existsSync(component)) {
    const content = fs.readFileSync(component, 'utf8');
    if (content.includes('sq:')) {
      console.log(`   ✅ ${component.split('/').pop()} has Albanian translations`);
      componentsPassed++;
    } else {
      console.log(`   ❌ ${component.split('/').pop()} missing Albanian translations`);
    }
  }
});

// Test 5: Check page files
console.log('\n5. Testing page components...');
const pages = ['./pages/reservations.js', './pages/catering.js', './pages/gallery.js'];
let pagesPassed = 0;

pages.forEach(page => {
  if (fs.existsSync(page)) {
    const content = fs.readFileSync(page, 'utf8');
    if (content.includes('sq:')) {
      console.log(`   ✅ ${page.split('/').pop()} has Albanian translations`);
      pagesPassed++;
    } else {
      console.log(`   ❌ ${page.split('/').pop()} missing Albanian translations`);
    }
  }
});

// Summary
console.log('\n🎯 SUMMARY:');
console.log('='.repeat(50));
console.log(`✅ Language Configuration: ${i18nContent.includes("sq: { name: 'Shqip'") ? 'PASS' : 'FAIL'}`);
console.log(`✅ Menu Translations: ${albanianMatches === needed ? 'COMPLETE' : 'INCOMPLETE'} (${albanianMatches}/${needed})`);
console.log(`✅ Culinary Terms: ${foundTerms >= albanianTerms.length * 0.8 ? 'GOOD' : 'NEEDS WORK'} (${foundTerms}/${albanianTerms.length})`);
console.log(`✅ Components: ${componentsPassed}/${components.length} have Albanian`);
console.log(`✅ Pages: ${pagesPassed}/${pages.length} have Albanian`);

const overallScore = (
  (i18nContent.includes("sq: { name: 'Shqip'") ? 1 : 0) +
  (albanianMatches === needed ? 1 : 0) +
  (foundTerms >= albanianTerms.length * 0.8 ? 1 : 0) +
  (componentsPassed === components.length ? 1 : 0) +
  (pagesPassed === pages.length ? 1 : 0)
) / 5 * 100;

console.log(`\n🏆 Overall Albanian Integration: ${overallScore.toFixed(1)}%`);

if (overallScore >= 90) {
  console.log('🎉 EXCELLENT! Albanian integration is ready for production!');
} else if (overallScore >= 75) {
  console.log('👍 GOOD! Albanian integration is mostly complete');
} else {
  console.log('⚠️  NEEDS WORK: Albanian integration requires more work');
}
