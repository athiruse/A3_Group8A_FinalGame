// --------------------------------------------------
// Shared UI + flow helpers
// Visual theme helpers are kept here so mechanics stay untouched.
// --------------------------------------------------

let transitionPending = false;
let failedLevel = null;
let failedMessage = "Wrong suspect!";

const UI_COLORS = {
  ink: [234, 240, 255],
  mutedInk: [189, 201, 227],
  panel: [14, 20, 34],
  panelSoft: [22, 30, 48],
  line: [131, 170, 255],
  accent: [94, 179, 255],
  accentStrong: [63, 141, 255],
  success: [70, 188, 132],
  warning: [246, 197, 90],
  danger: [239, 103, 103],
};

function resetLevelByScreen(screenName) {
  if (screenName === "level1") resetLevel1();
  else if (screenName === "level2") resetLevel2();
  else if (screenName === "level3") resetLevel3();
}

function drawGradientBackground(topColor, bottomColor) {
  push();
  noFill();

  const c1 = color(topColor[0], topColor[1], topColor[2]);
  const c2 = color(bottomColor[0], bottomColor[1], bottomColor[2]);

  for (let y = 0; y < height; y += 3) {
    const amt = map(y, 0, height, 0, 1);
    const c = lerpColor(c1, c2, amt);
    stroke(c);
    line(0, y, width, y);
  }
  pop();
}

function drawBackdropGlow() {
  push();
  noStroke();
  fill(50, 95, 180, 40);
  ellipse(width * 0.2, height * 0.14, width * 0.5, height * 0.28);
  fill(20, 35, 70, 70);
  ellipse(width * 0.82, height * 0.86, width * 0.65, height * 0.42);
  fill(10, 16, 28, 90);
  rect(0, 0, width, height * 0.12);
  rect(0, height * 0.88, width, height * 0.12);
  pop();
}

function drawVignette(alpha = 80) {
  push();
  noFill();
  rectMode(CORNER);
  for (let i = 0; i < 14; i++) {
    stroke(0, alpha - i * 5);
    strokeWeight(10);
    rect(i * 5, i * 5, width - i * 10, height - i * 10, 24);
  }
  pop();
}

function drawScreenBackdrop(
  bgImage = null,
  topColor = [8, 14, 28],
  bottomColor = [22, 32, 52],
  imageOverlayAlpha = 165,
) {
  if (bgImage) {
    push();
    imageMode(CORNER);
    image(bgImage, 0, 0, width, height);
    pop();

    push();
    fill(topColor[0], topColor[1], topColor[2], imageOverlayAlpha);
    noStroke();
    rect(0, 0, width, height);
    pop();
  } else {
    drawGradientBackground(topColor, bottomColor);
  }

  drawBackdropGlow();
  drawVignette(82);
}

function drawGlassPanel(x, y, w, h, accent = UI_COLORS.line, radius = 24) {
  push();
  rectMode(CENTER);

  noStroke();
  fill(0, 0, 0, 70);
  rect(x, y + 10, w, h, radius);

  stroke(accent[0], accent[1], accent[2], 130);
  strokeWeight(1.5);
  fill(UI_COLORS.panel[0], UI_COLORS.panel[1], UI_COLORS.panel[2], 225);
  rect(x, y, w, h, radius);

  noStroke();
  fill(255, 255, 255, 20);
  rect(x, y - h * 0.22, w * 0.94, h * 0.22, radius * 0.7);
  pop();
}

function drawBadge(textValue, x, y, w, fillColor = UI_COLORS.warning) {
  push();
  rectMode(CENTER);
  noStroke();
  fill(fillColor[0], fillColor[1], fillColor[2], 220);
  rect(x, y, w, 34, 999);
  fill(18, 20, 24);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(textValue, x, y + 1);
  pop();
}

