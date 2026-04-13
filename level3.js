// --------------------------------------------------
// Level 3 - Final case
// --------------------------------------------------

let suspects3 = [
  {
    name: "Noah",
    isCulprit: false,
    spriteIndex: 0,
    appearance: "Uniform is tidy. Sleeves are rolled evenly.",
    magnifiedClue: "Bus lint on the cuff, but no gray toner dust.",
    interview: "My shift ended at 9:00, and I caught the bus straight home.",
    boardNote: "Transit stamp places Noah at the bus stop by 9:07 PM.",
    notebook: "Bus pass stamped 9:07 PM. Timeline checks out.",
  },
  {
    name: "Riley",
    isCulprit: false,
    spriteIndex: 1,
    appearance: "Jacket hem is dusty and wrinkled from the loading bay.",
    magnifiedClue:
      "Mud and gravel from outside, nothing from the records room carpet.",
    interview: "I heard the scream from the loading bay and ran over.",
    boardNote: "Security guard confirms Riley was near the loading dock.",
    notebook: "Boot print pattern matches the loading bay only.",
  },
  {
    name: "Casey",
    isCulprit: true,
    spriteIndex: 2,
    appearance: "Dark suit. Right cuff looks recently brushed clean.",
    magnifiedClue: "A faint gray powder is trapped inside the right cuff seam.",
    interview: "I never went near the records room tonight.",
    boardNote: "Casey changed the timeline twice during questioning.",
    notebook: "Changed the story twice about where they were after 8:30.",
  },
  {
    name: "Jamie",
    isCulprit: false,
    spriteIndex: 3,
    appearance:
      "Front desk uniform still has a clipped visitor badge attached.",
    magnifiedClue: "Badge clip scratch and pen ink, but no toner residue.",
    interview: "I stayed at the front desk until police arrived.",
    boardNote: "Badge log shows Jamie remained at reception.",
    notebook: "Reception camera confirms Jamie stayed at the desk.",
  },
  {
    name: "Emma",
    isCulprit: false,
    spriteIndex: 4,
    appearance: "Looks shaken and disheveled after the incident.",
    magnifiedClue:
      "Dust and minor scrapes, but nothing matching toner from the records room.",
    interview: "I heard arguing, then I ducked when everything went quiet.",
    boardNote: "Emma's timeline matches the witness on the second floor.",
    notebook: "No sign Emma ever entered the records room.",
  },
];

let level3Stage = "intro";
let level3Mode = "lineup";
let selected3 = null;

let message3 = "";
let askMessage3 = "";
let magnifyMessage3 = "";

let convictMode3 = false;

let showNotebook3 = false;
let showBoard3 = false;

let questioned3 = [false, false, false, false, false];
let isHoldingMagnify3 = false;
let magnifyTries3 = 2;
let messageClearAt3 = 0;
let notebookCloseAt3 = 0;

function getLevel3Buttons() {
  const lineupRow = getButtonRow(2, height * 0.9, 170, 50, 24);

  const actionRow = getButtonRow(3, height * 0.87, 165, 48, 20);

  return {
    begin: { x: width / 2, y: height * 0.8, w: 220, h: 52 },
    helpContinue: { x: width / 2, y: height * 0.82, w: 220, h: 52 },

    board: lineupRow[0],
    convict: lineupRow[1],

    back: { x: 200, y: 120, w: 130, h: 44 },
    magnify: actionRow[0],
    ask: actionRow[1],
    notebook: actionRow[2],
  };
}

function isMouseOverLevel3Suspect(x, y, w, h) {
  return (
    mouseX > x - w / 2 &&
    mouseX < x + w / 2 &&
    mouseY > y - h / 2 &&
    mouseY < y + h / 2
  );
}

function drawLevel3Portrait(x, y, index, drawW, drawH) {
  const hovered = isMouseOverLevel3Suspect(x, y, drawW, drawH);
  const scale = hovered ? 1.04 : 1;

  drawPortraitFrame(
    x,
    y,
    drawW * scale,
    drawH * 0.97 * scale,
    hovered,
    convictMode3,
  );

  push();
  imageMode(CENTER);
  if (suspectImgs3[index]) {
    //[17]
    image(suspectImgs3[index], x, y, drawW * scale, drawH * scale); //[17]
  } else {
    fill(190);
    noStroke();
    rectMode(CENTER);
    rect(x, y, drawW, drawH, 14);
  }
  pop();
}

