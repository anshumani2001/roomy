const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const Room = require('./models/room');

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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/rooms', async (req, res) => {
    const rooms = await Room.find({});
    res.render('rooms/index', { rooms })
})

app.get('/rooms/new', (req, res) => {
    res.render('rooms/new')
})

app.post('/rooms', async (req, res) => {
    const room = new Room(req.body.room);
    await room.save();
    res.redirect(`/rooms/${room._id}`);
})

app.get('/rooms/:id', async (req, res) => {
    const room = await Room.findById(req.params.id)
    res.render('rooms/show', { room })
})

app.get('/rooms/:id/edit', async (req, res) => {
    const room = await Room.findById(req.params.id)
    res.render('rooms/edit', { room })
})

app.put('/rooms/:id', async (req, res) => {
    const room = await Room.findByIdAndUpdate(req.params.id, { ...req.body.room });
    res.redirect(`/rooms/${room._id}`);

})

app.delete('/rooms/:id', async (req, res) => {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    res.redirect('/rooms');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})