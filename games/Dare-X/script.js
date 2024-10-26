// script.js

let dares = [];

// Function to fetch dares from dares.json
async function loadDares() {
  try {
    const response = await fetch("dares.json"); // Adjust the path if necessary
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    dares = await response.json();
    console.log("Dares loaded:", dares);
  } catch (error) {
    console.error("Error loading dares:", error);
  }
}

// Call loadDares when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  await loadDares();
  // Initialize other functionalities that depend on dares here
  updateScore();
});

// Variables to store player names
let player1Name = "Player 1";
let player2Name = "Player 2";

// Show the modal when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("player-name-modal");
  modal.style.display = "flex"; // Ensure the modal is displayed
});

// Add event listener to Start Game button
document.getElementById("start-game-btn").addEventListener("click", () => {
  const player1Input = document.getElementById("player1").value.trim();
  const player2Input = document.getElementById("player2").value.trim();

  if (player1Input && player2Input) {
    player1Name = player1Input;
    player2Name = player2Input;
    updatePlayerSelection(); // Update the player selection with new names
    document.getElementById("game-section").style.display = "flex";
    document.getElementById("score-section").style.display = "block";
    document.getElementById(
      "score-display"
    ).textContent = `${player1Name}: 0 | ${player2Name}: 0`;

    // Close the modal
    document.getElementById("player-name-modal").style.display = "none";
  } else {
    alert("Please enter both player names.");
  }
});

// Function to update the player selection labels
function updatePlayerSelection() {
  document.getElementById("player1-label").textContent = player1Name;
  document.getElementById("player2-label").textContent = player2Name;
}

// Keep track of completed and not done dares for each player
const completedDares = {
  player1: {
    completed: [],
    notDone: [],
  },
  player2: {
    completed: [],
    notDone: [],
  },
};

// Function to check if all dares are completed for a player
function allDaresCompleted(player) {
  return dares.every(
    (dare) =>
      completedDares[player].completed.includes(dare) ||
      completedDares[player].notDone.includes(dare)
  );
}

// Function to check if all dares are completed for both players
function bothPlayersCompleted() {
  return allDaresCompleted("player1") && allDaresCompleted("player2");
}

// Function to get a random dare for the selected player
function getRandomDare(player) {
  const playerName = player === "player1" ? player1Name : player2Name;
  const availableDares = dares.filter(
    (dare) =>
      !completedDares[player].completed.includes(dare) &&
      !completedDares[player].notDone.includes(dare)
  );

  // If the player has no available dares, check if all are completed
  if (availableDares.length === 0) {
    if (bothPlayersCompleted()) {
      resetDare(); // Reset the dares if both players have completed their dares
      return "All dares have been completed! The list has been reset.";
    }
    return `All dares have been completed for ${playerName}! Wait for the other player.`;
  }

  // Return a random available dare
  const randomIndex = Math.floor(Math.random() * availableDares.length);
  return availableDares[randomIndex];
}

// Reset the dare lists for both players
function resetDare() {
  completedDares.player1.completed = [];
  completedDares.player1.notDone = [];
  completedDares.player2.completed = [];
  completedDares.player2.notDone = [];
  updateScore(); // Reset scores
  // Optionally, you can also clear the record list
  document.getElementById("record-list").innerHTML = "";
}

// Function to add a record to the table and update completed/not done dares
function addRecord(dare, player, status) {
  if (status === "Done") {
    completedDares[player].completed.push(dare);
  } else if (status === "Not Done") {
    completedDares[player].notDone.push(dare);
  }

  const recordList = document.getElementById("record-list");
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
    <td>${dare}</td>
    <td>${status}</td>
    <td>${player === "player1" ? player1Name : player2Name}</td>
  `;
  recordList.appendChild(newRow);

  updateScore(); // Update scores after adding a record
}

// Function to update the score display
function updateScore() {
  const player1Score = completedDares.player1.completed.length;
  const player2Score = completedDares.player2.completed.length;
  document.getElementById(
    "score-display"
  ).textContent = `${player1Name}: ${player1Score} | ${player2Name}: ${player2Score}`;
}

// Button event listeners
document.getElementById("randomize-btn").addEventListener("click", () => {
  if (dares.length === 0) {
    alert("Dares are still loading. Please wait.");
    return;
  }
  const player = document.querySelector('input[name="player"]:checked').value;
  const dareDisplay = document.getElementById("dare-display");
  const randomDare = getRandomDare(player);
  dareDisplay.textContent = randomDare;
});

document.getElementById("done-btn").addEventListener("click", () => {
  const player = document.querySelector('input[name="player"]:checked').value;
  const dareDisplay = document.getElementById("dare-display").textContent;
  if (
    dareDisplay !== "Press the button to get a dare!" &&
    !dareDisplay.includes("All dares have been completed")
  ) {
    addRecord(dareDisplay, player, "Done");
    document.getElementById("dare-display").textContent =
      "Press the button to get a dare!";
  }
});

document.getElementById("not-done-btn").addEventListener("click", () => {
  const player = document.querySelector('input[name="player"]:checked').value;
  const dareDisplay = document.getElementById("dare-display").textContent;
  if (
    dareDisplay !== "Press the button to get a dare!" &&
    !dareDisplay.includes("All dares have been completed")
  ) {
    addRecord(dareDisplay, player, "Not Done");
    document.getElementById("dare-display").textContent =
      "Press the button to get a dare!";
  }
});

// Initialize score display on page load
document.addEventListener("DOMContentLoaded", () => {
  updateScore();
});
