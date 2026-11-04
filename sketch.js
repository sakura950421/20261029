// ======================================================
// 月、櫻、小狼｜完整互動動畫
// ======================================================


// ======================================================
// 1. 畫面設定
// ======================================================

const BASE_W = 1366;
const BASE_H = 768;

let sceneScale = 1;
let offsetX = 0;
let offsetY = 0;

let characterScale = 2.4;
let sakuraScale = 2.4;
let wolfScale = 2.4;


// ======================================================
// 2. 月的圖片
// ======================================================

let standImg;
let startImg;
let flyImg;
let landingImg;
let attackImg;
let cardImg;
let blockImg;


// ======================================================
// 3. 櫻的圖片
// ======================================================

let sakuraStandImg;
let sakuraWalkImg;
let sakuraFallImg;
let sakuraCardImg;


// ======================================================
// 4. 小狼的圖片
// ======================================================

let wolfStandImg;
let wolfAttackImg;
let wolfLightningImg;
let wolfFlyImg;


// ======================================================
// 5. 月的基本設定
// ======================================================

let characterX;
let characterY;

let moveSpeed = 4 * characterScale;
let facing = 1;

let characterState = "stand";
let stateStartTime = 0;
let animationSpeed = 150;


// ======================================================
// 6. 月的手刀設定
// ======================================================

let spaceHeld = false;
let attackStartTime = 0;

let attackFrameCount = 5;
let attackFrameWidth = 705 / 5;
let attackFrameHeight = 170;

let attackFrameSpeed = 120;
let attackPauseTime = 350;

let lastAttackCycle = -1;


// ======================================================
// 7. 月的卡牌設定
// ======================================================

let cardHeld = false;
let cardStartTime = 0;

let cardFrameCount = 7;
let cardFrameWidth = 1192 / 7;
let cardFrameHeight = 144;

let cardFrameSpeed = 120;
let cardPauseTime = 350;


// ======================================================
// 8. 月的格擋設定
// ======================================================

let moonBlocking = false;
let moonDialogue = "";


// ======================================================
// 9. 櫻的基本設定
// ======================================================

let sakuraX;
let sakuraY;

let sakuraFacing = -1;
let sakuraSpeed = 4 * sakuraScale;

let sakuraState = "stand";
let sakuraStateStartTime = 0;

let sakuraIsMoving = false;


// ======================================================
// 10. 櫻的動畫設定
// ======================================================

let sakuraStandFrameCount = 4;
let sakuraStandFrameHeight = 95;

let sakuraWalkFrameCount = 3;
let sakuraWalkFrameHeight = 92;

let sakuraFallFrameCount = 3;
let sakuraFallFrameHeight = 98;

let sakuraCardFrameCount = 11;
let sakuraCardFrameHeight = 133;

let sakuraAnimationSpeed = 150;


// ======================================================
// 11. 櫻的卡牌設定
// ======================================================

let sakuraManualCard = false;
let sakuraDefense = false;

let sakuraDialogue = "";


// ======================================================
// 12. 小狼基本設定
// ======================================================

let wolfX;
let wolfY;

let wolfFacing = -1;

// 小狼與櫻的距離，數值越大距離越遠
let wolfFollowDistance = 220;

let wolfFollowSpeed = 0.18;

let wolfState = "stand";
let wolfStateStartTime = 0;


// ======================================================
// 13. 小狼站立動畫設定
// ======================================================

// 835 × 86，共 10 張
let wolfStandFrameCount = 10;
let wolfStandFrameWidth = 835 / 10;
let wolfStandFrameHeight = 86;

let wolfStandFrameSpeed = 120;


// ======================================================
// 14. 小狼攻擊動畫設定
// ======================================================

// 1347 × 130，共 13 張
let wolfAttackFrameCount = 13;
let wolfAttackFrameWidth = 1347 / 13;
let wolfAttackFrameHeight = 130;

let wolfAttackFrameSpeed = 120;

// 第 12、13 張重複 4 次
let wolfAttackRepeatCount = 4;

// 攻擊動畫開始時間
let wolfAttackStartTime = 0;

// 攻擊動畫的完整播放順序
let wolfAttackSequence = [];

