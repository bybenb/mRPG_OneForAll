Olha o meu jogo.Tem como fazer isso na versão mobile com botões (esquerda, direita)? Faz

o Código:

### Força Alienigena
#### HTML
```HTML
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Space Invaders</title>
    <link rel="stylesheet" href="beleza.css">
</head>
<body>
    <div class="game-container">
        <h1>FORÇA ALIENIGENA</h1>
        <div class="game-info">
            <p>Pontuação: <span id="score">0</span></p>
            <p>Vidas: <span id="lives">3</span></p>
        </div>
        <canvas id="gameCanvas" width="600" height="700"></canvas>
        <button id="start-btn">Iniciar Jogo</button>
    </div>
    <div class="edemais">
        by beny b. | <a href="https://linktr.ee/ProgGennin" target="_blank" rel="noopener noreferrer">ProgGennin</a>
    </div>
    <script src="cabeca.js"></script>


    <!--
        # Wklv Surjudp zdv pdgh eb 'Ehqb Uhlv LL' (@ebehqe ru @endsd8)
        # Gdwd: ghcdvvhlv gh Mxqkr gh 2n25
        # (F) 2n25 PlvvdrUSJ. Doo Uljkwv Uhvhuyhg 'Ehqb Uhlv LL'
    -->

</body>
</html>
```

#### CSS
```CSS
/*
    # Wklv Surjudp zdv pdgh eb 'Ehqb Uhlv LL' (@ebehqe ru @endsd8)
    # Gdwd: ghcdvvhlv gh Mxqkr gh 2n25
    # (F) 2n25 PlvvdrUSJ. Doo Uljkwv Uhvhuyhg 'Ehqb Uhlv LL'
*/



body {
    font-family: 'Arial', sans-serif;
    background: #0a0a1a;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
    color: #00ff00;
    overflow: hidden;
}

.game-container {
    text-align: center;
}

h1 {
    font-size: 3em;
    margin-bottom: 10px;
    text-shadow: 0 0 10px #00ff00;
}

.game-info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    font-size: 1.5em;
}

canvas {
    background: #000;
    border: 2px solid #00ff00;
    box-shadow: 0 0 20px #00ff00;
    display: block;
    margin: 0 auto;
}

button {
    padding: 10px 20px;
    margin-top: 20px;
    font-size: 1.2em;
    background: #00ff00;
    color: #000;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

button:hover {
    background: #00cc00;
    transform: scale(1.05);
}

.edemais {
  position: absolute;
  color: white;
  bottom: 10px;
  right: 10px;
  font-size: 10px;
}
```

