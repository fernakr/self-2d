window.s1 = function ($_p) {  

  let currentPuzzle = 0;
  let shapesToChoose;
  let puzzleShapes;
  let draggedShape = null; // To keep track of the currently dragged shape
  let selectedShape = null; // To keep track of the currently selected shape

  const rotationSpeed = 5; // Degrees per frame when key is held down
  let isKeyHeld = false;
  let rotationStartTime = 0;
  const holdDelay = 500; // 0.5 seconds in milliseconds

  class Shape {
    constructor({ shape, position = [0, 0], rotation = 0, isPuzzle = true }) {
      const shapeDetails = shapes.find(s => s.shape === shape) || {};
      this.shape = shape;
      this.position = position;
      this.rotation = rotation;
      this.color = shapeDetails.color || [255, 255, 255];
      this.size = shapeDetails.size || 60;
      this.width = shapeDetails.width || 60;
      this.height = shapeDetails.height || 60;
      this.type = shapeDetails.type;
      this.isPuzzle = isPuzzle;
      
      this.dragging = false;
      this.offset = [0, 0];  // To store offset during dragging
      this.hovered = false; // To track hover state      
      this.value = getValue(shapeDetails);
    }

    display() {
      $_p.push();
      $_p.translate(this.position[0], this.position[1]); // Move to shape position
      $_p.rotate($_p.radians(this.rotation)); // Rotate around the shape's center
    
      // Set color for outline based on hover state
      let stroke = this.isPuzzle ? [255, 255, 255] : this.color;
      if (this.hovered || this === selectedShape) {
        stroke = [255, 255, 255];
      }
      $_p.stroke(stroke);
    
      $_p.strokeWeight(2);
      let shapeColor = !this.isPuzzle ? this.color : [255, 255, 255];
      $_p.fill(shapeColor);
    
      // Draw shapes with center alignment
      if (this.shape === 'square') {
        $_p.rectMode($_p.CENTER);
        $_p.rect(0, 0, this.size, this.size);      
      } else if (this.shape === 'triangle' || this.shape === 'bigTriangle') {
        $_p.beginShape();
        $_p.vertex(-this.width / 2, this.height / 2);
        $_p.vertex(this.width / 2, this.height / 2);
        $_p.vertex(0, -this.height / 2);
        $_p.endShape($_p.CLOSE);
      } else if (this.shape === 'parallelogram') {
        const offset = this.width / 4;
        $_p.beginShape();
        $_p.vertex(-this.width / 2 - offset/2, -this.height / 2);
        $_p.vertex(this.width / 2 - offset/2, -this.height / 2);
        $_p.vertex(this.width / 2 + offset/2, this.height / 2);
        $_p.vertex(-this.width / 2 + offset/2, this.height / 2);
        $_p.endShape($_p.CLOSE);
      }
      $_p.pop();
    
      if (this.dragging) {
        this.position[0] = $_p.mouseX - $_p.width / 2 + this.offset[0];
        this.position[1] = $_p.mouseY - $_p.height / 2 + this.offset[1];
      }
    }
    
    

    isMouseOver(mx, my) {
      const [px, py] = this.position;
      let localX = mx - ($_p.width / 2 + px);
      let localY = my - ($_p.height / 2 + py);
      const angleRad = -$_p.radians(this.rotation); // Invert rotation angle for coordinate transformation
    
      // Rotate coordinates back to check within the shape’s bounds
      const rotatedX = localX * Math.cos(angleRad) - localY * Math.sin(angleRad);
      const rotatedY = localX * Math.sin(angleRad) + localY * Math.cos(angleRad);
    
      let isOver = false;
      if (this.shape === 'square') {
        isOver = Math.abs(rotatedX) <= this.size / 2 && Math.abs(rotatedY) <= this.size / 2;
      } else if (this.shape === 'triangle' || this.shape === 'bigTriangle') {
        isOver = rotatedX >= -this.width / 2 && rotatedX <= this.width / 2 && rotatedY >= -this.height / 2 && rotatedY <= this.height / 2;
      } else if (this.shape === 'parallelogram') {
        const offset = this.width / 2;
        isOver = rotatedX >= -offset && rotatedX <= this.width + offset && rotatedY >= -this.height / 2 && rotatedY <= this.height / 2;
      }
    
      this.hovered = isOver;
      return isOver;
    }
    
    rotate(angle) {
      this.rotation = (this.rotation + angle) % 360;
      if (this.rotation < 0) this.rotation += 360;
    }

    rotateFinished() {
      const snapAngleInc = 45;
      const snapAngle = Math.round(this.rotation / snapAngleInc) * snapAngleInc;
      this.rotation = snapAngle;
    }
  }

  const getValue = (shape) => {
    let randomValue = shape.values[Math.floor(Math.random() * shape.values.length)];
    // if an array, pick a random value from aray
    if (Array.isArray(randomValue)){
      randomValue = randomValue[Math.floor(Math.random() * randomValue.length)];
      // remove the value from the array
      shape.values = shape.values.filter(val => val !== randomValue);      
    }else{
      // remove the value from the array
      shape.values = shape.values.filter(val => val !== randomValue);
    }
    
    return randomValue;
  };



  const setupPuzzle = () => {
    puzzleShapes = puzzles[currentPuzzle].shapes.map(shapeData => {
      return new Shape({
        shape: shapeData.shape,
        position: shapeData.position,
        rotation: shapeData.rotation || 0,
        isPuzzle: true
      });
    });

    shapesToChoose = puzzleShapes.map(shape => new Shape({
      shape: shape.shape,
      position: shape.position,
      rotation: shape.rotation,
      isPuzzle: false,
    }));

    for (let i = 0; i < Math.ceil(puzzleShapes.length % 3 * 2 + 2); i++) {
      let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      // grab a value from the shape

      shapesToChoose.push(new Shape({
        shape: randomShape.shape,
        position: [0, 0],
        rotation: 0,        
        isPuzzle: false,
      }));
    }

    // shuffle
    shapesToChoose = shapesToChoose.sort(() => Math.random() - 0.5);

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


  const getDirection = (keypress) => {

    
    if ($_p.keyIsDown($_p.LEFT_ARROW) || keypress === 'a') {
      return 'left';
    } else if ($_p.keyIsDown($_p.RIGHT_ARROW) || keypress === 'd') {
      return 'right';
    }
    
    return null;
  }


  const checkPuzzle = () => {
    const tolerance = 10; // Position tolerance in pixels
    let allMatch = true;
  
    // Check if each puzzle shape has a matching chosen shape
    for (let i = 0; i < puzzleShapes.length; i++) {
      const puzzleShape = puzzleShapes[i];
      let matchFound = false;
  
      for (let j = 0; j < shapesToChoose.length; j++) {
        const chosenShape = shapesToChoose[j];
  
        // if (puzzleShape.shape !== chosenShape.shape)  return false;
        if (puzzleShape.shape === chosenShape.shape) {
          const posMatch = 
            Math.abs(chosenShape.position[0] - puzzleShape.position[0]) <= tolerance &&
            Math.abs(chosenShape.position[1] - puzzleShape.position[1]) <= tolerance;            
            
          let rotMatch;
          if (chosenShape.shape === 'square' || chosenShape.shape === 'parallelogram') {
            rotMatch = [0, 90, 180, 270].some(angle => Math.abs((chosenShape.rotation % 360) - angle) <= 5);
          } else {
            rotMatch = Math.abs((chosenShape.rotation % 360) - (puzzleShape.rotation % 360)) <= 5;
          }
  
          if (posMatch && rotMatch) {
            matchFound = true;
            // snap to puzzle position
            chosenShape.position = puzzleShape.position;
            // chosenShape.rotation = puzzleShape.rotation;

            break; // Stop searching once a match is found
          }
        }
      }
  
      if (!matchFound) {
        allMatch = false;
        // break; // Exit if any puzzle shape has no matching chosen shape
      }
    }
  
    if (allMatch) {
      console.log("Puzzle completed!");
      // Additional actions on puzzle completion can go here.
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
      shape: 'square', size: 60, color: [255, 0, 0], type: 'schema', 
      values: [
        ['The world is a safe place', 'The world is a dangerous place'],
        ['I am in control of my life', 'Things happen to me'],
        ['I am capable', 'I need help to succeed'],
        ['I am worthy', 'I am unworthy'],
        ['I am lovable', 'I am unlovable'],
        ['I am successful', 'I am a failure'],
        ['I can rely on myself', 'I need others to rely on'],
        ['I am accepted by others', 'I am an outsider'],

      ]

    },
    { shape: 'bigTriangle', width: 120, height: 60, color: [0, 255, 0], type: 'big belief', values: [
      ['I believe that people are inherently good', 'I believe that people are inherently bad'],
      ['I believe that there is a higher power','I don\'t believe in a higher power'],
      ['I believe that everyone deserves basic human rights', 'I believe that you have to earn your place in society'],
      ['I believe that everything happens for a reason', 'I believe that life is random'],
      ['I believe that everyone has a purpose', 'I believe that life has no purpose'],
      ['I believe that love conquers all', 'I believe that power conquers all'],
      ['I believe that the future is bright', 'I believe that the future is bleak'],
      ['I believe that we are all connected', 'I believe that we are all alone'],
      ['I believe that we are all equal', 'I believe that some are better than others'],
      ['I believe that we are all unique', 'I believe that we are all the same'],
      ['I believe that we are all capable of change', 'I believe that people never change'],
      ['I believe that we are all responsible for our actions', 'I believe that we are all victims of circumstance'],
      

    ] },
    { shape: 'triangle', width: 60, height: 30, color: [0, 255, 0], type: 'belief', values: [
      ['I am lazy', 'I am hardworking'],
      ['I am a pessimist', 'I am an optimist'],
      ['I am a procrastinator', 'I am a go-getter'],
      ['I am a perfectionist', 'I am a realist'],
      ['I am a dreamer', 'I am a realist'],
      ['I am a follower', 'I am a leader'],
      ['I am a loner', 'I am a social butterfly'],
      ['I am a night owl', 'I am an early bird'],
      ['I am a spender', 'I am a saver'],
      ['I am a talker', 'I am a listener'],
      ['I am a giver', 'I am a taker'],
      ['I am a planner', 'I am a spontaneous'],
      ['I am a worrier', 'I am carefree'],
      ['I am a fighter', 'I am a lover']
    ] },
    { shape: 'parallelogram', width: 120, height: 60, color: [0, 0, 255], type: 'identity', 
      values: [
        ['I am a mother', 'I am a father', 'I do not have children'],
        ['I am an introvert', 'I am an extrovert'],
        ['I am an artist', 'I am a scientist', 'I am a writer', 'I am a musician', 'I am a teacher'],
        ['I am a good person', 'I am a bad person'],
        ['I came from nothing', 'I came from privilege'],
        ['I am a woman','I am non-binary', 'I am a man'],
        ['I am a person of color', 'I am white'],
        ['I am a survivor', 'I am a victim'],

      ] 
     }
  ];

  let puzzles = [
    {
      shapes: [
        { shape: 'square', position: [30, 15] },
        { shape: 'square', position: [-30, 15] },
        { shape: 'triangle', position: [0, -30], rotation: 180 },
        { shape: 'triangle', position: [30, -30]},
        { shape: 'triangle', position: [-30, -30] },
        { shape: 'parallelogram', position: [15, 75] },
        { shape: 'triangle', position: [-40, -80], rotation: 45 },
        { shape: 'triangle', position: [-40, -100], rotation: 45 + 90 },
        { shape: 'triangle', position: [15, -80], rotation: 45 },
        { shape: 'triangle', position: [15, -100], rotation: 45 + 90 },
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
    if (selectedShape) {
        // make background color pulsate when shape is selected from 0.2 to 0.4 opacity
        const alpha = 0.4 + 0.2 * Math.sin($_p.frameCount * 0.03);
        const { levels }= $_p.color(selectedShape.color);
        // console.log(color);
        $_p.fill(levels[0], levels[1], levels[2], alpha * 255);
        $_p.noStroke();
        $_p.rectMode($_p.CORNER);
        $_p.rect(0, 0, $_p.width, $_p.height);

        // output value of selected shape
        $_p.fill(255);
        $_p.textSize(20);
        $_p.text(selectedShape.type + ': ' +selectedShape.value, 10, 60);

    }
    $_p.stroke(255);
    $_p.strokeWeight(2);
    $_p.fill(0);
    $_p.textSize(20);
    $_p.text("Puzzle " + currentPuzzle, 10, 30);

    $_p.translate($_p.width / 2, $_p.height / 2);

    puzzleShapes.forEach(shape => shape.display());
    shapesToChoose.forEach(shape => shape.display());

    // if (draggedShape) {
    //   draggedShape.display();
    // }

    if (selectedShape) {
      if (isKeyHeld && Date.now() - rotationStartTime > holdDelay) {
        const direction = getDirection($_p.key);
        //console.log(direction);
        const increment = direction === 'left' ? -rotationSpeed : rotationSpeed;
        selectedShape.rotate(increment);
      }

    }

    
  };

  $_p.mousePressed = () => {
    let clickedOnShape = null;
    for (let i = shapesToChoose.length - 1; i >= 0; i--) {
      const shape = shapesToChoose[i];
      if (shape.isMouseOver($_p.mouseX, $_p.mouseY)) {
        shape.dragging = true;
        draggedShape = shape;
        selectedShape = shape;
        clickedOnShape = true;

        shapesToChoose.splice(i, 1);
        shapesToChoose.push(draggedShape);

        shape.offset[0] = shape.position[0] - ($_p.mouseX - $_p.width / 2);
        shape.offset[1] = shape.position[1] - ($_p.mouseY - $_p.height / 2);
        break;
      }
    }
    if (!clickedOnShape) {
      selectedShape = null;
    }
  };

  $_p.mouseDragged = () => {
    if (draggedShape) {
      draggedShape.dragging = true;
    }
  };

  $_p.mouseReleased = () => {
    if (draggedShape) {
      draggedShape.dragging = false;
      draggedShape = null;
    }
    checkPuzzle();
  };

  $_p.keyPressed = () => {

    const direction = getDirection($_p.key);



    if (selectedShape && direction) {
      isKeyHeld = true;
      rotationStartTime = Date.now();
      
      const increment = direction === 'left' ? -45 : 45;
      selectedShape.rotate(increment);
    }
  };

  $_p.keyReleased = () => {
    if (selectedShape) {
      isKeyHeld = false;
      selectedShape.rotateFinished();
    }
    checkPuzzle();
  };
};




if (window.p5instance) window.p5instance.remove();
window.p5instance = new p5(window.s1);