// 是否正在攻擊
let wolfWasAttacking = false;


// ======================================================
// 15. 小狼雷擊動畫設定
// ======================================================

// 637 × 184，共 6 張
let wolfLightningFrameCount = 6;
let wolfLightningFrameWidth = 637 / 6;
let wolfLightningFrameHeight = 184;


// ======================================================
// 16. 小狼飛行動畫設定
// ======================================================

// 262 × 157，共 3 張
let wolfFlyFrameCount = 3;
let wolfFlyFrameWidth = 262 / 3;
let wolfFlyFrameHeight = 157;

let wolfFlyFrameSpeed = 120;

let wolfFlyStartTime = 0;
let wolfFlyLandTime = 0;


// ======================================================
// 17. 載入圖片
// ======================================================

function preload() {

  // 月
  standImg = loadImage("月/stand/stand.png");
  startImg = loadImage("月/jump/起步.png");
  flyImg = loadImage("月/jump/飛行.png");
  landingImg = loadImage("月/jump/降落.png");
  attackImg = loadImage("月/手刀/手刀.png");
  cardImg = loadImage("月/使用卡牌/使用卡牌.png");
  blockImg = loadImage("月/擋/擋.png");

  // 櫻
  sakuraStandImg = loadImage("櫻/站著/站.png");
  sakuraWalkImg = loadImage("櫻/走路/走路.png");
  sakuraFallImg = loadImage("櫻/跌倒/跌倒.png");
  sakuraCardImg = loadImage("櫻/使用卡牌/使用卡牌.png");

  // 小狼
  wolfStandImg = loadImage("小狼/站立/站立.png");
  wolfAttackImg = loadImage("小狼/攻擊/攻擊.png");
  wolfLightningImg = loadImage("小狼/雷/雷.png");
  wolfFlyImg = loadImage("小狼/飛/飛.png");

}


// ======================================================
// 18. 建立畫布
// ======================================================

function setup() {

  createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);

  characterX = BASE_W * 0.3;
  sakuraX = BASE_W * 0.7;

  characterY = BASE_H / 2;
  sakuraY = BASE_H / 2;

  wolfX = sakuraX - sakuraFacing * wolfFollowDistance;
  wolfY = sakuraY;

  createWolfAttackSequence();

  calculateScale();

}


// ======================================================
// 19. 建立小狼攻擊動畫順序
// ======================================================

function createWolfAttackSequence() {

  wolfAttackSequence = [];

  // 第 1～11 張各播放一次
  for (let i = 0; i < 11; i++) {
    wolfAttackSequence.push(i);
  }

  // 第 12、13 張重複 4 次
  for (let i = 0; i < wolfAttackRepeatCount; i++) {
    wolfAttackSequence.push(11);
    wolfAttackSequence.push(12);
  }

}


// ======================================================
// 20. 計算畫面縮放
// ======================================================

function calculateScale() {

  sceneScale = min(
    windowWidth / BASE_W,
    windowHeight / BASE_H
  );

  offsetX = (windowWidth - BASE_W * sceneScale) / 2;
  offsetY = (windowHeight - BASE_H * sceneScale) / 2;

}


// ======================================================
// 21. 繪製背景
// ======================================================

function drawBackground() {

  for (let y = 0; y < BASE_H; y++) {

    let amount = map(y, 0, BASE_H, 0, 1);

    let topColor = color("#101C45");
    let bottomColor = color("#39265C");

    let currentColor = lerpColor(
      topColor,
      bottomColor,
      amount
    );

    stroke(currentColor);
    line(0, y, BASE_W, y);

  }

  noStroke();

}


// ======================================================
// 22. 判斷月是否移動
// ======================================================

function isMoving() {

  return (
    keyIsDown(LEFT_ARROW) ||
    keyIsDown(RIGHT_ARROW)
  );

}


// ======================================================
// 23. 更新月的移動
// ======================================================

function updateMovement() {

  if (keyIsDown(LEFT_ARROW)) {

    characterX -= moveSpeed;
    facing = -1;

  }

  else if (keyIsDown(RIGHT_ARROW)) {

    characterX += moveSpeed;
    facing = 1;

  }

  characterX = constrain(
    characterX,
    70 * characterScale,
    BASE_W - 70 * characterScale
  );

}


