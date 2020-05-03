const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cl) => {
        cl(null, 'uploads/');
    },
    filename: (req, file, cl) => {
        cl(null, file.originalname);
    }
})
const upload = multer({ storage: storage });

/* GET users listing. */
userRouter.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

userRouter.get('/userData', (req, res, next) => {
    User.find((err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            // res.set({
            //     'Content-Type': 'application/json',
            //     // 'Access-Control-Allow-Origin': '*',
            //     // 'Access-Control-Allow-Origin': 'http://127.0.0.1:5500'
            // })
            res.json({ err: err });
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            console.log(data);
            res.json(data);
        }
    })
});

userRouter.post('/login', async (req, res, next) => {
    User.findOne({
        username: req.body.username
    }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user.toJSON(), config.secret, { expiresIn: '30m' });
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });

})

userRouter.post('/register', upload.single('userImage'), (req, res, next) => {
    console.log(req.file);
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middlename: req.body.middlename,
        email: req.body.email,
        password: req.body.password,
        conformPassword: req.body.conformPassword,
        contactNo: req.body.contactNo,
        DOB: req.body.DOB,
        gender: req.body.gender,
        birthTime: req.body.birthTime,
        birthPlace: req.body.birthPlace,
        education: req.body.education,
        occupation: req.body.occupation,
        fatherOccupation: req.body.fatherOccupation,
        motherOccupation: req.body.motherOccupation,
        height: req.body.height,
        weight: req.body.weight,
        jooth: req.body.jooth,
        marital_status: req.body.maritalStatus,
        manglik: req.body.manglik,
        mosad: req.body.mosad,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        zipCode: req.body.zipCode,
        userImage: req.file.path
    };
    User.create(user, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            res.json({ err: err });
        }
        else {
            res.statusCode = 200;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            res.json({ success: true, status: 'Registration Successful!' });
        }
    })
});


userRouter.post('/updateProfile/:id', (req, res, next) => {
    const id = req.params.id;
    const user = req.body;
    User.findByIdAndUpdate(id, { set: user }, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            res.json({ err: err });
        }
        else {
            res.statusCode = 200;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            res.json({ success: true, status: 'User Updated Successful!' });
        }
    });
});

userRouter.post('/updateProfile/:id', (req, res, next) => {
    const id = req.params.id;

    User.findByIdAndDelete(id, (err, response) => {
        if (err) {
            res.statusCode = 500;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            res.json({ err: err });
        }
        else {
            res.statusCode = 200;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            res.json({ success: true, status: 'User Deleted Successful!' });
        }
    });
});

module.exports = userRouter;



/**
 * Register Request Body
 * //  {
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname,
    //     middlename: req.body.middlename,
    //     email: req.body.email,
    //     password: req.body.password,
    //     conformPassword: req.body.conformPassword,
    //     contact_no: req.body.contact_no,
    //     DOB: req.body.DOB,
    //     gender: req.body.gender,
    //     birthTime: req.body.birthTime,
    //     birthPlace: req.body.birthPlace,
    //     education: req.body.education,
    //     occupation: req.body.occupation,
    //     father_occupation: req.body.father_occupation,
    //     mother_occupation: req.body.mother_occupation,
    //     height: req.body.height,
    //     weight: req.body.weight,
    //     jooth: req.body.jooth,
    //     marital_status: req.body.marital_status,
    //     manglik: req.body.manglik,
    //     mosad: req.body.mosad,
    //     address: req.body.address,
    //     city: req.body.city,
    //     country: req.body.country,
    // };

 */
