function generateFibonacci(n) {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Input must be a non-negative integer');
  }
  
  if (n === 0) return [];
  if (n === 1) return [0];
  
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  
  return fib;
}

function isPrime(num) {
  if (!Number.isInteger(num)) return false;
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  
  return true;
}

function filterPrimes(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  
  return numbers.filter(num => {
    if (!Number.isInteger(num)) {
      throw new Error('All elements must be integers');
    }
    return isPrime(num);
  });
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  
  return a;
}

function calculateHCF(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array');
  }
  
  // Validate all elements are integers
  if (!numbers.every(num => Number.isInteger(num))) {
    throw new Error('All elements must be integers');
  }
  
  if (numbers.length === 1) return Math.abs(numbers[0]);
  
  return numbers.reduce((acc, num) => gcd(acc, num));
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function calculateLCM(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    throw new Error('Input must be a non-empty array');
  }
  
  // Validate all elements are integers
  if (!numbers.every(num => Number.isInteger(num))) {
    throw new Error('All elements must be integers');
  }
  
  if (numbers.length === 1) return Math.abs(numbers[0]);
  
  return numbers.reduce((acc, num) => lcm(acc, num));
}

module.exports = {
  generateFibonacci,
  filterPrimes,
  calculateHCF,
  calculateLCM
};
