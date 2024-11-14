// Walker OOP Array Demo

class Walker {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.radius = 5;
    this.colour = colour;
  }

  display() {
    noStroke();
    fill(this.colour);
    circle(this.x, this.y, this.radius*2);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      // up
      this.y -= this.speed;
    }
    else if (choice < 50) {
      // down
      this.y += this.speed;
    }
    else if (choice < 75) {
      // left
      this.x -= this.speed;
    }
    else {
      // right
      this.x += this.speed;
    }
  }
}

let walkerArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  let luc = new Walker(width/2, height/2, "red");
  walkerArray.push(luc);
}

function draw() {
  for (let theWalker of walkerArray){
    theWalker.move();
    theWalker.display();
  }
}

function mousePressed() {
  let randomColor = color(random(255), random(255), random(255));

  let someWalker = new Walker(mouseX, mouseY, randomColor);
  walkerArray.push(someWalker);
}