function drawLevel3() {
  drawScreenBackdrop(level3BG, [7, 12, 24], [23, 32, 52], 175); //[10]
  drawScoreHUD();

  if (messageClearAt3 > 0 && millis() >= messageClearAt3) {
    message3 = "";
    messageClearAt3 = 0;
  }

  if (showNotebook3 && notebookCloseAt3 > 0 && millis() >= notebookCloseAt3) {
    showNotebook3 = false;
    notebookCloseAt3 = 0;
  }

  if (level3Stage === "play") {
    updateTimer();
    drawTimer();
  }

  if (level3Stage === "intro") drawLevel3Intro();
  else if (level3Stage === "help") drawLevel3Help();
  else if (level3Mode === "lineup") drawLevel3Lineup();
  else drawLevel3Inspect();

  if (showNotebook3) drawNotebook3();
  if (showBoard3) drawBoard3();

  drawFooterMessage(message3, convictMode3 ? "warning" : "info");

  // Help button + modal — always on top
  drawHelpOverlay();
}

function drawLevel3Intro() {
  const buttons = getLevel3Buttons();

  drawCenteredPanel(
    "Level 3: Corporate Fraud",
    "Confidential company records have been altered to hide financial fraud.\n\n" +
      "Someone accessed the records room and attempted to cover their tracks.\n\n" +
      "All suspects had potential access to the system.\n\n" +
      "Inspect, ask questions, and review the notebook and board.\n\n" +
      "Convict the suspect responsible for the fraud.",
    "Begin",
    buttons.begin,
  );
}

function drawLevel3Help() {
  const buttons = getLevel3Buttons();
  const panelW = min(width * 0.78, 760);
  const panelH = min(height * 0.64, 470);
  const panelX = width / 2;
  const panelY = height / 2;

  drawModalOverlay(145);
  drawGlassPanel(panelX, panelY, panelW, panelH, UI_COLORS.success, 28);
  drawBadge(
    "LEVEL 3 CONTROLS",
    panelX,
    panelY - panelH * 0.37,
    175,
    UI_COLORS.success,
  );

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(min(width, height) * 0.03);
  text("Quick guide", panelX, panelY - panelH * 0.22);
  pop();

  drawInfoPill(
    "Magnify uses: 2 total",
    panelX,
    panelY - panelH * 0.08,
    min(panelW * 0.46, 260),
    UI_COLORS.success,
  );

  push();
  textAlign(LEFT, TOP);
  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(min(width, height) * 0.019);
  textLeading(28);
  text(
    "• Click a suspect to inspect them.\n\n" +
      "• Hold Magnify to reveal a hidden clue.\n\n" +
      "• Press Ask to hear the suspect's statement.\n\n" +
      "• Press Notebook for extra notes and Board to compare evidence.\n\n" +
      "• Press Convict only when you are sure.",
    panelX - panelW * 0.34,
    panelY + panelH * 0.02,
    panelW * 0.68,
    panelH * 0.38,
  );
  pop();

  drawButton(buttons.helpContinue, "Start Level", UI_COLORS.success);
}

function drawLevel3Inspect() {
  const buttons = getLevel3Buttons();
  const suspect = suspects3[selected3];

  drawCaseHeader(
    "Inspecting " + suspect.name,
    "Hold Magnify to reveal clues, then use Ask and Notebook.",
  );

  const imgW = min(width * 0.29, 340);
  const imgH = min(height * 0.5, 410);
  const imgX = width / 2;
  const imgY = height * 0.49;

  drawGlassPanel(imgX, imgY, imgW + 70, imgH + 80, UI_COLORS.success, 30);

  push();
  imageMode(CENTER);

  if (isHoldingMagnify3 && realFaces3[selected3]) {
    //[19]
    image(realFaces3[selected3], imgX, imgY, imgW, imgH); // [19]
  } else if (suspectFaces3[selected3]) {
    //[18]
    image(suspectFaces3[selected3], imgX, imgY, imgW, imgH); //[18]
  } else {
    fill(190);
    noStroke();
    rectMode(CENTER);
    rect(imgX, imgY, imgW, imgH, 14);
  }
  pop();

  drawButton(buttons.back, "Back", [83, 103, 139]);
  drawButton(
    buttons.magnify,
    `Hold Magnify (${magnifyTries3})`,
    UI_COLORS.warning,
  );
  drawButton(buttons.ask, "Ask", UI_COLORS.accentStrong);
  drawButton(buttons.notebook, "Notebook", UI_COLORS.success);
}

