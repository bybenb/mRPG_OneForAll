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