// ======================================================
// 24. 更新月的動畫狀態
// ======================================================

function updateCharacterState() {

  if (moonBlocking) return;
  if (cardHeld) return;
  if (spaceHeld) return;

  let moving = isMoving();
  let elapsedTime = millis() - stateStartTime;

  if (characterState === "stand") {

    if (moving) {

      characterState = "start";
      stateStartTime = millis();

    }

  }

  else if (characterState === "start") {

    if (elapsedTime >= animationSpeed * 2) {

      if (moving) {
        characterState = "fly";
      } else {
        characterState = "landing";
      }

      stateStartTime = millis();

    }

  }

  else if (characterState === "fly") {

    if (!moving) {

      characterState = "landing";
      stateStartTime = millis();

    }

  }

  else if (characterState === "landing") {

    if (moving) {

      characterState = "start";
      stateStartTime = millis();

    }

    else if (elapsedTime >= animationSpeed) {

      characterState = "stand";
      stateStartTime = millis();

    }

  }

}


// ======================================================
// 25. 月的站立動畫
// ======================================================

function drawStand() {

  let frame = floor(
    millis() / animationSpeed
  ) % 3;

  let frameWidth = 376 / 3;

  drawMoonSprite(
    standImg,
    frame * frameWidth,
    0,
    frameWidth,
    136,
    frameWidth,
    136
  );

}


// ======================================================
// 26. 月的起步動畫
// ======================================================

function drawStart() {

  let elapsedTime = millis() - stateStartTime;

  let frame = min(
    floor(elapsedTime / animationSpeed),
    1
  );

  let frameWidth = 219 / 2;

  drawMoonSprite(
    startImg,
    frame * frameWidth,
    0,
    frameWidth,
    134,
    frameWidth,
    134
  );

}


// ======================================================
// 27. 月的飛行動畫
// ======================================================

function drawFly() {

  drawMoonSprite(
    flyImg,
    0, 0,
    107, 134,
    107, 134
  );

}


// ======================================================
// 28. 月的降落動畫
// ======================================================

function drawLanding() {

  drawMoonSprite(
    landingImg,
    0, 0,
    103, 129,
    103, 129
  );

}


// ======================================================
// 29. 月的手刀動畫
// ======================================================

function drawAttack() {

  let animationDuration =
    attackFrameCount * attackFrameSpeed;

  let cycleDuration =
    animationDuration + attackPauseTime;

  let totalElapsed =
    millis() - attackStartTime;

  let cycle = floor(totalElapsed / cycleDuration);

  let elapsedTime = totalElapsed % cycleDuration;

  let frame = attackFrameCount - 1;

  if (elapsedTime < animationDuration) {

    frame = floor(
      elapsedTime / attackFrameSpeed
    );

  }

  if (
    frame >= 2 &&
    frame <= 3 &&
    cycle !== lastAttackCycle
  ) {

    lastAttackCycle = cycle;
    checkAttackHit();

  }

  drawMoonSprite(
    attackImg,
    frame * attackFrameWidth,
    0,
    attackFrameWidth,
    attackFrameHeight,
    attackFrameWidth,
    attackFrameHeight
  );

}


// ======================================================
// 30. 月的卡牌動畫
// ======================================================

function drawCard() {

  let animationDuration =
    cardFrameCount * cardFrameSpeed;

  let cycleDuration =
    animationDuration + cardPauseTime;

  let elapsedTime =
    (millis() - cardStartTime) % cycleDuration;

  let frame = cardFrameCount - 1;

  if (elapsedTime < animationDuration) {

    frame = floor(
      elapsedTime / cardFrameSpeed
    );

  }

  drawMoonSprite(
    cardImg,
    frame * cardFrameWidth,
    0,
    cardFrameWidth,
    cardFrameHeight,
    cardFrameWidth,
    cardFrameHeight
  );

}


// ======================================================
// 31. 月的格擋動畫
// ======================================================