function drawLevel3Lineup() {
  const buttons = getLevel3Buttons();
  const positions = getLineupPositions(suspects3.length);
  // Move lineup UP
  for (let pos of positions) {
    pos.y -= height * 0.05; // adjust this value
  }
  const imgW = min(width * 0.8, 180);
  const imgH = min(height * 0.55, 420);

  drawCaseHeader(
    "Level 3: Corporate Fraud",
    convictMode3
      ? "Convict mode is active. Select the suspect."
      : "Inspect suspects, ask questions, and review the board.",
  );

  drawLineupFloor();

  for (let i = 0; i < suspects3.length; i++) {
    drawLevel3Portrait(positions[i].x, positions[i].y, i, imgW, imgH);

    suspects3[i].hitbox = {
      x: positions[i].x,
      y: positions[i].y,
      w: imgW,
      h: imgH,
    };

    drawSuspectNameTag(
      positions[i].x,
      positions[i].y + imgH * 0.58,
      suspects3[i].name,
      questioned3[i],
    );
  }

  drawButton(buttons.board, "Board", [96, 124, 181]);
  drawButton(
    buttons.convict,
    convictMode3 ? "Cancel Convict" : "Convict",
    convictMode3 ? UI_COLORS.danger : UI_COLORS.accentStrong,
  );
}

function showTemporaryMessage3(text, duration = 2400) {
  message3 = text;
  messageClearAt3 = millis() + duration;
}

function drawNotebook3() {
  drawModalOverlay(138);

  const panelW = min(width * 0.72, 700);
  const panelH = min(height * 0.52, 380);
  drawGlassPanel(width / 2, height / 2, panelW, panelH, UI_COLORS.warning, 26);
  drawBadge(
    "NOTEBOOK",
    width / 2,
    height / 2 - panelH * 0.33,
    120,
    UI_COLORS.warning,
  );

  push();
  textAlign(LEFT, TOP);
  fill(255);
  textSize(min(width, height) * 0.024);
  text("Field note", width / 2 - panelW * 0.36, height / 2 - panelH * 0.15);

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(min(width, height) * 0.022);
  textLeading(30);
  text(
    suspects3[selected3].notebook,
    width / 2 - panelW * 0.36,
    height / 2 - panelH * 0.03,
    panelW * 0.72,
    panelH * 0.34,
  );

  textAlign(CENTER, CENTER);
  textSize(16);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.34);
  pop();
}

function drawBoard3() {
  drawModalOverlay(138);

  const panelW = min(width * 0.82, 860);
  const panelH = min(height * 0.78, 560);
  drawGlassPanel(width / 2, height / 2, panelW, panelH, UI_COLORS.accent, 26);
  drawBadge(
    "EVIDENCE BOARD",
    width / 2,
    height / 2 - panelH * 0.39,
    155,
    UI_COLORS.accent,
  );

  push();
  textAlign(LEFT, TOP);
  const startX = width / 2 - panelW * 0.38;
  const startY = height / 2 - panelH * 0.26;

  for (let i = 0; i < suspects3.length; i++) {
    fill(255);
    textSize(18);
    text(`${suspects3[i].name}`, startX, startY + i * 78);

    fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
    textSize(17);

    if (questioned3[i]) {
      text(
        suspects3[i].boardNote,
        startX + 120,
        startY + i * 78,
        panelW * 0.58,
        58,
      );
    } else {
      text(
        "No statement recorded yet.",
        startX + 120,
        startY + i * 78,
        panelW * 0.58,
        58,
      );
    }
  }

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textAlign(CENTER, CENTER);
  textSize(16);
  text("Click anywhere to close.", width / 2, height / 2 + panelH * 0.4);
  pop();
}

function playLevel3Voice(index) {
  //[5], [6], [7], [8], [9]
  if (currentVoice3 && currentVoice3.isPlaying()) {
    //[5], [6], [7], [8], [9]
    currentVoice3.stop(); //[5], [6], [7], [8], [9]
  }

  if (suspectVoices3[index]) {
    //[5], [6], [7], [8], [9]
    currentVoice3 = suspectVoices3[index]; //[5], [6], [7], [8], [9]
    currentVoice3.play(); //[5], [6], [7], [8], [9]
  }
}

