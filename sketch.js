let buildings = [];
let backgroundBuildings = [];
let offY;
let ballX;
let dragging = false;
let ballRadius = 10;
let floorBlock;
let draggingFloor = false;

class Building {
  constructor(x, h, w, c, hasWindows = true, name = "") {
    this.x = x;
    this.h = h;
    this.w = w;
    this.baseColor = c;
    this.currentColor = c;
    this.hasWindows = hasWindows;
    this.name = name;
  }

  updateColor(currentYear) {
    if (this.name === "beige") {
      if (currentYear >= 2008 && currentYear <= 2016) {
        this.currentColor = color(160); // Grey
      } else {
        this.currentColor = this.baseColor;
      }
    }
  }

  show() {
    fill(this.currentColor);
    strokeWeight(1);
    rectMode(CORNER);
    rect(this.x, offY - this.h, this.w, this.h);
    if (this.hasWindows) {
      this.drawWindows();
    }
    // name display removed
  }

  drawWindows() {
    let cols = floor(this.w / 10);
    let rows = floor(this.h / 20);
    let marginX = 4;
    let marginY = 8;
    let winW = (this.w - (cols + 1) * marginX) / cols;
    let winH = (this.h - (rows + 1) * marginY) / rows;

    fill(250);
    stroke(1);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let winX = this.x + marginX + i * (winW + marginX);
        let winY = (offY - this.h) + marginY + j * (winH + marginY);
        rect(winX, winY, winW, winH);
      }
    }
  }
}

class FloorBlock {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.isDragging = false;
  }

  show() {
    fill(this.c);
    stroke(0);
    rect(this.x, this.y, this.w, this.h);
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
  }

  moveTo(mx, my) {
    this.x = mx - this.w / 2;
    this.y = my - this.h / 2;
  }
}

function setup() {
  createCanvas(800, 550);
  offY = (4 * height) / 5;
  ballX = map(2000, 2000, 2025, 10, width - 10);

  // Background buildings
  for (let i = 0; i < 40; i++) {
    let x = 20 + i * 40;
    let w = random(20, 100);
    let h = random(50, 200);
    let c = color(random(20, 150), 100);
    backgroundBuildings.push(new Building(x, h, w, c, false));
  }

  // Main Building
  buildings.push(new Building(340, 100, 180, color(0, 100, 180), true));

  // Red (public)
  buildings.push(new Building(50, random(100, 300), random(150, 250), color(random(150, 255), 0, random(50, 100), 220), true));

  // Beige (under construction) building
  buildings.push(new Building(560, random(100, 150), random(30, 50), color(255, random(200, 250), 204, 220), true, "beige"));

  // Orange (private) building
  buildings.push(new Building(650, random(150, 250), random(80, 140), color(255, random(150, 200), 0, 220), true));
 
  floorBlock = new FloorBlock(width - 120, 20, 50, 20, color(0, 100, 180));

 renovationCircle = {
  x: width - 95,
  y: 70,
  r: 25,
  dragging: false
};
  
}


function draw() {
  background(245);
  let currentYear = getYearFromX(ballX);

  for (let b of buildings) {
    b.updateColor(currentYear);
  }

  for (let b of backgroundBuildings) {
    b.show();
  }

  for (let b of buildings) {
    b.show();
  }

  displayEconomyState(currentYear);
  
  floorBlock.show();
  fill(0);
 textSize(10);
 textAlign(CENTER, CENTER);
 text("New Floor", floorBlock.x + floorBlock.w / 2,  floorBlock.y + floorBlock.h / 2);


 fill(255, 204, 100);
 stroke(0);
 ellipse(renovationCircle.x, renovationCircle.y,  renovationCircle.r * 2);
 fill(0);
 noStroke();
 textSize(10);
 textAlign(CENTER, CENTER);
 text("Renovation", renovationCircle.x, renovationCircle.y);


  strokeWeight(8);
  stroke(40, 200);
  line(0, offY, width, offY);
  drawTimeline(height - 30);

  drawBall(ballX, height - 30);
  
}

