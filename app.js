const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { roomSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override')
const Room = require('./models/room');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/roomy', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const validateRoom = (req, res, next) => {
    const { error } = roomSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/rooms', catchAsync(async (req, res) => {
    const rooms = await Room.find({});
    res.render('rooms/index', { rooms })
}))

app.get('/rooms/new', (req, res) => {
    res.render('rooms/new')
})

app.post('/rooms', validateRoom, catchAsync(async (req, res, next) => {
    // if (!req.body.room) throw new ExpressError('Invalid Room data', 400)
    const room = new Room(req.body.room);
    await room.save();
    res.redirect(`/rooms/${room._id}`);
}))

app.get('/rooms/:id', catchAsync(async (req, res) => {
    const room = await Room.findById(req.params.id).populate('reviews');
    res.render('rooms/show', { room })
}))

app.get('/rooms/:id/edit', catchAsync(async (req, res) => {
    const room = await Room.findById(req.params.id)
    res.render('rooms/edit', { room })
}))

app.put('/rooms/:id', validateRoom, catchAsync(async (req, res) => {
    const room = await Room.findByIdAndUpdate(req.params.id, { ...req.body.room });
    res.redirect(`/rooms/${room._id}`);
}))

app.delete('/rooms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.redirect('/rooms');
}))

app.post('/rooms/:id/reviews', catchAsync(async (req, res) => {
    const room = await Room.findById(req.params.id);
    const review = new Review(req.body.review);
    room.reviews.push(review);
    await review.save();
    await room.save();
    res.redirect(`/rooms/${room._id}`)
}))

app.delete('/rooms/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Room.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/rooms/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})