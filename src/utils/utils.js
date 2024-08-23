// Arrow function to shuffle an array using a random sort method
export const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// Save the current quiz state to localStorage to persist progress
export const saveProgress = (state) => localStorage.setItem('quizProgress', JSON.stringify(state));

// Clear the saved progress from localStorage (e.g., when the quiz is completed)
export const clearProgress = () => localStorage.removeItem('quizProgress');

// Function to get the color corresponding to the current quiz level
export const getLevelColor = (level) => ({ easy: "green", medium: "#FFDB58", hard: "red" }[level] || "black");