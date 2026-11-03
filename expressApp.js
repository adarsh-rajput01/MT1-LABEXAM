import express from 'express';

const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", price: 550, category: "Programming" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 400, category: "Self-Help" }
];

// GET all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET book by ID
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// POST add a new book
app.post('/books', (req, res) => {
  const { id, title, author, price, category } = req.body;
  if (!id || !title || !author || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newBook = { id, title, author, price, category: category || "General" };
  books.push(newBook);
  res.status(201).json({ message: "Book added successfully", book: newBook });
});

// PUT update book details
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const { title, author, price, category } = req.body;
  books[index] = {
    id: bookId,
    title: title || books[index].title,
    author: author || books[index].author,
    price: price || books[index].price,
    category: category || books[index].category
  };
  res.json({ message: "Book updated successfully", book: books[index] });
});

// DELETE book
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted successfully", book: deleted[0] });
});

app.listen(4000, () => {
  console.log('Express Server running at http://localhost:4000');
});