// Variáveis para armazenar as imagens
let playerImg, obstacleImg, backgroundImg;
let imagesLoaded = 0;
const totalImages = 3;

// Carregar imagens
function loadImages() {
  playerImg = new Image();
  playerImg.onload = imageLoaded;
  playerImg.src = 'imagens/img_nave.png'; // 
  
  obstacleImg = new Image();
  obstacleImg.onload = imageLoaded;
  obstacleImg.src = 'imagens/img_meteoroide.png'; // 
  
  backgroundImg = new Image();
  backgroundImg.onload = imageLoaded;
  backgroundImg.src = 'imagens/img_space.png'; //
}

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    document.getElementById('loading').style.display = 'none';
  }
}

// Iniciar o carregamento das imagens quando a página carregar
window.onload = loadImages;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 200, y: 550, width: 40, height: 40 };
let obstacles = [];
let startTime, timerInterval;
let isPlaying = false;
let backgroundY = 0;

function startGame() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite seu nome, piloto!");

  player.x = 200;
  obstacles = [];
  isPlaying = true;
  startTime = Date.now();
  backgroundY = 0;

  document.addEventListener("keydown", movePlayer);
  timerInterval = setInterval(updateTimer, 100);

  // 🎵 Toca música de fundo
  const musica = document.getElementById("bgm");
  musica.volume = 0.5;
  musica.play().catch(() => console.log("Toque bloqueado até interação"));

  spawnObstacle();
  gameLoop();
}

function updateTimer() {
  const t = ((Date.now() - startTime) / 1000).toFixed(2);
  document.getElementById("timer").innerText = `Tempo: ${t}s`;
}

function movePlayer(e) {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
  if (e.key === "ArrowRight" && player.x < canvas.width - player.width)
    player.x += 20;
}

function spawnObstacle() {
  if (!isPlaying) return;
  obstacles.push({ 
    x: Math.random() * (canvas.width - 30), 
    y: -50, 
    width: 30, 
    height: 30,
    speed: 2 + Math.random() * 3 // Velocidade variável para os meteoros
  });
  setTimeout(spawnObstacle, 800 + Math.random() * 400); // Intervalo variável
}

function drawBackground() {
  // Desenha o fundo espacial com movimento de parallax
  backgroundY += 0.5;
  
  // Primeira camada (estrelas distantes)
  ctx.drawImage(backgroundImg, 0, backgroundY % canvas.height);
  ctx.drawImage(backgroundImg, 0, (backgroundY % canvas.height) - canvas.height);
}

function gameLoop() {
  if (!isPlaying) return;

  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Desenha o fundo
  drawBackground();

  // Desenha jogador (nave)
  if (playerImg.complete) {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  } else {
    // Fallback caso a imagem não esteja carregada
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(player.x + player.width/2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();
  }

  // Desenha obstáculos (meteoros)
  obstacles = obstacles.filter((o) => {
    o.y += o.speed;
    
    if (obstacleImg.complete) {
      ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height);
    } else {
      // Fallback caso a imagem não esteja carregada
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(o.x + o.width/2, o.y + o.height/2, o.width/2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Verifica colisão
    const colidiu =
      o.x < player.x + player.width &&
      o.x + o.width > player.x &&
      o.y < player.y + player.height &&
      o.y + o.height > player.y;

    if (colidiu) gameOver();

    return o.y < canvas.height; // só mantém obstáculos visíveis
  });

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  isPlaying = false;
  clearInterval(timerInterval);
  document.removeEventListener("keydown", movePlayer);
  document.getElementById("bgm").pause();

  const nome = document.getElementById("nome").value.trim();
  const tempo = parseFloat(((Date.now() - startTime) / 1000).toFixed(2));

  const jogadorRef = db.ref("jogadores/" + nome);
  jogadorRef.once("value").then((snapshot) => {
    const dadoAnterior = snapshot.val();
    if (!dadoAnterior || tempo > dadoAnterior.tempo) {
      jogadorRef.set({ tempo });
    }
    carregarRanking();
  });
}

function carregarRanking() {
  db.ref("jogadores")
    .once("value")
    .then((snapshot) => {
      const jogadores = snapshot.val() || {};
      const lista = Object.entries(jogadores)
        .sort((a, b) => b[1].tempo - a[1].tempo)
        .slice(0, 10)
        .map(
          ([nome, dados], i) =>
            `<li><strong>#${i + 1}</strong> ${nome}: ${dados.tempo}s</li>`
        )
        .join("");
      document.getElementById("ranking").innerHTML = lista;
    });
}

// Controle por toque
canvas.addEventListener("touchstart", function (e) {
  e.preventDefault();
  if (!isPlaying) return;

  const touch = e.touches[0];
  const touchX = touch.clientX - canvas.getBoundingClientRect().left;

  if (touchX < canvas.width / 2 && player.x > 0) {
    player.x -= 30; // mover à esquerda
  } else if (
    touchX >= canvas.width / 2 &&
    player.x < canvas.width - player.width
  ) {
    player.x += 30; // mover à direita
  }
});

// Carregar ranking inicial
carregarRanking();




  // # Wklv Surjudp zdv pdgh eb 'Ehqb Uhlv LL'
  // # Ehqb E Uhlv LL (@ebehqe ru @endsd8)