function drawBlock() {

  let frame = 1;
  let blockFrameWidth = 189 / 2;

  drawMoonSprite(
    blockImg,
    frame * blockFrameWidth,
    0,
    blockFrameWidth,
    124,
    blockFrameWidth,
    124
  );

}


// ======================================================
// 32. 月的圖片繪製函式
// ======================================================

function drawMoonSprite(
  img,
  sourceX,
  sourceY,
  sourceWidth,
  sourceHeight,
  drawWidth,
  drawHeight
) {

  push();

  translate(characterX, characterY);

  if (facing === -1) {
    scale(-1, 1);
  }

  image(
    img,
    0,
    0,
    drawWidth * characterScale,
    drawHeight * characterScale,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight
  );

  pop();

}


// ======================================================
// 33. 繪製月目前的動畫
// ======================================================

function drawCharacter() {

  if (moonBlocking) {

    drawBlock();

  }

  else if (cardHeld) {

    drawCard();

  }

  else if (spaceHeld) {

    drawAttack();

  }

  else {

    if (characterState === "stand") {
      drawStand();
    }

    else if (characterState === "start") {
      drawStart();
    }

    else if (characterState === "fly") {
      drawFly();
    }

    else if (characterState === "landing") {
      drawLanding();
    }

  }

}


// ======================================================
// 34. 月的手刀命中判定
// ======================================================

function checkAttackHit() {

  if (sakuraState === "fall") return;
  if (sakuraState === "card") return;

  let distanceBetween = abs(
    characterX - sakuraX
  );

  let hitDistance = 125 * characterScale;

  if (distanceBetween <= hitDistance) {

    sakuraState = "fall";
    sakuraStateStartTime = millis();

    sakuraDialogue = "好痛";

    sakuraManualCard = false;
    sakuraDefense = false;

  }

}


// ======================================================
// 35. 更新櫻的移動
// ======================================================

function updateSakuraMovement() {

  sakuraIsMoving = false;

  if (sakuraState === "fall") return;
  if (sakuraState === "card") return;

  let moving = false;

  if (keyIsDown(65)) {

    sakuraX -= sakuraSpeed;
    sakuraFacing = -1;

    moving = true;

  }

  else if (keyIsDown(68)) {

    sakuraX += sakuraSpeed;
    sakuraFacing = 1;

    moving = true;

  }

  sakuraX = constrain(
    sakuraX,
    70 * sakuraScale,
    BASE_W - 70 * sakuraScale
  );

  sakuraIsMoving = moving;

  if (moving) {

    if (sakuraState !== "walk") {

      sakuraState = "walk";
      sakuraStateStartTime = millis();

    }

  }

  else if (sakuraState === "walk") {

    sakuraState = "stand";
    sakuraStateStartTime = millis();

  }

}


// ======================================================
// 36. 更新櫻的動畫狀態
// ======================================================

function updateSakuraState() {

  let elapsedTime =
    millis() - sakuraStateStartTime;

  if (sakuraDefense) {

    sakuraState = "card";

    if (characterX < sakuraX) {
      sakuraFacing = -1;
    } else {
      sakuraFacing = 1;
    }

    return;

  }

  if (sakuraManualCard) {

    sakuraState = "card";
    return;

  }

  if (sakuraState === "fall") {

    if (
      elapsedTime >=
      sakuraFallFrameCount * sakuraAnimationSpeed
    ) {

      sakuraState = "stand";
      sakuraStateStartTime = millis();

      sakuraDialogue = "";

    }

  }

  else if (sakuraState === "card") {

    sakuraState = "stand";
    sakuraStateStartTime = millis();

  }

}


// ======================================================
// 37. 櫻的圖片繪製函式
// ======================================================

function drawSakuraSprite(
  img,
  frame,
  frameCount,
  frameHeight,
  drawScale
) {

  let frameWidth = img.width / frameCount;

  push();

  translate(sakuraX, sakuraY);

  if (sakuraFacing === -1) {
    scale(-1, 1);
  }

  image(
    img,
    0,
    0,
    frameWidth * drawScale,
    frameHeight * drawScale,
    frame * frameWidth,
    0,
    frameWidth,
    frameHeight
  );

  pop();

}


