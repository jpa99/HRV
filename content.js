var analyze = require('Sentimental').analyze,
    positivity = require('Sentimental').positivity,
    negativity = require('Sentimental').negativity;

analyze("Hey you worthless scumbag"); //Score: -6, Comparative:-1.5
positivity("This is so cool"); //Score: 1, Comparative:.25
negativity("Hey you worthless scumbag"); //Score: 6, Comparative:1.5
analyze("I am happy"); //Score: 3, Comparative: 1
analyze("I am so happy"); //Score: 6, Comparative: 1.5
analyze("I am extremely happy"); //Score: 12, Comparative: 3