const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const port = 3000;
const mongoose = require('./connection');
const userRouter = require('./src/routes/userRouter');
app.use(bodyParser.json());
app.get('/', (req, res) => res.send('Hello World!!!!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.set('Access-Control-Allow-Credentials', 'true');
    next();
});


app.use('/users', userRouter);