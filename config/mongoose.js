const mongoose = require('mongoose');
//open a connection
mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

//to get notified of success or error
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to database!"));
db.once('open', function() {
    console.log("Database connection successful!");
});

module.exports = db;