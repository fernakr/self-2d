const p5Convert = require('p5-global2instance')

const sourceCode = `// USE WINDOW VARS!!!
function setup() {
    const myCanvas = createCanvas(400, 400);
    myCanvas.parent("content");
  }
  
  function draw() {
    background(20, 20, 20, 200);
    segment(90, 60, 90, 340);
    segment(90, 200, 320, 50);
    segment(90, 170, 320, 330);
  }
  
  function segment(x1, y1, x2, y2) {
    var distX = x2 - x1;
    var distY = y2 - y1;
    var segments = 20;
    var incX = distX / segments;
    var incY = distY / segments;
    for (var i = 0; i < 20; i++) {
      let currX = x1 + incX * i;
      let currY = y1 + incY * i;
      stroke(0, 0, 0, 100);
  
      for (var j = 0; j < 20; j++) {
        fill(255);
        if (j % 5) fill(random(200, 255), random(200, 255), random(200, 255));
        let distX = random(-40, 40);
        let distY = random(-20, 20);
        let thisX = currX + distX;
        let thisY = currY + distY;
        let distance = dist(currX, currY, thisX, thisY);
        let sizeAmp = map(mouseX, 0, width, 1, 5);
        let size = map(distance, 0, 40, 6, 2);
        ellipse(thisX, thisY, sizeAmp * size, sizeAmp * size);
      }
    }
  }
  
  setup();
`

let output = p5Convert(sourceCode)
console.log(output);