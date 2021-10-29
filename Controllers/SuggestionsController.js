const { data } = require("../db").DB;
const { getRandomNumberInRange, findDifference } = require("../utils/math");
const QUERY_SCORE_COEFFICIENT = {
    FIRST: 1,
    SECOND: 0.9,
    THIRD: 0.7,
    FOURTH: 0.5,
    FIFTH: 0.3,
}
const EDGE_VALUES_FOR_SCORE = {
    MIN_COEFFICIENT: 0,
    MAX_COEFFICIENT: 0.99
};

function getSuggestions(req, res) {
    const queryOptions = {
        text: req.query.q,
        latitude: req.query.latitude,
        longitude: req.query.longitude
    }
    const response = getLocationSuggestions(queryOptions, data)
    const formattedResponse = formatResponse(response);
    return res.json(formattedResponse);
}

function getLocationSuggestions(queryOptions, dbData) {
    const resultsFilteredByText = getFilteredSuggestionByText(queryOptions.text, dbData);
    const calculatedResults = calculateScoreAfterTextFiltering(queryOptions, resultsFilteredByText);
    return calculatedResults.sort((firstSuggestion, secondSuggestion) => secondSuggestion.score - firstSuggestion.score);
}

function getFilteredSuggestionByText(text, dbData){
    return dbData.filter(item => item.name?.includes(text));
}

function calculateScoreAfterTextFiltering({ text, latitude: lat, longitude: long }, results) {
    if (!lat && !long) {
        return results.map(item => {
            let score;
            if (item.name === text) {
                score = 1
            } else {
                score = getRandomNumberInRange(EDGE_VALUES_FOR_SCORE.MIN_COEFFICIENT, EDGE_VALUES_FOR_SCORE.MIN_COEFFICIENT);
            }
            item.score = score;
            return item;
        });
    } else if (!lat && long) {
        return results.map(item => {
            const diff = findDifference(item.long, long);
            item.score = calScoreBasedOnDiff(diff);
            return item;
        });
    } else if (lat && !long) {
        return results.map(item => {
            const diff = findDifference(item.lat, lat);
            item.score = calScoreBasedOnDiff(diff);
            return item;
        });
    } else return results.map(item => {
            const diffInLat = findDifference(item.lat, lat);
            const diffInLong = findDifference(item.long, long);
            const score = Math.sqrt(Math.pow(calScoreBasedOnDiff(diffInLat), 2) + Math.pow(calScoreBasedOnDiff(diffInLong), 2));
            item.score = score > 1 ? getRandomNumberInRange(QUERY_SCORE_COEFFICIENT.THIRD, EDGE_VALUES_FOR_SCORE.MAX_COEFFICIENT) : score;
            return item;
    });
}

function calScoreBasedOnDiff(value) {
    const {
        FIRST, SECOND, THIRD, FOURTH, FIFTH
    } = QUERY_SCORE_COEFFICIENT;
    if (value < 0.5) {
        return FIRST;
    } else if ( value < 1 ) {
        return getRandomNumberInRange(SECOND, FIRST);
    } else if ( value < 3 ) {
        return getRandomNumberInRange(THIRD, SECOND);
    } else if ( value < 5 ) {
        return getRandomNumberInRange(FOURTH, THIRD);
    } else if ( value < 7 ) {
        return getRandomNumberInRange(FIFTH, FOURTH);
    } else {
        return getRandomNumberInRange(EDGE_VALUES_FOR_SCORE.MIN_COEFFICIENT, FIFTH);
    }
}

function formatResponse(data) {
    return {
        suggestions: data.map(item => {
            return {
                name: `${item.name}, ${item.country}`,
                latitude: item.lat,
                longitude: item.long,
                score: item.score
            }
        })
    }
}

module.exports = {
    getSuggestions
}