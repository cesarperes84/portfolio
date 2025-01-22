let ctx,
  level = 0;
let ballOrientation = 1;
const h = 480,
  w = 320;

let clickStartGame = false;
var angleBall = 0;
let hit = false;
var rightAngle = 220;
const url1 = "assets/img/bullet.png";
const url2 = "assets/img/trajectory.png";
const url3 = "assets/img/bullet-invert.png";
let clicked = 0;
let pause = false;
var imageBall = new Image();
var imageBall2 = new Image();
var imagePath = new Image();
var interval = 10;
var targetBallOrientation = imageBall;
var speed = 2;

const loadImages = async () => {
  await new Promise((r) => (imageBall.onload = r), (imageBall.src = url1));
  await new Promise((r2) => (imagePath.onload = r2), (imagePath.src = url2));
  await new Promise((r3) => (imageBall2.onload = r3), (imageBall2.src = url3));
};

const setup = () => {
  const canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  writeThingsOnScreen();
};

const startGame = () => {
  if (!clickStartGame) {
    setInterval(loop, interval);
    loadImages();
  }
  clickStartGame = true;
};

const loop = () => {
  draw();
};

const goNextLevel = () => {
  // ballOrientation *= -1;
  setTimeout(() => {
    rightAngle = Math.floor(Math.random() * 360);
    hit = false;
    angleBall = 0;
    pause = false;
    ballOrientation *= -1;
    clicked = 0;
    if (level % 3 === 0) {
      speed += 1;
    }
    /* interval -= 8;  */
  }, 3000);
};

const draw = () => {
  if (!hit && !pause) {
    if (angleBall === 360) angleBall = 0;
    angleBall += speed;
    angleBall = parseFloat(angleBall.toFixed(2));
    drawBall(20, 80);
  } else {
    angleBall = rightAngle;
    drawBall(20, 80);
    pause = true;
  }
};

const drawBall = (x, y) => {
  ctx.clearRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  scale = 0.9;
  targetBallOrientation = ballOrientation < 0 ? imageBall2 : imageBall;

  // Path
  ctx.save();
  ctx.translate(
    x + (imagePath.width * scale) / 2,
    y + (imagePath.height * scale) / 2
  );
  ctx.rotate(((rightAngle * Math.PI) / 180) * ballOrientation);
  ctx.translate(
    -x - (imagePath.width * scale) / 2,
    -y - (imagePath.height * scale) / 2
  );
  ctx.drawImage(
    imagePath,
    x,
    y,
    targetBallOrientation.width * scale,
    imagePath.height * scale
  );
  ctx.restore();

  // Ball
  ctx.save();
  ctx.translate(
    x + (targetBallOrientation.width * scale) / 2,
    y + (targetBallOrientation.height * scale) / 2
  );
  ctx.rotate(((angleBall * Math.PI) / 180) * ballOrientation);
  ctx.translate(
    -x - (targetBallOrientation.width * scale) / 2,
    -y - (targetBallOrientation.height * scale) / 2
  );
  ctx.drawImage(
    targetBallOrientation,
    x,
    y,
    targetBallOrientation.width * scale,
    targetBallOrientation.height * scale
  );
  ctx.restore();
  writeThingsOnScreen();
};

const writeThingsOnScreen = () => {
  ctx.font = "22px Knewave";
  ctx.fillStyle = "#000";
  const maxLevel = `${localStorage.getItem('maxLevel') || 0}`;
  ctx.fillText(`LEVEL: ${level}`, 0, 20);
  ctx.fillText(`MAX: ${maxLevel}`, 0, 50);
  ctx.fillText(`SPEED: ${speed}`, 200, 20);
  // localStorage.setItem('best', level);


  ctx.font = "64px Knewave";
  ctx.fillText(`${clicked}`, 130, 220);

  ctx.font = "22px Knewave";
  ctx.fillText(`CLICKS `, 120, 260);
};

const hitCheck = (ev) => {
  if (clickStartGame && !pause) {
    console.log("angleBall", angleBall);
    console.log("rightAngle", rightAngle);
    console.log("---");
    clicked++;
    if (angleBall > rightAngle - 5 && angleBall <= rightAngle + 5) {
      level++;
      hit = true;
      
      if (localStorage.getItem('maxLevel') < level || localStorage.getItem('maxLevel') == '') {
        localStorage.setItem('maxLevel', level);
      }
      console.log("HIT");
      console.log("---");
      goNextLevel();
    }
  }
};

document.body.addEventListener("click", (ev) => hitCheck(ev), false);

document.addEventListener("click", (ev) => {
  startGame();
});


document.body.addEventListener("mousedown", (e) => {
  document.getElementById("x1").classList = "wave active";
  document.getElementById("x1").style.left = e.pageX+"px";
  document.getElementById("x1").style.top = e.pageY+"px";
  setTimeout(() => document.getElementById("x1").classList = "wave", 400)
});

setup();
