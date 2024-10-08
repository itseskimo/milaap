// Arrow function to shuffle an array using a random sort method

export function shuffleArray(array) {
    for (let i = 0; i < array.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));  // Select a random index from 0 to i
      [array[i], array[j]] = [array[j], array[i]];    // Swap elements at indices i and j
    }
    return array;
  }

// Save the current quiz state to localStorage to persist progress
export const saveProgress = (state) => localStorage.setItem('quizProgress', JSON.stringify(state));

// Clear the saved progress from localStorage (e.g., when the quiz is completed)
export const clearProgress = () => localStorage.removeItem('quizProgress');

// Function to get the color corresponding to the current quiz level
export const getLevelColor = (level) => ({ easy: "green", medium: "#FFDB58", hard: "red" }[level] || "black");