// ======================================================
// 38. 櫻的站立動畫
// ======================================================

function drawSakuraStand() {

  let frame = floor(
    millis() / sakuraAnimationSpeed
  ) % sakuraStandFrameCount;

  drawSakuraSprite(
    sakuraStandImg,
    frame,
    sakuraStandFrameCount,
    sakuraStandFrameHeight,
    sakuraScale
  );

}


// ======================================================
// 39. 櫻的走路動畫
// ======================================================

function drawSakuraWalk() {

  let elapsedTime =
    millis() - sakuraStateStartTime;

  let frame = floor(
    elapsedTime / sakuraAnimationSpeed
  ) % sakuraWalkFrameCount;

  drawSakuraSprite(
    sakuraWalkImg,
    frame,
    sakuraWalkFrameCount,
    sakuraWalkFrameHeight,
    sakuraScale
  );

}


// ======================================================
// 40. 櫻的跌倒動畫
// ======================================================

function drawSakuraFall() {

  let elapsedTime =
    millis() - sakuraStateStartTime;

  let frame = min(
    floor(elapsedTime / sakuraAnimationSpeed),
    sakuraFallFrameCount - 1
  );

  drawSakuraSprite(
    sakuraFallImg,
    frame,
    sakuraFallFrameCount,
    sakuraFallFrameHeight,
    sakuraScale
  );

}


// ======================================================
// 41. 櫻的卡牌動畫
// ======================================================

function drawSakuraCard() {

  let elapsedTime =
    millis() - sakuraStateStartTime;

  let frame = floor(
    elapsedTime / sakuraAnimationSpeed
  ) % sakuraCardFrameCount;

  drawSakuraSprite(
    sakuraCardImg,
    frame,
    sakuraCardFrameCount,
    sakuraCardFrameHeight,
    sakuraScale
  );

}


// ======================================================
// 42. 繪製櫻目前的動畫
// ======================================================

function drawSakura() {

  if (sakuraState === "fall") {

    drawSakuraFall();

  }

  else if (sakuraState === "card") {

    drawSakuraCard();

  }

  else if (sakuraState === "walk") {

    drawSakuraWalk();

  }

  else {

    drawSakuraStand();

  }

}


// ======================================================
// 43. 月使用卡牌時，櫻是否防禦
// ======================================================

function updateSakuraDefense() {

  if (cardHeld) {

    let moonFacingSakura =
      (characterX < sakuraX && facing === 1) ||
      (characterX > sakuraX && facing === -1);

    if (
      moonFacingSakura &&
      sakuraState !== "fall"
    ) {

      sakuraDefense = true;
      sakuraDialogue = "（防禦）";

    }

    else {

      sakuraDefense = false;
      sakuraDialogue = "";

    }

  }

  else {

    sakuraDefense = false;

    if (!sakuraManualCard) {
      sakuraDialogue = "";
    }

  }

}


// ======================================================
// 44. 櫻使用卡牌時，月是否格擋
// ======================================================

function updateMoonBlock() {

  if (sakuraManualCard && sakuraState !== "fall") {

    let sakuraFacingMoon =
      (sakuraX > characterX && sakuraFacing === -1) ||
      (sakuraX < characterX && sakuraFacing === 1);

    if (sakuraFacingMoon) {

      moonBlocking = true;

      facing = sakuraX > characterX ? 1 : -1;

      moonDialogue = "可惡";

    }

    else {

      moonBlocking = false;
      moonDialogue = "";

    }

  }

  else {

    moonBlocking = false;
    moonDialogue = "";

  }

}


// ======================================================
// 45. 更新小狼的位置
// ======================================================

function updateWolfPosition() {

  // 小狼永遠待在櫻面向方向的後方
  let targetX =
    sakuraX - sakuraFacing * wolfFollowDistance;

  let targetY = sakuraY;

  wolfX = lerp(
    wolfX,
    targetX,
    wolfFollowSpeed
  );

  wolfY = lerp(
    wolfY,
    targetY,
    wolfFollowSpeed
  );

  wolfFacing = sakuraFacing;

}


