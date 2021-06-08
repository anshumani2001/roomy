const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    PGname: String,
    price: Number,
    image: String,
    maxOccupants: Number,
    description: String,
    location: String,
    attachedBathroom: Boolean,
    attachedBalcony: Boolean,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

RoomSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Room',RoomSchema);