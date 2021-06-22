const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Room = require('../models/room');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Room.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1467 = Math.floor(Math.random() * 1467);
        const price = Math.floor(Math.random()*10000+5000);
        const room = new Room({
            author: '60d096bc99a1332674a1c44f',
            location: `${cities[random1467].city}, ${cities[random1467].state}`,
            PGname: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/3214295/1280x720',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam consequatur dolorem ut autem repellendus quos sed soluta impedit possimus, commodi non quas. Placeat consequatur qui dolore debitis. Porro, illum eveniet!',
            price
        })
        await room.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})