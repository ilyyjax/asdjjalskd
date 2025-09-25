const pickle = document.getElementById('pickle');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const gameArea = document.getElementById('game-area');

let score = 0;
let highscore = localStorage.getItem('highscore') || 0;
highscoreEl.textContent = highscore;

let holding = false;
let pickleY = 20; // pickle's position relative to bottom of game area
let cameraY = 0;  // how much we’ve moved the game content
let objects = []; // clouds and birds

document.addEventListener('keydown', e => {
  if (e.code === 'Space') holding = true;
});

document.addEventListener('keyup', e => {
  if (e.code === 'Space') {
    holding = false;
    score = 0;
    pickleY = 20;
    cameraY = 0;
    gameArea.style.transform = `translateY(0px)`;
    pickle.style.bottom = pickleY + 'px';
    
    // remove all clouds and birds
    objects.forEach(obj => obj.remove());
    objects = [];
    
    scoreEl.textContent = score;
  }
});

// Randomly spawn a cloud
function spawnCloud(y) {
  const cloud = document.createElement('div');
  cloud.className = 'cloud';
  cloud.style.top = y + 'px';
  cloud.style.left = Math.random() * 500 + 'px';
  gameArea.appendChild(cloud);
  objects.push(cloud);
}

// Randomly spawn a bird
function spawnBird(y) {
  const bird = document.createElement('div');
  bird.className = 'bird';
  bird.style.top = y + 'px';
  bird.style.left = Math.random() * 500 + 'px';
  gameArea.appendChild(bird);
  objects.push(bird);
}

function gameLoop() {
  if (holding) {
    pickleY += 3;
    score += 1;
    scoreEl.textContent = score;

    // Move camera so pickle stays around middle of the game area
    const gameHeight = gameArea.clientHeight;
    const pickleMiddle = pickleY - cameraY;
    const targetMiddle = gameHeight / 2 - 40; // 40 is half pickle height
    cameraY += (pickleMiddle - targetMiddle) * 0.1; // smooth follow
    gameArea.style.transform = `translateY(-${cameraY}px)`;

    pickle.style.bottom = pickleY + 'px';

    // Spawn new clouds and birds above current camera view
    if (Math.random() < 0.02) spawnCloud(cameraY - 100 - Math.random() * 200);
    if (Math.random() < 0.01) spawnBird(cameraY - 100 - Math.random() * 200);

    // Update highscore
    if (score > highscore) {
      highscore = score;
      localStorage.setItem('highscore', highscore);
      highscoreEl.textContent = highscore;
    }
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
