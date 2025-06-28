// 深度比较演示
console.log('=== 深度比较演示 ===\n');

// 1. 简单数组比较
console.log('1. 简单数组比较:');
const arr1 = [1, 2, 3];
const arr2 = [1, 2, 3];
const arr3 = [1, 2, 4];

console.log('arr1:', arr1);
console.log('arr2:', arr2);
console.log('arr3:', arr3);

console.log('arr1 === arr2:', arr1 === arr2); // false (浅比较)
console.log('arr1 deep.equal arr2:', JSON.stringify(arr1) === JSON.stringify(arr2)); // true
console.log('arr1 deep.equal arr3:', JSON.stringify(arr1) === JSON.stringify(arr3)); // false

// 2. 嵌套对象比较
console.log('\n2. 嵌套对象比较:');
const obj1 = { user: { name: 'John', age: 30 }, scores: [85, 90, 78] };
const obj2 = { user: { name: 'John', age: 30 }, scores: [85, 90, 78] };
const obj3 = { user: { name: 'John', age: 31 }, scores: [85, 90, 78] };

console.log('obj1:', JSON.stringify(obj1, null, 2));
console.log('obj2:', JSON.stringify(obj2, null, 2));
console.log('obj3:', JSON.stringify(obj3, null, 2));

console.log('obj1 === obj2:', obj1 === obj2); // false
console.log('obj1 deep.equal obj2:', JSON.stringify(obj1) === JSON.stringify(obj2)); // true
console.log('obj1 deep.equal obj3:', JSON.stringify(obj1) === JSON.stringify(obj3)); // false

// 3. 价格排序比较（模拟你的测试用例）
console.log('\n3. 价格排序比较:');
const originalPrices = [29.99, 9.99, 15.99, 49.99, 7.99, 15.99];
const sortedPrices = [7.99, 9.99, 15.99, 15.99, 29.99, 49.99];
const wrongSortedPrices = [7.99, 9.99, 15.99, 29.99, 49.99, 15.99]; // 最后一个位置错误

console.log('原始价格:', originalPrices);
console.log('正确排序:', sortedPrices);
console.log('错误排序:', wrongSortedPrices);

console.log('原始价格 === 正确排序:', JSON.stringify(originalPrices) === JSON.stringify(sortedPrices)); // false
console.log('正确排序 === 正确排序:', JSON.stringify(sortedPrices) === JSON.stringify(sortedPrices)); // true
console.log('正确排序 === 错误排序:', JSON.stringify(sortedPrices) === JSON.stringify(wrongSortedPrices)); // false

// 4. 深度比较算法模拟
console.log('\n4. 深度比较算法模拟:');
function deepEqual(a, b) {
    // 类型检查
    if (typeof a !== typeof b) return false;
    
    // null 检查
    if (a === null && b === null) return true;
    if (a === null || b === null) return false;
    
    // 基本类型直接比较
    if (typeof a !== 'object') return a === b;
    
    // 数组比较
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }
    
    // 对象比较
    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        
        if (keysA.length !== keysB.length) return false;
        
        for (let key of keysA) {
            if (!keysB.includes(key)) return false;
            if (!deepEqual(a[key], b[key])) return false;
        }
        return true;
    }
    
    return false;
}

console.log('deepEqual([1,2,3], [1,2,3]):', deepEqual([1,2,3], [1,2,3])); // true
console.log('deepEqual([1,2,3], [1,2,4]):', deepEqual([1,2,3], [1,2,4])); // false
console.log('deepEqual(sortedPrices, sortedPrices):', deepEqual(sortedPrices, sortedPrices)); // true
console.log('deepEqual(sortedPrices, wrongSortedPrices):', deepEqual(sortedPrices, wrongSortedPrices)); // false 