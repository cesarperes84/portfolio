import * as THREE from 'three';

const canvas = document.querySelector('#canvas');
const scoreEl = document.querySelector('#score');
const shieldEl = document.querySelector('#shield');
const shieldFillEl = document.querySelector('#shieldFill');
const waveEl = document.querySelector('#wave');
const titleEl = document.querySelector('#title');
const messageEl = document.querySelector('#message');
const startScreen = document.querySelector('#start');
const gameOverScreen = document.querySelector('#gameOver');
const finalScore = document.querySelector('#finalScore');
const startBtn = document.querySelector('#startBtn');
const restartBtn = document.querySelector('#restartBtn');

let running = false;
let paused = false;
let score = 0;
let shield = 100;
let wave = 1;
let lastShot = 0;
let spawnTimer = 0;
let ringSpawnTimer = 1.2;
let coinSpawnTimer = 0.8;
let boostEnergy = 100;
let worldSpeed = 1;
let lastEnemySpawnX = 999;

const keys = { left:false, right:false, up:false, down:false, shoot:false, boost:false };

let audioCtx = null;
let musicNodes = [];
let musicTimer = null;

function ensureAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function tone(freq, duration, type = "sine", volume = 0.08, when = 0) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime + when;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.03);
}

function noise(duration = 0.18, volume = 0.14) {
  if (!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const source = audioCtx.createBufferSource();
  const gain = audioCtx.createGain();
  gain.gain.value = volume;
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(audioCtx.destination);
  source.start();
}

function playShotSound() {
  ensureAudio();
  tone(780, 0.08, "square", 0.04);
  tone(420, 0.08, "sawtooth", 0.03, 0.035);
}

function playEnemyShotSound() {
  ensureAudio();
  tone(260, 0.12, "square", 0.035);
  tone(190, 0.12, "triangle", 0.025, 0.03);
}

function playDamageSound() {
  ensureAudio();
  tone(140, 0.18, "sawtooth", 0.09);
  tone(90, 0.22, "square", 0.05, 0.04);
  noise(0.18, 0.13);
}

function playHitSound() {
  ensureAudio();
  tone(120, 0.14, "sawtooth", 0.09);
  tone(70, 0.2, "square", 0.055);
  noise(0.2, 0.12);
}

function playCollectSound(type = 'coin') {
  ensureAudio();
  if (type === 'ring') {
    tone(620, 0.08, "triangle", 0.04);
    tone(930, 0.14, "sine", 0.028, 0.05);
  } else {
    tone(540, 0.06, "triangle", 0.03);
    tone(760, 0.08, "sine", 0.022, 0.03);
  }
}

function startMusic() {
  ensureAudio();
  if (musicTimer) return;

  const notes = [196, 247, 294, 330, 294, 247, 220, 247];
  let step = 0;

  musicTimer = setInterval(() => {
    if (!running || paused) return;
    const note = notes[step % notes.length];

    tone(note, 0.18, "triangle", 0.022);
    tone(note / 2, 0.24, "sine", 0.018);
    if (step % 4 === 0) tone(98, 0.14, "square", 0.018);

    step++;
  }, 280);
}

function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x84c7ec);
scene.fog = new THREE.Fog(0x84c7ec, 40, 145);

const camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 400);
camera.position.set(0, 4.7, 15.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemi = new THREE.HemisphereLight(0xf0fbff, 0x355b39, 1.35);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 2.35);
sun.position.set(-14, 24, 12);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -60;
sun.shadow.camera.right = 60;
sun.shadow.camera.top = 60;
sun.shadow.camera.bottom = -60;
scene.add(sun);

const mats = {
  grass: new THREE.MeshStandardMaterial({ color: 0x47c33e, roughness: 0.98, flatShading: true }),
  grass2: new THREE.MeshStandardMaterial({ color: 0x53d148, roughness: 0.98, flatShading: true }),
  dirt: new THREE.MeshStandardMaterial({ color: 0x8a5e2d, roughness: 0.98, flatShading: true }),
  road: new THREE.MeshStandardMaterial({ color: 0xddcf8d, roughness: 0.99, flatShading: true }),
  river: new THREE.MeshStandardMaterial({ color: 0x3397d4, roughness: 0.22, transparent: true, opacity: 0.88, flatShading: true }),
  trunk: new THREE.MeshStandardMaterial({ color: 0x724a22, roughness: 0.95, flatShading: true }),
  tree: new THREE.MeshStandardMaterial({ color: 0x1f8032, roughness: 0.92, flatShading: true }),
  tree2: new THREE.MeshStandardMaterial({ color: 0x2c9840, roughness: 0.92, flatShading: true }),
  rock: new THREE.MeshStandardMaterial({ color: 0xbfc8bd, roughness: 0.98, flatShading: true }),
  hill: new THREE.MeshStandardMaterial({ color: 0x71b85d, roughness: 0.98, flatShading: true }),
  building: new THREE.MeshStandardMaterial({ color: 0x95b4b8, roughness: 0.96, flatShading: true }),
  playerBody: new THREE.MeshStandardMaterial({ color: 0xffc933, roughness: 0.42, flatShading: true }),
  playerWing: new THREE.MeshStandardMaterial({ color: 0x1b67e0, roughness: 0.4, flatShading: true }),
  enemyBody: new THREE.MeshStandardMaterial({ color: 0xe83d62, roughness: 0.42, flatShading: true }),
  enemyWing: new THREE.MeshStandardMaterial({ color: 0x6833dc, roughness: 0.4, flatShading: true }),
  canopy: new THREE.MeshStandardMaterial({ color: 0x1c2f56, roughness: 0.28, flatShading: true }),
  bullet: new THREE.MeshStandardMaterial({ color: 0x8cf4ff, emissive: 0x18c8ff, emissiveIntensity: 1.2 }),
  enemyBullet: new THREE.MeshStandardMaterial({ color: 0xff8d6d, emissive: 0xff5326, emissiveIntensity: 1.05, roughness: 0.28, flatShading: true }),
  robotBody: new THREE.MeshStandardMaterial({ color: 0xe9eef5, roughness: 0.82, flatShading: true }),
  robotWing: new THREE.MeshStandardMaterial({ color: 0x4551e0, roughness: 0.58, flatShading: true }),
  robotAccent: new THREE.MeshStandardMaterial({ color: 0x7c2fcb, roughness: 0.55, flatShading: true }),
  robotCore: new THREE.MeshStandardMaterial({ color: 0x9fe8ff, roughness: 0.26, emissive: 0x5ad7ff, emissiveIntensity: 0.2, flatShading: true }),
};

