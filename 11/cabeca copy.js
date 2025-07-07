document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const startBtn = document.getElementById("start-btn");

  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const shootBtn = document.getElementById("shoot-btn");

  let isMobile = false;
  let scale = 1; // Escala do jogo, começa como 1

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
    isMovingRight: false,
  };

  let bullets = [];
  let enemies = [];
  let score = 0;
  let lives = 3;
  let gameRunning = false;
  let animationId = null;

  // ********************************** Função para redimensionar o canvas e ajustar escala
  function resizeCanvas() {
    const ratio = 600 / 700; // Largura / altura base
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let canvasWidth = Math.min(windowWidth, 600);
    let canvasHeight = canvasWidth / ratio;

    if (canvasHeight > windowHeight * 0.7) {
      canvasHeight = windowHeight * 0.7;
      canvasWidth = canvasHeight * ratio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Calcular a escala
    scale = canvas.width / 600; // A escala do jogo será a razão entre o novo tamanho e o tamanho original do canvas
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // Chama para ajustar na carga inicial

  // ********************************** Sprites com Escala
  function drawPlayer() {
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x * scale, player.y * scale, PLAYER_WIDTH * scale, PLAYER_HEIGHT * scale);
  }

  function drawEnemy(x, y) {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(x * scale, y * scale, ENEMY_WIDTH * scale, ENEMY_HEIGHT * scale);
  }

  function drawBullet(x, y) {
    ctx.fillStyle = "#ffff00";
    ctx.fillRect(x * scale, y * scale, BULLET_WIDTH * scale, BULLET_HEIGHT * scale);
  }

  function initEnemies() {
    enemies = [];
    for (let r = 0; r < ENEMY_ROWS; r++) {
      for (let c = 0; c < ENEMY_COLS; c++) {
        enemies.push({
          x: c * (ENEMY_WIDTH + 20) + 50,
          y: r * (ENEMY_HEIGHT + 20) + 50,
          speed: 1, // Velocidade original dos inimigos
          naoMorri: true,
        });
      }
    }
  }

  function checkIfMobile() {
    isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      document.querySelector(".mobile-controls").style.display = "flex";
    }
  }

  // Event Listeners
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.isMovingLeft = true;
    if (e.key === "ArrowRight") player.isMovingRight = true;
    if (e.key === " " && gameRunning) {
      bullets.push({
        x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: player.y,
        speed: 10,
      });
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") player.isMovingLeft = false;
    if (e.key === "ArrowRight") player.isMovingRight = false;
  });

  startBtn.addEventListener("click", () => {
    if (!gameRunning) {
      gameRunning = true;
      score = 0;
      lives = 3;
      scoreDisplay.textContent = score;
      livesDisplay.textContent = lives;
      initEnemies();
      startBtn.style.display = "none";
      gameLoop();
    }
  });

  leftBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    player.isMovingLeft = true;
  });
  leftBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    player.isMovingLeft = false;
  });
  rightBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    player.isMovingRight = true;
  });
  rightBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    player.isMovingRight = false;
  });
  shootBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (gameRunning) {
      bullets.push({
        x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: player.y,
        speed: 10,
      });
    }
  });

  leftBtn.addEventListener("mousedown", () => (player.isMovingLeft = true));
  leftBtn.addEventListener("mouseup", () => (player.isMovingLeft = false));
  leftBtn.addEventListener("mouseleave", () => (player.isMovingLeft = false));
  rightBtn.addEventListener("mousedown", () => (player.isMovingRight = true));
  rightBtn.addEventListener("mouseup", () => (player.isMovingRight = false));
  rightBtn.addEventListener("mouseleave", () => (player.isMovingRight = false));
  shootBtn.addEventListener("click", () => {
    if (gameRunning) {
      bullets.push({
        x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: player.y,
        speed: 10,
      });
    }
  });

  function update() {
    // Ajuste da velocidade com base na escala
    const enemySpeed = 1 / scale; // Divida pela escala para reduzir a velocidade de descida

    // Movimento do jogador
    if (player.isMovingLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (player.isMovingRight && player.x < canvas.width - PLAYER_WIDTH) {
      player.x += player.speed;
    }

    // Movimento das balas
    bullets.forEach((bullet, index) => {
      bullet.y -= bullet.speed;

      // Remover balas fora da tela
      if (bullet.y < 0) {
        bullets.splice(index, 1);
      }
    });

    // Movimento dos inimigos
    let edgeReached = false;
    enemies.forEach((enemy) => {
      if (enemy.naoMorri) {
        enemy.x += enemy.speed;

        // Verifica se os inimigos atingiram as bordas
        if (enemy.x <= 0 || enemy.x + ENEMY_WIDTH >= canvas.width) {
          edgeReached = true;
        }
      }
    });

    // Inverte direção e faz os inimigos descerem
    if (edgeReached) {
      enemies.forEach((enemy) => {
        if (enemy.naoMorri) {
          enemy.speed = -enemy.speed;
          enemy.y += ENEMY_HEIGHT * scale; // Desce com a escala
        }
      });
    }

    // Verifica colisões entre tiros e inimigos
    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        if (
          enemy.naoMorri &&
          bullet.x + BULLET_WIDTH * scale > enemy.x * scale &&
          bullet.x * scale < enemy.x + ENEMY_WIDTH * scale &&
          bullet.y * scale < enemy.y + ENEMY_HEIGHT * scale &&
          bullet.y + BULLET_HEIGHT * scale > enemy.y
        ) {
          score += 10;
          scoreDisplay.textContent = score;
          enemy.naoMorri = false;
          bullets.splice(bulletIndex, 1);
        }
      });
    });

    // Verifica colisões entre o jogador e inimigos
    enemies.forEach((enemy) => {
      if (
        enemy.naoMorri &&
        player.x + PLAYER_WIDTH * scale > enemy.x &&
        player.x < enemy.x + ENEMY_WIDTH * scale &&
        player.y < enemy.y + ENEMY_HEIGHT * scale &&
        player.y + PLAYER_HEIGHT * scale > enemy.y
      ) {
        lives -= 1;
        livesDisplay.textContent = lives;
        if (lives <= 0) {
          gameRunning = false;
          cancelAnimationFrame(animationId);
          startBtn.style.display = "block";
        }
      }
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();

    enemies.forEach((enemy) => {
      if (enemy.naoMorri) {
        drawEnemy(enemy.x, enemy.y);
      }
    });

    bullets.forEach((bullet) => {
      drawBullet(bullet.x, bullet.y);
    });
  }

  function gameLoop() {
    if (gameRunning) {
      update();
      draw();
      animationId = requestAnimationFrame(gameLoop);
    }
  }

  checkIfMobile();
});
