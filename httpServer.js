import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", price: 550, category: "Programming" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 400, category: "Self-Help" }
];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome message in HTML format</h1>');
  } 
  else if (url === '/books' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
  } 
  else if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ app: "Library Book Management", info: "Node.js HTTP module practical" }));
  } 
  else if (url === '/home' && method === 'GET') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  else if (url === '/add-book' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const newBook = JSON.parse(body);
        if (!newBook.id || !newBook.title || !newBook.author || !newBook.price) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: "Required fields missing: id, title, author, price" }));
          return;
        }
        books.push(newBook);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Book added successfully", book: newBook }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    });
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log('HTTP Server running at http://localhost:3000');
});