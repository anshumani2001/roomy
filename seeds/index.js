if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Room = require('../models/room');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl, {
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
        const price = Math.floor(Math.random() * 10000 + 5000);
        const location = `${cities[random1467].city}, ${cities[random1467].state}`;
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send();

        const room = new Room({
            author: '6129fe4fe829830016e004e5',
            location: location,
            PGname: `${sample(descriptors)} ${sample(places)} PG`,
            // image: 'https://source.unsplash.com/collection/3214295/1280x720',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam consequatur dolorem ut autem repellendus quos sed soluta impedit possimus, commodi non quas. Placeat consequatur qui dolore debitis. Porro, illum eveniet!',
            price,
            geometry: geoData.body.features[0].geometry,
            images: [
                {
                    url: 'https://res.cloudinary.com/dus522prm/image/upload/v1630073580/Roomy/norbert-levajsics-oTJ92KUXHls-unsplash_t5ls5p.jpg',
                    filename: 'Roomy/vbgowcn5ouobtsoj1nia'
                },
                {
                    url: 'https://res.cloudinary.com/dus522prm/image/upload/v1630074259/Roomy/yeongkyeong-lee-AkNRiespFjA-unsplash_cnhg1s.jpg',
                    filename: 'Roomy/yv81hqvmhalm7jkjlxak'
                }
            ]
        })
        await room.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})