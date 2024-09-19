const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const http = require('http');
const { fibonacci } = require('./fibonacci');

if (isMainThread) {
  http.createServer((req, res) => {
    const worker = new Worker(__filename, { workerData: 47 });

    worker.on('message', (result) => {
      res.writeHead(200);
      res.write(`worker: ${worker.threadId}\n fibonacci: ${result}`);
      res.end();
    });

  }).listen(8000, () => {
    console.log('Server listening on port 8000');
  });
} else {
  const result = fibonacci(workerData);
  parentPort.postMessage(result);
}
