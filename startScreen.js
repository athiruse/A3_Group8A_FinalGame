// --------------------------------------------------
// Start screen
// --------------------------------------------------

function getStartLayout() {
  const panelW = min(width * 0.72, 760);
  const panelH = min(height * 0.58, 460);
  const panelX = width / 2;
  const panelY = height / 2;

  return {
    panelX,
    panelY,
    panelW,
    panelH,
    start: {
      x: panelX,
      y: panelY + panelH * 0.3,
      w: 300,
      h: 55,
      textSize: 22,
    },
    instructions: {
      x: panelX,
      y: panelY + panelH * 0.45 + 20,
      w: 300,
      h: 55,
      textSize: 20,
    },
  };
}

function getStartButtons() {
  const { start, instructions } = getStartLayout();
  return { start, instructions };
}

function drawStart() {
  drawScreenBackdrop(level1BG, [7, 12, 24], [20, 30, 48], 190);

  const { panelX, panelY, panelW, panelH, start, instructions } =
    getStartLayout();

  drawGlassPanel(panelX, panelY, panelW, panelH, UI_COLORS.line, 30);

  push();
  textAlign(CENTER, CENTER);

  fill(255, 230);
  textSize(constrain(min(width, height) * 0.022, 14, 22));
  text("DETECTIVE FILES", panelX, panelY - panelH * 0.28);

  fill(255);
  textSize(constrain(min(width, height) * 0.075, 34, 68));
  text("Detective Lineup", panelX, panelY - panelH * 0.12);

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(constrain(min(width, height) * 0.026, 15, 24));
  text(
    "Inspect clues, compare stories, and solve all three cases.",
    panelX,
    panelY + panelH * 0.01,
  );

  textSize(constrain(min(width, height) * 0.018, 12, 17));
  textLeading(24);
  text(
    "Press Start Game to begin or click Instructions to learn how to play.",
    panelX - panelW * 0.3,
    panelY + panelH * 0.08,
    panelW * 0.6,
    50,
  );
  pop();

  drawButton(start, "Start Game", UI_COLORS.accentStrong);
  drawButton(instructions, "Instructions", [82, 109, 166]);
}

function startMousePressed() {
  const buttons = getStartButtons();

  if (isOverButton(buttons.start)) {
    resetScore();
    resetAllLevels();
    currentScreen = "level1";
    return;
  }

  if (isOverButton(buttons.instructions)) {
    currentScreen = "instructions";
  }
}
