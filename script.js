// JavaScript for the game logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Game Variables ---
let score = 0;
let particles = [];
const paddleHeight = 15;
const paddleWidth = 120;
let paddleX = (canvas.width - paddleWidth) / 2;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 12,
    speed: 5,
    dx: 5,
    dy: -5,
    color: '#08ffffff' // Initial cyan color
};

// --- Particle System ---
function createParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x: x,
            y: y,
            radius: Math.random() * 3 + 1,
            color: color,
            dx: (Math.random() - 0.5) * 5,
            dy: (Math.random() - 0.5) * 5,
            life: 30 // Lifespan in frames
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 30; // Fade out effect
        ctx.fill();
        ctx.closePath();
    });
    ctx.globalAlpha = 1.0; // Reset alpha
}

// --- Drawing Functions ---
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    // Magical glow effect for the ball
    ctx.shadowColor = ball.color;
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    // Reset shadow for other elements
    ctx.shadowBlur = 0;
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0606c7ff';
    // Magical glow for the paddle
    ctx.shadowColor = '#2bff00ff';
    ctx.shadowBlur = 19;
    ctx.fill();
    ctx.closePath();
    // Reset shadow
    ctx.shadowBlur = 0;
}

function drawScore() {
    ctx.font = '20px "Courier New"';
    ctx.fillStyle = '#ffffffff';
    ctx.fillText('Score: ' + score, 15, 25);
}

// --- Collision and Movement ---
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (left/right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx *= -1;
        createParticles(ball.x, ball.y, '#ffffff'); // White sparks on wall hit
    }

    // Wall collision (top)
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
        createParticles(ball.x, ball.y, '#ffffff');
    }

    // Paddle collision
    if (ball.y + ball.radius > canvas.height - paddleHeight - 10 &&
        ball.x > paddleX &&
        ball.x < paddleX + paddleWidth) {
        ball.dy *= -1;
        score++;
        // Change ball color and create a magical burst
        ball.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        createParticles(ball.x, ball.y, ball.color);
    }

    // Game over condition (bottom wall)
    if (ball.y + ball.radius > canvas.height) {
        alert('GAME OVER! Your score: ' + score);
        document.location.reload();
    }
}

function movePaddle(e) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = e.clientX - rect.left - root.scrollLeft;
    paddleX = mouseX - paddleWidth / 2;

    // Keep paddle within canvas bounds
    if (paddleX < 0) {
        paddleX = 0;
    }
    if (paddleX + paddleWidth > canvas.width) {
        paddleX = canvas.width - paddleWidth;
    }
}

// --- Main Game Loop ---
function gameLoop() {
    // Magical trail effect: fill canvas with a semi-transparent layer
    ctx.fillStyle = 'rgba(9, 3, 59, 0.69)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawParticles();

    moveBall();
    updateParticles();

    requestAnimationFrame(gameLoop);
}

// Event Listener for paddle control
document.addEventListener('mousemove', movePaddle);

// Start the game!
gameLoop();