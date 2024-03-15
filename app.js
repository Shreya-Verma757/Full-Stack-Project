if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');
const User = require('./models/user.js');
const user = require('./routes/user.js');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderworld";

const dbUrl = process.env.ATLASDB_URL;

main().then(() =>{
    console.log('Connected to the Database..');
}).catch((err) =>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on('error', () =>{
    console.log('ERROR in MONGO SESSION STORE', err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
    },
};

// app.get('/', (req, res) =>{
//     res.send('Working!!');
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
    res.locals.message = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// app.get('/demouser', async (req, res) =>{
//     let fakeUser = new User({
//         email: 'student2gmail.com',
//         username: 'delta-student',
//     })

//     let registeredUser = await User.register(fakeUser,'helloworld');
//     res.send(registeredUser);
// });

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
app.use('/', user);



// app.get('/testlisting', (req, res) =>{
//     let sampleListing = new Listing({
//         title: 'My Villa',
//         description: 'Near Beach',
//         price: 450000,
//         location: 'Calangute , Goa',
//         country: 'India',
//     });
//     sampleListing.save().then(() =>{
//         console.log('Sample was Saved!');
//     }).catch((err) =>{
//         console.log(err);
//     });
//     res.send('Successful testing!')
// });

app.all('*', (req, res, next) =>{
    next(new ExpressError(404, 'Page Not Found!!'));
});

app.use((err, req, res, next) =>{
    let { statusCode=500, message='Something went wrong' } = err;
    res.status(statusCode).render('error.ejs', { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () =>{
    console.log('Server is listening to port 8080');
});
