
const board = document.getElementById('board');
const bestTimeDisplay = document.getElementById('best-time');
let cards = [];
let flippedCards = [];
let matchedCards = 0;
let startTime = null;
let gameDuration = null;


const cartas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// Função para embaralhar as cartas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Função para criar as cartas
function gerarCartas() {
  shuffledCards = shuffle([...cartas]);
  board.innerHTML = '';

  shuffledCards.forEach((value, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-index', index);
    card.setAttribute('data-value', value);
    card.textContent = '';
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
  });
}

// Função de clique nas cartas
function handleCardClick(event) {
  const clickedCard = event.target;
  if (flippedCards.length === 2 || clickedCard.classList.contains('flipped')) return;
  
  clickedCard.textContent = clickedCard.getAttribute('data-value');
  clickedCard.classList.add('flipped');
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    verificaIgualdade();
  }
}

// Verificar se as cartas formam um par
function verificaIgualdade() {
  const [card1, card2] = flippedCards;
  if (card1.getAttribute('data-value') === card2.getAttribute('data-value')) {
    matchedCards += 2;
    flippedCards = [];
    if (matchedCards === cards.length) {
      finishGame();
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '';
      card2.textContent = '';
      flippedCards = [];
    }, 1000);
  }
}


function finishGame() {
  gameDuration = Math.floor((Date.now() - startTime) / 1000);
  alert(`Você terminou o jogo em ${gameDuration}s!`);
  updateBestTime(gameDuration);
}


function updateBestTime(currentTime) {
  let bestTime = localStorage.getItem('best-time');
  if (!bestTime || currentTime < bestTime) {
    localStorage.setItem('best-time', currentTime);
    bestTime = currentTime;
  }
  bestTimeDisplay.textContent = `${bestTime}s`;
}


function startGame() {
  cards = document.querySelectorAll('.card');
  flippedCards = [];
  matchedCards = 0;
  startTime = Date.now();
  gerarCartas();
  updateBestTime(localStorage.getItem('best-time') || 0);
}


window.onload = startGame;
