window.s1 = function ($_p)  {  
  
  $_p.setup = () => {  
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    canvas = $_p.createCanvas(windowWidth,windowHeight);  
    canvas.parent("#content");
  }

  let shapes = [
    {
      shape: 'square',
      size: 60,      
      color: [255, 0, 0],
      type: 'identity'
    },
    {
      shape: 'bigTriangle',
      width: 120,      
      height: 60,  
      color: [0, 255, 0],
      type: 'big belief'
    },
    {
      shape: 'triangle',
      width: 60,      
      height: 30,
      color: [0, 255, 0],
      type: 'belief'
    },
    {
      shape: 'parallelogram',
      width: 120,      
      height: 60,
    }
  ];

  let puzzles = [
    {
      shapes: [
        {
          shape: 'square',          
          position: [30, 30],
          // rotation: 20
        },
        {
          shape: 'square',          
          position: [-30, 30],
          // rotation: 20
        },
        {
          shape: 'triangle',          
          position: [0, 0],
          rotation: 180
        },
        {
          shape: 'triangle',          
          position: [60, 0],
          rotation: 180
        },
        {
          shape: 'triangle',          
          position: [-30, -30],          
        },
        {
          shape: 'parallelogram',          
          position: [-60, 60],
          // rotation: 20
        }
      ]
    }
  ];

  let currentPuzzle = 0;

  const drawShape = (shape) => {
    $_p.push();
    $_p.fill(255);
    $_p.stroke(255);
    $_p.strokeWeight(2);
    

    const x = shape.position[0];
    const y = shape.position[1];

    // Translate to the shape's position and apply rotation if it has one
    $_p.translate(x, y);
    if (shape.rotation) $_p.rotate($_p.radians(shape.rotation));

    const shapeObject = shapes.find(s => s.shape === shape.shape);
    const { size, color, width, height } = shapeObject;

    // Draw the shape at the origin (0, 0) now that we've translated to its position
    if (shape.shape === 'square') {
      $_p.rectMode($_p.CENTER);
      $_p.rect(0, 0, size, size);      
    } else if (shape.shape === 'triangle') {
      $_p.triangle(0, 0, width, 0, width / 2, height);
    } else if (shape.shape === 'parallelogram') {
      const offset = width / 2;
      $_p.quad(0, 0, width, 0, width + offset, height, offset, height);
    }

    $_p.pop();
  };

  $_p.draw = () => {        
    $_p.background(2);  
    $_p.stroke(255);
    $_p.strokeWeight(2);
    $_p.fill(0);
    $_p.textSize(20);
    $_p.text("Puzzle " + currentPuzzle, 10, 30);

    $_p.translate($_p.width / 2, $_p.height / 2);
    for (let i = 0; i < puzzles[currentPuzzle].shapes.length; i++) {
      const shape = puzzles[currentPuzzle].shapes[i];
      drawShape(shape);
    }
  };
};

if (window.p5instance) window.p5instance.remove();
window.p5instance = new p5(window.s1);
