const http = require('http');
const workerpool = require('workerpool');
const path = require('path');
const MAX_WORKERS = 4
// Crie um pool de workers com o script do worker
const pool = workerpool.pool(path.join(__dirname, 'worker.js'), {
  maxWorkers: MAX_WORKERS
});

const PORT = 8000;
let activeWorkers = 0;

// Função para exibir o número de workers em uso
function logActiveWorkers() {
  console.log(`Active workers: ${activeWorkers}`);
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const n = parseInt(url.searchParams.get('n'), 10);

  if(url.pathname === '/fibonacci') {
    try {
      activeWorkers++;
      logActiveWorkers();
      const result = await pool.exec('calculateFibonacci', [n]);
      console.log("🚀 ~ http.createServer ~ result:", result)
      activeWorkers--;
      logActiveWorkers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ result }));
    } catch (error) {
      activeWorkers--;
      logActiveWorkers();
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Error: ${error.message}`);
    }
  }
}).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
