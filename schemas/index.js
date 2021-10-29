const Joi = require("@hapi/joi");

const suggestionsSchema = Joi.object().keys({
    q: Joi.string().required(),
    latitude: Joi.number(),
    longitude: Joi.number(),
});

module.exports = {
    suggestionsSchema
}
