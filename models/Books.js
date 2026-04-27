import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publish_date: {
        type: String,
        required: true
    },
});

const Books = mongoose.model('Books', bookSchema);

export default Books;