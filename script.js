const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2109-UNF-HY-WEB-PT";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${APIURL}/players`);
    const playersData = await response.json();
    console.log(playersData);
    players = playersData.data.players;
    console.log(players);
    return players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`);
    let playerData = await response.json();
    //await fetchSinglePlayer(7039)
    return playerData;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const result = await response.json();
    if (result.ok) {
      console.log("Player added successfully.");
    } else {
      console.error("Failed to add player. Status:", result.status);
    }
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Data deleted successfully.");
    }
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async () => {
  try {
    playerContainer.innerHTML = "";

    const playerList = await fetchAllPlayers();

    playerList.forEach((players) => {
      const playerElement = document.createElement("div");
      playerElement.classList.add("player-card"); // Add a class for styling purposes
      playerElement.innerHTML = `
        <h2>${players.name}</h2>
        <p>${players.breed}</p>
        <p>${players.status}</p>
        <button class="details-button" data-id="${players.id}">See Details</button>
        <button class="delete-button" data-id="${players.id}">Delete</button>
      `;
      playerContainer.appendChild(playerElement);

      // See details
      const detailsButton = playerElement.querySelector(".details-button");
      detailsButton.addEventListener("click", async (event) => {
        await renderSinglePlayerById(players);
      });

      // Delete player
      const deleteButton = playerElement.querySelector(".delete-button");
      deleteButton.addEventListener("click", async () => {
        await removePlayer(players.id);
        await renderAllPlayers();
      });
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

const renderSinglePlayerById = async (playerId) => {
  try {
    // Render single player details to the DOM
    // ...
    const playerDetailsElement = document.getElementById("player-details");
    playerDetailsElement.style.display = "block";
    console.log(playerDetailsElement);
    playerDetailsElement.innerHTML = `
      <h2>These are the player details</h2>
      <p>${playerId.name}</p>
      <p>${playerId.breed}</p>
      <button class="close-button">Close</button>
    `;

    // Add event listener to the close button
    const closeButton = playerDetailsElement.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      playerDetailsElement.style.display = "none";
    });
  } catch (err) {
    console.error(`Oh no, trouble rendering player #${playerId}!`, err);
  }
};

// Rest of your code...

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = async () => {
  try {
    newPlayerFormContainer.innerHTML = "";
    const newPlayersForm = document.createElement("div");
    newPlayersForm.innerHTML = `
        <form id="myForm" action="/submit" method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required><br><br>
        
        <label for="breed">Breed:</label>
        <input type="text" id="breed" name="breed" required><br><br>
        
        <input type="submit" value="Submit">
        </form>
        
      `;
    newPlayerFormContainer.appendChild(newPlayersForm);

    document.getElementById("myForm").addEventListener("submit", async (e) => {
      e.preventDefault();

      let newName = document.getElementById("name").value;
      let newBreed = document.getElementById("breed").value;
      let newPlayer = {
        name: newName,
        breed: newBreed,
      };
      await addNewPlayer(newPlayer);
      await renderAllPlayers();
      // Reset the form fields
      document.getElementById("myForm").reset();
    });

    // See details
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  await renderAllPlayers();
  await renderNewPlayerForm();
};

init();