function shadowify(mesh, receive = true, cast = true) {
  mesh.receiveShadow = receive;
  mesh.castShadow = cast;
  return mesh;
}

function createHorizontalWing(side = 1, length = 1.35, span = 1.25) {
  // Wing built directly in the XZ plane, keeping it horizontal like a Star Fox-style craft.
  const vertices = new Float32Array([
    0, 0, -length * 0.55,
    side * span, 0, 0,
    0, 0, length * 0.55,

    0, -0.06, -length * 0.55,
    side * span, -0.06, 0,
    0, -0.06, length * 0.55,
  ]);

  const indices = [
    0, 1, 2,
    5, 4, 3,
    0, 3, 4, 0, 4, 1,
    1, 4, 5, 1, 5, 2,
    2, 5, 3, 2, 3, 0
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function makeTree(scale = 1) {
  const g = new THREE.Group();

  const trunk = shadowify(new THREE.Mesh(new THREE.CylinderGeometry(0.14 * scale, 0.18 * scale, 1 * scale, 5), mats.trunk));
  trunk.position.y = 0.5 * scale;
  g.add(trunk);

  const c1 = shadowify(new THREE.Mesh(new THREE.ConeGeometry(0.62 * scale, 1.2 * scale, 5), mats.tree));
  c1.position.y = 1.1 * scale;
  g.add(c1);

  const c2 = shadowify(new THREE.Mesh(new THREE.ConeGeometry(0.43 * scale, 0.9 * scale, 5), mats.tree2));
  c2.position.y = 1.85 * scale;
  g.add(c2);

  return g;
}

function makeRock(scale = 1) {
  const r = shadowify(new THREE.Mesh(new THREE.DodecahedronGeometry(scale, 0), mats.rock));
  r.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  return r;
}

function makeHill(scale = 1) {
  const hill = shadowify(new THREE.Mesh(new THREE.CylinderGeometry(2.5 * scale, 4.2 * scale, 3.2 * scale, 5), mats.hill));
  hill.position.y = 1.4 * scale;
  return hill;
}

function makeBuilding(scale = 1) {
  const g = new THREE.Group();
  const body = shadowify(new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 2.8 * scale, 1.4 * scale), mats.building));
  body.position.y = 1.4 * scale;
  g.add(body);

  const roof = shadowify(new THREE.Mesh(new THREE.ConeGeometry(1 * scale, 1 * scale, 4), mats.road));
  roof.position.y = 3.3 * scale;
  roof.rotation.y = Math.PI * 0.25;
  g.add(roof);
  return g;
}

function makeGiantRobot(scale = 1) {
  const g = new THREE.Group();

  const torso = shadowify(new THREE.Mesh(new THREE.BoxGeometry(1.8 * scale, 2.2 * scale, 1.3 * scale), mats.robotBody));
  torso.position.y = 6.5 * scale;
  g.add(torso);

  const core = shadowify(new THREE.Mesh(new THREE.OctahedronGeometry(0.62 * scale, 0), mats.robotCore));
  core.position.set(0, 6.65 * scale, 0.82 * scale);
  core.scale.set(1.1, 1.25, 0.85);
  g.add(core);

  const head = shadowify(new THREE.Mesh(new THREE.BoxGeometry(1.0 * scale, 0.9 * scale, 0.9 * scale), mats.robotBody));
  head.position.set(0, 8.05 * scale, 0);
  g.add(head);

  const visor = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.7 * scale, 0.18 * scale, 0.16 * scale), mats.robotCore));
  visor.position.set(0, 8.1 * scale, 0.48 * scale);
  g.add(visor);

  const crest = shadowify(new THREE.Mesh(new THREE.ConeGeometry(0.24 * scale, 0.9 * scale, 4), mats.robotAccent));
  crest.position.set(0, 8.72 * scale, 0.05 * scale);
  crest.rotation.x = Math.PI;
  g.add(crest);

  const shoulderBar = shadowify(new THREE.Mesh(new THREE.BoxGeometry(3.1 * scale, 0.45 * scale, 0.55 * scale), mats.robotAccent));
  shoulderBar.position.set(0, 6.95 * scale, 0);
  g.add(shoulderBar);

  for (const side of [-1, 1]) {
    const wing = shadowify(new THREE.Mesh(createHorizontalWing(side, 1.7 * scale, 0.9 * scale), mats.robotWing));
    wing.position.set(side * 0.9 * scale, 7.1 * scale, 0.05 * scale);
    wing.rotation.z = side * 0.2;
    g.add(wing);

    const fin = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.3 * scale, 3.8 * scale, 0.45 * scale), mats.robotWing));
    fin.position.set(side * 1.45 * scale, 5.8 * scale, 0.05 * scale);
    fin.rotation.z = side * -0.14;
    g.add(fin);

    const upperArm = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.35 * scale, 1.4 * scale, 0.35 * scale), mats.robotBody));
    upperArm.position.set(side * 1.45 * scale, 5.8 * scale, 0);
    upperArm.rotation.z = side * -0.32;
    g.add(upperArm);

    const lowerArm = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.28 * scale, 1.2 * scale, 0.28 * scale), mats.robotBody));
    lowerArm.position.set(side * 1.9 * scale, 4.8 * scale, 0.1 * scale);
    lowerArm.rotation.z = side * 0.24;
    g.add(lowerArm);

    const claw = shadowify(new THREE.Mesh(new THREE.ConeGeometry(0.2 * scale, 0.6 * scale, 4), mats.robotAccent));
    claw.position.set(side * 2.15 * scale, 4.1 * scale, 0.18 * scale);
    claw.rotation.z = side * Math.PI * 0.5;
    g.add(claw);

    const hip = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 0.7 * scale, 0.6 * scale), mats.robotBody));
    hip.position.set(side * 0.55 * scale, 4.55 * scale, 0);
    g.add(hip);

    const thigh = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.42 * scale, 2.2 * scale, 0.42 * scale), mats.robotBody));
    thigh.position.set(side * 0.55 * scale, 3.15 * scale, 0);
    thigh.rotation.z = side * 0.08;
    g.add(thigh);

    const shin = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.34 * scale, 2.0 * scale, 0.34 * scale), mats.robotWing));
    shin.position.set(side * 0.7 * scale, 1.55 * scale, 0.1 * scale);
    shin.rotation.z = side * -0.14;
    g.add(shin);

    const foot = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.85 * scale, 0.28 * scale, 1.1 * scale), mats.robotAccent));
    foot.position.set(side * 0.75 * scale, 0.18 * scale, 0.18 * scale);
    g.add(foot);
  }

  g.traverse((child) => {
    if (child.isMesh) child.userData.noCollision = true;
  });

  return g;
}

