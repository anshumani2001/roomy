const Room = require('../models/room');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const rooms = await Room.find({});
    res.render('rooms/index', { rooms })
}

module.exports.renderNewForm = (req, res) => {
    res.render('rooms/new')
}

module.exports.createRoom = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.room.location,
        limit:1
    }).send();
    const room = new Room(req.body.room);
    room.geometry = geoData.body.features[0].geometry;
    room.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    room.author = req.user._id;
    await room.save();
    console.log(room);
    req.flash('success', 'Successfully creeated a new room')
    res.redirect(`/rooms/${room._id}`);
}

module.exports.showRoom = async (req, res) => {
    const room = await Room.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!room) {
        req.flash('error', 'Room does not exist');
        return res.redirect('/rooms');
    }
    res.render('rooms/show', { room })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const room = await Room.findById(id)
    if (!room) {
        req.flash('error', 'Cannot find that room!');
        return res.redirect('/rooms');
    }
    res.render('rooms/edit', { room });
}

module.exports.updateRoom = async (req, res) => {
    const { id } = req.params;
    const room = await Room.findByIdAndUpdate(id, { ...req.body.room });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    room.images.push(...imgs);
    await room.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await room.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated room!');
    res.redirect(`/rooms/${room._id}`)
}

module.exports.deleteRoom = async (req, res) => {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted room')
    res.redirect('/rooms');
}