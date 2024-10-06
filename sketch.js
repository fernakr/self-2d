window.s1 = function ($_p) {  

  let currentPuzzle = 0;
  let shapesToChoose;
  let puzzleShapes;
  let draggedShape = null; // To keep track of the currently dragged shape

  class Shape {
    constructor({ shape, position = [0, 0], rotation = 0, type = 'puzzle' }) {
      const shapeDetails = shapes.find(s => s.shape === shape) || {};
      this.shape = shape;
      this.position = position;
      this.rotation = rotation;
      this.color = shapeDetails.color || [255, 255, 255];
      this.size = shapeDetails.size || 60;
      this.width = shapeDetails.width || 60;
      this.height = shapeDetails.height || 60;
      this.type = type;
      this.dragging = false;
      this.offset = [0, 0];  // To store offset during dragging
      this.hovered = false; // To track hover state
    }

    display() {
      $_p.push();
      $_p.translate(this.position[0], this.position[1]);
      if (this.rotation) $_p.rotate($_p.radians(this.rotation));

      // Set color for outline based on hover state

      let stroke = this.type === 'puzzle' ? [255,255,255] : this.color;
      if (this.hovered) {
        // yellow
        stroke = [255, 255, 0];
      }
      $_p.stroke(stroke);

      $_p.strokeWeight(2);

      let shapeColor = this.type !== 'puzzle' ? this.color : [255, 255, 255];
      $_p.fill(shapeColor);

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
        this.position[0] = $_p.mouseX - $_p.width / 2 + this.offset[0];
        this.position[1] = $_p.mouseY - $_p.height / 2 + this.offset[1];
      }
    }

    isMouseOver(mx, my) {
      const [px, py] = this.position;

      // Translate and rotate mouse coordinates into the shape's local space
      let localX = mx - ($_p.width / 2 + px);
      let localY = my - ($_p.height / 2 + py);
      
      const angleRad = -$_p.radians(this.rotation);  // Invert rotation angle for coordinate transformation
      const rotatedX = localX * Math.cos(angleRad) - localY * Math.sin(angleRad);
      const rotatedY = localX * Math.sin(angleRad) + localY * Math.cos(angleRad);

      // Check collision based on shape type
      let isOver = false;
      if (this.shape === 'square') {
        isOver = Math.abs(rotatedX) <= this.size / 2 && Math.abs(rotatedY) <= this.size / 2;
      } else if (this.shape === 'triangle') {
        isOver = rotatedX >= 0 && rotatedX <= this.width && rotatedY >= 0 && rotatedY <= this.height;
      } else if (this.shape === 'parallelogram') {
        const offset = this.width / 2;
        isOver = rotatedX >= -offset && rotatedX <= this.width + offset && rotatedY >= 0 && rotatedY <= this.height;
      }
      
      this.hovered = isOver; // Update the hover state
      return isOver;
    }
  }

  const setupPuzzle = () => {
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

    // Add random shapes
    for (let i = 0; i < 4; i++) {
      let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      shapesToChoose.push(new Shape({
        shape: randomShape.shape,
        position: [0, 0],
        rotation: 0,
        type: 'piece'
      }));
    }

    // Calculate position and rotation after all shapes are added
    const radius = 300;
    const angleBetweenShapes = Math.PI * 2 / shapesToChoose.length;

    for (let i = 0; i < shapesToChoose.length; i++) {
      let shape = shapesToChoose[i];
      const x = Math.cos(angleBetweenShapes * i) * radius;
      const y = Math.sin(angleBetweenShapes * i) * radius;
      let rotation = Math.atan2(y, x) * 180 / Math.PI;
      if (i % 2 === 0) rotation += 180;

      shape.position = [x, y];
      shape.rotation = rotation;
    }
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

    // Draw the currently dragged shape on top
    if (draggedShape) {
      draggedShape.display();
    }
  };

  $_p.mousePressed = () => {
    // Check shapesToChoose in reverse order to find the topmost shape
    for (let i = shapesToChoose.length - 1; i >= 0; i--) {
      const shape = shapesToChoose[i];
      if (shape.isMouseOver($_p.mouseX, $_p.mouseY)) {
        shape.dragging = true;
        draggedShape = shape; // Set the currently dragged shape

        // Move the dragged shape to the end of the array
        shapesToChoose.splice(i, 1); // Remove it from its current position
        shapesToChoose.push(draggedShape); // Add it to the end of the array

        // Calculate offset and store it
        shape.offset[0] = shape.position[0] - ($_p.mouseX - $_p.width / 2);
        shape.offset[1] = shape.position[1] - ($_p.mouseY - $_p.height / 2);
        break; // Stop searching after finding the topmost shape
      }
    }
  };

  $_p.mouseDragged = () => {
    if (draggedShape) {
      draggedShape.position[0] = $_p.mouseX - $_p.width / 2 + draggedShape.offset[0];
      draggedShape.position[1] = $_p.mouseY - $_p.height / 2 + draggedShape.offset[1];
    }
  };

  $_p.mouseReleased = () => {
    if (draggedShape) {
      draggedShape.dragging = false;
      draggedShape = null; // Reset the currently dragged shape
    }
  };

  $_p.mouseMoved = () => {
    // Reset hovered state for all shapes
    for (let shape of shapesToChoose) {
      shape.hovered = false; // Reset hover state
      shape.isMouseOver($_p.mouseX, $_p.mouseY); // Update hover state
    }
  };

};




if (window.p5instance) window.p5instance.remove();
window.p5instance = new p5(window.s1);
