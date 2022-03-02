const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    googleid:{
        type : String,
        required :true
    },
    displayname:{
        type : String,
        required :true
    },
    firstname:{
        type : String,
        required :true
    },
    lastname:{
        type : String,
        required :true
    },
    image:{
        type : String,
    },
    createdAt:{
        type : Date,
        default : Date.now 
    }
})

module.exports = mongoose.model('user',schema)