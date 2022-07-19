const Joi = require('joi');

const transaction = Joi.object().keys({
    ID: Joi.number().id().required(),
    Amount: Joi.number().required(),
    Currency: Joi.string().uppercase().required(),
    CustomerEmail: Joi.string().email().trim().required(),
    SplitInfo: Joi.array().items({
        SplitType: Joi.string().required(),
        SplitValue: Joi.number().required(),
        SplitEntityId: Joi.string().required()
    }).min(1).max(20),
    
});


module.exports = {
    transaction,
}