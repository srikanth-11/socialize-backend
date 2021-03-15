require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.REQUEST_ORIGIN
}))

app.use('/user', userRoute);
app.use('/post', postRoute);

const connectionUrl = process.env.MONGO_URL;
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Successfully connected to mongodb")).catch(err => console.log("mongo error", err));
app.listen(port, () => console.log(`listening on port : ${port}`));