function drawInfoPill(textValue, x, y, w, accent = UI_COLORS.accent) {
  push();
  rectMode(CENTER);
  stroke(accent[0], accent[1], accent[2], 135);
  strokeWeight(1.2);
  fill(16, 24, 38, 205);
  rect(x, y, w, 40, 999);
  noStroke();
  fill(UI_COLORS.ink[0], UI_COLORS.ink[1], UI_COLORS.ink[2]);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.018);
  text(textValue, x, y + 1);
  pop();
}

function drawButton(button, label, fillColor = UI_COLORS.accentStrong) {
  const hovered = isOverButton(button);
  const base = Array.isArray(fillColor) ? fillColor : UI_COLORS.accentStrong;
  const lift = hovered ? 3 : 0;
  const glowAlpha = hovered ? 52 : 26;

  push();
  rectMode(CENTER);

  noStroke();
  fill(base[0], base[1], base[2], glowAlpha);
  rect(button.x, button.y + 6, button.w + 16, button.h + 14, 18);

  noStroke();
  fill(0, 0, 0, 60);
  rect(button.x, button.y + 8 - lift, button.w, button.h, 16);

  stroke(255, 255, 255, hovered ? 175 : 110);
  strokeWeight(1.4);
  fill(
    constrain(base[0] + (hovered ? 14 : 0), 0, 255),
    constrain(base[1] + (hovered ? 14 : 0), 0, 255),
    constrain(base[2] + (hovered ? 14 : 0), 0, 255),
    235,
  );
  rect(button.x, button.y - lift, button.w, button.h, 16);

  noStroke();
  fill(255, 255, 255, hovered ? 44 : 28);
  rect(
    button.x,
    button.y - lift - button.h * 0.18,
    button.w * 0.88,
    button.h * 0.28,
    12,
  );

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(button.textSize || 18);
  text(label, button.x, button.y - lift + 1);
  pop();
}

function isOverButton(button) {
  return (
    mouseX > button.x - button.w / 2 &&
    mouseX < button.x + button.w / 2 &&
    mouseY > button.y - button.h / 2 &&
    mouseY < button.y + button.h / 2
  );
}

function drawCenteredPanel(title, body, buttonLabel, button) {
  const panelW = min(width * 0.78, 760);
  const panelH = min(height * 0.66, 450);
  const panelX = width / 2;
  const panelY = height / 2;

  push();
  fill(4, 7, 14, 160);
  noStroke();
  rect(0, 0, width, height);
  pop();

  drawGlassPanel(panelX, panelY, panelW, panelH, UI_COLORS.line, 28);
  drawBadge("CASE FILE", panelX, panelY - panelH * 0.36, 118);

  push();
  fill(UI_COLORS.ink[0], UI_COLORS.ink[1], UI_COLORS.ink[2]);
  textAlign(CENTER, CENTER);

  textSize(min(width, height) * 0.05);
  text(title, panelX, panelY - panelH * 0.2);

  fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
  textSize(min(width, height) * 0.022);
  textLeading(30);
  text(
    body,
    panelX - panelW * 0.33,
    panelY - panelH * 0.05,
    panelW * 0.66,
    panelH * 0.44,
  );
  pop();

  drawButton(button, buttonLabel);
}

function drawCaseHeader(title, subtitle = "") {
  push();
  textAlign(CENTER, CENTER);
  fill(UI_COLORS.ink[0], UI_COLORS.ink[1], UI_COLORS.ink[2]);
  textSize(min(width, height) * 0.044);
  text(title, width / 2, height * 0.07);

  if (subtitle) {
    drawInfoPill(subtitle, width / 2, height * 0.125, min(width * 0.66, 720));
  }
  pop();
}

function getLineupPositions(count) {
  const y = height * 0.56;
  const left = count >= 5 ? width * 0.1 : width * 0.16;
  const right = count >= 5 ? width * 0.9 : width * 0.84;

  if (count === 1) return [{ x: width / 2, y }];

  const step = (right - left) / (count - 1);
  const positions = [];

  for (let i = 0; i < count; i++) {
    positions.push({ x: left + i * step, y });
  }

  return positions;
}

