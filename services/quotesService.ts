
const QUOTES = [
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Your direction is more important than your speed.", author: "Anonymous" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Great things are not done by impulse, but by a series of small things brought together.", author: "Vincent van Gogh" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" }
];

export const getRandomQuote = () => {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
};
