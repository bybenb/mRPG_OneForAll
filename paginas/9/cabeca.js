document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const player1Score = document.getElementById('player1');
    const player2Score = document.getElementById('player2');
    const singleplayerBtn = document.getElementById('singleplayer');
    const multiplayerBtn = document.getElementById('multiplayer');

    // Configurações do jogo
    const PADDLE_WIDTH = 15;
    const PADDLE_HEIGHT = 100;
    const BALL_SIZE = 10;
    const PADDLE_SPEED = 8;
    const BALL_SPEED = 5;

    // Estado do jogo
    let gameMode = 'singleplayer';
    let player1Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    let player2Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = BALL_SPEED;
    let ballSpeedY = BALL_SPEED;
    let player1ScoreValue = 0;
    let player2ScoreValue = 0;
    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;
    let gameRunning = false;

    // Event Listeners
    singleplayerBtn.addEventListener('click', () => {
        gameMode = 'singleplayer';
        resetGame();
    });

    multiplayerBtn.addEventListener('click', () => {
        gameMode = 'multiplayer';
        resetGame();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') upPressed = true;
        if (e.key === 'ArrowDown') downPressed = true;
        if (e.key === 'w') wPressed = true;
        if (e.key === 's') sPressed = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp') upPressed = false;
        if (e.key === 'ArrowDown') downPressed = false;
        if (e.key === 'w') wPressed = false;
        if (e.key === 's') sPressed = false;
    });

    // Função para resetar o jogo
    function resetGame() {
        player1Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
        player2Y = canvas.height / 2 - PADDLE_HEIGHT / 2;
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        gameRunning = true;
        requestAnimationFrame(gameLoop);
    }

    // IA simples
    function aiMovement() {
        const paddleCenter = player2Y + PADDLE_HEIGHT / 2;
        if (paddleCenter < ballY - 20) {
            player2Y += PADDLE_SPEED - 5; // IA um pouco mais lenta
        } else if (paddleCenter > ballY + 20) {
            player2Y -= PADDLE_SPEED - 5;
        }
    }

    // Lógica do jogo
    function update() {
        // Movimento do jogador 1 (W/S ou setas)
        if (gameMode === 'multiplayer') {
            if (wPressed && player1Y > 0) player1Y -= PADDLE_SPEED;
            if (sPressed && player1Y < canvas.height - PADDLE_HEIGHT) player1Y += PADDLE_SPEED;
        } else {
            if (upPressed && player1Y > 0) player1Y -= PADDLE_SPEED;
            if (downPressed && player1Y < canvas.height - PADDLE_HEIGHT) player1Y += PADDLE_SPEED;
        }

        // Movimento do jogador 2 (IA ou segundo jogador)
        if (gameMode === 'singleplayer') {
            aiMovement();
        } else {
            if (upPressed && player2Y > 0) player2Y -= PADDLE_SPEED;
            if (downPressed && player2Y < canvas.height - PADDLE_HEIGHT) player2Y += PADDLE_SPEED;
        }

        // Movimento da bola
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Colisão com as paredes (topo e base)
        if (ballY <= 0 || ballY >= canvas.height - BALL_SIZE) {
            ballSpeedY = -ballSpeedY;
        }

        // Colisão com as raquetes
        // Raquete do jogador 1 (esquerda)
        if (
            ballX <= PADDLE_WIDTH &&
            ballY + BALL_SIZE >= player1Y &&
            ballY <= player1Y + PADDLE_HEIGHT
        ) {
            ballSpeedX = -ballSpeedX * 1.015; // Aumenta a velocidade após rebater
            // Efeito de ângulo baseado na posição de contato
            const hitPosition = (ballY - (player1Y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
            ballSpeedY = hitPosition * BALL_SPEED;
        }

        // Raquete do jogador 2 (direita)
        if (
            ballX >= canvas.width - PADDLE_WIDTH - BALL_SIZE &&
            ballY + BALL_SIZE >= player2Y &&
            ballY <= player2Y + PADDLE_HEIGHT
        ) {
            ballSpeedX = -ballSpeedX * 1.05;
            const hitPosition = (ballY - (player2Y + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
            ballSpeedY = hitPosition * BALL_SPEED;
        }

        // Pontuação
        if (ballX < 0) {
            player2ScoreValue++;
            player2Score.textContent = player2ScoreValue;
            resetBall();
        } else if (ballX > canvas.width) {
            player1ScoreValue++;
            player1Score.textContent = player1ScoreValue;
            resetBall();
        }
    }

    // Resetar a bola após um ponto
    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
        ballSpeedY = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    }

    // Renderização
    function draw() {
        // Limpar o canvas
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Linha central
        ctx.strokeStyle = '#444';
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Raquete do jogador 1 (esquerda)
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(0, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Raquete do jogador 2 (direita)
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(canvas.width - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

        // Bola
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ballX, ballY, BALL_SIZE, 0, Math.PI * 2);
        ctx.fill();
    }

    // Loop principal do jogo
    function gameLoop() {
        if (gameRunning) {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    // Iniciar o jogo
    resetGame();
});