function makeBridge() {
  const g = new THREE.Group();
  const deck = shadowify(new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.25, 1.4), mats.dirt));
  deck.position.set(0, 0.56, 0);
  g.add(deck);

  for (let i = -2; i <= 2; i++) {
    const postL = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.95, 0.14), mats.trunk));
    postL.position.set(-2.4, 0.48, i * 0.3);
    g.add(postL);

    const postR = postL.clone();
    postR.position.x = 2.4;
    g.add(postR);
  }
  return g;
}

function rngFromSeed(seed) {
  let t = seed * 1103515245 + 12345;
  return () => {
    t = (1664525 * t + 1013904223) % 4294967296;
    return t / 4294967296;
  };
}

const terrainRoot = new THREE.Group();
terrainRoot.position.set(0, -3.1, 8.0);
scene.add(terrainRoot);

const farRoot = new THREE.Group();
farRoot.position.set(0, -2.8, -118);
scene.add(farRoot);

const skyRoot = new THREE.Group();
scene.add(skyRoot);

const SEGMENT_LENGTH = 22;
const SEGMENT_COUNT = 12;
const TERRAIN_SPEED = 18.5;
const terrainSegments = [];

function clearChildren(group) {
  while (group.children.length) group.remove(group.children[0]);
}

function populateSegment(content, seed) {
  const rand = rngFromSeed(seed);
  const rf = (a, b) => a + (b - a) * rand();

  const ground = shadowify(new THREE.Mesh(new THREE.BoxGeometry(72, 0.55, SEGMENT_LENGTH), mats.grass));
  ground.position.set(0, -0.28, 0);
  content.add(ground);

  const road = shadowify(new THREE.Mesh(new THREE.BoxGeometry(12, 0.08, SEGMENT_LENGTH), mats.road));
  road.position.set(-4.8, 0.07, 0);
  content.add(road);

  const river = shadowify(new THREE.Mesh(new THREE.BoxGeometry(9, 0.07, SEGMENT_LENGTH), mats.river), true, false);
  river.position.set(9.4, 0.09, 0);
  content.add(river);

  // soft banks instead of hard green walls
  const leftBank = shadowify(new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.26, SEGMENT_LENGTH), mats.grass2));
  leftBank.position.set(-17.5, 0.13, 0);
  content.add(leftBank);

  const rightBank = leftBank.clone();
  rightBank.position.x = 18.7;
  content.add(rightBank);

  // sparse large trees, buildings and hills on the sides
  const leftCount = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < leftCount; i++) {
    const pick = rand();
    let obj;
    if (pick < 0.45) obj = makeTree(rf(1.4, 2.5));
    else if (pick < 0.75) obj = makeHill(rf(1.2, 2.1));
    else obj = makeBuilding(rf(1.1, 1.8));

    obj.position.set(rf(-28, -16), 0, rf(-8.5, 8.5));
    obj.rotation.y = rf(0, Math.PI * 2);
    content.add(obj);
  }

  const rightCount = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < rightCount; i++) {
    const pick = rand();
    let obj;
    if (pick < 0.45) obj = makeTree(rf(1.4, 2.5));
    else if (pick < 0.75) obj = makeHill(rf(1.2, 2.1));
    else obj = makeBuilding(rf(1.1, 1.8));

    obj.position.set(rf(16, 29), 0, rf(-8.5, 8.5));
    obj.rotation.y = rf(0, Math.PI * 2);
    content.add(obj);
  }

  if (seed % 5 === 0 || rand() > 0.82) {
    const robot = makeGiantRobot(rf(0.95, 1.28));
    const onLeft = rand() > 0.5;
    robot.position.set(onLeft ? rf(-24, -14) : rf(14, 24), 0, rf(-6.5, 6.5));
    robot.rotation.y = onLeft ? rf(0.2, 0.7) : rf(-0.7, -0.2);
    content.add(robot);
  }

  const rocks = 4 + Math.floor(rand() * 4);
  for (let i = 0; i < rocks; i++) {
    const rock = makeRock(rf(0.3, 0.75));
    rock.position.set(rf(-12, 14), 0.25, rf(-9, 9));
    content.add(rock);
  }

  if (seed % 4 === 0) {
    const bridge = makeBridge();
    bridge.position.set(9.4, 0, rf(-2.5, 2.5));
    content.add(bridge);
  }
}

function createTerrainSegment(index, z) {
  const group = new THREE.Group();
  group.position.z = z;
  const content = new THREE.Group();
  group.add(content);
  group.userData.content = content;
  group.userData.seed = index + 1;
  populateSegment(content, group.userData.seed);
  terrainRoot.add(group);
  terrainSegments.push(group);
}

