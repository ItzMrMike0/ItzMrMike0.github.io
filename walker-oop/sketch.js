// Walker OOP Demo
class Walker {
  constructor(x, y, colour) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.radius = 2;
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

let michael;
let luc;

function setup() {
  createCanvas(windowWidth, windowHeight);
  michael = new Walker(width/2, height/2, "aqua");
  luc = new Walker(width/3, height/3, "red");
}

function draw() {
  michael.move();
  luc.move();

  michael.display();
  luc.display();
}
