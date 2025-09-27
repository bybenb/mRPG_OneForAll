document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const actionsDiv = document.getElementById('actions');
  const battleLog = document.getElementById('battle-log');
  const attackButtons = document.querySelectorAll('.attack-btn');

  const player = {
    name: document.getElementById('player-name'),
    healthBar: document.getElementById('player-health'),
    hpText: document.getElementById('player-hp-text')
  };

  const enemy = {
    name: document.getElementById('enemy-name'),
    healthBar: document.getElementById('enemy-health'),
    hpText: document.getElementById('enemy-hp-text')
  };

  let playerPokemon, enemyPokemon;
  let isPlayerTurn = true;
  let gameActive = false;

  const defaultAttacks = [
    { name: "Investida", type: "normal", power: 40, accuracy: 100 },
    { name: "Brasa", type: "fire", power: 60, accuracy: 100 },
    { name: "Jato d'Água", type: "water", power: 60, accuracy: 100 },
    { name: "Chicote de Cipó", type: "grass", power: 55, accuracy: 95 }
  ];

  function initBattle() {
    playerPokemon = {
      name: "Charizard",
      maxHp: 150,
      currentHp: 150,
      attacks: [...defaultAttacks]
    };

    enemyPokemon = {
      name: "Blastoise",
      maxHp: 170,
      currentHp: 170,
      attacks: [
        { name: "Investida", type: "normal", power: 40, accuracy: 100 },
        { name: "Jato d'Água", type: "water", power: 60, accuracy: 100 },
        { name: "Casco Força", type: "water", power: 75, accuracy: 90 }
      ]
    };

    player.name.textContent = playerPokemon.name;
    enemy.name.textContent = enemyPokemon.name;

    updateHealthBars();
    actionsDiv.style.display = 'none';
    startBtn.textContent = "Começar Batalha";
    startBtn.style.display = 'block';
    battleLog.innerHTML = "<p>Uma batalha começou!</p>";
    gameActive = false;
  }

  function startBattle() {
    playerPokemon.currentHp = playerPokemon.maxHp;
    enemyPokemon.currentHp = enemyPokemon.maxHp;
    gameActive = true;
    isPlayerTurn = true;
    updateHealthBars();
    startBtn.style.display = 'none';
    actionsDiv.style.display = 'grid';
    addToBattleLog(`Um ${enemyPokemon.name} selvagem apareceu!`);
  }

  function updateHealthBars() {
    const playerHpPercent = (playerPokemon.currentHp / playerPokemon.maxHp) * 100;
    const enemyHpPercent = (enemyPokemon.currentHp / enemyPokemon.maxHp) * 100;

    player.healthBar.style.width = `${playerHpPercent}%`;
    enemy.healthBar.style.width = `${enemyHpPercent}%`;

    player.hpText.textContent = `HP: ${playerPokemon.currentHp}/${playerPokemon.maxHp}`;
    enemy.hpText.textContent = `HP: ${enemyPokemon.currentHp}/${enemyPokemon.maxHp}`;

    player.healthBar.style.backgroundColor = playerHpPercent < 30 ? '#e74c3c' :
                                             playerHpPercent < 50 ? '#f39c12' : '#2ecc71';

    enemy.healthBar.style.backgroundColor = enemyHpPercent < 30 ? '#e74c3c' :
                                            enemyHpPercent < 50 ? '#f39c12' : '#2ecc71';
  }

  function addToBattleLog(message) {
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    battleLog.appendChild(logEntry);
    battleLog.scrollTop = battleLog.scrollHeight;
  }

  function toggleButtons(disable) {
    attackButtons.forEach(btn => btn.disabled = disable);
  }

  function playerAttack(moveIndex) {
    if (!gameActive || !isPlayerTurn) return;

    toggleButtons(true);
    const move = playerPokemon.attacks[moveIndex];
    const doesHit = Math.random() * 100 <= move.accuracy;

    if (doesHit) {
      const damage = Math.floor(move.power * (0.85 + Math.random() * 0.15));
      enemyPokemon.currentHp = Math.max(0, enemyPokemon.currentHp - damage);
      addToBattleLog(`${playerPokemon.name} usou ${move.name} e causou ${damage} de dano!`);

      if (enemyPokemon.currentHp <= 0) {
        enemyPokemon.currentHp = 0;
        updateHealthBars();
        addToBattleLog(`O ${enemyPokemon.name} inimigo foi derrotado!`);
        endBattle(true);
        return;
      }
    } else {
      addToBattleLog(`${playerPokemon.name} usou ${move.name}, mas errou!`);
    }

    updateHealthBars();
    isPlayerTurn = false;

    if (gameActive) {
      setTimeout(enemyTurn, 1500);
    }
  }

  function enemyTurn() {
    if (!gameActive || isPlayerTurn) return;

    const moveIndex = Math.floor(Math.random() * enemyPokemon.attacks.length);
    const move = enemyPokemon.attacks[moveIndex];
    const doesHit = Math.random() * 100 <= move.accuracy;

    if (doesHit) {
      const damage = Math.floor(move.power * (0.85 + Math.random() * 0.15));
      playerPokemon.currentHp = Math.max(0, playerPokemon.currentHp - damage);
      addToBattleLog(`O ${enemyPokemon.name} inimigo usou ${move.name} e causou ${damage} de dano!`);

      if (playerPokemon.currentHp <= 0) {
        playerPokemon.currentHp = 0;
        updateHealthBars();
        addToBattleLog(`Seu ${playerPokemon.name} foi derrotado!`);
        endBattle(false);
        return;
      }
    } else {
      addToBattleLog(`O ${enemyPokemon.name} inimigo usou ${move.name}, mas errou!`);
    }

    updateHealthBars();
    isPlayerTurn = true;
    toggleButtons(false);
  }

  function endBattle(playerWon) {
    gameActive = false;
    actionsDiv.style.display = 'none';
    startBtn.style.display = 'block';
    startBtn.textContent = playerWon ? "Batalhar Novamente" : "Tentar Novamente";
    toggleButtons(false);

    addToBattleLog(playerWon ? "Você venceu a batalha!" : "Você perdeu a batalha!");
  }

  // Eventos
  startBtn.addEventListener('click', () => {
    initBattle();
    startBattle();
  });

  attackButtons.forEach((button, index) => {
    button.addEventListener('click', () => playerAttack(index));
  });

  // Inicialização
  initBattle();
});