function getButtonRow(count, centerY, buttonW, buttonH, gap = 20) {
  const totalWidth = count * buttonW + (count - 1) * gap;
  const startX = width / 2 - totalWidth / 2 + buttonW / 2;
  let buttons = [];

  for (let i = 0; i < count; i++) {
    buttons.push({
      x: startX + i * (buttonW + gap),
      y: centerY,
      w: buttonW,
      h: buttonH,
    });
  }

  return buttons;
}

function drawFooterMessage(message, variant = "info") {
  if (!message) return;

  let accent = UI_COLORS.accent;
  if (variant === "success") accent = UI_COLORS.success;
  if (variant === "danger") accent = UI_COLORS.danger;
  if (variant === "warning") accent = UI_COLORS.warning;

  const boxW = min(width * 0.74, 760);
  const boxH = 52;

  push();
  rectMode(CENTER);
  noStroke();
  fill(0, 0, 0, 70);
  rect(width / 2, height * 0.94 + 6, boxW, boxH, 999);

  stroke(accent[0], accent[1], accent[2], 145);
  strokeWeight(1.3);
  fill(12, 18, 30, 220);
  rect(width / 2, height * 0.94, boxW, boxH, 999);

  noStroke();
  fill(UI_COLORS.ink[0], UI_COLORS.ink[1], UI_COLORS.ink[2]);
  textAlign(CENTER, CENTER);
  textSize(min(width, height) * 0.02);
  text(message, width / 2, height * 0.94 + 1);
  pop();
}

function drawLineupFloor() {
  push();
  noStroke();
  fill(10, 16, 28, 125);
  rect(0, height * 0.74, width, height * 0.26);
  fill(255, 255, 255, 8);
  rect(width * 0.05, height * 0.72, width * 0.9, 4, 999);
  pop();
}

function drawSuspectNameTag(x, y, label, active = false) {
  push();
  rectMode(CENTER);
  stroke(active ? 255 : 130, active ? 170 : 160, 255, active ? 180 : 95);
  strokeWeight(1.2);
  fill(12, 18, 30, active ? 235 : 210);
  rect(x, y, 108, 34, 999);
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  text(label, x, y + 1);
  pop();
}

function drawPortraitFrame(x, y, w, h, hovered, dangerMode = false) {
  const accent = dangerMode ? UI_COLORS.danger : UI_COLORS.accent;

  push();
  rectMode(CENTER);
  noStroke();
  fill(accent[0], accent[1], accent[2], hovered ? 40 : 20);
  rect(x, y, w + 24, h + 24, 24);

  noFill();
  stroke(accent[0], accent[1], accent[2], hovered ? 220 : 110);
  strokeWeight(hovered ? 3 : 1.4);
  rect(x, y, w + 8, h + 8, 20);
  pop();
}

function drawInspectLayout(
  title,
  subtitle,
  portraitDrawer,
  sections,
  accent = UI_COLORS.accent,
) {
  drawCaseHeader(title, subtitle);

  const portraitW = min(width * 0.28, 330);
  const portraitH = min(height * 0.46, 360);
  const portraitX = width * 0.3;
  const portraitY = height * 0.46;

  const infoW = min(width * 0.4, 500);
  const infoH = min(height * 0.5, 420);
  const infoX = width * 0.72;
  const infoY = height * 0.49;

  drawGlassPanel(
    portraitX,
    portraitY,
    portraitW + 54,
    portraitH + 68,
    accent,
    30,
  );
  drawBadge("INSPECTION", portraitX, portraitY - portraitH * 0.62, 128, accent);

  push();
  imageMode(CENTER);
  portraitDrawer(portraitX, portraitY, portraitW, portraitH);
  pop();

  drawGlassPanel(infoX, infoY, infoW, infoH, accent, 28);

  let startY = infoY - infoH * 0.35;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const blockY = startY + i * 112;

    push();
    textAlign(LEFT, TOP);
    fill(UI_COLORS.ink[0], UI_COLORS.ink[1], UI_COLORS.ink[2]);
    textSize(18);
    text(section.label, infoX - infoW * 0.39, blockY);

    fill(UI_COLORS.mutedInk[0], UI_COLORS.mutedInk[1], UI_COLORS.mutedInk[2]);
    textSize(17);
    textLeading(25);
    text(
      section.value,
      infoX - infoW * 0.39,
      blockY + 26,
      infoW * 0.78,
      section.h || 74,
    );
    pop();

    if (i < sections.length - 1) {
      push();
      stroke(255, 255, 255, 26);
      line(infoX - infoW * 0.4, blockY + 92, infoX + infoW * 0.4, blockY + 92);
      pop();
    }
  }
}

