window.s1 = function ($_p)  {  

  let currentPuzzle = 0;
  let shapesToChoose;
  let puzzleShapes;

  class Shape {
    constructor({ shape, position = [0, 0], rotation = 0, type = 'puzzle' }) {
      // Find the shape details based on the shape type
      const shapeDetails = shapes.find(s => s.shape === shape) || {};

      // Set properties based on shape details or default values
      this.shape = shape;
      this.position = position;
      this.rotation = rotation;
      this.color = shapeDetails.color || [255, 255, 255];
      this.size = shapeDetails.size || 60;
      this.width = shapeDetails.width || 60;
      this.height = shapeDetails.height || 60;
      this.type = type;
      this.dragging = false;
    }

    display() {
      $_p.push();
      $_p.translate(this.position[0], this.position[1]);
      if (this.rotation) $_p.rotate($_p.radians(this.rotation));

      let shapeColor = this.type !== 'puzzle' ? this.color : [255, 255, 255];
      $_p.fill(shapeColor);
      $_p.stroke(shapeColor);
      $_p.strokeWeight(2);

      if (this.shape === 'square') {
        $_p.rectMode($_p.CENTER);
        $_p.rect(0, 0, this.size, this.size);      
      } else if (this.shape === 'triangle') {
        $_p.triangle(0, 0, this.width, 0, this.width / 2, this.height);
      } else if (this.shape === 'parallelogram') {
        const offset = this.width / 2;
        $_p.quad(0, 0, this.width, 0, this.width + offset, this.height, offset, this.height);
      }
      $_p.pop();

      if (this.dragging) {
        this.position = [$_p.mouseX - $_p.width / 2, $_p.mouseY - $_p.height / 2];
      }
    }
  }

  const setupPuzzle = () => {
    const radius = 300;

    puzzleShapes = puzzles[currentPuzzle].shapes.map(shapeData => {
      return new Shape({
        shape: shapeData.shape,
        position: shapeData.position,
        rotation: shapeData.rotation || 0,
        type: 'puzzle'
      });
    });

    shapesToChoose = puzzleShapes.map(shape => new Shape({
      shape: shape.shape,
      position: shape.position,
      rotation: shape.rotation,
      type: 'piece'
    }));


    

    for (let i = 0; i < 4; i++) {
      let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      shapesToChoose.push(new Shape({
        shape: randomShape.shape,
        position: [0, 0],
        rotation: 0,
        type: 'piece'
      }));
    }

    const angleBetweenShapes = Math.PI * 2 / shapesToChoose.length;



    // Calculate initial positions based on radius and angle
    for (let i = 0; i < shapesToChoose.length; i++) {
      let shape = shapesToChoose[i];
      const x = Math.cos(angleBetweenShapes * i) * radius;
      const y = Math.sin(angleBetweenShapes * i) * radius;
      let rotation = Math.atan2(y, x) * 180 / Math.PI;
      if (i % 2 === 0) rotation += 180;

      shape.position = [x, y];
      shape.rotation = rotation;
    }

    

    shapesToChoose.sort(() => Math.random() - 0.5);
  };

  $_p.setup = () => {  
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    canvas = $_p.createCanvas(windowWidth, windowHeight);  
    canvas.parent("#content");
    setupPuzzle();
  };

  const shapes = [
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
        },
        {
          shape: 'square',          
          position: [-30, 30],
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
        }
      ]
    }
  ];

  // resize canvas on window resize
  $_p.windowResized = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    $_p.resizeCanvas(windowWidth, windowHeight);
  };

  $_p.draw = () => {        
    $_p.background(2);  
    $_p.stroke(255);
    $_p.strokeWeight(2);
    $_p.fill(0);
    $_p.textSize(20);
    $_p.text("Puzzle " + currentPuzzle, 10, 30);

    $_p.translate($_p.width / 2, $_p.height / 2);

    puzzleShapes.forEach(shape => shape.display());
    shapesToChoose.forEach(shape => shape.display());
  };

  $_p.mousePressed = () => {
    shapesToChoose.forEach(shape => {
      const x = $_p.mouseX - $_p.width / 2 - shape.position[0];
      const y = $_p.mouseY - $_p.height / 2 - shape.position[1];
      const distance = Math.sqrt(x * x + y * y);
      if (distance < shape.size / 2) {
        shape.dragging = true;
      }
    });
  };

  $_p.mouseDragged = () => {
    shapesToChoose.forEach(shape => {
      if (shape.dragging) {
        shape.position = [$_p.mouseX - $_p.width / 2, $_p.mouseY - $_p.height / 2];
      }
    });
  };

  $_p.mouseReleased = () => {
    shapesToChoose.forEach(shape => shape.dragging = false);
  };
};

if (window.p5instance) window.p5instance.remove();
window.p5instance = new p5(window.s1);
