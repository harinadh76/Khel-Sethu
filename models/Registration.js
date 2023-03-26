const mongoose = require('mongoose')

const eventRegistration = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true 
    },
    phnumber:{
        type:Number,
        required:true 
    },
    year:{
        type:String,
        required:true
    },
    event:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    transactionid:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('eventRegistration', eventRegistration);