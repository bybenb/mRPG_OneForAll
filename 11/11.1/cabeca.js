document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("score");
  const livesDisplay = document.getElementById("lives");
  const startBtn = document.getElementById("start-btn");

  // Configurações responsivas
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const maxWidth = Math.min(window.innerWidth * 0.95, 600);
  const maxHeight = Math.min(window.innerHeight * 0.65, 700);
  
  canvas.width = maxWidth;
  canvas.height = maxHeight;

  // Ajuste de tamanhos relativos ao canvas
  const PLAYER_WIDTH = canvas.width / 10;
  const PLAYER_HEIGHT = PLAYER_WIDTH * 0.6;
  const ENEMY_WIDTH = canvas.width / 12;
  const ENEMY_HEIGHT = ENEMY_WIDTH;
  const BULLET_WIDTH = canvas.width / 80;
  const BULLET_HEIGHT = canvas.height / 25;
  const ENEMY_COLS = 8;
  const ENEMY_ROWS = 3;

  // Estado do jogo
  let player = {
    x: canvas.width / 2 - PLAYER_WIDTH / 2,
    y: canvas.height - PLAYER_HEIGHT * 2,
    speed: canvas.width / 80,
    isMovingLeft: false,
    isMovingRight: false,
    touchId: null
  };

  let bullets = [];
  let enemies = [];
  let score = 0;
  let lives = 3;
  let gameRunning = false;
  let animationId = null;
  let enemySpeed = canvas.width / 400;
  let lastTouchTime = 0;

  // Funções de desenho (VERSÃO CORRIGIDA COM RETÂNGULOS)
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

  // Inicialização dos inimigos
  function initEnemies() {
    enemies = [];
    const horizontalSpacing = (canvas.width - 40) / ENEMY_COLS;
    
    for (let r = 0; r < ENEMY_ROWS; r++) {
      for (let c = 0; c < ENEMY_COLS; c++) {
        enemies.push({
          x: 20 + c * horizontalSpacing,
          y: 30 + r * (ENEMY_HEIGHT + 15),
          speed: enemySpeed,
          naoMorri: true
        });
      }
    }
  }

  // Controles Touch
  function setupTouchControls() {
    // Toque para movimento
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const touchX = touch.clientX - canvas.getBoundingClientRect().left;
      
      player.x = Math.max(0, Math.min(canvas.width - PLAYER_WIDTH, touchX - PLAYER_WIDTH/2));
      player.touchId = touch.identifier;
    });

    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!player.touchId) return;
      
      const touch = Array.from(e.touches).find(t => t.identifier === player.touchId);
      if (touch) {
        const touchX = touch.clientX - canvas.getBoundingClientRect().left;
        player.x = Math.max(0, Math.min(canvas.width - PLAYER_WIDTH, touchX - PLAYER_WIDTH/2));
      }
    });

    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      if (Array.from(e.changedTouches).some(t => t.identifier === player.touchId)) {
        player.touchId = null;
      }
    });

    // Toque duplo para disparar
    canvas.addEventListener('touchstart', (e) => {
      const currentTime = new Date().getTime();
      if (currentTime - lastTouchTime < 250) { // 250ms para duplo toque
        if (gameRunning) fireBullet();
        e.preventDefault();
      }
      lastTouchTime = currentTime;
    });
  }

  // Controles de teclado (para desktop)
  function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') player.isMovingLeft = true;
      if (e.key === 'ArrowRight') player.isMovingRight = true;
      if (e.key === ' ' && gameRunning) fireBullet();
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') player.isMovingLeft = false;
      if (e.key === 'ArrowRight') player.isMovingRight = false;
    });
  }

  function fireBullet() {
    if (bullets.length < 3) { // Limite de 3 tiros na tela
      bullets.push({
        x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: player.y,
        speed: canvas.height / 40
      });
    }
  }

  // Lógica do jogo
  function update() {
    // Movimento do jogador (teclado)
    if (player.isMovingLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (player.isMovingRight && player.x < canvas.width - PLAYER_WIDTH) {
      player.x += player.speed;
    }

    // Movimento dos tiros
    bullets.forEach((bullet, index) => {
      bullet.y -= bullet.speed;
      if (bullet.y < 0) {
        bullets.splice(index, 1);
      }
    });

    // Movimento dos inimigos
    let edgeReached = false;
    enemies.forEach(enemy => {
      if (enemy.naoMorri) {
        enemy.x += enemy.speed;
        if (enemy.x <= 0 || enemy.x + ENEMY_WIDTH >= canvas.width) {
          edgeReached = true;
        }
      }
    });

    if (edgeReached) {
      enemies.forEach(enemy => {
        if (enemy.naoMorri) {
          enemy.speed = -enemy.speed;
          enemy.y += ENEMY_HEIGHT * 0.5;
        }
      });
    }

    // Colisões: tiro com inimigo
    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        if (enemy.naoMorri &&
            bullet.x < enemy.x + ENEMY_WIDTH &&
            bullet.x + BULLET_WIDTH > enemy.x &&
            bullet.y < enemy.y + ENEMY_HEIGHT &&
            bullet.y + BULLET_HEIGHT > enemy.y) {
          enemy.naoMorri = false;
          bullets.splice(bulletIndex, 1);
          score += 10;
          scoreDisplay.textContent = score;
        }
      });
    });

    // Colisão: inimigo com jogador
    enemies.forEach(enemy => {
      if (enemy.naoMorri &&
          enemy.y + ENEMY_HEIGHT >= player.y &&
          enemy.x + ENEMY_WIDTH >= player.x &&
          enemy.x <= player.x + PLAYER_WIDTH) {
        lives--;
        livesDisplay.textContent = lives;
        enemy.naoMorri = false;

        if (lives <= 0) {
          gameOver();
        }
      }
    });

    // Verifica se inimigos chegaram ao fundo
    enemies.forEach(enemy => {
      if (enemy.naoMorri && enemy.y + ENEMY_HEIGHT >= canvas.height) {
        gameOver();
      }
    });

    // Verifica vitória
    if (enemies.every(enemy => !enemy.naoMorri)) {
      gameRunning = false;
      setTimeout(() => {
        alert(`Você venceu! Pontuação: ${score}`);
        startBtn.style.display = 'inline-block';
      }, 100);
    }
  }

  function draw() {
    // Fundo do espaço
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Estrelas (decoração)
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
      const x = Math.sin(i * 10) * canvas.width/2 + canvas.width/2;
      const y = (i * canvas.height/50 + Date.now()/100) % canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }

    // Elementos do jogo
    drawPlayer();
    bullets.forEach(bullet => drawBullet(bullet.x, bullet.y));
    enemies.forEach(enemy => {
      if (enemy.naoMorri) drawEnemy(enemy.x, enemy.y);
    });
  }

  function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    setTimeout(() => {
      alert(`Game Over! Pontuação: ${score}`);
      startBtn.style.display = 'inline-block';
    }, 100);
  }

  function gameLoop() {
    if (gameRunning) {
      update();
      draw();
      animationId = requestAnimationFrame(gameLoop);
    }
  }

 // Inicialização do jogo
  function init() {
    setupTouchControls();
    setupKeyboardControls();
    
    // // Esconde controles físicos se for mobile
    // if (!isMobile) {
    //   document.querySelector('.mobile-controls').style.display = 'none';
    // }

    // else { 
    //   document.querySelector('.mobile-controls').style.display = 'flex';
    // }

    initEnemies();

    startBtn.addEventListener('click', () => {
      if (!gameRunning) {
        gameRunning = true;
        score = 0;
        lives = 3;
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        bullets = [];
        initEnemies();
        startBtn.style.display = 'none';
        gameLoop();
      }
    });
  }

  init();
});  // Redimensionamento responsivo


  // window.addEventListener('resize', () => {
  //   if (!gameRunning) {
  //     const newWidth = Math.min(window.innerWidth * 0.95, 600);
  //     const newHeight = Math.min(window.innerHeight * 0.65, 700);
      
  //     if (canvas.width !== newWidth || canvas.height !== newHeight) {
  //       canvas.width = newWidth;
  //       canvas.height = newHeight;
        
  //       // Ajusta posição do jogador
  //       player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
  //       player.y = canvas.height - PLAYER_HEIGHT * 2;
  //     }
  //   }
  // });
// });
