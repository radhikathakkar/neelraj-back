const mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/NeelRaj';
mongoose.connect(mongoDB, { useNewUrlParser: true })
    .then(data => {
        console.log('connected...');
    })
    .catch(err => err);