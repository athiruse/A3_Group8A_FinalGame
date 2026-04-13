// --------------------------------------------------
// Instructions screen
// --------------------------------------------------

function getInstructionsLayout() {
  const panelW = 900;
  const panelH = 620;
  const panelX = width / 2;
  const panelY = height / 2;

  return {
    panelX,
    panelY,
    panelW,
    panelH,
    backButton: {
      x: panelX,
      y: 655,
      w: 210,
      h: 50,
      textSize: 18,
    },
    cardX: panelX - 378,
    cardW: 756,
    cardsTop: 280,
    cardGap: 14,
    cardH: 82,
  };
}

function drawInstructionsPanel(x, y, w, h) {
  drawGlassPanel(x, y, w, h, UI_COLORS.line, 30);

  push();
  rectMode(CENTER);
  noFill();
  stroke(255, 255, 255, 24);
  strokeWeight(1);
  rect(x, y, w * 0.95, h * 0.1, 24);
  pop();
}

function drawInstructionStep(x, y, w, h, step, title, body, accent) {
  const titleSize = 16;
  const bodySize = 12;
  const chipW = 42;
  const chipH = 42;
  const innerX = x + 78;
  const innerW = w - 100;

  push();
  rectMode(CORNER);

  noStroke();
  fill(0, 0, 0, 38);
  rect(x, y + 4, w, h, 18);

  stroke(accent[0], accent[1], accent[2], 110);
  strokeWeight(1.2);
  fill(18, 26, 42, 220);
  rect(x, y, w, h, 18);

  noStroke();
  fill(accent[0], accent[1], accent[2], 220);
  rect(x + 16, y + h / 2 - chipH / 2, chipW, chipH, 12);

  fill(15, 18, 26);
  textAlign(CENTER, CENTER);
  textSize(15);
  text(step, x + 16 + chipW / 2, y + h / 2 + 1);

  textAlign(LEFT, TOP);
  fill(255);
  textSize(titleSize);
  textLeading(titleSize + 1);
  text(title, innerX, y + 10, innerW, 20);

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(bodySize);
  textLeading(bodySize + 3);
  text(body, innerX, y + 32, innerW, h - 38);
  pop();
}

function drawInstructions() {
  drawScreenBackdrop(level1BG, [10, 14, 27], [21, 30, 48], 195);

  const {
    panelX,
    panelY,
    panelW,
    panelH,
    backButton,
    cardX,
    cardW,
    cardsTop,
    cardGap,
    cardH,
  } = getInstructionsLayout();

  drawInstructionsPanel(panelX, panelY, panelW, panelH);

  drawBadge("HOW TO PLAY", panelX, 102, 140, UI_COLORS.warning);

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(38);
  text("Detective Lineup", panelX, 160);

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(15);
  text(
    "Inspect suspects, collect clues, and convict the guilty person in each case.",
    panelX,
    198,
  );
  pop();

  drawInstructionStep(
    cardX,
    cardsTop,
    cardW,
    cardH,
    "1",
    "Level 1 — Read their face",
    "Click a suspect to inspect them. Hold Magnify to reveal the hidden clue, then decide who looks suspicious.",
    UI_COLORS.warning,
  );

  drawInstructionStep(
    cardX,
    cardsTop + (cardH + cardGap),
    cardW,
    cardH,
    "2",
    "Level 2 — Ask and compare",
    "Inspect suspects, use Magnify for extra clues, press Ask to hear a statement, and open the Board to compare evidence.",
    UI_COLORS.accent,
  );

  drawInstructionStep(
    cardX,
    cardsTop + (cardH + cardGap) * 2,
    cardW,
    cardH,
    "3",
    "Level 3 — Check the final evidence",
    "Use Magnify, Ask, the Notebook, and the Board to catch the last suspect before time runs out.",
    UI_COLORS.success,
  );

  drawInstructionStep(
    cardX,
    cardsTop + (cardH + cardGap) * 3,
    cardW,
    cardH,
    "4",
    "Convict only when you are sure",
    "Press Convict, then click the suspect you believe is guilty. A wrong choice fails the case.",
    UI_COLORS.danger,
  );

  drawButton(backButton, "Back", [82, 109, 166]);
}

function instructionsMousePressed() {
  const { backButton } = getInstructionsLayout();

  if (isOverButton(backButton)) {
    currentScreen = "start";
  }
}