for (let i = 0; i < SEGMENT_COUNT; i++) {
  createTerrainSegment(i, -i * SEGMENT_LENGTH);
}

function buildFarBackground() {
  // far hills / mountain range to fill horizon softly
  for (let i = -9; i <= 9; i++) {
    const hill = makeHill(2.7 + Math.random() * 1.8);
    hill.position.set(i * 9 + THREE.MathUtils.randFloatSpread(3), 0, THREE.MathUtils.randFloatSpread(18));
    farRoot.add(hill);

    if (Math.random() > 0.55) {
      const tree = makeTree(2.6 + Math.random() * 1.3);
      tree.position.set(i * 8 + THREE.MathUtils.randFloatSpread(4), 0, THREE.MathUtils.randFloatSpread(24));
      farRoot.add(tree);
    } else {
      const b = makeBuilding(1.8 + Math.random() * 1.1);
      b.position.set(i * 8 + THREE.MathUtils.randFloatSpread(4), 0, THREE.MathUtils.randFloatSpread(24));
      farRoot.add(b);
    }
  }

  for (let i = 0; i < 4; i++) {
    const robot = makeGiantRobot(1.85 + Math.random() * 0.55);
    const side = i % 2 === 0 ? -1 : 1;
    robot.position.set(side * (46 + Math.random() * 16), 0, -18 + i * 16 + THREE.MathUtils.randFloatSpread(5));
    robot.rotation.y = side < 0 ? 0.5 : -0.5;
    farRoot.add(robot);
  }

  for (let i = 0; i < 10; i++) {
    const cloud = new THREE.Group();
    const puffCount = 4 + Math.floor(Math.random() * 3);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      flatShading: true,
      transparent: true,
      opacity: 0.98
    });

    for (let j = 0; j < puffCount; j++) {
      const radius = 1.15 + Math.random() * 0.75;
      const c = shadowify(
        new THREE.Mesh(new THREE.IcosahedronGeometry(radius, 2), cloudMat),
        false,
        false
      );
      const spreadX = (j - (puffCount - 1) * 0.5) * (1.55 + Math.random() * 0.6);
      c.position.set(
        spreadX,
        Math.random() * 0.4 + Math.sin(j * 0.8) * 0.18,
        THREE.MathUtils.randFloatSpread(0.45)
      );
      c.scale.set(
        1.0 + Math.random() * 0.22,
        0.82 + Math.random() * 0.10,
        1.0 + Math.random() * 0.15
      );
      cloud.add(c);
    }

    const core = shadowify(
      new THREE.Mesh(new THREE.IcosahedronGeometry(1.85 + Math.random() * 0.45, 2), cloudMat),
      false,
      false
    );
    core.position.set(0, 0.2, 0);
    core.scale.set(1.35, 0.9, 1.0);
    cloud.add(core);

    cloud.position.set(THREE.MathUtils.randFloatSpread(130), 18 + Math.random() * 10, -18 + THREE.MathUtils.randFloatSpread(62));
    cloud.scale.setScalar(0.88 + Math.random() * 0.22);
    skyRoot.add(cloud);
  }
}
buildFarBackground();

const player = new THREE.Group();
scene.add(player);

function buildPlayer() {
  const body = shadowify(new THREE.Mesh(new THREE.ConeGeometry(0.52, 1.7, 4), mats.playerBody));
  body.rotation.x = Math.PI / 2;
  player.add(body);

  const leftWing = shadowify(new THREE.Mesh(createHorizontalWing(-1, 1.55, 1.35), mats.playerWing));
  leftWing.position.set(-0.22, -0.04, 0.05);
  player.add(leftWing);

  const rightWing = shadowify(new THREE.Mesh(createHorizontalWing(1, 1.55, 1.35), mats.playerWing));
  rightWing.position.set(0.22, -0.04, 0.05);
  player.add(rightWing);

  const tail = shadowify(new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.95, 4), mats.playerWing));
  tail.position.set(0, 0.28, 0.76);
  tail.rotation.x = Math.PI / 2;
  player.add(tail);

  const nose = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.42), mats.playerBody));
  nose.position.set(0, 0.03, -0.95);
  player.add(nose);

  const canopy = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.42), mats.canopy));
  canopy.position.set(0, 0.19, -0.05);
  player.add(canopy);

  player.position.set(0, 1.15, 8.5);
  player.rotation.x = -0.08;
  player.userData.rollTimer = 0;
  player.userData.rollDir = 0;
  player.userData.hitTimer = 0;
}
buildPlayer();

const bullets = [];
const enemyBullets = [];
const enemies = [];
const explosions = [];
const rings = [];
const coins = [];

function addEnemyDart(enemy) {
  const body = shadowify(new THREE.Mesh(new THREE.OctahedronGeometry(0.58, 0), mats.enemyBody));
  body.scale.set(1.4, 0.58, 1);
  enemy.add(body);

  const leftWing = shadowify(new THREE.Mesh(createHorizontalWing(-1, 1.12, 0.98), mats.enemyWing));
  leftWing.position.set(-0.16, -0.04, 0.03);
  enemy.add(leftWing);

  const rightWing = shadowify(new THREE.Mesh(createHorizontalWing(1, 1.12, 0.98), mats.enemyWing));
  rightWing.position.set(0.16, -0.04, 0.03);
  enemy.add(rightWing);

  const tail = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.52, 0.16), mats.enemyWing));
  tail.position.set(0, 0.28, 0.55);
  enemy.add(tail);
}

function addEnemyBlade(enemy) {
  const body = shadowify(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.42, 0.96), mats.enemyBody));
  body.position.y = 0.02;
  enemy.add(body);

  const nose = shadowify(new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.9, 4), mats.enemyBody));
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 0.02, -0.82);
  enemy.add(nose);

  for (const side of [-1, 1]) {
    const wing = shadowify(new THREE.Mesh(createHorizontalWing(side, 1.45, 1.15), mats.enemyWing));
    wing.position.set(side * 0.08, -0.02, 0.02);
    wing.rotation.z = side * 0.04;
    enemy.add(wing);

    const fin = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), mats.enemyWing));
    fin.position.set(side * 0.78, 0.22, 0.38);
    enemy.add(fin);
  }
}

