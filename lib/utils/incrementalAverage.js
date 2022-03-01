function addNewRating(currentRating, currentRatingsCount, ratingToAdd) {
  const newCount = currentRatingsCount + 1;
  const newRating = currentRating + ((ratingToAdd - currentRating) / newCount); 
  return { newRating, newCount };
}

module.exports = { addNewRating };
