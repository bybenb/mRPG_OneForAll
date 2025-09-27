O que há de errado com esse programa?:


#### index.html
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Beny's Game | Missão RPG 8</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="game-container">
        <h1>PokeFight</h1>
        
        <div class="battle-scene">
            <!-- Inimigo -->
            <div class="enemy" id="enemy">
                <div class="pokemon-sprite"></div>
                <div class="health-bar">
                    <div class="health" id="enemy-health"></div>
                </div>
                <div class="pokemon-name" id="enemy-name">Inimigo</div>
                <div class="hp-text" id="enemy-hp-text">HP: 100/100</div>
            </div>
            
            <!-- Jogador -->
            <div class="player" id="player">
                <div class="pokemon-sprite"></div>
                <div class="health-bar">
                    <div class="health" id="player-health"></div>
                </div>
                <div class="pokemon-name" id="player-name">Jogador</div>
                <div class="hp-text" id="player-hp-text">HP: 100/100</div>
            </div>
        </div>
        
        <div class="battle-log" id="battle-log">
            <p>Uma batalha começou!</p>
        </div>
        
        <div class="actions" id="actions">
            <button class="attack-btn" data-move="tackle">Investida</button>
            <button class="attack-btn" data-move="ember">Brasa</button>
            <button class="attack-btn" data-move="water-gun">Jato d'Água</button>
            <button class="attack-btn" data-move="vine-whip">Chicote de Cipó</button>
        </div>
        
        <button id="start-btn">Começar Batalha</button>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
```


#### style.css
```css
body {
    font-family: 'Arial', sans-serif;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    color: #333;
}

.game-container {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 90%;
    max-width: 600px;
    text-align: center;
}

h1 {
    color: #e74c3c;
    margin-bottom: 20px;
}

.battle-scene {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    position: relative;
    height: 300px;
}

.enemy, .player {
    position: absolute;
    width: 100%;
    padding: 15px;
    border-radius: 8px;
    background-color: #f8f8f8;
}

.enemy {
    top: 0;
    left: 0;
    text-align: left;
}

.player {
    bottom: 0;
    right: 0;
    text-align: right;
}

.pokemon-sprite {
    width: 100px;
    height: 100px;
    background-color: #ddd;
    border-radius: 50%;
    margin: 10px auto;
}

.health-bar {
    width: 100%;
    height: 20px;
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin: 5px 0;
}

.health {
    height: 100%;
    background-color: #2ecc71;
    width: 100%;
    transition: width 0.3s;
}

.pokemon-name {
    font-weight: bold;
    font-size: 1.2em;
    margin: 5px 0;
}

.hp-text {
    font-size: 0.9em;
    color: #666;
}

.battle-log {
    height: 100px;
    overflow-y: auto;
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 15px;
    text-align: left;
}

.actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 15px;
}

button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    background-color: #3498db;
    color: white;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
}

button:hover {
    background-color: #2980b9;
}

button:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
}

.attack-btn {
    background-color: #e74c3c;
}

.attack-btn:hover {
    background-color: #c0392b;
}

#start-btn {
    background-color: #2ecc71;
    width: 100%;
}