function level3MousePressed() {
  if (transitionPending) return;

  // Help button / modal intercepts clicks first
  if (handleHelpButtonClick()) return;

  if (showNotebook3) {
    showNotebook3 = false;
    notebookCloseAt3 = 0;
    return;
  }

  if (showBoard3) {
    showBoard3 = false;
    return;
  }

  const buttons = getLevel3Buttons();

  if (level3Stage === "intro") {
    if (isOverButton(buttons.begin)) {
      level3Stage = "help";
      message3 = "";
      messageClearAt3 = 0;
    }
    return;
  }

  if (level3Stage === "help") {
    if (isOverButton(buttons.helpContinue)) {
      level3Stage = "play";
      level3Mode = "lineup";
      currentTimer = level3Time;
      maxTime = level3Time;
      lastTimeCheck = millis();
    }
    return;
  }

  if (level3Mode === "lineup") {
    if (isOverButton(buttons.board)) {
      showBoard3 = true;
      return;
    }

    if (isOverButton(buttons.convict)) {
      convictMode3 = !convictMode3;

      if (convictMode3) {
        showTemporaryMessage3("Select the suspect.");
      } else {
        message3 = "";
        messageClearAt3 = 0;
      }

      return;
    }

    for (let i = 0; i < suspects3.length; i++) {
      const hb = suspects3[i].hitbox;

      if (isMouseOverLevel3Suspect(hb.x, hb.y, hb.w, hb.h)) {
        if (convictMode3) {
          if (suspects3[i].isCulprit) {
            addPoints(POINTS_CORRECT);
          } else {
            subtractPoints(POINTS_WRONG);
          }

          finishCase(
            suspects3[i].isCulprit,
            `Correct! +${POINTS_CORRECT} points. Casey manipulated the records and committed fraud.`,
            `Wrong suspect! -${POINTS_WRONG} points. The fraud continues unnoticed.`,
            "win",
            (msg) => {
              message3 = msg;
            },
          );
        } else {
          selected3 = i;
          level3Mode = "inspect";
          askMessage3 = questioned3[i] ? suspects3[i].interview : "";
          magnifyMessage3 = "";
          isHoldingMagnify3 = false;
          message3 = "";
          messageClearAt3 = 0;
        }
        return;
      }
    }
  } else {
    if (isOverButton(buttons.back)) {
      if (currentVoice3 && currentVoice3.isPlaying()) {
        //[5], [6], [7], [8], [9]
        currentVoice3.stop(); //[5], [6], [7], [8], [9]
      }

      isHoldingMagnify3 = false;
      level3Mode = "lineup";
      return;
    }

    if (isOverButton(buttons.magnify)) {
      if (magnifyTries3 > 0) {
        isHoldingMagnify3 = true;
        magnifyTries3--;
        magnifyMessage3 = suspects3[selected3].magnifiedClue;
        showTemporaryMessage3("Magnify is active.");
      } else {
        isHoldingMagnify3 = false;
        showTemporaryMessage3("No magnify tries left.");
      }
      return;
    }

    if (isOverButton(buttons.ask)) {
      questioned3[selected3] = true;
      askMessage3 = suspects3[selected3].interview;
      showTemporaryMessage3("Statement added to the board.");

      playLevel3Voice(selected3); //[5], [6], [7], [8], [9]
      return;
    }

    if (isOverButton(buttons.notebook)) {
      isHoldingMagnify3 = false;
      showNotebook3 = true;
      notebookCloseAt3 = millis() + 2600;
      return;
    }
  }
}

function level3MouseReleased() {
  if (level3Mode === "inspect") {
    isHoldingMagnify3 = false;
  }
}

function resetLevel3() {
  if (currentVoice3 && currentVoice3.isPlaying()) {
    //[5], [6], [7], [8], [9]
    currentVoice3.stop(); //[5], [6], [7], [8], [9]
  }

  level3Stage = "intro";
  level3Mode = "lineup";
  selected3 = null;
  message3 = "";
  messageClearAt3 = 0;
  askMessage3 = "";
  magnifyMessage3 = "";
  convictMode3 = false;
  showNotebook3 = false;
  showBoard3 = false;
  notebookCloseAt3 = 0;
  questioned3 = [false, false, false, false, false];
  magnifyTries3 = 2;
  isHoldingMagnify3 = false;
}
