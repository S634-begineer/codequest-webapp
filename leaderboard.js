// Example static data — you can replace this with backend fetch later
const leaderboardData = [
  { username: "Alice", score: 85 },
  { username: "Bob", score: 73 },
  { username: "Charlie", score: 60 },
  { username: "David", score: 92 },
  { username: "Eva", score: 55 }
];

// Clamp score 0-100 for progress bar width safety
function clampScore(score) {
  return Math.min(Math.max(score, 0), 100);
}

function createUserRow(user, rank) {
  const row = document.createElement("div");
  row.className = "user-row";

  const safeScore = clampScore(user.score);

  row.innerHTML = `
    <span class="rank">${rank}</span>
    <span class="username">${user.username}</span>
    <div class="progress-bar1">
      <div class="progress-fill" style="width: ${safeScore}%;"></div>
    </div>
    <span class="score">${safeScore}</span>
  `;

  return row;
}

function renderLeaderboard(data) {
  // Sort data by score descending
  data.sort((a, b) => b.score - a.score);

  const leaderboard = document.querySelector(".leaderboard");

  // Remove existing user rows
  document.querySelectorAll(".user-row").forEach(row => row.remove());

  // Add new rows
  data.forEach((user, index) => {
    const row = createUserRow(user, index + 1);
    leaderboard.appendChild(row);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  // You can replace leaderboardData here with fetch call from backend later.
  renderLeaderboard(leaderboardData);
});