function addEnemyFork(enemy) {
  const core = shadowify(new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0), mats.enemyBody));
  core.scale.set(1.2, 0.7, 1.3);
  enemy.add(core);

  const cockpit = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.42), mats.canopy));
  cockpit.position.set(0, 0.18, -0.05);
  enemy.add(cockpit);

  for (const side of [-1, 1]) {
    const boom = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 1.08), mats.enemyWing));
    boom.position.set(side * 0.52, -0.02, 0.08);
    boom.rotation.y = side * 0.12;
    enemy.add(boom);

    const tip = shadowify(new THREE.Mesh(new THREE.TetrahedronGeometry(0.34, 0), mats.enemyWing));
    tip.position.set(side * 1.05, -0.02, -0.22);
    tip.rotation.z = side * -0.55;
    enemy.add(tip);

    const rear = shadowify(new THREE.Mesh(new THREE.TetrahedronGeometry(0.28, 0), mats.enemyWing));
    rear.position.set(side * 0.82, 0.06, 0.68);
    rear.rotation.x = Math.PI;
    enemy.add(rear);
  }
}

function createEnemy() {
  const enemy = new THREE.Group();
  const types = ['dart', 'blade', 'fork'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'blade') addEnemyBlade(enemy);
  else if (type === 'fork') addEnemyFork(enemy);
  else addEnemyDart(enemy);

  const lanes = [-8.5, -5.6, -2.8, 0, 2.8, 5.6, 8.5];
  let baseX = lanes[Math.floor(Math.random() * lanes.length)];
  let attempts = 0;
  while (Math.abs(baseX - lastEnemySpawnX) < 2.4 && attempts < 8) {
    baseX = lanes[Math.floor(Math.random() * lanes.length)];
    attempts += 1;
  }
  lastEnemySpawnX = baseX;

  const baseY = THREE.MathUtils.randFloat(1.8, 5.1);

  enemy.position.set(baseX, baseY, -78 - Math.random() * 14);
  enemy.userData = {
    speed: THREE.MathUtils.randFloat(12.8, 17.2) + wave * 0.85,
    baseX,
    baseY,
    phase: Math.random() * Math.PI * 2,
    swayX: THREE.MathUtils.randFloat(1.8, 4.4),
    swayY: THREE.MathUtils.randFloat(0.28, 1.1),
    freq: THREE.MathUtils.randFloat(0.62, 1.2),
    homing: THREE.MathUtils.randFloat(1.5, 2.2),
    t: Math.random() * 2,
    shotTimer: THREE.MathUtils.randFloat(1.4, 2.8),
    burstLeft: 0,
    burstGap: 0,
    radius: type === 'blade' ? 1.05 : 0.95,
    type,
  };

  scene.add(enemy);
  enemies.push(enemy);
}

function createRing() {
  const ring = new THREE.Group();
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xffd86b, roughness: 0.52, metalness: 0.12, flatShading: true });
  const torus = shadowify(new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.16, 8, 18), ringMat), false, false);
  ring.add(torus);

  const core = shadowify(new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.04, 6, 14), new THREE.MeshStandardMaterial({ color: 0xfff3b3, roughness: 0.8, flatShading: true })), false, false);
  ring.add(core);

  ring.position.set(THREE.MathUtils.randFloat(-6.8, 6.8), THREE.MathUtils.randFloat(1.6, 5.4), -90);
  ring.userData = {
    speed: TERRAIN_SPEED + 1.6,
    spin: THREE.MathUtils.randFloat(0.9, 1.8),
    radius: 1.18,
    value: 125,
    bobPhase: Math.random() * Math.PI * 2
  };
  scene.add(ring);
  rings.push(ring);
}

function createCoin(offset = 0) {
  const coin = new THREE.Group();
  const mesh = shadowify(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 10), new THREE.MeshStandardMaterial({ color: 0xffca3a, roughness: 0.45, metalness: 0.18, flatShading: true })), false, false);
  mesh.rotation.z = Math.PI / 2;
  coin.add(mesh);

  const center = shadowify(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.14, 8), new THREE.MeshStandardMaterial({ color: 0xffec96, roughness: 0.7, flatShading: true })), false, false);
  center.rotation.z = Math.PI / 2;
  coin.add(center);

  const laneX = THREE.MathUtils.randFloat(-5.8, 5.8);
  const laneY = THREE.MathUtils.randFloat(1.4, 5.2);
  coin.position.set(laneX + offset * 0.8, laneY + Math.sin(offset * 1.4) * 0.32, -86 - offset * 1.6);
  coin.userData = {
    speed: TERRAIN_SPEED + 1.2,
    value: 35,
    bobPhase: Math.random() * Math.PI * 2
  };
  scene.add(coin);
  coins.push(coin);
}

function createCollectBurst(position, color = 0xffd54a) {
  for (let i = 0; i < 10; i++) {
    const shard = shadowify(
      new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.08 + Math.random() * 0.08, 0),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.18, roughness: 0.8, flatShading: true })
      ),
      false,
      false
    );
    shard.position.copy(position);
    shard.userData.life = 0.45 + Math.random() * 0.25;
    shard.userData.velocity = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(2.3),
      THREE.MathUtils.randFloatSpread(2.3),
      THREE.MathUtils.randFloatSpread(2.3)
    );
    shard.userData.spin = new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8);
    scene.add(shard);
    explosions.push(shard);
  }
}

function createBullet() {
  const bullet = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.92), mats.bullet), false, false);
  bullet.position.copy(player.position);
  bullet.position.z -= 0.95;
  bullet.rotation.x = Math.PI * 0.5;
  bullet.userData.speed = 43;
  scene.add(bullet);
  bullets.push(bullet);
}

