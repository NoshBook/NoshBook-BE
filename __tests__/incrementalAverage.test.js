const { addNewRating } = require('../lib/utils/incrementalAverage.js');

describe('incrementalAverage test', () => {

  function normalAverage(ratingsArray) {
    const sum = ratingsArray.reduce((acc, curr) => acc + curr, 0);
    return sum / ratingsArray.length;
  }

  it('should average 5 and 5 correctly', () => {
    const expected = normalAverage([5, 5]);
    const actual = addNewRating(5, 1, 5).newRating;
    expect(actual).toEqual(expected);
  });

  it('should average 5 5 5 5 5 correctly', () => {
    const expected = normalAverage([5, 5, 5, 5, 5]);
    const actual = addNewRating(5, 4, 5).newRating;
    expect(actual).toEqual(expected);
  });

  it('should average 1 2 3 4 5 correctly', () => {
    const expected = normalAverage([1, 2, 3, 4, 5]);
    const actual = addNewRating(2.5, 4, 5).newRating;
    expect(actual).toEqual(expected);
  });

  it('should average 2 2 3 2 5 correctly', () => {
    const expected = normalAverage([2, 2, 3, 2, 5]);
    const actual = addNewRating(2.25, 4, 5).newRating;
    expect(actual).toEqual(expected);
  });
});