function drawModalOverlay(alpha = 170) {
  push();
  fill(4, 7, 14, alpha);
  noStroke();
  rect(0, 0, width, height);
  pop();
}

function finishCase(
  isCorrect,
  successMessage,
  failureMessage,
  nextScreen,
  setMessage,
) {
  if (transitionPending) return;

  transitionPending = true;
  const originScreen = currentScreen;

  setMessage(isCorrect ? successMessage : failureMessage);

  setTimeout(() => {
    if (isCorrect) {
      currentScreen = nextScreen;
    } else {
      failedLevel = originScreen;
      failedMessage = failureMessage;
      resetLevelByScreen(originScreen);
      currentScreen = "fail";
    }

    transitionPending = false;
  }, 900);
}

function resetAllLevels() {
  resetLevel1();
  resetLevel2();
}

function drawScoreHUD() {
  drawInfoPill(
    `Score: ${playerScore}`,
    width * 0.13,
    height * 0.08,
    145,
    UI_COLORS.success,
  );
}

function addPoints(points) {
  playerScore += points;
}

function subtractPoints(points) {
  playerScore = max(0, playerScore - points);
}

function resetScore() {
  playerScore = 0;
}
// --------------------------------------------------
// Help Button + Instructions Modal System
// --------------------------------------------------

let helpModalOpen = false;

const HELP_CONTENT = {
  level1: {
    title: "How to Play – Level 1",
    lines: [
      "👁  Observe suspects carefully",
      "🔍  Look for visual inconsistencies in objects, clothing, and expressions",
      "💬  No dialogue in this level — visual clues only",
      "✨  Hints are UNLIMITED — use the magnify button freely",
      "🎯  Click a suspect to inspect them, then use Convict to accuse",
    ],
  },
  level2: {
    title: "How to Play – Level 2",
    lines: [
      "🗣  Interrogate suspects using dialogue",
      "🔍  Compare their answers with visual clues you find",
      "⚡  Watch for contradictions between their words and evidence",
      "🔎  Hints (magnify button) are LIMITED — use them wisely (3 uses)",
      "📋  Open the Evidence Board to compare notes across suspects",
    ],
  },
  level3: {
    title: "How to Play – Level 3",
    lines: [
      "🧩  Combine visual clues, dialogue, and evidence board",
      "😬  Use the emotion detection system to spot deceptive behaviour",
      "📓  Check the notebook for timeline inconsistencies",
      "⚠️  Hints are VERY LIMITED — think before you use them",
      "🎭  Multiple suspects may seem guilty — only one is",
    ],
  },
};

function getHelpContentKey() {
  if (currentScreen === "level1") return "level1";
  if (currentScreen === "level2") return "level2";
  if (currentScreen === "level3") return "level3";
  return null;
}

function drawHelpButton() {
  const bx = width - 54;
  const by =  620;
  const r = 26;
  const hovered = dist(mouseX, mouseY, bx, by) < r + 4;

  push();
  noStroke();

  if (hovered) {
    fill(220, 40, 40, 55);
    ellipse(bx, by, (r + 10) * 2, (r + 10) * 2);
  }

  fill(0, 0, 0, 80);
  ellipse(bx + 2, by + 4, r * 2, r * 2);

  fill(hovered ? color(80, 160, 255) : color(40, 120, 220));
  ellipse(bx, by, r * 2, r * 2);

  noFill();
  stroke(255, 255, 255, 90);
  strokeWeight(1.5);
  ellipse(bx, by, r * 2 - 2, r * 2 - 2);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(20);
  text("?", bx, by + 1);
  textStyle(NORMAL);
  pop();
}

