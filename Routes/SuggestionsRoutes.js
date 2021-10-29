const express = require("express");
const { requestSchemeValidator } = require("../Middlewares/schemaValidator");
const { suggestionsSchema } = require("../schemas");
const { getSuggestions } = require("../Controllers/SuggestionsController");

const router = express.Router();

router.get("/suggestions", requestSchemeValidator(suggestionsSchema), getSuggestions);

module.exports = router;
