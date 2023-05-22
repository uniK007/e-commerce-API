const express = require('express');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv').config();
const cors = require('cors');
const connectDb = require('./config/dbConnection');

connectDb();
const app = express();
app.use(cors())
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/category', require('./routes/categoryRoute'));
app.use('/api/products', require('./routes/productRoute'));
app.use('/api/product-details', require('./routes/productDetailRoute'));
app.use('/api/users', require('./routes/userRoute'));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});