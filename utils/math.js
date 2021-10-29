function getRandomNumberInRange(minValue, maxValue) {
    return minValue + (maxValue - minValue) * Math.random();
}

function findDifference(firstVal, secondVal){
    return Math.abs(firstVal - secondVal);
}

module.exports = {
    getRandomNumberInRange,
    findDifference
}