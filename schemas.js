const Joi = require('joi')

module.exports.roomSchema = Joi.object({
    room: Joi.object({
        PGname: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required()
    }).required()
});