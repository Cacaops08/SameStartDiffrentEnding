// Game state
let gameState = {
    players: [],
    currentPlayerIndex: 0,
    playerCount: 0,
    twistQuestions: [],
    usedTwistQuestions: new Set()
};

// Procedurally generated twist questions
const twistQuestionTemplates = [
    "If you had to show your entire camera roll to the group, what pic would you delete first?",
    "What's the most embarrassing thing you've ever done in public?",
    "If you could swap lives with anyone in this room for a day, who would it be and why?",
    "What's the weirdest dream you've ever had that you still remember?",
    "If you had to eat one food for the rest of your life, what would it be?",
    "What's the most ridiculous thing you've ever cried about?",
    "If you could have any superpower, but it had to be completely useless, what would you choose?",
    "What's the most childish thing you still do as an adult?",
    "If you had to describe yourself using only emojis, which 3 would you pick?",
    "What's the most embarrassing thing in your search history?",
    "If you could time travel, but only to awkward moments in your past, would you do it?",
    "What's the weirdest thing you've ever eaten?",
    "If you had to wear one outfit for the rest of your life, what would it be?",
    "What's the most ridiculous thing you've ever done to avoid social interaction?",
    "If you could only communicate through interpretive dance for a week, how would you survive?",
    "What's the most embarrassing thing you've ever said to someone you had a crush on?",
    "If you had to live in a different decade, which would you choose and why?",
    "What's the weirdest thing you've ever done when you thought no one was watching?",
    "If you could have any animal as a roommate, what would you choose?",
    "What's the most ridiculous thing you've ever done to impress someone?",
    "If you had to give up one of your five senses, which would you choose?",
    "What's the most embarrassing thing you've ever done while drunk?",
    "If you could only listen to one song for the rest of your life, what would it be?",
    "What's the weirdest thing you've ever done to avoid doing work?",
    "If you had to live in a different country for a year, where would you go?",
    "What's the most ridiculous thing you've ever done to save money?",
    "If you could have any celebrity as your best friend, who would you choose?",
    "What's the most embarrassing thing you've ever done in a restaurant?",
    "If you had to wear a costume every day for a month, what would you choose?",
    "What's the weirdest thing you've ever done to try to fall asleep?",
    "If you could only eat food from one culture for the rest of your life, which would you choose?",
    "What's the most ridiculous thing you've ever done to avoid exercise?",
    "If you had to give up all social media except one, which would you keep?",
    "What's the most embarrassing thing you've ever done in a movie theater?",
    "If you could have any job in the world, but it had to be completely made up, what would it be?",
    "What's the weirdest thing you've ever done to try to be cool?",
    "If you had to live in a different time period, which would you choose?",
    "What's the most ridiculous thing you've ever done to avoid confrontation?",
    "If you could only watch one movie for the rest of your life, what would it be?",
    "What's the most embarrassing thing you've ever done in a gym?",
    "If you had to communicate only through memes for a day, how would you survive?",
    "What's the weirdest thing you've ever done to try to be healthy?",
    "If you could have any pet in the world, what would you choose?",
    "What's the most ridiculous thing you've ever done to avoid responsibility?",
    "If you had to live in a different climate, which would you choose?",
    "What's the most embarrassing thing you've ever done in a library?",
    "If you could only use one app on your phone for a month, which would you choose?",
    "What's the weirdest thing you've ever done to try to be romantic?",
    "If you had to give up one hobby forever, which would you choose?",
    "What's the most ridiculous thing you've ever done to avoid cleaning?",
    "If you could have any talent in the world, but it had to be completely useless, what would you choose?",
    "What's the most embarrassing thing you've ever done in a car?",
    "If you had to live in a different type of home, what would you choose?",
    "What's the weirdest thing you've ever done to try to be productive?",
    "If you could only read one book for the rest of your life, what would it be?",
    "What's the most ridiculous thing you've ever done to avoid cooking?",
    "If you had to give up one comfort item forever, what would you choose?",
    "What's the most embarrassing thing you've ever done in a store?",
    "If you could have any skill in the world, but it had to be completely impractical, what would you choose?"
];

// Player avatars for visual variety
const playerAvatars = ['👤', '👨', '👩', '🧑', '👧', '👦', '👴', '👵', '🧑‍🦰', '🧑‍🦱'];

// Show player registration screen
function showPlayerRegistration() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    
    if (playerCount < 2 || playerCount > 10) {
        alert('Please enter a number between 2 and 10 players.');
        return;
    }
    
    // Generate player input fields
    const playersList = document.getElementById('playersList');
    playersList.innerHTML = '';
    
    for (let i = 0; i < playerCount; i++) {
        const playerField = document.createElement('div');
        playerField.className = 'player-input-field';
        playerField.innerHTML = `
            <label for="player${i + 1}">Player ${i + 1} Name:</label>
            <input type="text" id="player${i + 1}" placeholder="Enter name..." maxlength="20">
        `;
        playersList.appendChild(playerField);
    }
    
    // Hide setup, show registration
    document.getElementById('gameSetup').style.display = 'none';
    document.getElementById('playerRegistration').style.display = 'block';
    
    // Focus on first player input
    document.getElementById('player1').focus();
}