function createEnemyBullet(enemy) {
  const bullet = shadowify(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.98), mats.enemyBullet), false, false);
  bullet.position.copy(enemy.position);
  bullet.position.z += 0.75;

  const target = player.position.clone();
  target.x += THREE.MathUtils.randFloatSpread(0.5);
  target.y += THREE.MathUtils.randFloatSpread(0.4);
  const velocity = target.sub(enemy.position).normalize().multiplyScalar(19 + wave * 0.8);
  bullet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), velocity.clone().normalize());
  bullet.userData.velocity = velocity;
  bullet.userData.life = 6;
  scene.add(bullet);
  enemyBullets.push(bullet);
  playEnemyShotSound();
}

function shoot() {
  const now = performance.now();
  if (now - lastShot < 145) return;
  lastShot = now;
  createBullet();
  playShotSound();
}

function triggerRoll(dir) {
  if (player.userData.rollTimer > 0.05) return;
  player.userData.rollTimer = 0.42;
  player.userData.rollDir = dir;
}

function createDamageBurst(position) {
  for (let i = 0; i < 10; i++) {
    const shard = shadowify(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.08 + Math.random() * 0.12, 0.08 + Math.random() * 0.12, 0.08 + Math.random() * 0.2),
        new THREE.MeshStandardMaterial({ color: 0xff845f, emissive: 0xff4a2c, emissiveIntensity: 0.45, roughness: 0.6, flatShading: true })
      ),
      false,
      false
    );
    shard.position.copy(position);
    shard.userData.life = 0.35 + Math.random() * 0.25;
    shard.userData.velocity = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(3.5),
      THREE.MathUtils.randFloatSpread(2.8),
      THREE.MathUtils.randFloatSpread(3.5)
    );
    shard.userData.spin = new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10);
    scene.add(shard);
    explosions.push(shard);
  }
}

function damagePlayer(amountShield = 7, scorePenalty = 25, title = 'DAMAGE', text = 'A nave sofreu dano.') {
  shield -= amountShield;
  score = Math.max(0, score - scorePenalty);
  player.userData.hitTimer = 0.38;
  playDamageSound();
  createDamageBurst(player.position.clone());
  setMessage(title, text);
  updateHud();
  if (shield <= 0) endGame();
}

function createExplosion(position, enemyObject = null) {
  playHitSound();

  const colors = [0xe83d62, 0x6934dc, 0xffde66, 0xffffff];

  for (let i = 0; i < 22; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      emissive: i % 3 === 0 ? 0xff5500 : 0x000000,
      emissiveIntensity: i % 3 === 0 ? 0.7 : 0,
      roughness: 0.6,
      flatShading: true
    });

    const geometry =
      i % 2 === 0
        ? new THREE.TetrahedronGeometry(THREE.MathUtils.randFloat(0.09, 0.2), 0)
        : new THREE.BoxGeometry(
            THREE.MathUtils.randFloat(0.1, 0.28),
            THREE.MathUtils.randFloat(0.05, 0.18),
            THREE.MathUtils.randFloat(0.1, 0.28)
          );

    const shard = shadowify(new THREE.Mesh(geometry, material), false, false);
    shard.position.copy(position);
    shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    shard.userData.velocity = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(5.2),
      THREE.MathUtils.randFloatSpread(4.2),
      THREE.MathUtils.randFloatSpread(5.2)
    );
    shard.userData.spin = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(6),
      THREE.MathUtils.randFloatSpread(6),
      THREE.MathUtils.randFloatSpread(6)
    );
    shard.userData.life = THREE.MathUtils.randFloat(0.55, 0.95);
    scene.add(shard);
    explosions.push(shard);
  }
}

function setMessage(title, text) {
  titleEl.textContent = title;
  messageEl.textContent = text;
}

function updateHud() {
  const shieldValue = Math.max(0, Math.round(shield));
  scoreEl.textContent = score;
  shieldEl.textContent = `${shieldValue}%`;
  if (shieldFillEl) shieldFillEl.style.width = `${shieldValue}%`;
  waveEl.textContent = wave;
}

function resetGame() {
  score = 0;
  shield = 100;
  wave = 1;
  spawnTimer = 0;
  lastEnemySpawnX = 999;
  ringSpawnTimer = 1.2;
  coinSpawnTimer = 0.8;
  boostEnergy = 100;
  worldSpeed = 1;
  player.position.set(0, 1.15, 8.5);
  player.rotation.set(-0.08, 0, 0);
  player.userData.rollTimer = 0;
  player.userData.rollDir = 0;
  player.userData.hitTimer = 0;
  mats.playerBody.emissive.setHex(0x000000);
  mats.playerBody.emissiveIntensity = 0;
  mats.playerWing.emissive.setHex(0x000000);
  mats.playerWing.emissiveIntensity = 0;

  bullets.forEach(o => scene.remove(o));
  enemyBullets.forEach(o => scene.remove(o));
  enemies.forEach(o => scene.remove(o));
  explosions.forEach(o => scene.remove(o));
  rings.forEach(o => scene.remove(o));
  coins.forEach(o => scene.remove(o));
  bullets.length = 0;
  enemyBullets.length = 0;
  enemies.length = 0;
  explosions.length = 0;
  rings.length = 0;
  coins.length = 0;

  terrainSegments.forEach((seg, i) => {
    seg.position.z = -i * SEGMENT_LENGTH;
    clearChildren(seg.userData.content);
    seg.userData.seed = i + 1;
    populateSegment(seg.userData.content, seg.userData.seed);
  });

  updateHud();
}

function startGame() {
  ensureAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  resetGame();
  running = true;
  paused = false;
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  setMessage('MISSION START', 'Shift acelera, Q/E faz giros, inimigos atiram em rajadas e colisões causam dano.');
  startMusic();
}

function endGame() {
  running = false;
  finalScore.textContent = `Score: ${score}`;
  gameOverScreen.classList.remove('hidden');
  setMessage('MISSION FAILED', 'A nave perdeu o escudo.');
  stopMusic();
}

