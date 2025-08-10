require('dotenv').config()

const express = require('express');
const port = process.env.APP_PORT || 2021;
const app = express();
const db = require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const { urlencoded } = require('express');
const flash = require('connect-flash');
const session = require('express-session');
const middlewares = require('./config/middlewares');
const favicon = require('serve-favicon');
const path = require('path');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./config/passport_local');
const http = require('http');
const server = http.createServer(app);
require('./config/serverSockets')(server);

//static files
app.use(express.static(__dirname + '/assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));

// serving the favicon
app.use(favicon(path.join(__dirname,'assets', 'img', 'logoimg.png')));

// express-session
app.use(session({
    name: 'ChitChat',
    secret: process.env.APP_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000*60*60*24 //the expiry time of the cookie
    },
    store: MongoStore.create({ // mongostore for storing sessions in database
        mongoUrl: `mongodb://localhost:27017/${process.env.DB_NAME}`
    }, (err) => console.log('Error in mongoStore: ', err))

}));

//to extract scripts, styles && view engine
app.use(expressLayouts); 
app.set('view engine', 'ejs');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout', 'homelayout');

//body-parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// flash
app.use(flash());
app.use(middlewares.flashMiddleWare);

//passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUserIfAuthenticated);

app.use('/', require('./routes/index'));
server.listen(port, (err) => {
    if(err)
        console.log(`Error encountered: ${err}`);
    else
        console.log(`Server is running at port: ${port}`);
});