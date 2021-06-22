const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateRoom } = require('../middleware')

router.route('/')
    .get(catchAsync(rooms.index))
    .post(isLoggedIn, validateRoom, catchAsync(rooms.createRoom))

router.get('/new', isLoggedIn, rooms.renderNewForm)

router.route('/:id')
    .get(catchAsync(rooms.showRoom))
    .put(isLoggedIn, isAuthor, validateRoom, catchAsync(rooms.updateRoom))
    .delete(isLoggedIn, isAuthor, catchAsync(rooms.deleteRoom));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(rooms.renderEditForm))

module.exports = router;