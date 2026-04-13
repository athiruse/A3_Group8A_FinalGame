function getFailButtons() {
  const row = getButtonRow(2, height * 0.73, 190, 56, 28);

  return {
    home: row[0],
    retry: row[1],
  };
}

function getFailedLevelLabel() {
  if (failedLevel === "level1") return "Level 1";
  if (failedLevel === "level2") return "Level 2";
  if (failedLevel === "level3") return "Level 3";
  return "This Case";
}

function drawFail() {
  drawScreenBackdrop(null, [26, 10, 14], [56, 18, 24], 0);

  const buttons = getFailButtons();
  const panelW = min(width * 0.72, 720);
  const panelH = min(height * 0.58, 400);
  const panelX = width / 2;
  const panelY = height / 2;

  drawModalOverlay(120);
  drawGlassPanel(panelX, panelY, panelW, panelH, UI_COLORS.danger, 28);
  drawBadge("CASE LOST", panelX, panelY - panelH * 0.35, 120, UI_COLORS.danger);

  push();
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.055);
  text("Case Failed", panelX, panelY - panelH * 0.16);

  fill(255, 218, 218);
  textSize(min(width, height) * 0.026);
  text(getFailedLevelLabel(), panelX, panelY - panelH * 0.04);

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(min(width, height) * 0.022);
  textLeading(30);
  text(
    failedMessage +
      "\n\nChoose Retry to replay this level or Home to return to the main menu.",
    panelX - panelW * 0.32,
    panelY + panelH * 0.02,
    panelW * 0.64,
    panelH * 0.32,
  );
  pop();

  drawButton(buttons.home, "Home", [90, 110, 145]);
  drawButton(buttons.retry, "Retry", UI_COLORS.danger);
}

function failMousePressed() {
  const buttons = getFailButtons();

  if (isOverButton(buttons.home)) {
    resetAllLevels();
    failedLevel = null;
    failedMessage = "Wrong suspect!";
    currentScreen = "start";
    return;
  }

  if (isOverButton(buttons.retry)) {
    if (failedLevel) {
      currentScreen = failedLevel;
    } else {
      currentScreen = "start";
    }
  }
}