// ======================================================
// 46. 更新小狼飛行狀態
// ======================================================

function updateWolfFlight() {

  // 櫻攻擊時，由攻擊動畫接管
  if (sakuraManualCard) return;

  if (sakuraIsMoving) {

    if (
      wolfState !== "flyStart" &&
      wolfState !== "flyLoop"
    ) {

      wolfState = "flyStart";

      wolfFlyStartTime = millis();

    }

    if (wolfState === "flyStart") {

      let elapsed =
        millis() - wolfFlyStartTime;

      // 起步第 1、2 張，之後固定第 3 張
      if (elapsed >= wolfFlyFrameSpeed * 2) {

        wolfState = "flyLoop";

      }

    }

  }

  else {

    if (
      wolfState === "flyStart" ||
      wolfState === "flyLoop"
    ) {

      wolfState = "flyLand";

      wolfFlyLandTime = millis();

    }

    if (wolfState === "flyLand") {

      let elapsed =
        millis() - wolfFlyLandTime;

      // 降落第 3、2、1 張
      if (elapsed >= wolfFlyFrameSpeed * 3) {

        wolfState = "stand";

        wolfStateStartTime = millis();

      }

    }

  }

}


// ======================================================
// 47. 更新小狼攻擊狀態
// ======================================================

function updateWolfAttack() {

  let shouldAttack =
    sakuraManualCard &&
    sakuraState !== "fall";

  if (shouldAttack) {

    // 剛開始攻擊時，重新計時
    if (!wolfWasAttacking) {

      wolfAttackStartTime = millis();

      wolfWasAttacking = true;

    }

    wolfState = "attack";

    // 攻擊時面向月
    wolfFacing = characterX < wolfX ? -1 : 1;

  }

  else {

    // 放開 S，立刻停止攻擊與雷擊
    if (wolfWasAttacking) {

      wolfWasAttacking = false;

      if (sakuraIsMoving) {

        wolfState = "flyLoop";

      }

      else {

        wolfState = "stand";

        wolfStateStartTime = millis();

      }

    }

  }

}


// ======================================================
// 48. 取得小狼攻擊動畫目前影格
// ======================================================

function getWolfAttackFrame() {

  let elapsed =
    millis() - wolfAttackStartTime;

  let sequenceDuration =
    wolfAttackSequence.length * wolfAttackFrameSpeed;

  // 完整序列播放完畢後，從第 1 張重新開始
  let sequenceTime =
    elapsed % sequenceDuration;

  let sequenceIndex = floor(
    sequenceTime / wolfAttackFrameSpeed
  );

  let frame =
    wolfAttackSequence[sequenceIndex];

  return {
    frame: frame,
    sequenceIndex: sequenceIndex,
    sequenceTime: sequenceTime
  };

}


// ======================================================
// 49. 繪製小狼攻擊動畫
// ======================================================

function drawWolfAttack() {

  let attackData = getWolfAttackFrame();

  let frame = attackData.frame;

  push();

  translate(wolfX, wolfY);

  if (wolfFacing === -1) {
    scale(-1, 1);
  }

  image(
    wolfAttackImg,
    0,
    0,
    wolfAttackFrameWidth * wolfScale,
    wolfAttackFrameHeight * wolfScale,
    frame * wolfAttackFrameWidth,
    0,
    wolfAttackFrameWidth,
    wolfAttackFrameHeight
  );

  pop();

}


// ======================================================
// 50. 取得小狼雷擊目前影格
// ======================================================

function getWolfLightningFrame() {

  let attackData = getWolfAttackFrame();

  let sequenceIndex = attackData.sequenceIndex;

  // 攻擊序列前 11 張：
  // 雷擊第 1、2、3 張依序播放
  if (sequenceIndex < 11) {

    let frame = min(
      floor(sequenceIndex / 4),
      2
    );

    return frame;

  }

  // 攻擊序列進入第 12、13 張重複階段：
  // 雷擊第 4、5、6 張持續循環
  let lightningElapsed =
    attackData.sequenceTime -
    (11 * wolfAttackFrameSpeed);

  let lightningLoopDuration =
    3 * wolfAttackFrameSpeed;

  let lightningTime =
    lightningElapsed % lightningLoopDuration;

  let lightningFrame =
    3 + floor(
      lightningTime / wolfAttackFrameSpeed
    );

  return lightningFrame;

}


