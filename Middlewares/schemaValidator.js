const Joi = require("@hapi/joi");
const {isNumber} = require("@hapi/joi/lib/common");

function requestSchemeValidator(schema) {
    return (req, res, next) => {

        if (!req.query.q) {
            res.status(404);
            return res.json({ errorCode: 404, message: "User must enter partial (or complete) location as 'q' param  :[  "});
        }

        return _schemeValidator(schema, req.query, res, next);
    };
}

async function _schemeValidator(scheme, paramsToValidate, res, next) {
    if (!scheme) throw new Error("Invalid schema");
    try {
        await scheme.validateAsync(paramsToValidate);
        return next();
    } catch (error) {
        console.error(error.message);
        return res.json({ errorCode: 404, message: error.message});
    }
}

module.exports = {
    requestSchemeValidator,
};
