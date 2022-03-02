const mongoose = require('mongoose');

const connect = async() => {
    try {
        const con = await mongoose.connect(process.env.URI);
        console.log(`Database is connected ${con.connection.host}`);
    } catch (err) {
        console.log(err)
        process.exit(1);
    }
}

module.exports = connect