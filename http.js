const http = require('http');
const { fibonacci } = require('./fibonacci');

http.createServer(async (req, res) => {
  const result = await fibonacci(46);

  res.writeHead(200);
  res.write(`fibonacci: ${result}`);
  res.end();
}).listen(8000, () => {
  console.log('Server listening on port 8000');
});


