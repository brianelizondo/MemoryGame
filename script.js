const gameContainer = document.getElementById("game");
const startButton = document.querySelector('button#startGame');

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];
var colorsLenght = COLORS.length;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}
let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
let activeCards = 0;
let activeCardsUp = [0, null, null];
let matchCards = 0;
let clickCounter = 0;

// function to reset cards
function resetCards(){
  activeCardsUp[0] = 0;
  activeCardsUp[1] = null;
  activeCardsUp[2] = null;
}

// function to reset score
function resetScore(){
  const clickCounterSpan = document.querySelector('div#score span');
  clickCounterSpan.innerText = 0;
  clickCounter = 0;
}

// function to save score in localstore
function saveScore(gameScore){
  // check if saved local score with the current score game
  if(localStorage.getItem('lowestGameScore')){
    const localLowestScore = parseInt(localStorage.getItem('lowestGameScore'));
    if(gameScore < localLowestScore){
      localStorage.setItem('lowestGameScore', gameScore);
      let lowestScoreSpan = document.querySelector('div#lowestScore span');
      lowestScoreSpan.innerText = gameScore;
    }
  }else{
    localStorage.setItem('lowestGameScore', gameScore);
  }
}

// fuction to change cards to original bg
function notMatchCards(){
  let gameContainerCards = document.querySelectorAll('div#game div[data-status="active"]');
  for(let notMatchCards of gameContainerCards){
    notMatchCards.removeAttribute('data-status');
    const colorBg = notMatchCards.classList.item(0);
    notMatchCards.classList.remove(`${colorBg}-Up`);
  }
  resetCards();
}

// function to update score clicks
function clickCounterFunct(){
  clickCounter++;
  const clickCounterSpan = document.querySelector('div#score span');
  clickCounterSpan.innerText = clickCounter;
}

// fuction to finish and restart the game
function finishGame(){
  // save local score and delete cards
  saveScore(clickCounter);
  resetCards();
  resetScore();
  const gameCardsMatch = document.querySelectorAll('div#game div[data-status="match"]');
  for(let matchCards of gameCardsMatch){
    matchCards.remove();
  }

  // button to restart the game once it has ended
  const newGameButton = document.createElement('button');
  newGameButton.innerText = 'Start New Game...!';
  newGameButton.setAttribute('id', 'startGame');
  newGameButton.addEventListener('click', function(){
    createDivsForColors(shuffledColors);
    newGameButton.remove();
  });
  gameContainer.append(newGameButton);
}

function handleCardClick(event) {
  // Users should only be able to change at most two cards at a time.
  // Check if activeCardsUp is < 2
  if(activeCardsUp[0] < 2 && event.target.hasAttribute('data-status') == false){
    // if activeCards is < 2 can pick a new card and update cards active
    activeCardsUp[0] = activeCardsUp[0] + 1;
    // you can use event.target to see which element was clicked
    // const bgColorCard = event.target.getAttribute('class');
    const bgColorCard = event.target.classList[0];
    event.target.classList.toggle(`${bgColorCard}-Up`);
    event.target.setAttribute('data-status', 'active');
    // update array with the card color clicked
    activeCardsUp[activeCardsUp[0]] = bgColorCard;

    // update score clicks
    clickCounterFunct();

    // verify if two matching cards should be a “match”
    if(activeCardsUp[1] === activeCardsUp[2]){
      matchCards = matchCards + 2;
      if(matchCards == colorsLenght){
        // if all cards are selected and match finish the game
        setTimeout(finishGame, 1000);
      }
      let gameContainerCards = document.querySelectorAll('div#game div[data-status="active"]');
      for(let matchCard of gameContainerCards){
        matchCard.dataset.status = 'match';
      }
      resetCards();
    }else{
      if(activeCardsUp[0] == 2){
        setTimeout(notMatchCards, 1000);
      }
    }
  }
  console.log(matchCards);
}

// Further Study options
// button that when clicked will start the game
const resetButton = document.querySelector('#resetButtonDiv button');
resetButton.addEventListener('click', function(){
  resetCards();
  resetScore();
  const gameCardsDivs = document.querySelectorAll('div#game div');
  for(let resetCards of gameCardsDivs){
    resetCards.removeAttribute('data-status');
    const colorBg = resetCards.classList.item(0);
    resetCards.classList.remove(`${colorBg}-Up`);
  }
});


// when the DOM loads
document.addEventListener('DOMContentLoaded', function(){
  // check localstorage for lowest score
  if(localStorage.getItem('lowestGameScore')){
    let lowestScoreSpan = document.querySelector('div#lowestScore span');
    lowestScoreSpan.innerText = parseInt(localStorage.getItem('lowestGameScore'));
  }

  // start game button
  startButton.addEventListener('click', function(){
    createDivsForColors(shuffledColors);
    startButton.remove();
  });
});