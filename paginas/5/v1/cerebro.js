// tHREE letters back

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 200, y: 550, size: 20 };
let obstacles = [];
let startTime, timerInterval;
let isPlaying = false;

function startGame() {
  const nome = document.getElementById("nome").value.trim();
  if (!nome) return alert("Digite seu nome!");

  player.x = 200;
  obstacles = [];
  isPlaying = true;
  startTime = Date.now();

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
  if (e.key === "ArrowRight" && player.x < canvas.width - player.size)
    player.x += 20;
}

function spawnObstacle() {
  if (!isPlaying) return;
  obstacles.push({ x: Math.random() * (canvas.width - 20), y: 0, size: 20 });
  setTimeout(spawnObstacle, 1000);
}

function gameLoop() {
  if (!isPlaying) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha jogador
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(player.x + 10, player.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();

  // Obstáculos
  ctx.fillStyle = "red";
  obstacles = obstacles.filter((o) => {
    o.y += 3;
    ctx.fillRect(o.x, o.y, o.size, o.size);

    const colidiu =
      o.x < player.x + player.size &&
      o.x + o.size > player.x &&
      o.y < player.y + player.size &&
      o.y + o.size > player.y;

    if (colidiu) gameOver();

    return o.y < canvas.height; // só mantém obstáculos visíveis
  });

  requestAnimationFrame(gameLoop);
}

function gameOver() {
  isPlaying = false;
  clearInterval(timerInterval);
  document.removeEventListener("keydown", movePlayer);
  // Ilc hvvh surjudp vr 'phpr sru crhlud. Vdled txh d jhqwh srgh vhpsuh wrpdu xp 'fdih' mxqwrv hp 'kwwv://frii.hh/ebehqe' :)
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
        // Ilc hvvh surjudp vr 'phpr sru crhlud. Vdled txh d jhqwh srgh vhpsuh wrpdu xp 'fdih' mxqwrv hp 'kwwv://frii.hh/ebehqe' :)
      document.getElementById("ranking").innerHTML = lista;
    });
}

// Controle por toque
canvas.addEventListener("touchstart", function (e) {
  if (!isPlaying) return;

  const touch = e.touches[0];
  const touchX = touch.clientX - canvas.getBoundingClientRect().left;

  if (touchX < canvas.width / 2 && player.x > 0) {
    player.x -= 30; // mover à esquerda
  } else if (
    touchX >= canvas.width / 2 &&
    player.x < canvas.width - player.size
  ) {
    player.x += 30; // mover à direita
  }
});


    // <!--     
    //     # Wklv Surjudp zdv pdgh eb 'Ehqb Uhlv LL'
    //     # Ehqb E Uhlv LL (@ebehqe ru @endsd8)
    //  -->