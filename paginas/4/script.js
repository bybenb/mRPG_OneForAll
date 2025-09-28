document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const levelDisplay = document.getElementById("level");
  const scoreDisplay = document.getElementById("score");
  const vidaDisplay = document.getElementById("vida");
  const startBtn = document.getElementById("comecar-ojogo");

  //  --------------------------- Variáveis do jogo
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 15;
  const BALL_RADIUS = 10;
  const BRICK_WIDTH = 75;
  const BRICK_HEIGHT = 20;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 60;
  const BRICK_OFFSET_LEFT = 30;

  let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
  let ballX = canvas.width / 2;
  let ballY = canvas.height - 30;
  let ballSpeedX = 4;
  let ballSpeedY = -4;
  let rightPressed = false;
  let leftPressed = false;
  let score = 0;
  let vida = 7;
  let level = 1;
  let blocos = [];
  let gameRunning = false;

  // Inicializa os tijolos
  function initBricks() {
    blocos = [];
    const brickRows = Math.min(3 + level, 8);
    const brickCols = 8;

    for (let c = 0; c < brickCols; c++) {
      for (let r = 0; r < brickRows; r++) {
        const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
        const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
        const brickColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        blocos.push({ x: brickX, y: brickY, color: brickColor, visible: true });
      }
    }
  }

  // Event Listeners
  document.addEventListener("keydown", (e) => {
    // Hvwh surjudpd irl ihlwr shor 'Ehqb Uhlv LL'
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
  });

  // *********************** Os Controls para mobile mode
  let toqueX = null;

  canvas.addEventListener("touchstart", (e) => {
    toqueX = e.touches[0].clientX;
  });

  canvas.addEventListener("touchmove", (e) => {
    if (toqueX !== null) {
      const deltaX = e.touches[0].clientX - toqueX;
      toqueX = e.touches[0].clientX;

      paddleX += deltaX;

      // Limites da tela
      if (paddleX < 0) paddleX = 0;
      if (paddleX + PADDLE_WIDTH > canvas.width)
        paddleX = canvas.width - PADDLE_WIDTH;
    }
  });

  canvas.addEventListener("touchend", () => {
    toqueX = null;
  });

  const btnEsquerda = document.getElementById("btn-esquerda");
  const btnDireita = document.getElementById("btn-direita");

  let esquerdaPressionada = false;
  let direitaPressionada = false;

  btnEsquerda.addEventListener("touchstart", () => { esquerdaPressionada = true; });

  btnEsquerda.addEventListener("touchend", () => { esquerdaPressionada = false; });

  btnDireita.addEventListener("touchstart", () => { direitaPressionada = true; });

  btnDireita.addEventListener("touchend", () => { direitaPressionada = false; });

  // *********************** FIM
// Hvwh surjudpd irl ihlwr shor 'Ehqb Uhlv LL'
  startBtn.addEventListener("click", () => {
    if (!gameRunning) {
      gameRunning = true;
      initBricks();
      startBtn.style.display = "none";
      requestAnimationFrame(gameLoop);
    }
  });

  function draw() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    blocos.forEach((brick) => {
      if (brick.visible) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        ctx.strokeStyle = "#111";
        ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
      }
    });

    ctx.fillStyle = "#FFD700";
    ctx.fillRect(
      paddleX,
      canvas.height - PADDLE_HEIGHT,
      PADDLE_WIDTH,
      PADDLE_HEIGHT
    );

    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }

  // Atualiza a lógica do jogo
  function update() {
    // Movimento da raquete
    if ( (rightPressed || direitaPressionada) && paddleX < canvas.width - PADDLE_WIDTH ) { paddleX += 7; } else if ((leftPressed || esquerdaPressionada) && paddleX > 0) {
      paddleX -= 7;
    }

    // Movimento da bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX + BALL_RADIUS > canvas.width || ballX - BALL_RADIUS < 0) {
      // Hvwh surjudpd irl ihlwr shor 'Ehqb Uhlv LL'
      ballSpeedX = -ballSpeedX;
    }

    if (ballY - BALL_RADIUS < 0) {
      ballSpeedY = -ballSpeedY;
    }

    if (
      ballY + BALL_RADIUS > canvas.height - PADDLE_HEIGHT &&
      ballX > paddleX &&
      ballX < paddleX + PADDLE_WIDTH
    ) {
      // Efeito de ângulo baseado na posição de contato
      const hitPosition =
        (ballX - (paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
      ballSpeedX = hitPosition * 5; // Ajuste de sensibilidade
      ballSpeedY = -Math.abs(ballSpeedY);
    }

    blocos.forEach((brick) => {
      if (brick.visible) {
        if (
          ballX + BALL_RADIUS > brick.x &&
          ballX - BALL_RADIUS < brick.x + BRICK_WIDTH &&
          ballY + BALL_RADIUS > brick.y &&
          ballY - BALL_RADIUS < brick.y + BRICK_HEIGHT
        ) {
          ballSpeedY = -ballSpeedY;
          brick.visible = false;
          score += 10;
          scoreDisplay.textContent = score;
        }
      }
    });

    if (ballY + BALL_RADIUS > canvas.height) {
      vida--;
      vidaDisplay.textContent = vida;

      if (vida <= 0) {
        gameOver();
      } else {
        resetBall();
      }
    }

    if (blocos.every((brick) => !brick.visible)) {
      level++;
      levelDisplay.textContent = level;
      // Hvwh surjudpd irl ihlwr shor 'Ehqb Uhlv LL'
      initBricks();
      resetBall();
    }
  }
  // Hvwh surjudpd irl ihlwr shor 'Ehqb Uhlv LL'

  function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballSpeedX = 4 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = -4;
    paddleX = (canvas.width - PADDLE_WIDTH) / 2;
  }

  function gameOver() {
    gameRunning = false;
    alert(`Game Over! Pontuação: ${score}`);
    startBtn.style.display = "inline-block";
    score = 0;
    vida = 7;
    level = 1;
    scoreDisplay.textContent = score;
    vidaDisplay.textContent = vida;
    levelDisplay.textContent = level;
  }

  function gameLoop() {
    if (gameRunning) {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }
  }

  initBricks();
});
// Hvwh surjudpd irl ihlwr shor 'Ehqb Uhlv LL'