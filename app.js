const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/makeroom', async (req, res) => {
    const room = new Room({ name: 'Pinnacle PG', description:'Cheap PG' });
    await room.save();
    res.send(room);
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})