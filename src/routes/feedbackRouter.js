const express = require('express');
const feedbackRouter = express.Router();
const Feedback = require('../models/feedbackModel');
const bodyParser = require('body-parser');
feedbackRouter.use(bodyParser.json());
feedbackRouter.use(bodyParser.urlencoded({ extended: false }));

/* GET users listing. */
feedbackRouter.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

feedbackRouter.post('/addFeedback', (req, res, next) => {
    const feedback = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    };
    Feedback.create(feedback, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            console.log('register err', err);
            console.log('register res \n \n \n ', res.statusCode);
            res.json({ err: err });
        }
        else {
            res.statusCode = 200;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            console.log('register res', res.statusCode);
            res.json({ success: true, statusCode: 200, status: 'Feedback Added Successfully!' });
        }
    })
});



module.exports = feedbackRouter;