#start-btn:hover {
    background-color: #27ae60;
}
```


####  script.js
```js
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const startBtn = document.getElementById('start-btn');
    const actionsDiv = document.getElementById('actions');
    const battleLog = document.getElementById('battle-log');
    const attackButtons = document.querySelectorAll('.attack-btn');
    
    // Elementos dos personagens
    const player = {
        element: document.getElementById('player'),
        name: document.getElementById('player-name'),
        healthBar: document.getElementById('player-health'),
        hpText: document.getElementById('player-hp-text')
    };
    
    const enemy = {
        element: document.getElementById('enemy'),
        name: document.getElementById('enemy-name'),
        healthBar: document.getElementById('enemy-health'),
        hpText: document.getElementById('enemy-hp-text')
    };
    
    // Dados dos personagens
    let playerPokemon = {
        name: "Charizard",
        maxHp: 150,
        currentHp: 150,
        attacks: [
            { name: "Investida", type: "normal", power: 40, accuracy: 100 },
            { name: "Brasa", type: "fire", power: 60, accuracy: 100 },
            { name: "Garra de Dragão", type: "dragon", power: 80, accuracy: 85 }
        ]
    };
    
    let enemyPokemon = {
        name: "Blastoise",
        maxHp: 170,
        currentHp: 170,
        attacks: [
            { name: "Investida", type: "normal", power: 40, accuracy: 100 },
            { name: "Jato d'Água", type: "water", power: 60, accuracy: 100 },
            { name: "Casco Força", type: "water", power: 75, accuracy: 90 }
        ]
    };
    
    // Variáveis de jogo
    let isPlayerTurn = true;
    let gameActive = false;
    
    // Inicializa a batalha
    function initBattle() {
        // Atualiza os nomes
        player.name.textContent = playerPokemon.name;
        enemy.name.textContent = enemyPokemon.name;
        
        // Atualiza as barras de HP
        updateHealthBars();
        
        // Esconde os botões de ação inicialmente
        actionsDiv.style.display = 'none';
        
        // Configura o botão de início
        startBtn.textContent = "Começar Batalha";
        startBtn.style.display = 'block';
        
        // Limpa o log de batalha
        battleLog.innerHTML = "<p>Uma batalha começou!</p>";
        
        gameActive = false;
    }
    
    // Começa a batalha
    function startBattle() {
        gameActive = true;
        isPlayerTurn = true;
        startBtn.style.display = 'none';
        actionsDiv.style.display = 'grid';
        addToBattleLog(`Um ${enemyPokemon.name} selvagem apareceu!`);
    }
    
    // Atualiza as barras de saúde
    function updateHealthBars() {
        // Jogador
        const playerHpPercent = (playerPokemon.currentHp / playerPokemon.maxHp) * 100;
        player.healthBar.style.width = `${playerHpPercent}%`;
        player.hpText.textContent = `HP: ${playerPokemon.currentHp}/${playerPokemon.maxHp}`;
        
        // Inimigo
        const enemyHpPercent = (enemyPokemon.currentHp / enemyPokemon.maxHp) * 100;
        enemy.healthBar.style.width = `${enemyHpPercent}%`;
        enemy.hpText.textContent = `HP: ${enemyPokemon.currentHp}/${enemyPokemon.maxHp}`;
        
        // Muda a cor conforme a saúde diminui
        if (playerHpPercent < 30) player.healthBar.style.backgroundColor = '#e74c3c';
        else if (playerHpPercent < 50) player.healthBar.style.backgroundColor = '#f39c12';
        else player.healthBar.style.backgroundColor = '#2ecc71';
        
        if (enemyHpPercent < 30) enemy.healthBar.style.backgroundColor = '#e74c3c';
        else if (enemyHpPercent < 50) enemy.healthBar.style.backgroundColor = '#f39c12';
        else enemy.healthBar.style.backgroundColor = '#2ecc71';
    }
    
    // Adiciona mensagem ao log de batalha
    function addToBattleLog(message) {
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        battleLog.appendChild(logEntry);
        battleLog.scrollTop = battleLog.scrollHeight;
    }
    
    // Ataque do jogador
    function playerAttack(moveIndex) {
        if (!gameActive || !isPlayerTurn) return;
        
        const move = playerPokemon.attacks[moveIndex];
        
        // Verifica acerto
        const doesHit = Math.random() * 100 <= move.accuracy;
        
        if (doesHit) {
            // Calcula dano com variação de 85% a 100%
            const damage = Math.floor(move.power * (0.85 + Math.random() * 0.15));
            enemyPokemon.currentHp = Math.max(0, enemyPokemon.currentHp - damage);
            
            addToBattleLog(`${playerPokemon.name} usou ${move.name} e causou ${damage} de dano!`);
            
            // Verifica se o inimigo foi derrotado
            if (enemyPokemon.currentHp <= 0) {
                enemyPokemon.currentHp = 0;
                addToBattleLog(`O ${enemyPokemon.name} inimigo foi derrotado!`);
                endBattle(true);
            }
        } else {
            addToBattleLog(`${playerPokemon.name} usou ${move.name}, mas errou!`);
        }
        
        updateHealthBars();
        isPlayerTurn = false;
        
        // Turno do inimigo após um pequeno delay
        if (gameActive) {
            setTimeout(enemyTurn, 1500);
        }
    }
    
    // Turno do inimigo
    function enemyTurn() {
        if (!gameActive || isPlayerTurn) return;
        
        // Escolhe um ataque aleatório
        const moveIndex = Math.floor(Math.random() * enemyPokemon.attacks.length);
        const move = enemyPokemon.attacks[moveIndex];
        
        // Verifica acerto
        const doesHit = Math.random() * 100 <= move.accuracy;
        
        if (doesHit) {
            // Calcula dano com variação de 85% a 100%
            const damage = Math.floor(move.power * (0.85 + Math.random() * 0.15));
            playerPokemon.currentHp = Math.max(0, playerPokemon.currentHp - damage);
            
            addToBattleLog(`O ${enemyPokemon.name} inimigo usou ${move.name} e causou ${damage} de dano!`);
            
            // Verifica se o jogador foi derrotado
            if (playerPokemon.currentHp <= 0) {
                playerPokemon.currentHp = 0;
                addToBattleLog(`Seu ${playerPokemon.name} foi derrotado!`);
                endBattle(false);
            }
        } else {
            addToBattleLog(`O ${enemyPokemon.name} inimigo usou ${move.name}, mas errou!`);
        }
        
        updateHealthBars();
        isPlayerTurn = true;
    }
    
    // Finaliza a batalha
    function endBattle(playerWon) {
        gameActive = false;
        actionsDiv.style.display = 'none';
        startBtn.style.display = 'block';
        startBtn.textContent = playerWon ? "Batalhar Novamente" : "Tentar Novamente";
        
        if (playerWon) {
            addToBattleLog("Você venceu a batalha!");
        } else {
            addToBattleLog("Você perdeu a batalha!");
        }
    }
    
    // Event Listeners
    startBtn.addEventListener('click', startBattle);
    
    attackButtons.forEach((button, index) => {
        button.addEventListener('click', () => playerAttack(index));
    });
    
    // Inicializa o jogo
    initBattle();
});
```