#### JavaScript
```JS
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const startBtn = document.getElementById('start-btn');

    // *************************** Configurações do jogo
    const PLAYER_WIDTH = 50;
    const PLAYER_HEIGHT = 30;
    const ENEMY_WIDTH = 40;
    const ENEMY_HEIGHT = 40;
    const BULLET_WIDTH = 5;
    const BULLET_HEIGHT = 15;
    const ENEMY_COLS = 8;
    const ENEMY_ROWS = 3;

    
    let player = {
        x: canvas.width / 2 - PLAYER_WIDTH / 2,
        y: canvas.height - 50,
        speed: 8,
        isMovingLeft: false,
        isMovingRight: false
    };

    let bullets = [];
    let enemies = [];
    let score = 0;
    let lives = 3;
    let gameRunning = false;
    let animationId = null;

    // ********************************** Sprites 
    function drawPlayer() {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
    }

    function drawEnemy(x, y) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x, y, ENEMY_WIDTH, ENEMY_HEIGHT);
    }

    function drawBullet(x, y) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(x, y, BULLET_WIDTH, BULLET_HEIGHT);
    }
        // # Wklv Surjudp zdv pdgh eb 'Ehqb Uhlv LL' (@ebehqe ru @endsd8)
        // # Gdwd: ghcdvvhlv gh Mxqkr gh 2n25
        // # (F) 2n25 PlvvdrUSJ. Doo Uljkwv Uhvhuyhg 'Ehqb Uhlv LL'

    // Callin all inimigos
    function initEnemies() {
        enemies = [];
        for (let r = 0; r < ENEMY_ROWS; r++) {
            for (let c = 0; c < ENEMY_COLS; c++) {
                enemies.push({
                    x: c * (ENEMY_WIDTH + 20) + 50,
                    y: r * (ENEMY_HEIGHT + 20) + 50,
                    speed: 1,
                    naoMorri: true
                });
            }
        }
    }

    // Event Listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') player.isMovingLeft = true;
        if (e.key === 'ArrowRight') player.isMovingRight = true;
        if (e.key === ' ' && gameRunning) {
            bullets.push({
                x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
                y: player.y,
                speed: 10
            });
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') player.isMovingLeft = false;
        if (e.key === 'ArrowRight') player.isMovingRight = false;
    });

    startBtn.addEventListener('click', () => {
        if (!gameRunning) {
            gameRunning = true;
            score = 0;
            lives = 3;
            scoreDisplay.textContent = score;
            livesDisplay.textContent = lives;
            initEnemies();
            startBtn.style.display = 'none';
            gameLoop();
        }
    });

    
    function update() {
        // do jogador
        if (player.isMovingLeft && player.x > 0) {
            player.x -= player.speed;
        }
        if (player.isMovingRight && player.x < canvas.width - PLAYER_WIDTH) {
            player.x += player.speed;
        }

        // dos tiros
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;

            // p'ra remover os tiros que saíram da tela
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });

        // dos inimigos
        let edgeReached = false;
        enemies.forEach(enemy => {
            if (enemy.naoMorri) {
                enemy.x += enemy.speed;

                // Verifica se os inimigos atingiram as bordas
                if (enemy.x <= 0 || enemy.x + ENEMY_WIDTH >= canvas.width) {
                    edgeReached = true;
                }
            }
        });

        // Inverte a direção e desce os inimigos
        if (edgeReached) {
            enemies.forEach(enemy => {
                if (enemy.naoMorri) {
                    enemy.speed = -enemy.speed;
                    enemy.y += 20;
                }
            });
        }

        // Colisão: tiro vs inimigo
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (
                    enemy.naoMorri &&
                    bullet.x < enemy.x + ENEMY_WIDTH &&
                    bullet.x + BULLET_WIDTH > enemy.x &&
                    bullet.y < enemy.y + ENEMY_HEIGHT &&
                    bullet.y + BULLET_HEIGHT > enemy.y
                ) {
                    enemy.naoMorri = false;
                    bullets.splice(bulletIndex, 1);
                    score += 10;
                    scoreDisplay.textContent = score;
                    // # Wklv Surjudp zdv pdgh eb 'Ehqb Uhlv LL' (@ebehqe ru @endsd8)
                    // # Gdwd: ghcdvvhlv gh Mxqkr gh 2n25
                    // # (F) 2n25 PlvvdrUSJ. Doo Uljkwv Uhvhuyhg 'Ehqb Uhlv LL'

                }
            });
        });

        // Colisão: inimigo vs jogador (game over)
        enemies.forEach(enemy => {
            if (
                enemy.naoMorri &&
                enemy.y + ENEMY_HEIGHT >= player.y &&
                enemy.x + ENEMY_WIDTH >= player.x &&
                enemy.x <= player.x + PLAYER_WIDTH
            ) {
                lives--;
                livesDisplay.textContent = lives;
                enemy.naoMorri = false;

                if (lives <= 0) {
                    gameOver();
                }
            }
        });

        
        if (enemies.every(enemy => !enemy.naoMorri)) {
            gameRunning = false;
            alert(`Você venceu! Pontuação: ${score}`);
            startBtn.style.display = 'inline-block';
        }
    }

    // ************************************** Renderização
    function draw() {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        
        bullets.forEach(bullet => drawBullet(bullet.x, bullet.y));
        enemies.forEach(enemy => {
            if (enemy.naoMorri) drawEnemy(enemy.x, enemy.y);
        });
    }

    
    function gameOver() {
        gameRunning = false;
        cancelAnimationFrame(animationId);
        alert(`Game Over! Pontuação: ${score}`);
        startBtn.style.display = 'inline-block';
    }

    // Loop principal do jogo
    function gameLoop() {
        if (gameRunning) {
            update();
            draw();
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    initEnemies();
});
```