// Go back to setup screen
function backToSetup() {
    document.getElementById('playerRegistration').style.display = 'none';
    document.getElementById('gameSetup').style.display = 'block';
}

// Initialize the game
function startGame() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    
    // Collect player names
    const playerNames = [];
    for (let i = 1; i <= playerCount; i++) {
        const nameInput = document.getElementById(`player${i}`);
        const name = nameInput.value.trim();
        
        if (!name) {
            alert(`Please enter a name for Player ${i}.`);
            nameInput.focus();
            return;
        }
        
        // Check for duplicate names
        if (playerNames.includes(name)) {
            alert(`Player names must be unique. "${name}" is used more than once.`);
            nameInput.focus();
            return;
        }
        
        playerNames.push(name);
    }
    
    gameState.playerCount = playerCount;
    gameState.players = [];
    gameState.currentPlayerIndex = 0;
    gameState.usedTwistQuestions = new Set();
    
    // Create players with their names
    for (let i = 0; i < playerCount; i++) {
        gameState.players.push({
            id: i,
            name: playerNames[i],
            avatar: playerAvatars[i % playerAvatars.length],
            twistQuestion: generateTwistQuestion()
        });
    }
    
    // Hide registration, show game
    document.getElementById('playerRegistration').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';
    
    // Load first player
    loadCurrentPlayer();
}

// Generate a unique twist question for each player
function generateTwistQuestion() {
    let availableQuestions = twistQuestionTemplates.filter(q => !gameState.usedTwistQuestions.has(q));
    
    // If we run out of questions, reset the used set
    if (availableQuestions.length === 0) {
        gameState.usedTwistQuestions.clear();
        availableQuestions = twistQuestionTemplates;
    }
    
    // Pick a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Mark as used
    gameState.usedTwistQuestions.add(selectedQuestion);
    
    return selectedQuestion;
}

// Load the current player's questions
function loadCurrentPlayer() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    document.getElementById('currentPlayerName').textContent = currentPlayer.name;
    document.getElementById('playerAvatar').textContent = currentPlayer.avatar;
    document.getElementById('twistQuestionText').textContent = currentPlayer.twistQuestion;
}

// Handle twist question actions
function answerTwist() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    alert(`${currentPlayer.name} chose to answer their twist question!\n\n"${currentPlayer.twistQuestion}"\n\nPlease read this question out loud and answer it!`);
}

function passTwist() {
    showPassModal();
}

// Show modal to select who to pass the twist question to
function showPassModal() {
    const modal = document.getElementById('passModal');
    const playerList = document.getElementById('playerList');
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Clear previous options
    playerList.innerHTML = '';
    
    // Create options for all other players
    gameState.players.forEach(player => {
        if (player.id !== currentPlayer.id) {
            const playerOption = document.createElement('div');
            playerOption.className = 'player-option';
            playerOption.textContent = `${player.avatar} ${player.name}`;
            playerOption.onclick = () => passToPlayer(player.id);
            playerList.appendChild(playerOption);
        }
    });
    
    modal.style.display = 'flex';
}

// Pass the twist question to a specific player
function passToPlayer(playerId) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const targetPlayer = gameState.players[playerId];
    
    closePassModal();
    
    alert(`${currentPlayer.name} passed their twist question to ${targetPlayer.name}!\n\n"${currentPlayer.twistQuestion}"\n\n${targetPlayer.name}, please read this question out loud and answer it or follow its instructions!`);
}

// Close the pass modal
function closePassModal() {
    document.getElementById('passModal').style.display = 'none';
}

// Move to the next player
function nextPlayer() {
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.playerCount;
    loadCurrentPlayer();
}

// Reset the game
function resetGame() {
    if (confirm('Are you sure you want to reset the game?')) {
        gameState = {
            players: [],
            currentPlayerIndex: 0,
            playerCount: 0,
            twistQuestions: [],
            usedTwistQuestions: new Set()
        };
        
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('playerRegistration').style.display = 'none';
        document.getElementById('gameSetup').style.display = 'block';
        document.getElementById('playerCount').value = 4;
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight' || event.key === ' ') {
        // Next player
        if (document.getElementById('gameArea').style.display !== 'none') {
            nextPlayer();
        }
    } else if (event.key === 'Escape') {
        // Close modal
        closePassModal();
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set focus to player count input
    document.getElementById('playerCount').focus();
    
    // Add enter key support for continuing to registration
    document.getElementById('playerCount').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            showPlayerRegistration();
        }
    });
    
    // Add keyboard navigation for player registration
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && document.getElementById('playerRegistration').style.display !== 'none') {
            // Check if we're in a player name input
            const activeElement = document.activeElement;
            if (activeElement && activeElement.id && activeElement.id.startsWith('player')) {
                const currentPlayerNum = parseInt(activeElement.id.replace('player', ''));
                const playerCount = parseInt(document.getElementById('playerCount').value);
                
                if (currentPlayerNum < playerCount) {
                    // Move to next player input
                    document.getElementById(`player${currentPlayerNum + 1}`).focus();
                } else {
                    // Start the game
                    startGame();
                }
            }
        }
    });
});