function isHelpButtonClicked() {
  const bx = width - 54;
  const by =  620;
  return dist(mouseX, mouseY, bx, by) < 30;
}

function drawHelpModal() {
  const key = getHelpContentKey();
  if (!key) return;

  const content = HELP_CONTENT[key];

  push();
  fill(4, 7, 14, 200);
  noStroke();
  rect(0, 0, width, height);
  pop();

  const mw = min(width * 0.72, 680);
  const mh = min(height * 0.62, 480);
  const mx = width / 2;
  const my = height / 2;

  drawGlassPanel(mx, my, mw, mh, UI_COLORS.accent, 28);

  push();
  noStroke();
  fill(UI_COLORS.accentStrong[0], UI_COLORS.accentStrong[1], UI_COLORS.accentStrong[2], 200);
  rectMode(CENTER);
  rect(mx, my - mh * 0.5 + 28, mw, 56, 28, 28, 0, 0);
  pop();

  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textStyle(BOLD);
  textSize(min(width, height) * 0.032);
  text(content.title, mx, my - mh * 0.5 + 28);
  textStyle(NORMAL);
  pop();

  const lineStartY = my - mh * 0.5 + 80;
  const lineGap = min((mh - 130) / content.lines.length, 60);

  push();
  textAlign(CENTER, CENTER);
  for (let i = 0; i < content.lines.length; i++) {
    const ly = lineStartY + i * lineGap + lineGap * 0.5;

    if (i % 2 === 0) {
      noStroke();
      fill(255, 255, 255, 10);
      rectMode(CENTER);
      rect(mx, ly, mw - 40, lineGap - 6, 8);
    }

    fill(UI_COLORS.ink[0], UI_COLORS.ink[1], UI_COLORS.ink[2]);
    noStroke();
    textSize(min(width, height) * 0.022);
    text(content.lines[i], mx, ly);
  }
  pop();

  // Close X button
  const cx = mx + mw * 0.5 - 24;
  const cy = my - mh * 0.5 + 28;
  const cr = 16;
  const cHovered = dist(mouseX, mouseY, cx, cy) < cr + 4;

  push();
  noStroke();
  fill(cHovered ? color(255, 80, 80) : color(160, 40, 40));
  ellipse(cx, cy, cr * 2, cr * 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text("✕", cx, cy + 1);
  textStyle(NORMAL);
  pop();

  // Got it button
  const gotItBtn = {
    x: mx,
    y: my + mh * 0.5 - 40,
    w: 160,
    h: 44,
  };
  drawButton(gotItBtn, "Got it!", UI_COLORS.accentStrong);
}

function handleHelpButtonClick() {
  if (helpModalOpen) {
    const key = getHelpContentKey();
    if (!key) return true;

    const mw = min(width * 0.72, 680);
    const mh = min(height * 0.62, 480);
    const mx = width / 2;
    const my = height / 2;

    // Close X
    const cx = mx + mw * 0.5 - 24;
    const cy = my - mh * 0.5 + 28;
    if (dist(mouseX, mouseY, cx, cy) < 20) {
      helpModalOpen = false;
      return true;
    }

    // Got it button
    const gotItBtn = {
      x: mx,
      y: my + mh * 0.5 - 40,
      w: 160,
      h: 44,
    };
    if (isOverButton(gotItBtn)) {
      helpModalOpen = false;
      return true;
    }

    return true; // swallow all clicks while modal is open
  }

  if (isHelpButtonClicked()) {
    helpModalOpen = true;
    return true;
  }

  return false;
}

function drawHelpOverlay() {
  drawHelpButton();
  if (helpModalOpen) drawHelpModal();
}