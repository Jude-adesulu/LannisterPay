const Joi = require('joi');

const transaction = Joi.object().keys({
    ID: Joi.number().id().required(),
    Amount: Joi.number.required(),
    Currency: Joi.string().uppercase().required(),
    CustomerEmail: Joi.string().email().trim().required(),
    SplitInfo: Joi.array().min(1).max(20)

});

module.exports = transaction