const express = require('express');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
userRouter.use(bodyParser.json());
userRouter.use(bodyParser.urlencoded({ extended: false }));

// Back end storage where we store images
const storage = multer.diskStorage({
    destination: (req, file, cl) => {
        cl(null, 'uploads/');
    },
    filename: (req, file, cl) => {
        cl(null, file.originalname);
    },
});

// File upload object
const upload = multer({
    storage: storage,
    fileFilter: (req, file, callback) => {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
});

/* GET users listing. */
userRouter.get('/', (req, res, next) => {
    res.send('respond with a resource');
});

// Get All users from database
userRouter.get('/userData', (req, res, next) => {
    User.find((err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
        }
    })
});


// Get All images from database
userRouter.get('/userData/images', (req, res, next) => {
    let fileArr = [];
    User.find((err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        } else {
            data.forEach(user => {
                console.log('user =', user);

                fileArr.push(user.files);
            });
            if (fileArr.length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    statusCode: 200,
                    data: fileArr
                });
            } else {
                res.json({
                    statusCode: 401,
                    message: 'No Records Found!'
                });
            }
        }
    })
});


// Validate if id is exists or not
userRouter.get('/:id', (req, res, next) => {
    User.findById({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(data);
        }
    })
});

// Calculate Age from DOB
const calculateAge = (dob) => {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age = age - 1;
    }

    return age;
}

// Register new user into database
userRouter.post('/register', (req, res, next) => {
    const email = req.body.email;
    let age = calculateAge(req.body.DOB);
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        middlename: req.body.middlename,
        email: req.body.email,
        contactNo: req.body.contactNo,
        password: req.body.password,
        conformPassword: req.body.conformPassword,
        DOB: req.body.DOB,
        enrollDate: new Date(),
        age: age,
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
        maritalStatus: req.body.maritalStatus,
        manglik: req.body.manglik,
        mosad: req.body.mosad,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        zipCode: req.body.zipCode,
    };
    // Check weather the email is already exists
    User.findOne({ email }, (err, data) => {
        if (!data) {

            User.create(user, (err, data) => {
                if (err) {
                    console.log('err');
                    res.statusCode = 500;
                    res.set({
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    });
                    res.json({ err: err, statusCode: 500 });
                } else {
                    console.log('res 200');
                    res.statusCode = 200;
                    res.set({
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    });
                    res.json({ success: true, statusCode: 200, status: 'Registration Successful!' });
                }
            });
        } else {
            console.log('res 400');
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            res.json({ success: false, statusCode: 401, status: 'User Already Exist' });
        }
    });
});

// Compare password for login
const isMatchPass = (password, reqPass) => {
    if (password === reqPass)
        return true;
    else
        return false;
};

// Login using JWT Token
userRouter.post('/login', (req, res, next) => {
    const userInput = {
        email: req.body.email,
    }
    User.findOne(userInput, (err, user) => {
        if (err) {
            res.status(500).send({ success: false, msg: 'Internal Server Error' });
        }

        if (!user) {
            res.status(400).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            const isMatch = isMatchPass(req.body.password, user.password);
            if (isMatch) {
                // if user is found and password is right create a token
                var token = jwt.sign(userInput, '123456', {
                    expiresIn: 60 * 24 // expires in 24 hours
                });
                // return the information including token as JSON
                res.json({
                    success: true,
                    statusCode: 200,
                    id: user._id,
                    token
                });
            } else {
                res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
        }
    });
});


// Upload image for selected user
userRouter.put('/uploadImage/:id', upload.single('file'), (req, res) => {
    const file = {
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: req.file.path
    };
    User.findOneAndUpdate(
        { _id: req.params.id },
        {
            "$set":
                { "files": file }
        },
        (err, result) => {
            if (err) {
                res.set({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                });
                res.statusCode = 400;
            } else {
                res.set({
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                });
                res.json({ id: req.params.id, statusCode: 200, data: result });
            }
        });
});

userRouter.get('/images/:id', (req, res, next) => {
    const id = req.params.id;
    User.findOne({ _id: req.params.id }, (err, result) => {
        if (err) {
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            res.statusCode = 400;
        } else {
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            res.json({ statusCode: 200, data: result.files });
        }
    })
});

userRouter.post('/userById', (req, res, next) => {
    User.findById(req.body.id, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            res.json({ err: err, statusCode: 500 });
        }
        else {
            res.statusCode = 200;
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            });
            res.json({ success: true, statusCode: 200, data: data });
        }
    })
});

userRouter.get('/showProfile/:id', (req, res, next) => {
    const id = req.params.id;
    User.findById(id, (err, data) => {
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
            res.json({
                success: true,
                statusCode: 200,
                data: data,
                status: 'User Found Successfully!'
            });
        }
    });
});



userRouter.post('/updateProfile/:id', (req, res, next) => {
    const user = req.body;
    User.findOneAndUpdate({ _id: req.params.id }, user, (err, data) => {
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

userRouter.delete('/deleteProfile/:id', (req, res, next) => {
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
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            console.log('deleted ..')
            res.json({ statusCode: 200, success: true, status: 'User Deleted Successful!' });
        }
    });
});

module.exports = userRouter;


