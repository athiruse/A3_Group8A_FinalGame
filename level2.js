// --------------------------------------------------
// Level 2 - Interview case
// --------------------------------------------------

let suspects2 = [
  {
    name: "Taylor",
    isCulprit: false,
    spriteIndex: 0,
    expression: "Looks alert but composed.",
    magnifiedClue:
      "A clean bracelet clasp and no velvet fibers on the sleeves.",
    answer: "I was at the florist at 8:10. I still have the printed receipt.",
    boardNote: "Receipt timestamp matches 8:10 PM.",
  },
  {
    name: "Jordan",
    isCulprit: true,
    spriteIndex: 1,
    expression: "Keeps glancing away and tightening their jaw.",
    magnifiedClue:
      "A tiny strand of black velvet is caught near the cuff seam.",
    answer: "I stayed outside the gallery the whole time.",
    boardNote:
      "Parking camera shows Jordan re-entering the gallery at 8:12 PM.",
  },
  {
    name: "Avery",
    isCulprit: false,
    spriteIndex: 2,
    expression: "Looks irritated, not frightened.",
    magnifiedClue:
      "Only catering glitter from the gift table, nothing from the necklace case.",
    answer: "I was packing the gift table when security shouted.",
    boardNote: "A staff member confirms Avery was beside the exit display.",
  },
  {
    name: "Morgan",
    isCulprit: false,
    spriteIndex: 3,
    expression: "Tired eyes, steady voice.",
    magnifiedClue:
      "Phone screen smudge and lipstick trace, but no display-case residue.",
    answer: "I stepped outside for a phone call before the lights flickered.",
    boardNote: "Phone log shows a three-minute call beginning at 8:07 PM.",
  },
];

let level2Stage = "intro";
let level2Mode = "lineup";
let selected2 = null;

let message2 = "";
let askMessage2 = "";
let magnifyMessage2 = "";

let convictMode2 = false;
let showBoard2 = false;
let questioned2 = [false, false, false, false];
let isHoldingMagnify2 = false;
let magnifyTries2 = 3;
let messageClearAt2 = 0;

function getLevel2Buttons() {
  const lineupRow = getButtonRow(2, height * 0.9, 170, 50, 28);
  const inspectRow = getButtonRow(2, height * 0.86, 150, 50, 20);

  return {
    begin: { x: width / 2, y: height * 0.8, w: 220, h: 52 },
    helpContinue: { x: width / 2, y: height * 0.8, w: 220, h: 52 },

    board: lineupRow[0],
    convict: lineupRow[1],

    back: { x: 200, y: 120, w: 130, h: 44 },
    magnify: inspectRow[0],
    ask: inspectRow[1],
  };
}

function isMouseOverLevel2Suspect(x, y, w, h) {
  return (
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2
  );
}

function drawLevel2Portrait(x, y, index, drawW, drawH) {
  const hovered = isMouseOverLevel2Suspect(x, y, drawW, drawH);
  const scale = hovered ? 1.04 : 1;

  drawPortraitFrame(
    x,
    y,
    drawW * scale,
    drawH * 0.97 * scale,
    hovered,
    convictMode2,
  );

  push();
  imageMode(CENTER);
  if (suspectImgs2[index]) {
    image(suspectImgs2[index], x, y, drawW * scale, drawH * scale);
  } else {
    fill(190);
    noStroke();
    rectMode(CENTER);
    rect(x, y, drawW, drawH, 14);
  }
  pop();
}

function drawLevel2() {
  drawScreenBackdrop(level2BG, [7, 12, 24], [22, 31, 50], 175);
  drawScoreHUD();

  if (messageClearAt2 > 0 && millis() >= messageClearAt2) {
    message2 = "";
    messageClearAt2 = 0;
  }

  if (level2Stage === "play") {
    updateTimer();
    drawTimer();
  }

  if (level2Stage === "intro") drawLevel2Intro();
  else if (level2Stage === "help") drawLevel2Help();
  else if (level2Mode === "lineup") drawLevel2Lineup();
  else drawLevel2Inspect();

  if (showBoard2) drawLevel2Board();

  drawFooterMessage(message2, convictMode2 ? "warning" : "info");

  // Help button + modal — always on top
  drawHelpOverlay();
}

