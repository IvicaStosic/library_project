const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user')

const MONGODB_URI = 'mongodb+srv://IvicaStosic:rIVOZqcqUtVbas2W@library-lbzor.mongodb.net/library'

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const libraryRoutes = require('./routes/library');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

app.use(adminRoutes);
app.use(libraryRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
    .connect(
        MONGODB_URI
    )
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    firstName: 'Ivica',
                    lastName: 'test',
                    dateOfBirth: '11 / 2 / 1989',
                    gender: 'male',
                    email: 'ivica@test.com',

                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

// mongoose.connect(MONGODB_URI).then(result => {
//     app.listen(3000);
// }).catch(err => { console.log(err) });