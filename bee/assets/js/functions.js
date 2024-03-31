var bee;
var floor;
var obstacles = [];
var score = 0;
var scoreComponent;
var labelGameOver;

document.body.addEventListener("pointerdown", () => accelerate(-0.2));
document.body.addEventListener("pointerup", () => accelerate(0.05));

function loadGame() {
    gameArea.load();
}

function startGame() {
    bee = new component(40, 33, "assets/img/bee2.png", 20, 120, "bee");
    floor = new component(644, 90, "assets/img/floor.png", -2, 390, "floor");
    bee.gravity = 0.05;
    scoreComponent = new component("23px", "VT323", "White", 160, 30, "text");
    document.querySelector(".btn-start").style.display = 'none';
    gameArea.start();
}

function restartGame() {
    obstacles = [];
    score = 0;
    document.querySelector(".btn").style.display = 'none';
    document.querySelector("canvas").remove();
    gameArea.stop();
    gameArea.start();
}

var gameArea = {
    canvas: document.createElement("canvas"),
    load: function() {
        this.canvas.style.backgroundColor = '#00BFFF';
        this.canvas.width = 320;
        this.canvas.height = 480;
        this.context = this.canvas.getContext("2d");
        var element = document.querySelector(".wrapper-game");
        element.appendChild(this.canvas);
        this.frameNo = 0;
    },
    start: function() {
        this.load();
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;

    this.update = function() {
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if(this.type == "circle") {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
            ctx.fill();
        } else if(this.type == "obstacle" || this.type == "bee" || this.type == "floor" || this.type == "game-over") {
            this.image = new Image();
            frameToSecond = Math.floor(gameArea.frameNo/20);
            if (this.type == "bee") {
              color = (frameToSecond % 2 == 0) ? "assets/img/bee.png" : "assets/img/bee2.png";
            }
            this.image.src = color;
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);           
        }else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPosition = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitExtremities();
    }
    
    this.run = function() {
        if (this.x > -150 ) {
            this.x -= 3;
        }else {
            this.x = 0;
        }
    }

    this.hitExtremities = function() {
        var rockBottom = gameArea.canvas.height - this.height - 88;
        var rockTop = 0;
        if (this.y > rockBottom) {
            this.y = rockBottom;
            this.gravitySpeed = 0;
        }
        if (this.y < rockTop) {
            this.y = rockTop;
            this.gravitySpeed = 0;
        }

    }

    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        

        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        } else {
            labelGameOver = new component(171, 37, "assets/img/game-over.png", 75, 160, "game-over");
            labelGameOver.update();
            document.querySelector(".btn").style.display = 'block';
        }
        if (localStorage.getItem('best') < score || localStorage.getItem('best') == '') {
            localStorage.setItem('best', score);
        }
        return crash;
    }
}

function updateGameArea() {
    var gap,  minGap, maxGap;
    for (i = 0; i < obstacles.length; i += 1) {
        if (bee.crashWith(obstacles[i])) {
            return;
        } else if (!bee.crashWith(obstacles[i]) && bee.x >= obstacles[i].x && obstacles[i].x == 19)  {
            score += 1/2;
        }
    } 
    
    gameArea.clear();
    gameArea.frameNo += 1;

    if (gameArea.frameNo == 1 || everyInterval(150)) {
        widthCanvas = gameArea.canvas.width;
        heightCanvas = gameArea.canvas.height;
        minGap = 1;
        maxGap = 60;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        yObstacleBottom = Math.floor(240 + gap);
        yObstacleTop = Math.floor(0 - gap);
        obstacles.push(new component(66, 200, "assets/img/obstacle-top.png", widthCanvas, yObstacleTop, 'obstacle', 'normal'));
        obstacles.push(new component(66, 200, "assets/img/obstacle-bottom.png", widthCanvas, yObstacleBottom, 'obstacle', 'invert'));
    }

    for (i = 0; i < obstacles.length; i += 1) {
        obstacles[i].x += -1;
        obstacles[i].update();
    }

    scoreComponent.text= `SCORE: ${score} BEST: ${localStorage.getItem('best') || 0}`;
    scoreComponent.update();
    floor.update();
    floor.run();
    bee.newPosition();
    bee.update();
}

function everyInterval(n) {
    if ((gameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    bee.gravity = n;
}