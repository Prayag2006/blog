import express from 'express'
import { ensureAuth } from '../middlewares/authMiddleware.js';
import { addBook, addBookForm, bookManagement, editBook, editBookForm, getAllBooks, deleteBook } from '../controllers/booksController.js';

const router = express.Router();

router.get('/', getAllBooks);
router.get('/manage-books', ensureAuth, bookManagement);

router.get('/add', ensureAuth, addBookForm);
router.post('/add', ensureAuth, addBook);

router.get('/edit/:id', ensureAuth, editBookForm);
router.post('/edit/:id', ensureAuth, editBook);

router.post('/delete/:id', ensureAuth, deleteBook);

export default router;