function updatePlayer(dt) {
  worldSpeed = THREE.MathUtils.lerp(worldSpeed, keys.boost && boostEnergy > 0 ? 1.8 : 1, 0.08);
  if (keys.boost && boostEnergy > 0) boostEnergy = Math.max(0, boostEnergy - 22 * dt);
  else boostEnergy = Math.min(100, boostEnergy + 12 * dt);

  const speed = 10.5 + (worldSpeed - 1) * 3.8;
  let dx = 0;
  let dy = 0;

  if (keys.left) dx--;
  if (keys.right) dx++;
  if (keys.up) dy++;
  if (keys.down) dy--;

  player.position.x += dx * speed * dt;
  player.position.y += dy * speed * dt;

  player.position.x = THREE.MathUtils.clamp(player.position.x, -10, 10);
  player.position.y = THREE.MathUtils.clamp(player.position.y, 0.9, 5.7);

  let rollAngle = 0;
  if (player.userData.rollTimer > 0) {
    const progress = 1 - player.userData.rollTimer / 0.42;
    rollAngle = player.userData.rollDir * progress * Math.PI * 2;
    player.userData.rollTimer = Math.max(0, player.userData.rollTimer - dt);
  }

  if (player.userData.hitTimer > 0) {
    player.userData.hitTimer = Math.max(0, player.userData.hitTimer - dt);
    const pulse = 0.4 + Math.sin(performance.now() * 0.045) * 0.3;
    mats.playerBody.emissive.setHex(0xff6333);
    mats.playerBody.emissiveIntensity = pulse;
    mats.playerWing.emissive.setHex(0xff3f1f);
    mats.playerWing.emissiveIntensity = pulse * 0.6;
  } else {
    mats.playerBody.emissive.setHex(0x000000);
    mats.playerBody.emissiveIntensity = 0;
    mats.playerWing.emissive.setHex(0x000000);
    mats.playerWing.emissiveIntensity = 0;
  }

  const extraBank = player.userData.hitTimer > 0 ? Math.sin(performance.now() * 0.06) * 0.1 : 0;
  player.rotation.z = THREE.MathUtils.lerp(player.rotation.z, -dx * 0.34 + rollAngle + extraBank, 0.18);
  player.rotation.x = THREE.MathUtils.lerp(player.rotation.x, -0.08 - dy * 0.12 - (worldSpeed - 1) * 0.05, 0.14);
  player.rotation.y = THREE.MathUtils.lerp(player.rotation.y, dx * 0.08, 0.12);

  if (keys.shoot) shoot();
}

function updateBullets(dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.position.z -= bullet.userData.speed * dt * worldSpeed;
    if (bullet.position.z < -72) {
      scene.remove(bullet);
      bullets.splice(i, 1);
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const bullet = enemyBullets[i];
    bullet.position.addScaledVector(bullet.userData.velocity, dt);
    bullet.userData.life -= dt;

    if (bullet.position.distanceTo(player.position) < 0.72) {
      createDamageBurst(bullet.position.clone());
      scene.remove(bullet);
      enemyBullets.splice(i, 1);
      damagePlayer(6, 20, 'ENEMY FIRE', 'Você foi atingido por uma rajada inimiga.');
      continue;
    }

    if (bullet.userData.life <= 0 || bullet.position.z > 28 || Math.abs(bullet.position.x) > 18 || bullet.position.y < -2 || bullet.position.y > 9) {
      scene.remove(bullet);
      enemyBullets.splice(i, 1);
    }
  }
}

function updateEnemies(dt) {
  spawnTimer -= dt;

  if (spawnTimer <= 0) {
    createEnemy();
    spawnTimer = Math.max(0.55, 1.25 - wave * 0.03);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    const data = enemy.userData;
    data.t += dt;

    const desiredX = data.baseX + Math.sin(data.t * data.freq + data.phase) * data.swayX + player.position.x * 0.28;
    const desiredY = data.baseY + Math.sin(data.t * (data.freq * 1.35) + data.phase * 0.7) * data.swayY + (player.position.y - 3.2) * 0.16;

    const prevX = enemy.position.x;
    const prevY = enemy.position.y;

    enemy.position.x = THREE.MathUtils.lerp(enemy.position.x, desiredX, dt * data.homing);
    enemy.position.y = THREE.MathUtils.lerp(enemy.position.y, desiredY, dt * (data.homing - 0.3));
    enemy.position.z += data.speed * dt * worldSpeed;

    const dx = enemy.position.x - prevX;
    const dy = enemy.position.y - prevY;
    enemy.rotation.z = THREE.MathUtils.lerp(enemy.rotation.z, -dx * 2.6, 0.18);
    enemy.rotation.x = THREE.MathUtils.lerp(enemy.rotation.x, dy * 1.4, 0.18);
    enemy.rotation.y += dt * 0.8;

    data.shotTimer -= dt;
    if (enemy.position.z > -48 && enemy.position.z < 10) {
      if (data.burstLeft > 0) {
        data.burstGap -= dt;
        if (data.burstGap <= 0) {
          createEnemyBullet(enemy);
          data.burstLeft -= 1;
          data.burstGap = 0.17;
        }
      } else if (data.shotTimer <= 0) {
        data.burstLeft = THREE.MathUtils.randInt(2, 4);
        data.burstGap = 0;
        data.shotTimer = THREE.MathUtils.randFloat(1.2, 2.4);
      }
    }

    if (enemy.position.distanceTo(player.position) < 1.08) {
      createExplosion(enemy.position.clone(), enemy);
      scene.remove(enemy);
      enemies.splice(i, 1);
      damagePlayer(10, 35, 'DIRECT HIT', 'Colisão direta. Inimigo destruído e sua nave sofreu dano.');
      continue;
    }

    if (enemy.position.z > 16) {
      shield -= 6;
      scene.remove(enemy);
      enemies.splice(i, 1);
      setMessage('SHIELD HIT', 'Um inimigo passou pela defesa.');
      updateHud();
      if (shield <= 0) endGame();
    }
  }
}

