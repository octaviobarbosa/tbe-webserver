const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const mimeTypes = {
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
  woff: 'font/woof',
  ico: 'image/x-icon',
}

const server = http.createServer((req, res) => {  
  const uri = url.parse(req.url).pathname;
  let fileName = path.join(process.cwd(), decodeURI(uri));

  let loadedFile;

  try {
    loadedFile = fs.lstatSync(fileName);
  } catch (error) {
    fileName = path.join(process.cwd(), '404.html')
    loadedFile = fs.lstatSync(fileName);
    res.writeHead(302, {'Location': '/404.html'});
    res.end();
  }

  if(loadedFile && loadedFile.isFile()) {
    const mimeType = mimeTypes[path.extname(fileName).substring(1)];
    const responseCode = fileName.includes('404.html') ? 404 : 200;
    res.writeHead(responseCode, {'Content-Type': mimeType});
    const fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);    
  } else if(loadedFile && loadedFile.isDirectory()) {
    res.writeHead(302, {'Location': '/index.html'});
    res.end();
  } else {
    res.writeHead(500, {'Content-Type': 'text/plain'});
    res.write('500 Internal Server Error');
    res.end();
  }
});


server.listen(port, hostname, () => {
  console.log(`🚀 Server is up on http://${hostname}:${port}`)
})