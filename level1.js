// --------------------------------------------------
// Level 1 - Visual clue case
// --------------------------------------------------

let suspects1 = [
  {
    name: "Mia",
    isCulprit: false,
    emotion: "calm",
    spriteIndex: 0,
    expression: "Steady posture and relaxed face.",
  },
  {
    name: "Derek",
    isCulprit: true,
    emotion: "nervous",
    spriteIndex: 1,
    expression: "Tense face and uneasy body language.",
  },
  {
    name: "Luis",
    isCulprit: false,
    emotion: "angry",
    spriteIndex: 2,
    expression: "Looks irritated, but not fearful.",
  },
];

let level1Stage = "intro";
let level1Mode = "lineup";
let selected1 = null;

let message1 = "";
let messageClearAt1 = 0;
let convictMode1 = false;
let revealTimer1 = 0;
let isHoldingMagnify1 = false;

function getLevel1Buttons() {
  return {
    begin: { x: width / 2, y: height * 0.8, w: 220, h: 52 },
    helpContinue: { x: width / 2, y: height * 0.78, w: 220, h: 52 },
    convict: { x: width / 2, y: height * 0.2, w: 200, h: 40 },

    back: { x: 200, y: 120, w: 130, h: 44 },
    magnify: { x: width / 2, y: height * 0.86, w: 180, h: 50 },
  };
}

// --------------------------------------------------
// DRAW
// --------------------------------------------------

function drawLevel1() {
  drawScreenBackdrop(level1BG, [7, 12, 24], [19, 30, 47], 175); // [10]
  drawScoreHUD();

  if (messageClearAt1 > 0 && millis() >= messageClearAt1) {
    message1 = "";
    messageClearAt1 = 0;
  }

  if (level1Stage === "play") {
    updateTimer();
    drawTimer();
  }

  if (revealTimer1 > 0) {
    revealTimer1--;
  }

  if (level1Stage === "intro") {
    drawLevel1Intro();
  } else if (level1Stage === "help") {
    drawLevel1Help();
  } else if (level1Mode === "lineup") {
    drawLevel1Lineup();
  } else {
    drawLevel1Inspect();
  }

  drawFooterMessage(message1, convictMode1 ? "warning" : "info");

  // Help button + modal — always on top
  drawHelpOverlay();
}

function drawLevel1Intro() {
  const buttons = getLevel1Buttons();

  drawCenteredPanel(
    "Level 1: Office Theft",
    "A cash envelope has gone missing from a staff office.\n\n" +
      "There are no signs of forced entry, meaning the thief is someone inside.\n" +
      "The suspects were all nearby when it happened.\n\n" +
      "Observe their behavior carefully and use Magnify to spot small physical clues.\n\n" +
      "Convict the thief when the evidence gives them away.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel1Help() {
  const buttons = getLevel1Buttons();
  const panelW = min(width * 0.74, 700);
  const panelH = min(height * 0.58, 420);
  const panelX = width / 2;
  const panelY = height / 2;

  drawModalOverlay(145);
  drawGlassPanel(panelX, panelY, panelW, panelH, UI_COLORS.warning, 28);
  drawBadge(
    "LEVEL 1 CONTROLS",
    panelX,
    panelY - panelH * 0.37,
    175,
    UI_COLORS.warning,
  );

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(min(width, height) * 0.03);
  text("Quick guide", panelX, panelY - panelH * 0.22);
  pop();

  drawInfoPill(
    "Magnify: unlimited",
    panelX,
    panelY - panelH * 0.08,
    min(panelW * 0.46, 260),
    UI_COLORS.warning,
  );

  push();
  textAlign(LEFT, TOP);
  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(min(width, height) * 0.019);
  textLeading(28);
  text(
    "• Click a suspect to inspect them.\n\n" +
      "• Hold Magnify to reveal the hidden clue.\n\n" +
      "• Press Back to return to the lineup.\n\n" +
      "• Press Convict only when you are sure.",
    panelX - panelW * 0.34,
    panelY + panelH * 0.02,
    panelW * 0.68,
    panelH * 0.36,
  );
  pop();

  drawButton(buttons.helpContinue, "Start Level", UI_COLORS.warning);
}

function drawLevel1Lineup() {
  const buttons = getLevel1Buttons();
  const positions = getLineupPositions(suspects1.length);
  const imgW = min(width * 0.8, 180);
  const imgH = min(height * 0.55, 420);

  drawCaseHeader(
    "Level 1: Office Theft",
    convictMode1
      ? "Convict mode is active. Select the robber."
      : "Inspect suspects and use magnify.",
  );

  drawLineupFloor();

  for (let i = 0; i < suspects1.length; i++) {
    let x = positions[i].x;
    let y = positions[i].y;

    // SAME hover detection as Level 2
    let hovered =
      mouseX > x - imgW / 2 &&
      mouseX < x + imgW / 2 &&
      mouseY > y - imgH / 2 &&
      mouseY < y + imgH / 2;

    //  SAME scaling effect
    let scale = hovered ? 1.04 : 1;

    //  Frame reacts to hover
    drawPortraitFrame(
      x,
      y,
      imgW * scale,
      imgH * 0.97 * scale,
      hovered,
      convictMode1,
    );

    // ✅ Image scales too
    push();
    imageMode(CENTER);
    if (suspectImgs1[i]) {
      image(suspectImgs1[i], x, y, imgW * scale, imgH * scale); // [11]
    } else {
      fill(190);
      noStroke();
      rectMode(CENTER);
      rect(x, y, imgW, imgH, 14);
    }
    pop();

    // ✅ Keep hitbox SAME SIZE (important for clicking accuracy)
    suspects1[i].hitbox = {
      x: x,
      y: y,
      w: imgW,
      h: imgH,
    };

    drawSuspectNameTag(x, y + imgH * 0.58, suspects1[i].name, false);
  }

  drawButton(
    buttons.convict,
    convictMode1 ? "Cancel Convict" : "Convict",
    convictMode1 ? UI_COLORS.danger : UI_COLORS.accentStrong,
  );
}

function drawLevel1Inspect() {
  const buttons = getLevel1Buttons();
  const suspect = suspects1[selected1];

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "Hold Magnify to reveal hidden identity",
  );

  const imgW = min(width * 0.32, 360);
  const imgH = min(height * 0.5, 400);
  const centerX = width / 2;
  const centerY = height * 0.48;

  drawGlassPanel(centerX, centerY, imgW + 60, imgH + 70, UI_COLORS.warning, 30);

  imageMode(CENTER);
  if (isHoldingMagnify1 && realFaces1[selected1]) {
    //[13]
    image(realFaces1[selected1], centerX, centerY, imgW, imgH); // [13]
  } else if (suspectFaces1[selected1]) {
    //[13]
    image(suspectFaces1[selected1], centerX, centerY, imgW, imgH); //[12]
  } else {
    fill(150);
    rectMode(CENTER);
    rect(centerX, centerY, imgW, imgH, 14);
  }

  drawButton(buttons.back, "Back", [83, 103, 139]);
  drawButton(buttons.magnify, "Hold Magnify", UI_COLORS.warning);
}