function drawLevel2Intro() {
  const buttons = getLevel2Buttons();

  drawCenteredPanel(
    "Level 2: Gallery Robbery",
    "A valuable necklace was stolen during a busy gallery event.\n\n" +
      "This was not a simple theft — the timing suggests a planned robbery.\n" +
      "All suspects were present when the display case was accessed.\n\n" +
      "Inspect clues, question each suspect, and compare their statements on the board.\n\n" +
      "Convict the robber by finding the inconsistency.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel2Help() {
  const buttons = getLevel2Buttons();
  const panelW = min(width * 0.76, 740);
  const panelH = min(height * 0.62, 460);
  const panelX = width / 2;
  const panelY = height / 2;

  drawModalOverlay(145);
  drawGlassPanel(panelX, panelY, panelW, panelH, UI_COLORS.accent, 28);
  drawBadge(
    "LEVEL 2 CONTROLS",
    panelX,
    panelY - panelH * 0.37,
    175,
    UI_COLORS.accent,
  );

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(min(width, height) * 0.03);
  text("Quick guide", panelX, panelY - panelH * 0.22);
  pop();

  drawInfoPill(
    "Magnify uses: 3 total",
    panelX,
    panelY - panelH * 0.08,
    min(panelW * 0.46, 260),
    UI_COLORS.warning,
  );

  push();
  textAlign(LEFT, TOP);
  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(min(width, height) * 0.0185);
  textLeading(27);
  text(
    "• Click a suspect to inspect them.\n\n" +
      "• Hold Magnify for an extra clue.\n\n" +
      "• Press Ask to hear and save a statement.\n\n" +
      "• Press Board to compare the evidence.\n\n" +
      "• Press Convict when you are ready.",
    panelX - panelW * 0.35,
    panelY + panelH * 0.005,
    panelW * 0.7,
    panelH * 0.42,
  );
  pop();

  drawButton(buttons.helpContinue, "Start Level", UI_COLORS.accentStrong);
}

function drawLevel2Lineup() {
  const buttons = getLevel2Buttons();
  const positions = getLineupPositions(suspects2.length);
  // Move lineup UP
  for (let pos of positions) {
    pos.y -= height * 0.05; // adjust this value
  }

  const recordedCount = questioned2.filter(Boolean).length;
  const imgW = min(width * 0.8, 180);
  const imgH = min(height * 0.55, 420);

  drawCaseHeader(
    "Level 2: Gallery Robbery",
    convictMode2
      ? "Convict mode is active. Select the thief."
      : "Inspect, magnify, question, then compare the board.",
  );

  drawLineupFloor();
  drawInfoPill(
    `Statements recorded: ${recordedCount}/${suspects2.length}`,
    width / 2,
    height * 0.2,
    260,
    UI_COLORS.warning,
  );

  for (let i = 0; i < suspects2.length; i++) {
    drawLevel2Portrait(positions[i].x, positions[i].y, i, imgW, imgH);

    suspects2[i].hitbox = {
      x: positions[i].x,
      y: positions[i].y,
      w: imgW,
      h: imgH,
    };

    drawSuspectNameTag(
      positions[i].x,
      positions[i].y + imgH * 0.58,
      suspects2[i].name,
      questioned2[i],
    );
  }

  drawButton(buttons.board, "Board", [96, 124, 181]);
  drawButton(
    buttons.convict,
    convictMode2 ? "Cancel Convict" : "Convict",
    convictMode2 ? UI_COLORS.danger : UI_COLORS.accentStrong,
  );
}

function drawLevel2Inspect() {
  const buttons = getLevel2Buttons();
  const suspect = suspects2[selected2];

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "Hold Magnify to reveal hidden clue",
  );

  const imgW = min(width * 0.32, 360);
  const imgH = min(height * 0.5, 400);
  const centerX = width / 2;
  const centerY = height * 0.48;

  drawGlassPanel(centerX, centerY, imgW + 60, imgH + 70, UI_COLORS.warning, 30);

  imageMode(CENTER);

  if (isHoldingMagnify2 && realFaces2[selected2]) {
    image(realFaces2[selected2], centerX, centerY, imgW, imgH);
  } else if (suspectFaces2[selected2]) {
    image(suspectFaces2[selected2], centerX, centerY, imgW, imgH);
  } else {
    fill(150);
    rectMode(CENTER);
    rect(centerX, centerY, imgW, imgH, 14);
  }

  drawInfoPill(
    suspect.expression,
    width / 2,
    height * 0.78,
    420,
    UI_COLORS.accent,
  );

  drawButton(buttons.back, "Back", [83, 103, 139]);
  drawButton(
    buttons.magnify,
    `Hold Magnify (${magnifyTries2})`,
    UI_COLORS.warning,
  );
  drawButton(buttons.ask, "Ask", UI_COLORS.accentStrong);
}

function showTemporaryMessage2(text, duration = 2400) {
  message2 = text;
  messageClearAt2 = millis() + duration;
}