// ======================================================
// 51. 繪製小狼雷擊
// ======================================================

function drawWolfLightning() {

  // 沒有攻擊時不顯示雷
  if (!wolfWasAttacking) return;

  let lightningFrame =
    getWolfLightningFrame();

  push();

  // 雷擊打在月身上
  image(
    wolfLightningImg,
    characterX,
    characterY - 45 * characterScale,
    wolfLightningFrameWidth * wolfScale,
    wolfLightningFrameHeight * wolfScale,
    lightningFrame * wolfLightningFrameWidth,
    0,
    wolfLightningFrameWidth,
    wolfLightningFrameHeight
  );

  pop();

}


// ======================================================
// 52. 繪製小狼站立動畫
// ======================================================

function drawWolfStand() {

  let frame = floor(
    millis() / wolfStandFrameSpeed
  ) % wolfStandFrameCount;

  push();

  translate(wolfX, wolfY);

  if (wolfFacing === -1) {
    scale(-1, 1);
  }

  image(
    wolfStandImg,
    0,
    0,
    wolfStandFrameWidth * wolfScale,
    wolfStandFrameHeight * wolfScale,
    frame * wolfStandFrameWidth,
    0,
    wolfStandFrameWidth,
    wolfStandFrameHeight
  );

  pop();

}


// ======================================================
// 53. 繪製小狼飛行動畫
// ======================================================

function drawWolfFly() {

  let frame = 0;

  // 起飛：第 1、2 張
  if (wolfState === "flyStart") {

    let elapsed =
      millis() - wolfFlyStartTime;

    frame = min(
      floor(elapsed / wolfFlyFrameSpeed),
      1
    );

  }

  // 持續飛行：固定第 3 張
  else if (wolfState === "flyLoop") {

    frame = 2;

  }

  // 降落：第 3、2、1 張
  else if (wolfState === "flyLand") {

    let elapsed =
      millis() - wolfFlyLandTime;

    let landFrame = min(
      floor(elapsed / wolfFlyFrameSpeed),
      2
    );

    frame = 2 - landFrame;

  }

  push();

  translate(wolfX, wolfY);

  if (wolfFacing === -1) {
    scale(-1, 1);
  }

  image(
    wolfFlyImg,
    0,
    0,
    wolfFlyFrameWidth * wolfScale,
    wolfFlyFrameHeight * wolfScale,
    frame * wolfFlyFrameWidth,
    0,
    wolfFlyFrameWidth,
    wolfFlyFrameHeight
  );

  pop();

}


// ======================================================
// 54. 繪製小狼
// ======================================================

function drawWolf() {

  if (wolfState === "attack") {

    drawWolfAttack();

  }

  else if (
    wolfState === "flyStart" ||
    wolfState === "flyLoop" ||
    wolfState === "flyLand"
  ) {

    drawWolfFly();

  }

  else {

    drawWolfStand();

  }

}


// ======================================================
// 55. 繪製對話
// ======================================================

function drawDialogues() {

  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  if (sakuraDialogue !== "") {

    fill("#FFFFFF");
    stroke("#39265C");
    strokeWeight(4);

    textSize(24);

    text(
      sakuraDialogue,
      sakuraX,
      sakuraY - 85 * sakuraScale
    );

  }

  if (moonDialogue !== "") {

    fill("#FFFFFF");
    stroke("#39265C");
    strokeWeight(4);

    textSize(24);

    text(
      moonDialogue,
      characterX,
      characterY - 100 * characterScale
    );

  }

  noStroke();
  textStyle(NORMAL);

}


// ======================================================
// 56. 繪製操作說明
// ======================================================

