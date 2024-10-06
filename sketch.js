window.s1 = function ($_p)  {  
  
  let currentPuzzle = 0;
  let shapesToChoose;
  let puzzleShapes;

  const setupPuzzle = () => {
    puzzleShapes = puzzles[currentPuzzle].shapes;
    shapesToChoose = [...puzzleShapes];
    // add some fake random shapes
    for (let i = 0; i < 3; i++) {
      let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      shapesToChoose.push({
        shape: randomShape.shape, 
      });      
    }
    // shuffle the shapes

    shapesToChoose = shapesToChoose.sort(() => Math.random() - 0.5);
  }

  $_p.setup = () => {  
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    canvas = $_p.createCanvas(windowWidth,windowHeight);  
    canvas.parent("#content");
    setupPuzzle();

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
      color: [0, 0, 255],
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

  

  const drawShape = (shape, useColor) => {
    const shapeObject = shapes.find(s => s.shape === shape.shape);
    const { size, color, width, height } = shapeObject;
    $_p.push();
    let shapeColor = useColor ? color : [255, 255, 255];
    $_p.fill(shapeColor);
    $_p.stroke(shapeColor);
    $_p.strokeWeight(2);
    

    const x = shape.position[0];
    const y = shape.position[1];

    // Translate to the shape's position and apply rotation if it has one
    $_p.translate(x, y);
    if (shape.rotation) $_p.rotate($_p.radians(shape.rotation));



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
    
    for (let i = 0; i < puzzleShapes.length; i++) {
      const shape = puzzleShapes[i];
      drawShape(shape);
    }
    
    
    // display the shapes to choose from radially from the center
    const radius = 300;
    const angleBetweenShapes = Math.PI * 2 / shapesToChoose.length;

    for (let i = 0; i < shapesToChoose.length; i++) {
      const shape = shapesToChoose[i];
      const x = Math.cos(angleBetweenShapes * i) * radius;
      const y = Math.sin(angleBetweenShapes * i) * radius;
      let rotation = Math.atan2(y, x) * 180 / Math.PI;
      // every other shape is rotated 180 degrees
      if (i % 2 === 0) {
        rotation += 180;
      }
      drawShape({ ...shape, position: [x, y], rotation }, true);
    }
    

  };
};

if (window.p5instance) window.p5instance.remove();
window.p5instance = new p5(window.s1);
