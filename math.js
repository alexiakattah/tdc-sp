const fs = require('fs');

function blockMainThread(ms) {
  const start = Date.now();

  while (Date.now() - start < ms) {
    // block the main thread
  }
  console.log(`Main thread blocked for ${ms}ms`);
}

console.log("Start program");

fs.readFile('./example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log("File read complete");
  console.log(data);
});

console.log("Started reading the file");

blockMainThread(5000);

console.log("End program");