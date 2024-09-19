const cluster = require('cluster');
const http = require('http');
const { fibonacci } = require('./fibonacci');
const { performance } = require('perf_hooks');

const TOTAL_REQUESTS = 5; // Número total de requisições que você espera processar
let requestCount = 0;
let startTime = null;

if (cluster.isMaster) {
  const cpus = 5;
  console.log(`Clustering to ${cpus} CPUs`);

  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }

  cluster.on('message', (worker, msg) => {
    if (msg.type === 'request') {
      if (!startTime) {
        startTime = performance.now(); // Marca o tempo da primeira requisição
      }

      requestCount += 1;

      if (requestCount === TOTAL_REQUESTS) {
        const endTime = performance.now();
        const totalExecutionTime = (endTime - startTime).toFixed(2);
        console.log(`Processed ${TOTAL_REQUESTS} requests in ${totalExecutionTime} ms`);
      }
    }
  });
} else {
  http.createServer((req, res) => {
    const result = fibonacci(47);
    process.send({ type: 'request' }); // Notifica o master sobre a requisição processada
    res.writeHead(200);
    res.write(`worker: ${process.pid}\n fibonacci: ${result}`);
    res.end();
  }).listen(8000);
}
