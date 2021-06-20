const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { roomSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware')

const ExpressError = require('../utils/ExpressError');
const Room = require('../models/room');

const validateRoom = (req, res, next) => {
    const { error } = roomSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const rooms = await Room.find({});
    res.render('rooms/index', { rooms })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('rooms/new')
})

router.post('/', isLoggedIn, validateRoom, catchAsync(async (req, res, next) => {
    // if (!req.body.room) throw new ExpressError('Invalid Room data', 400)
    const room = new Room(req.body.room);
    await room.save();
    req.flash('success', 'Successfully creeated a new room')
    res.redirect(`/rooms/${room._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const room = await Room.findById(req.params.id).populate('reviews');
    if (!room) {
        req.flash('error', 'Room does not exist');
        return res.redirect('/rooms');
    }
    res.render('rooms/show', { room })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (!room) {
        req.flash('error', 'Room does not exist');
        return res.redirect('/rooms');
    }
    res.render('rooms/edit', { room })
}))

router.put('/:id', validateRoom, catchAsync(async (req, res) => {
    const room = await Room.findByIdAndUpdate(req.params.id, { ...req.body.room });
    req.flash('success', 'Successfully Updated Room')
    res.redirect(`/rooms/${room._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Room.findByIdAndDelete(id);
    req.flash('success', 'Room Deleted!')
    res.redirect('/rooms');
}))

module.exports = router;