const workerpool = require('workerpool');
const { fibonacci } = require('./fibonacci.js');

// Difinindo a função que será exposta ao pool de workers
function calculateFibonacci(n) {
  console.log(`Calculating fibonacci for ${n}`);
  return fibonacci(n);
}

// Expondo a função para o workerpool
workerpool.worker({
  calculateFibonacci
});
