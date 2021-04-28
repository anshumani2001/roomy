const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    PGname: String,
    price: String,
    maxOccupants: Number,
    description: String,
    location: String,
    attachedBathroom: Boolean,
    attachedBalcony: Boolean
})

module.exports = mongoose.model('Room',RoomSchema);