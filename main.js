// --------------------------------------------------
// Main app loop
// --------------------------------------------------

let currentScreen = "start";
let level1Sprite = null;
let level2Sprite = null;
let level3Sprite = null;
let level1bg;
let suspectImgs1 = [];
let suspectFaces1 = [];
let suspectImgs2 = [];
let suspectFaces2 = [];
let suspectImgs3 = [];
let suspectFaces3 = [];
let realFaces1 = [];
let realFaces2 = [];
let realFaces3 = [];

// LEVEL 2 AUDIO
let level2Voices = [];

// LEVEL 3 AUDIO
let suspectVoices3 = [];
let currentVoice3 = null;

let level2BG;
let level3BG;
let level1BG;

let level1Time = 70; // 2.5 minutes
let level2Time = 65; // 1.5 minutes
let level3Time = 55; // 1 minute

let currentTimer = 0;
let lastTimeCheck = 0;
let maxTime = 150; // used for clock animation

// SCORE
let playerScore = 0;
const POINTS_CORRECT = 10;
const POINTS_WRONG = 5;

const FIXED_GAME_WIDTH = 1280;
const FIXED_GAME_HEIGHT = 720;

function preload() {
  soundFormats("wav");

  level1BG = loadImage("assets/images/backgroundimagefixed.png");
  suspectImgs1[0] = loadImage("assets/images/mia.png");
  suspectImgs1[1] = loadImage("assets/images/derek.png");
  suspectImgs1[2] = loadImage("assets/images/luis.png");

  suspectFaces1[0] = loadImage("assets/images/miacalm.png");
  suspectFaces1[1] = loadImage("assets/images/dereknervous.png");
  suspectFaces1[2] = loadImage("assets/images/luisangry.png");

  realFaces1[0] = loadImage("assets/images/mia_true.png");
  realFaces1[1] = loadImage("assets/images/derek_true.png");
  realFaces1[2] = loadImage("assets/images/luis_true.png");

  level2BG = loadImage("assets/images/backgroundimagefixed.png");

  suspectImgs2[0] = loadImage("assets/images/taylor.png");
  suspectImgs2[1] = loadImage("assets/images/jordon.png");
  suspectImgs2[2] = loadImage("assets/images/avery.png");
  suspectImgs2[3] = loadImage("assets/images/morgan.png");

  suspectFaces2[0] = loadImage("assets/images/taylorcalm.png");
  suspectFaces2[1] = loadImage("assets/images/jordonnervous.png");
  suspectFaces2[2] = loadImage("assets/images/averyupset.png");
  suspectFaces2[3] = loadImage("assets/images/morgantired.png");

  // LEVEL 2 TRUE (MAGNIFY) FACES
  realFaces2[0] = loadImage("assets/images/taylor_true.png");
  realFaces2[1] = loadImage("assets/images/jordon_true.png");
  realFaces2[2] = loadImage("assets/images/avery_true.png");
  realFaces2[3] = loadImage("assets/images/morgan_true.png");

  // LEVEL 2 AUDIO
  level2Voices[0] = loadSound("assets/sounds/taylor_voice.wav");
  level2Voices[1] = loadSound("assets/sounds/jordan_voice.wav");
  level2Voices[2] = loadSound("assets/sounds/avery_voice.wav");
  level2Voices[3] = loadSound("assets/sounds/morgan_voice.wav");

  // LEVEL 3 IMAGES
  level3BG = loadImage("assets/images/backgroundimagefixed.png");

  suspectImgs3[0] = loadImage("assets/images/noah_normal.png");
  suspectImgs3[1] = loadImage("assets/images/riley_normal.png");
  suspectImgs3[2] = loadImage("assets/images/casey_normal.png");
  suspectImgs3[3] = loadImage("assets/images/jamie_normal.png");
  suspectImgs3[4] = loadImage("assets/images/emma_normal.png");

  suspectFaces3[0] = loadImage("assets/images/noah_fake.png");
  suspectFaces3[1] = loadImage("assets/images/riley_fake.png");
  suspectFaces3[2] = loadImage("assets/images/casey_fake.png");
  suspectFaces3[3] = loadImage("assets/images/jamie_fake.png");
  suspectFaces3[4] = loadImage("assets/images/emma_fake.png");

  realFaces3[0] = loadImage("assets/images/noah_true.png");
  realFaces3[1] = loadImage("assets/images/riley_true.png");
  realFaces3[2] = loadImage("assets/images/casey_true.png");
  realFaces3[3] = loadImage("assets/images/jamie_true.png");
  realFaces3[4] = loadImage("assets/images/emma_true.png");

  // LEVEL 3 AUDIO
  suspectVoices3[0] = loadSound("assets/sounds/noah_voice.wav");
  suspectVoices3[1] = loadSound("assets/sounds/riley_voice.wav");
  suspectVoices3[2] = loadSound("assets/sounds/casey_voice.wav");
  suspectVoices3[3] = loadSound("assets/sounds/jamie_voice.wav");
  suspectVoices3[4] = loadSound("assets/sounds/emma_voice.wav");
}

function stopLevel2Voices() {
  for (let i = 0; i < level2Voices.length; i++) {
    if (level2Voices[i] && level2Voices[i].isPlaying()) {
      level2Voices[i].stop();
    }
  }
}

function stopLevel3Voice() {
  if (currentVoice3 && currentVoice3.isPlaying()) {
    currentVoice3.stop();
  }
}

function setup() {
  createCanvas(FIXED_GAME_WIDTH, FIXED_GAME_HEIGHT);
  pixelDensity(1);
  textFont("Trebuchet MS");
  textAlign(CENTER, CENTER);

  for (let i = 0; i < level2Voices.length; i++) {
    if (level2Voices[i]) {
      level2Voices[i].setVolume(1);
    }
  }

  for (let i = 0; i < suspectVoices3.length; i++) {
    if (suspectVoices3[i]) {
      suspectVoices3[i].setVolume(1);
    }
  }
}

function windowResized() {
  // Keep the game canvas fixed.
}

function draw() {
  background(18);

  if (currentScreen === "start") drawStart();
  else if (currentScreen === "instructions") drawInstructions();
  else if (currentScreen === "level1") drawLevel1();
  else if (currentScreen === "level2") drawLevel2();
  else if (currentScreen === "level3") drawLevel3();
  else if (currentScreen === "win") drawWin();
  else if (currentScreen === "fail") drawFail();
}

function mousePressed() {
  if (transitionPending) return;

  if (
    typeof getAudioContext === "function" &&
    getAudioContext().state !== "running"
  ) {
    userStartAudio();
  }

  if (currentScreen === "start") startMousePressed();
  else if (currentScreen === "instructions") instructionsMousePressed();
  else if (currentScreen === "level1") level1MousePressed();
  else if (currentScreen === "level2") level2MousePressed();
  else if (currentScreen === "level3") level3MousePressed();
  else if (currentScreen === "win") winMousePressed();
  else if (currentScreen === "fail") failMousePressed();
}

function mouseReleased() {
  if (currentScreen === "level1" && typeof level1MouseReleased === "function")
    level1MouseReleased();
  else if (
    currentScreen === "level2" &&
    typeof level2MouseReleased === "function"
  )
    level2MouseReleased();
  else if (
    currentScreen === "level3" &&
    typeof level3MouseReleased === "function"
  )
    level3MouseReleased();
}
