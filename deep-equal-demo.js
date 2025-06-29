// Deep comparison demonstration

console.log('=== Deep Equal Demo ===\n');

// 1. Simple array comparison
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = [1, 2, 4];

console.log('Array comparison:');
console.log('arr1:', arr1);
console.log('arr2:', arr2);
console.log('arr3:', arr3);

console.log('arr1 === arr2:', arr1 === arr2); // false (shallow comparison)
console.log('Deep equal (arr1, arr2):', JSON.stringify(arr1) === JSON.stringify(arr2)); // true

// 2. Nested object comparison
const obj1 = {
  name: 'Product A',
  price: 29.99,
  details: {
    color: 'red',
    size: 'M'
  }
};

const obj2 = {
  name: 'Product A',
  price: 29.99,
  details: {
    color: 'red',
    size: 'M'
  }
};

console.log('\nObject comparison:');
console.log('obj1 === obj2:', obj1 === obj2); // false (shallow comparison)
console.log('Deep equal (obj1, obj2):', JSON.stringify(obj1) === JSON.stringify(obj2)); // true

// 3. Price sorting comparison (simulating your test case)
const correctSortedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];
const wrongSortedPrices = [7.99, 9.99, 15.99, 29.99, 49.99, 15.99]; // Wrong position for last item

console.log('\nPrice sorting comparison:');
console.log('Correct sorted:', correctSortedPrices);
console.log('Wrong sorted:', wrongSortedPrices);
console.log('Deep equal:', JSON.stringify(correctSortedPrices) === JSON.stringify(wrongSortedPrices)); // false

// 4. Deep comparison algorithm simulation
function deepEqual(a, b) {
  // Type check
  if (typeof a !== typeof b) return false;
  
  // null check
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;
  
  // Primitive types direct comparison
  if (typeof a !== 'object') return a === b;
  
  // Array comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  // Object comparison
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

console.log('\nCustom deepEqual function test:');
console.log('deepEqual(arr1, arr2):', deepEqual(arr1, arr2)); // true
console.log('deepEqual(arr1, arr3):', deepEqual(arr1, arr3)); // false
console.log('deepEqual(obj1, obj2):', deepEqual(obj1, obj2)); // true
console.log('deepEqual(correctSortedPrices, wrongSortedPrices):', deepEqual(correctSortedPrices, wrongSortedPrices)); // false 