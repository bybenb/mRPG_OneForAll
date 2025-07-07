# Space Invaders Mobile com Botões de Controle
Vou adicionar botões de controle para a versão mobile ao seu jogo Space Invaders. Aqui estão
as modificações necessárias:
## Modificações no HTML (adicionar os botões de controle)
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,
user-scalable=no">
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
<!-- Botões de controle mobile -->
<div class="mobile-controls">
<button class="control-btn" id="left-btn">←</button>
<button class="control-btn" id="shoot-btn">DISPARAR</button>
<button class="control-btn" id="right-btn">→</button>
</div>
</div>
<div class="edemais">
by beny b. | <a href="https://linktr.ee/ProgGennin" target="_blank" rel="noopener
noreferrer">ProgGennin</a>
</div>
<script src="cabeca.js"></script>
</body>
</html>
```
## Modificações no CSS (estilizar os botões mobile)
```css
/* Seus estilos existentes permanecem aqui */
/* Adicione no final do arquivo CSS */
.mobile-controls {
display: none; /* Escondido por padrão, será mostrado apenas em mobile */
justify-content: space-between;
width: 100%;
max-width: 600px;
margin: 20px auto 0;
padding: 0 10px;
box-sizing: border-box;
}
.control-btn {
padding: 15px 25px;
font-size: 1.2em;
background: rgba(0, 255, 0, 0.3);
color: #00ff00;
border: 1px solid #00ff00;
border-radius: 5px;
cursor: pointer;
transition: all 0.3s;
touch-action: manipulation;
}
.control-btn:active {
background: rgba(0, 255, 0, 0.7);
}
#shoot-btn {
flex-grow: 1;
margin: 0 10px;
}
/* Mostrar controles apenas em dispositivos móveis */
@media (max-width: 768px) {
.mobile-controls {
display: flex;
}
/* Ajustar canvas para mobile */
canvas {
width: 100%;
height: auto;
max-height: 70vh;
}
}
```
## Modificações no JavaScript (adicionar controles touch)
```javascript
document.addEventListener('DOMContentLoaded', () => {
// Seu código existente permanece aqui...
// Adicione estas variáveis no início com as outras
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const shootBtn = document.getElementById('shoot-btn');
let isMobile = false;
// Verificar se é mobile
function checkIfMobile() {
isMobile = /Mobi|Android/i.test(navigator.userAgent);
if (isMobile) {
document.querySelector('.mobile-controls').style.display = 'flex';
}
}
// Adicione este código depois dos event listeners de teclado
// Event listeners para botões mobile
leftBtn.addEventListener('touchstart', (e) => {
e.preventDefault();
player.isMovingLeft = true;
});
leftBtn.addEventListener('touchend', (e) => {
e.preventDefault();
player.isMovingLeft = false;
});
rightBtn.addEventListener('touchstart', (e) => {
e.preventDefault();
player.isMovingRight = true;
});
rightBtn.addEventListener('touchend', (e) => {
e.preventDefault();
player.isMovingRight = false;
});
shootBtn.addEventListener('touchstart', (e) => {
e.preventDefault();
if (gameRunning) {
bullets.push({
x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
y: player.y,
speed: 10
});
}
});
// Para clique com mouse também (em tablets que podem ter mouse)
leftBtn.addEventListener('mousedown', () => player.isMovingLeft = true);
leftBtn.addEventListener('mouseup', () => player.isMovingLeft = false);
leftBtn.addEventListener('mouseleave', () => player.isMovingLeft = false);
rightBtn.addEventListener('mousedown', () => player.isMovingRight = true);
rightBtn.addEventListener('mouseup', () => player.isMovingRight = false);
rightBtn.addEventListener('mouseleave', () => player.isMovingRight = false);
shootBtn.addEventListener('click', () => {
if (gameRunning) {
bullets.push({
x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
y: player.y,
speed: 10
});
}
});
// Adicione esta chamada no final do DOMContentLoaded
checkIfMobile();
});
```
## Funcionalidades adicionadas:
1. **Botões de controle móvel**:
- Botão esquerdo (←) para mover para a esquerda
- Botão direito (→) para mover para a direita
- Botão "DISPARAR" para atirar
2. **Detecção automática de dispositivo móvel**:
- Os controles só aparecem em dispositivos móveis
- Em desktops, os controles permanecem ocultos
3. **Otimização para touch**:
- Eventos `touchstart` e `touchend` para controles suaves
- Também suporta eventos de mouse para tablets com mouse
4. **Estilo responsivo**:
- O canvas se ajusta ao tamanho da tela em dispositivos móveis
- Botões grandes para fácil toque
Estas modificações mantêm toda a funcionalidade original do jogo enquanto adicionam
controles touch amigáveis para dispositivos móveis. O jogo agora pode ser jogado tanto com
teclado em desktop quanto com os botões touch em dispositivos móveis.