var enemyMax = 5;
var enemyWidth = 101;
var enemySpeed = 60;

var canvasW = 505;
var canvasH = 606;

var playerWidth = 101;
var playerMoveX = 101;
var playerMoveY = 83;
var playerStartingPos = [canvasW / 2 - playerWidth / 2, canvasH - 2 * playerWidth]; // starting player position centralized on x axis

var dateTime = 0;
/*jshint -W058 */
var allEnemies = [];


// define random position function
function randomYPosition() {
    var x = Math.floor((Math.random() * 3) + 1);
    if (x === 1) {
        return 72;
    }
    if (x === 2) {
        return 155;
    }
    return 238;
}

function randomXPosition() {
    return -(Math.floor((Math.random() * 500) + 100));
}

// random speed function
function randomSpeed() {
    return Math.floor((Math.random() * 50) + 50) + enemySpeed;
}

// Enemies our player must avoid
var Enemy = function() {
    this.x = randomXPosition();
    //console.log(this.x)
    this.y = randomYPosition(); // loc y = 72 || 148 || 238
    this.speed = randomSpeed();

    allEnemies[allEnemies.length] = this;
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-crab.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // console.log(ctx.canvas.width);
    if (this.x <= ctx.canvas.width) {
        this.x += this.speed * dt;
    } else { // if the enemy reaches the end of the canvas put him back at the beginning
        this.speed = randomSpeed();
        this.x = randomXPosition();
        this.y = randomYPosition();
    }

    // if the player touch enemy, go back to the starting position and take one life
    if (this.x + enemyWidth / 4 >= player.x - playerWidth / 2  && this.x <= player.x + playerWidth / 2 && this.y === player.y) {
        //console.log("you died")
        player.x = playerStartingPos[0];
        player.y = playerStartingPos[1];
        player.life--;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // if life changes clear the canvas so new score amount could be added
        //console.log(player.life)
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //console.log(ctx)
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.gameActive = true;
    this.x = playerStartingPos[0];
    this.y = playerStartingPos[1];
    this.life = 4;
    this.score = 0;
    this.lifeImg = 'images/Heart.png';
    this.sprite = 'images/char-boy.png';
    //console.log("Player")
};

Player.prototype.update = function() {
    // if player reaches water go back to the starting position and increase the score and increase the enemy speed
    if (this.y <= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // if the score changes clear the canvas so new score amount could be added
        this.score += 100;

        if (this.score % 500 === 0){ // if 500 points is achieved a new bug enemy will be added
            new Enemy;
        }

        enemySpeed += 1;
        this.x = playerStartingPos[0];
        this.y = playerStartingPos[1];
    }
    if (player.life === 0) {
        gameActive = false;
    }
};

Player.prototype.render = function() {
    // display lifes
    var pos = 0;
    for (i = 0; i < this.life; i++) {
        //console.log(this.life)
        ctx.drawImage(Resources.get(this.lifeImg), pos, 0, 101/3, 171/3); // render hearts with the third of the real img size
        pos += 101 / 3;
    }

    // display score
    ctx.textBaseline = 'top';
    ctx.textAlign="right";
    ctx.font="35px Georgia";
    ctx.fillText(this.score, canvasW, 10);

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keycode){
    if (keycode === 'up' && this.y >= 0) {
        this.y -= playerMoveY;
    }
    else if (keycode == 'down' && this.y < canvasH - 2 * playerWidth) {
        this.y += playerMoveY;
    }
    else if (keycode == 'left' && this.x > 0) {
        this.x -= playerMoveX;
    }
    else if (keycode == 'right' && this.x < canvasW - playerWidth) {
        this.x += playerMoveX;
    }
    // console.log(this.y)
    // console.log(this.x)
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// gen
for (i = 0; i < enemyMax; i++) {
    new Enemy;
    // console.log(allEnemies)
}

var player = new Player;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
