exports.shuffleArray = async (array) => {
    // Copy the original array to avoid modifying the original
  const shuffledArray = [...array];
  
  // Start from the last element and iterate backwards
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    
    // Swap the current element with the randomly selected one
    [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
  }
  
  return shuffledArray;
}