function showTemporaryMessage1(text, duration = 2400) {
  message1 = text;
  messageClearAt1 = millis() + duration;
}

// --------------------------------------------------
// INPUT
// --------------------------------------------------

function level1MousePressed() {
  if (transitionPending) return;

  // Help button / modal intercepts clicks first
  if (handleHelpButtonClick()) return;

  const buttons = getLevel1Buttons();

  if (level1Stage === "intro") {
    if (isOverButton(buttons.begin)) {
      level1Stage = "help";
      message1 = "";
      messageClearAt1 = 0;
    }
    return;
  }

  if (level1Stage === "help") {
    if (isOverButton(buttons.helpContinue)) {
      level1Stage = "play";
      level1Mode = "lineup";
      currentTimer = level1Time;
      maxTime = level1Time;
      lastTimeCheck = millis();
    }
    return;
  }

  if (level1Mode === "lineup") {
    if (isOverButton(buttons.convict)) {
      convictMode1 = !convictMode1;

      if (convictMode1) {
        showTemporaryMessage1("Select the thief.");
      } else {
        message1 = "";
        messageClearAt1 = 0;
      }
      return;
    }

    for (let i = 0; i < suspects1.length; i++) {
      let hb = suspects1[i].hitbox;

      if (
        mouseX > hb.x - hb.w / 2 &&
        mouseX < hb.x + hb.w / 2 &&
        mouseY > hb.y - hb.h / 2 &&
        mouseY < hb.y + hb.h / 2
      ) {
        if (convictMode1) {
          if (suspects1[i].isCulprit) {
            addPoints(POINTS_CORRECT);
          } else {
            subtractPoints(POINTS_WRONG);
          }

          finishCase(
            suspects1[i].isCulprit,
            `Correct! +${POINTS_CORRECT} points. The stolen cash left a trace on the culprit.`,
            `Wrong suspect! -${POINTS_WRONG} points. The thief avoids being caught.`,
            "level2",
            (msg) => (message1 = msg),
          );
        } else {
          selected1 = i;
          level1Mode = "inspect";
          isHoldingMagnify1 = false;
        }
        return;
      }
    }
  } else {
    if (isOverButton(buttons.back)) {
      isHoldingMagnify1 = false;
      level1Mode = "lineup";
      return;
    }

    if (isOverButton(buttons.magnify)) {
      isHoldingMagnify1 = true;
      showTemporaryMessage1("Magnify is active.");
    }
  }
}

function level1MouseReleased() {
  if (level1Mode === "inspect") {
    isHoldingMagnify1 = false;
  }
}

// --------------------------------------------------
// TIMER / RESET
// --------------------------------------------------

function updateTimer() {
  if (millis() - lastTimeCheck >= 1000) {
    currentTimer--;
    lastTimeCheck = millis();

    if (currentTimer <= 0) {
      finishCase(
        false,
        "",
        "Time's up! The culprit escaped.",
        "level1",
        () => {},
      );
    }
  }
}

function drawTimer() {
  let x = width - 80;
  let y = 80;
  let radius = 40;

  fill(20, 30, 50, 200);
  stroke(255);
  strokeWeight(2);
  ellipse(x, y, radius * 2);

  let angle = map(currentTimer, 0, maxTime, TWO_PI, 0);

  push();
  translate(x, y);
  rotate(angle);

  if (currentTimer < 10) {
    stroke(255, 60, 60);
  } else {
    stroke(255);
  }

  strokeWeight(4);
  line(0, 0, 0, -radius + 8);
  pop();

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(currentTimer + "s", x, y + radius + 12);
}

function resetLevel1() {
  level1Stage = "intro";
  level1Mode = "lineup";
  selected1 = null;
  message1 = "";
  messageClearAt1 = 0;
  convictMode1 = false;
  revealTimer1 = 0;
  isHoldingMagnify1 = false;
}
