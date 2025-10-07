/**
 * Test suite for YouTube URL converter
 * Run with: npm test (after setting up a test runner)
 */

import { convertYouTubeUrl, isYouTubeUrl, normalizeUrl } from './youtube-converter';

// Test data
const testCases = [
  // Standard youtube.com/watch?v= format
  {
    input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ',
    description: 'Standard youtube.com/watch?v= URL',
  },
  // youtu.be short links
  {
    input: 'https://youtu.be/dQw4w9WgXcQ',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ',
    description: 'youtu.be short link',
  },
  // Mobile links
  {
    input: 'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ',
    description: 'Mobile YouTube URL',
  },
  // Embed links
  {
    input: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ',
    description: 'Embedded YouTube URL',
  },
  // Shorts
  {
    input: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ',
    description: 'YouTube Shorts URL',
  },
  // Live videos
  {
    input: 'https://www.youtube.com/live/dQw4w9WgXcQ',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ',
    description: 'YouTube Live URL',
  },
  // With timestamp
  {
    input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ&t=42s',
    description: 'URL with timestamp',
  },
  // With playlist
  {
    input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ&list=PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf',
    description: 'URL with playlist',
  },
  // youtu.be with timestamp
  {
    input: 'https://youtu.be/dQw4w9WgXcQ?t=42',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ&t=42',
    description: 'youtu.be with timestamp',
  },
  // Music YouTube
  {
    input: 'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
    expected: 'https://yout-ube.com/watch?v=dQw4w9WgXcQ',
    description: 'YouTube Music URL',
  },
];

// Manual testing function (can be called from browser console)
export function runTests(): void {
  console.log('🧪 Running YouTube Converter Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    const result = convertYouTubeUrl(testCase.input);
    
    if (result.success && result.convertedUrl === testCase.expected) {
      console.log(`✅ Test ${index + 1}: ${testCase.description}`);
      console.log(`   Input:    ${testCase.input}`);
      console.log(`   Output:   ${result.convertedUrl}`);
      console.log(`   Expected: ${testCase.expected}\n`);
      passed++;
    } else {
      console.error(`❌ Test ${index + 1}: ${testCase.description}`);
      console.error(`   Input:    ${testCase.input}`);
      console.error(`   Output:   ${result.convertedUrl || 'ERROR: ' + result.error}`);
      console.error(`   Expected: ${testCase.expected}\n`);
      failed++;
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  
  // Test invalid URLs
  console.log('\n🧪 Testing Invalid URLs...\n');
  
  const invalidUrls = [
    '',
    'not a url',
    'https://google.com',
    'https://vimeo.com/123456',
  ];
  
  let invalidPassed = 0;
  invalidUrls.forEach((url, index) => {
    const result = convertYouTubeUrl(url);
    if (!result.success) {
      console.log(`✅ Invalid URL Test ${index + 1}: Correctly rejected "${url}"`);
      invalidPassed++;
    } else {
      console.error(`❌ Invalid URL Test ${index + 1}: Should have rejected "${url}"`);
    }
  });
  
  console.log(`\n📊 Invalid URL Tests: ${invalidPassed} passed out of ${invalidUrls.length} tests`);
  
  // Test URL validation
  console.log('\n🧪 Testing URL Validation...\n');
  
  const validationTests = [
    { url: 'https://www.youtube.com/watch?v=test', expected: true },
    { url: 'https://youtu.be/test', expected: true },
    { url: 'https://google.com', expected: false },
    { url: 'not a url', expected: false },
  ];
  
  let validationPassed = 0;
  validationTests.forEach((test, index) => {
    const result = isYouTubeUrl(test.url);
    if (result === test.expected) {
      console.log(`✅ Validation Test ${index + 1}: "${test.url}" -> ${result}`);
      validationPassed++;
    } else {
      console.error(`❌ Validation Test ${index + 1}: "${test.url}" -> ${result} (expected ${test.expected})`);
    }
  });
  
  console.log(`\n📊 Validation Tests: ${validationPassed} passed out of ${validationTests.length} tests`);
  
  // Test URL normalization
  console.log('\n🧪 Testing URL Normalization...\n');
  
  const normalizationTests = [
    { input: 'youtube.com/watch?v=test', expected: 'https://youtube.com/watch?v=test' },
    { input: 'www.youtube.com/watch?v=test', expected: 'https://www.youtube.com/watch?v=test' },
    { input: 'youtu.be/test', expected: 'https://youtu.be/test' },
    { input: 'https://youtube.com/watch?v=test', expected: 'https://youtube.com/watch?v=test' },
  ];
  
  let normalizationPassed = 0;
  normalizationTests.forEach((test, index) => {
    const result = normalizeUrl(test.input);
    if (result === test.expected) {
      console.log(`✅ Normalization Test ${index + 1}: "${test.input}" -> "${result}"`);
      normalizationPassed++;
    } else {
      console.error(`❌ Normalization Test ${index + 1}: "${test.input}" -> "${result}" (expected "${test.expected}")`);
    }
  });
  
  console.log(`\n📊 Normalization Tests: ${normalizationPassed} passed out of ${normalizationTests.length} tests`);
  
  const totalTests = testCases.length + invalidUrls.length + validationTests.length + normalizationTests.length;
  const totalPassed = passed + invalidPassed + validationPassed + normalizationPassed;
  
  console.log(`\n🎉 Overall Results: ${totalPassed}/${totalTests} tests passed`);
  
  if (totalPassed === totalTests) {
    console.log('✨ All tests passed! ✨');
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).runYouTubeConverterTests = runTests;
}

