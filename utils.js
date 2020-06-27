/* eslint-disable no-unused-vars */

const Utils = {
  // return summary text from positive %
  rating: (per) => [{ min: 95, text: 'Overwhelmingly Positive' },
    { min: 80, text: 'Very Positive' },
    { min: 70, text: 'Mostly Positive' },
    { min: 40, text: 'Mixed' },
    { min: 20, text: 'Mostly Negative' },
    { min: 0, text: 'Very Negative' }]
    .find((row) => per >= row.min).text,
};

module.exports = Utils;