function drawControls() {

  let panelWidth = 220;
  let panelHeight = 120;
  let margin = 25;

  // 月
  push();

  rectMode(CORNER);
  noStroke();

  fill(10, 15, 40, 175);

  rect(
    margin,
    BASE_H - panelHeight - margin,
    panelWidth,
    panelHeight,
    14
  );

  fill("#FFFFFF");

  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(BOLD);

  text(
    "月｜操作",
    margin + 16,
    BASE_H - panelHeight - margin + 12
  );

  textStyle(NORMAL);
  textSize(14);

  text(
    "← →　移動\n↑　手刀\n空白鍵　使用卡牌",
    margin + 16,
    BASE_H - panelHeight - margin + 42
  );

  pop();


  // 櫻
  push();

  rectMode(CORNER);
  noStroke();

  fill(10, 15, 40, 175);

  rect(
    BASE_W - panelWidth - margin,
    BASE_H - panelHeight - margin,
    panelWidth,
    panelHeight,
    14
  );

  fill("#FFFFFF");

  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(BOLD);

  text(
    "櫻｜操作",
    BASE_W - panelWidth - margin + 16,
    BASE_H - panelHeight - margin + 12
  );

  textStyle(NORMAL);
  textSize(14);

  text(
    "A　向左移動\nD　向右移動\nS　使用卡牌",
    BASE_W - panelWidth - margin + 16,
    BASE_H - panelHeight - margin + 42
  );

  pop();

}


// ======================================================
// 57. 鍵盤按下
// ======================================================

function keyPressed() {

  // 月的方向
  if (keyCode === LEFT_ARROW) {
    facing = -1;
  }

  if (keyCode === RIGHT_ARROW) {
    facing = 1;
  }

  // 月的手刀
  if (keyCode === UP_ARROW) {

    if (!spaceHeld) {

      spaceHeld = true;

      attackStartTime = millis();

      lastAttackCycle = -1;

    }

  }

  // 月的卡牌
  if (keyCode === 32) {

    if (!cardHeld) {

      cardHeld = true;

      cardStartTime = millis();

    }

  }

  // 櫻的卡牌攻擊
  if (key === "s" || key === "S") {

    if (
      !sakuraManualCard &&
      !sakuraDefense &&
      sakuraState !== "fall"
    ) {

      sakuraManualCard = true;

      sakuraState = "card";

      sakuraStateStartTime = millis();

    }

  }

  if (
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW ||
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW ||
    keyCode === 32
  ) {

    return false;

  }

}


// ======================================================
// 58. 鍵盤放開
// ======================================================

function keyReleased() {

  // 月停止手刀
  if (keyCode === UP_ARROW) {

    spaceHeld = false;

  }

  // 月停止卡牌
  if (keyCode === 32) {

    cardHeld = false;

    sakuraDefense = false;

    if (!sakuraManualCard) {
      sakuraDialogue = "";
    }

  }

  // 櫻放開 S
  if (key === "s" || key === "S") {

    sakuraManualCard = false;

    // 小狼攻擊與雷擊立即停止
    wolfWasAttacking = false;

    if (sakuraIsMoving) {

      wolfState = "flyLoop";

    }

    else {

      wolfState = "stand";

      wolfStateStartTime = millis();

    }

  }

  if (
    keyCode === LEFT_ARROW ||
    keyCode === RIGHT_ARROW ||
    keyCode === UP_ARROW ||
    keyCode === DOWN_ARROW ||
    keyCode === 32
  ) {

    return false;

  }

}


// ======================================================
// 59. 主程式
// ======================================================

function draw() {

  background("#101C45");

  calculateScale();

  push();

  translate(offsetX, offsetY);

  scale(sceneScale);


  // 背景
  drawBackground();


  // 更新月
  updateMovement();
  updateCharacterState();


  // 更新櫻
  updateSakuraMovement();
  updateSakuraDefense();
  updateSakuraState();


  // 更新月的格擋
  updateMoonBlock();


  // 更新小狼
  updateWolfPosition();
  updateWolfAttack();
  updateWolfFlight();


  // 繪製月
  drawCharacter();


  // 繪製小狼
  drawWolf();


  // 繪製櫻
  drawSakura();


  // 雷擊疊在月身上
  drawWolfLightning();


  // 對話
  drawDialogues();


  // 操作說明
  drawControls();


  pop();

}


// ======================================================
// 60. 視窗大小改變
// ======================================================

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  calculateScale();

}