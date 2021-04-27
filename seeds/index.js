const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers')
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

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() =>{
    await Room.deleteMany({})
    for(let i=0;i<50;i++){
        const random1467 = Math.floor(Math.random()*1467);
        const room = new Room({
            location:`${cities[random1467].city}, ${cities[random1467].state}`,
            PGname: `${sample(descriptors)} ${sample(places)}`
        })
        await room.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})