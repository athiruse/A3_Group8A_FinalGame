// --------------------------------------------------
// Win screen
// --------------------------------------------------

function drawWin() {
  drawScreenBackdrop(null, [8, 20, 18], [15, 54, 42], 0);

  const panelW = min(width * 0.74, 760);
  const panelH = min(height * 0.58, 380);
  drawGlassPanel(width / 2, height / 2, panelW, panelH, UI_COLORS.success, 30);
  drawBadge("ALL CASES CLOSED", width / 2, height * 0.34, 170, UI_COLORS.success);

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(min(width, height) * 0.07);
  text("You Solved All Cases!", width / 2, height * 0.46);

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(min(width, height) * 0.026);
  text(
    "Observation, interviews, and forensics all lined up.",
    width / 2,
    height * 0.56,
  );

  textSize(min(width, height) * 0.021);
  text("Click anywhere to restart.", width / 2, height * 0.64);
  pop();
}

function winMousePressed() {
  resetAllLevels();
  currentScreen = "start";
}
