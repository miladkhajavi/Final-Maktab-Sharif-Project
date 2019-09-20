const generalTools = {};

generalTools.randomNumberGenerator = (length) => {
    return Math.floor(Math.random() * ((10 ** length) - (10 ** (length - 1)))) + 10 ** (length - 1)
};

console.log(generalTools.randomNumberGenerator(4));


module.exports = generalTools;
