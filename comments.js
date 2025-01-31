// Create web server
// Run in the terminal: node comments.js
// Load http://localhost:3000 in your web browser

const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

http.createServer((request, response) => {
  const {pathname, query} = url.parse(request.url, true);

  if (pathname === '/') {
    fs.readFile('comments.html', 'utf-8', (err, data) => {
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 Not Found');
      } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(data);
      }
    });
  } else if (pathname === '/comment') {
    let postData = '';
    request.on('data', (chunk) => {
      postData += chunk;
    });

    request.on('end', () => {
      let comment = querystring.parse(postData);
      fs.readFile('comments.json', 'utf-8', (err, data) => {
        const comments = JSON.parse(data);
        comments.push(comment);
        fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (err) => {
          if (err) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.end('500 Internal Server Error');
          } else {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('Comment added');
          }
        });
      });
    });
  } else if (pathname === '/comments') {
    fs.readFile('comments.json', 'utf-8', (err, data) => {
      if (err) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 Not Found');
      } else {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(data);
      }
    });
  } else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404 Not Found');
  }
}).listen(3000);

console.log('Server running at http://localhost:3000/');