function drawLevel2Board() {
  drawModalOverlay(138);

  const panelW = min(width * 0.8, 820);
  const panelH = min(height * 0.74, 500);
  drawGlassPanel(width / 2, height / 2, panelW, panelH, UI_COLORS.accent, 26);
  drawBadge(
    "EVIDENCE BOARD",
    width / 2,
    height / 2 - panelH * 0.37,
    155,
    UI_COLORS.accent,
  );

  push();
  textAlign(LEFT, TOP);
  fill(255);
  textSize(min(width, height) * 0.022);
  textLeading(28);

  const startX = width / 2 - panelW * 0.38;
  const startY = height / 2 - panelH * 0.24;

  for (let i = 0; i < suspects2.length; i++) {
    fill(255);
    textSize(18);
    text(`${suspects2[i].name}`, startX, startY + i * 78);

    fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
    textSize(17);
    const line = questioned2[i]
      ? suspects2[i].boardNote
      : "No statement recorded yet.";
    text(line, startX + 120, startY + i * 78, panelW * 0.55, 60);
  }

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.38);
  pop();
}

function level2MousePressed() {
  if (transitionPending) return;

  // Help button / modal intercepts clicks first
  if (handleHelpButtonClick()) return;
  if (showBoard2) {
    showBoard2 = false;
    return;
  }

  const buttons = getLevel2Buttons();

  if (level2Stage === "intro") {
    if (isOverButton(buttons.begin)) {
      level2Stage = "help";
      message2 = "";
      messageClearAt2 = 0;
    }
    return;
  }

  if (level2Stage === "help") {
    if (isOverButton(buttons.helpContinue)) {
      level2Stage = "play";
      level2Mode = "lineup";
      currentTimer = level2Time;
      maxTime = level2Time;
      lastTimeCheck = millis();
    }
    return;
  }

  if (level2Mode === "lineup") {
    if (isOverButton(buttons.board)) {
      showBoard2 = true;
      return;
    }

    if (isOverButton(buttons.convict)) {
      convictMode2 = !convictMode2;

      if (convictMode2) {
        showTemporaryMessage2("Select the thief.");
      } else {
        message2 = "";
        messageClearAt2 = 0;
      }

      return;
    }

    for (let i = 0; i < suspects2.length; i++) {
      let hb = suspects2[i].hitbox;

      let hovered =
        mouseX > hb.x - hb.w / 2 &&
        mouseX < hb.x + hb.w / 2 &&
        mouseY > hb.y - hb.h / 2 &&
        mouseY < hb.y + hb.h / 2;

      if (hovered) {
        if (convictMode2) {
          stopLevel2Voices();

          if (suspects2[i].isCulprit) {
            addPoints(POINTS_CORRECT);
          } else {
            subtractPoints(POINTS_WRONG);
          }

          finishCase(
            suspects2[i].isCulprit,
            `Correct! +${POINTS_CORRECT} points. The evidence and timeline expose the robber.`,
            `Wrong suspect! -${POINTS_WRONG} points. The robber escapes with the necklace.`,
            "level3",
            (msg) => {
              message2 = msg;
            },
          );
        } else {
          stopLevel2Voices();
          selected2 = i;
          level2Mode = "inspect";
          askMessage2 = questioned2[i] ? suspects2[i].answer : "";
          magnifyMessage2 = "";
          message2 = "";
          messageClearAt2 = 0;
        }

        return;
      }
    }
  } else {
    if (isOverButton(buttons.back)) {
      stopLevel2Voices();
      isHoldingMagnify2 = false;
      level2Mode = "lineup";
      return;
    }

    if (isOverButton(buttons.magnify)) {
      if (magnifyTries2 > 0) {
        isHoldingMagnify2 = true;
        magnifyTries2--;
        magnifyMessage2 = suspects2[selected2].magnifiedClue;
        showTemporaryMessage2("Magnify is active.");
      } else {
        isHoldingMagnify2 = false;
        showTemporaryMessage2("No magnify tries left.");
      }
      return;
    }

    if (isOverButton(buttons.ask)) {
      questioned2[selected2] = true;
      askMessage2 = suspects2[selected2].answer;
      showTemporaryMessage2("Statement recorded to the board.");

      if (level2Voices[selected2]) {
        stopLevel2Voices();
        level2Voices[selected2].play();
      }
      return;
    }
  }
}

function level2MouseReleased() {
  if (level2Mode === "inspect") {
    isHoldingMagnify2 = false;
  }
}

function resetLevel2() {
  stopLevel2Voices();
  level2Stage = "intro";
  level2Mode = "lineup";
  selected2 = null;
  message2 = "";
  messageClearAt2 = 0;
  askMessage2 = "";
  magnifyMessage2 = "";
  convictMode2 = false;
  showBoard2 = false;
  questioned2 = [false, false, false, false];
  magnifyTries2 = 3;
  isHoldingMagnify2 = false;
}
