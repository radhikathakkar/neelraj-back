const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    conformPassword: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number,
        required: true
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthTime: {
        type: String,
        required: true
    },
    birthPlace: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    fatherOccupation: {
        type: String,
        required: true
    },
    motherOccupation: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    jooth: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        required: true
    },
    manglik: {
        type: Boolean,
        required: true
    },
    mosad: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zipCode: {
        type: Number,
        required: true
    },
    userImage: {
        type: String,
        required: true
    },
});


const User = module.exports = mongoose.model('users', userSchema);