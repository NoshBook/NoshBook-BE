function calcNewRating(currentRating, currentRatingsCount, ratingToAdd) {
  if(currentRatingsCount === 0) return { updatedRating: ratingToAdd, newCount: 1 };
  
  const newCount = currentRatingsCount + 1;
  const updatedRating = currentRating + ((ratingToAdd - currentRating) / newCount); 
  return { updatedRating, newCount };
}

module.exports = { calcNewRating };