function displayEconomyState(year) {
  push(); // Save current style settings
  noStroke();
  textSize(14);
  fill(0);
  textAlign(LEFT, TOP);

  if ((year >= 2000 && year < 2008) || (year > 2016 && year <= 2025)) {
    text("State of Economy = Economic Prosperity", 10, 10);
  } else if (year >= 2008 && year <= 2016) {
    text("State of Economy = Economic Crisis", 10, 10);
  }
  pop(); // Restore previous style settings
}


function drawTimeline(yPos) {
  push(); // Protect text settings
  stroke(0);
  strokeWeight(2);
  line(10, yPos, width - 10, yPos);

  let startYear = 2000;
  let endYear = 2025;
  let years = endYear - startYear + 1;
  let step = (width - 20) / (years - 1);

  textAlign(CENTER);
  textSize(10);
  noStroke();
  fill(0);

  for (let i = 0; i < years; i++) {
    let x = 10 + i * step;
    let year = startYear + i;

    stroke(0);
    strokeWeight(1);
    line(x, yPos - 5, x, yPos + 5);

    noStroke();
    fill(0);
    text(year, x, yPos + 20);
  }
  pop(); // Restore prior settings
}


function drawBall(x, y) {
  fill(100);
  stroke(0);
  ellipse(x, y, ballRadius / 2);
}

function mousePressed() {
  if (dist(mouseX, height - 20, ballX, height - 20) < ballRadius + 2) {
    dragging = true;
  }

  if (floorBlock.contains(mouseX, mouseY)) {
    draggingFloor = true;
  }
}

function mouseDragged() {
  if (dragging) {
    ballX = constrain(mouseX, 10, width - 10);
  }

  if (draggingFloor) {
    floorBlock.moveTo(mouseX, mouseY);
  }
  
    if (dist(mouseX, mouseY, renovationCircle.x, renovationCircle.y) < renovationCircle.r) {
    renovationCircle.dragging = true;
  }
  if (renovationCircle.dragging) {
    renovationCircle.x = mouseX;
    renovationCircle.y = mouseY;
  }
}

function mouseReleased() {
  dragging = false;

  if (draggingFloor) {
  let currentYear = getYearFromX(ballX);
  let isProsperity = (currentYear >= 2000 && currentYear < 2008) || (currentYear > 2016 && currentYear <= 2025);

  let mainBuilding = buildings[0];
  if (
    isProsperity &&
    floorBlock.x + floorBlock.w / 2 > mainBuilding.x &&
    floorBlock.x + floorBlock.w / 2 < mainBuilding.x + mainBuilding.w &&
    floorBlock.y + floorBlock.h > offY - mainBuilding.h - 30 &&
    floorBlock.y < offY
  ) {
    mainBuilding.h += 20;
  }

  // Reset position
  floorBlock.x = width - 120;
  floorBlock.y = 20;
  draggingFloor = false;
}

  
if (renovationCircle.dragging) {
  for (let b of buildings) {
    if (
      renovationCircle.x > b.x &&
      renovationCircle.x < b.x + b.w &&
      renovationCircle.y > offY - b.h &&
      renovationCircle.y < offY
    ) {
      // Get base color levels
      let c = b.baseColor.levels;

      // Modify brightness slightly to create a new shade
      let shadeFactor = random(0.4, 1.2); // slightly darker or lighter
      let r = constrain(c[0] * shadeFactor, 0, 255);
      let g = constrain(c[1] * shadeFactor, 0, 255);
      let bl = constrain(c[2] * shadeFactor, 0, 255);

      b.currentColor = color(r, g, bl, 220);
    }
  }

  renovationCircle.x = width - 50;
  renovationCircle.y = 50;
  renovationCircle.dragging = false;
}  
}


function getYearFromX(x) {
  let startX = 10;
  let endX = width - 10;
  let year = map(x, startX, endX, 2000, 2025);
  return floor(year);
}