function updateCollectibles(dt) {
  ringSpawnTimer -= dt;
  coinSpawnTimer -= dt;

  if (ringSpawnTimer <= 0) {
    createRing();
    ringSpawnTimer = THREE.MathUtils.randFloat(4.2, 6.2);
  }

  if (coinSpawnTimer <= 0) {
    const chain = THREE.MathUtils.randInt(2, 4);
    for (let i = 0; i < chain; i++) createCoin(i);
    coinSpawnTimer = THREE.MathUtils.randFloat(2.0, 3.4);
  }

  for (let i = rings.length - 1; i >= 0; i--) {
    const ring = rings[i];
    ring.position.z += ring.userData.speed * dt * worldSpeed;
    ring.rotation.z += ring.userData.spin * dt;
    ring.position.y += Math.sin(performance.now() * 0.0018 + ring.userData.bobPhase) * 0.003;

    if (ring.position.distanceTo(player.position) < ring.userData.radius) {
      score += ring.userData.value;
      playCollectSound('ring');
      createCollectBurst(ring.position.clone(), 0xffe27a);
      setMessage('RING BONUS', `Anel coletado: +${ring.userData.value} pontos.`);
      scene.remove(ring);
      rings.splice(i, 1);
      updateHud();
      continue;
    }

    if (ring.position.z > 20) {
      scene.remove(ring);
      rings.splice(i, 1);
    }
  }

  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    coin.position.z += coin.userData.speed * dt * worldSpeed;
    coin.rotation.y += dt * 4.2;
    coin.position.y += Math.sin(performance.now() * 0.0022 + coin.userData.bobPhase) * 0.004;

    if (coin.position.distanceTo(player.position) < 0.72) {
      score += coin.userData.value;
      playCollectSound('coin');
      createCollectBurst(coin.position.clone(), 0xffca3a);
      scene.remove(coin);
      coins.splice(i, 1);
      updateHud();
      continue;
    }

    if (coin.position.z > 18) {
      scene.remove(coin);
      coins.splice(i, 1);
    }
  }
}

function updateCollisions() {
  for (let e = enemies.length - 1; e >= 0; e--) {
    const enemy = enemies[e];
    for (let b = bullets.length - 1; b >= 0; b--) {
      const bullet = bullets[b];
      if (enemy.position.distanceTo(bullet.position) < 0.82) {
        createExplosion(enemy.position, enemy);
        scene.remove(enemy);
        scene.remove(bullet);
        enemies.splice(e, 1);
        bullets.splice(b, 1);
        score += 100;

        if (score > 0 && score % 700 === 0) {
          wave += 1;
          setMessage('WAVE UP', `Onda ${wave}. Mais velocidade e mais pressão.`);
        } else {
          setMessage('TARGET DOWN', 'Inimigo abatido.');
        }
        updateHud();
        break;
      }
    }
  }
}

function updateExplosions(dt) {
  for (let i = explosions.length - 1; i >= 0; i--) {
    const shard = explosions[i];
    shard.userData.life -= dt;

    if (shard.userData.velocity) {
      shard.userData.velocity.y -= 2.8 * dt;
      shard.position.addScaledVector(shard.userData.velocity, dt);
    }

    if (shard.userData.spin) {
      shard.rotation.x += shard.userData.spin.x * dt;
      shard.rotation.y += shard.userData.spin.y * dt;
      shard.rotation.z += shard.userData.spin.z * dt;
    }

    shard.scale.multiplyScalar(0.982);

    if (shard.userData.life <= 0) {
      scene.remove(shard);
      explosions.splice(i, 1);
    }
  }
}

function updateTerrain(dt) {
  for (const seg of terrainSegments) {
    seg.position.z += TERRAIN_SPEED * dt * worldSpeed;

    if (seg.position.z > SEGMENT_LENGTH) {
      seg.position.z -= SEGMENT_LENGTH * SEGMENT_COUNT;
      seg.userData.seed += SEGMENT_COUNT;
      clearChildren(seg.userData.content);
      populateSegment(seg.userData.content, seg.userData.seed);
    }
  }

  skyRoot.children.forEach((c, i) => {
    c.position.x += Math.sin(performance.now() * 0.00008 + i) * 0.0022;
    c.position.y += Math.cos(performance.now() * 0.00005 + i * 0.7) * 0.0009;
  });
  farRoot.rotation.y = Math.sin(performance.now() * 0.00012) * 0.015;
}

function updateCamera() {
  const desired = new THREE.Vector3(
    player.position.x * 0.24,
    player.position.y + 3.9,
    player.position.z + 8.8 - (worldSpeed - 1) * 0.8
  );
  camera.position.lerp(desired, 0.07);
  camera.lookAt(player.position.x * 0.18, player.position.y * 0.38, player.position.z - 18 - (worldSpeed - 1) * 3.5);
}

let last = performance.now();

function animate(now) {
  requestAnimationFrame(animate);
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  if (running && !paused) {
    updatePlayer(dt);
    updateBullets(dt);
    updateEnemies(dt);
    updateCollectibles(dt);
    updateCollisions();
    updateExplosions(dt);
    updateTerrain(dt);
    updateCamera();
  }

  renderer.render(scene, camera);
}

requestAnimationFrame(animate);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('keydown', (e) => {
  ensureAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
  if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = true;
  if (e.code === 'Space') keys.shoot = true;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.boost = true;
  if (e.code === 'KeyQ') triggerRoll(-1);
  if (e.code === 'KeyE') triggerRoll(1);

  if (e.code === 'KeyP') {
    paused = !paused;
    setMessage(paused ? 'PAUSED' : 'MISSION ACTIVE', paused ? 'Jogo pausado.' : 'Continue combatendo.');
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
  if (e.code === 'ArrowDown' || e.code === 'KeyS') keys.down = false;
  if (e.code === 'Space') keys.shoot = false;
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.boost = false;
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

updateHud();
