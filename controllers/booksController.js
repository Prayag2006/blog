import Books from "../models/Books.js";

export const addBook = async (req, res) => {
    try {
        const { title, description, image, price, publish_date, author } = req.body;
        await Books.create({
            title,
            description,
            image,
            price,
            publish_date,
            author,
        });
        res.redirect('/manage-books');
    }
    catch (error) {
        console.log("Faild to add book.!!");
        res.status(500).send("Failed to add book.");
    }
}

export const addBookForm = async (req, res) => {
    try {
        res.render('addBook');
    }
    catch (error) {
        console.log("Faild to fetch book form")
        res.status(500).send("Failed to fetch book form.");
    }
}

export const getAllBooks = async (req, res) => {
    try {
        const books = await Books.find();
        res.render('books', { books });
    }
    catch (error) {
        console.log("Faild to fetch books.!!");
        res.status(500).send("Failed to fetch books.");
    }
}

export const bookManagement = async (req, res) => {
    try {
        const userId = req.cookies.userid;
        if (!userId) {
            return res.redirect('/login');
        }
        const books = await Books.find();
        res.render('bookManagement', { books });
    }
    catch (error) {
        console.log("Faild to fetch books.!!");
        res.status(500).send("Failed to fetch books.");
    }
}

export const editBookForm = async (req, res) => {
    try {
        const book = await Books.findById(req.params.id);
        res.render('editBook', { book });
    }
    catch (error) {
        console.log("Faild to fetch book.!!");
        res.status(500).send("Failed to fetch book.");
    }
}

export const editBook = async (req, res) => {
    try {
        const { title, description, image, price, publish_date, author } = req.body;

        if (!title || !description || !image || !price || !publish_date || !author) {
            return res.status(400).send('All fields are required');
        }

        const updatedBook = {
            title,
            description,
            image,
            price,
            publish_date,
            author
        };

        await Books.findByIdAndUpdate(req.params.id, updatedBook);
        res.redirect('/manage-books');
    }
    catch (error) {
        console.error("Failed to update book: ", error);
        res.status(500).send("Failed to update book.");
    }
}

export const deleteBook = async (req, res) => {
    try {
        await Books.findByIdAndDelete(req.params.id);
        res.redirect('/manage-books');
    } catch (error) {
        console.error('Failed to delete book:', error);
        res.status(500).send('Failed to delete book');
    }
};