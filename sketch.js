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
      size: 100,      
      color: [255, 0, 0],
      type: 'identity'
    },
    {
      shape: 'bigTriangle',
      size: 150,      
      color: [0, 255, 0],
      type: 'big belief'
    },
    {
      shape: 'triangle',
      size: 50,      
      color: [0, 255, 0],
      type: 'belief'
    },
    {
      shape: 'parallelogram',
      size: 100,      
    }
  ]

  let puzzles = [
    {
      shapes: [
        {
          shape: 'square',          
          position: [30, 30, 0],
          rotation: 20
        },
        {
          shape: 'square',          
          position: [50, 60, 0],
          rotation: 20
        },
        {
          shape: 'triangle',          
          position: [100, 100, 0],
          rotation: 20
        },
        {
          shape: 'triangle',          
          position: [100, 100, 0],
          rotation: 20
        },
        {
          shape: 'parallelogram',          
          position: [100, 100, 0],
          rotation: 20
        }

      ]
    }
  ]

  let currentPuzzle = 0;

  const drawShape = (shape) => {
    $_p.fill(255);
    $_p.stroke(0);
    $_p.strokeWeight(2);
    let x = shape.position[0];
    let y = shape.position[1];
    let size = shape.size;
    $_p.push();
    $_p.translate($_p.width/2, $_p.height/2);
    console.log(shapes);
    const shapeObject = shapes.find(s => s.shape === shape.shape);
    
    if (shape.type === 'square') {
      $_p.rect(x, y, shapeObject.size, shapeObject.size);
    } else if (shape.type === 'triangle') {
      $_p.triangle(x, y, x + shapeObject.size, y, x + shapeObject.size / 2, y + shapeObject.size);
    }else if (shape.type === 'parallelogram') {
      const offset = shapeObject.size / 2;
      $_p.quad(x, y, x + shapeObject.size, y, x + shapeObject.size + offset, y + shapeObject.size, x + offset, y + shapeObject.size);

    }
    $_p.pop();
  }

  $_p.draw = () => {        
    
    /* The line `// .background(255);` is a comment in JavaScript code. Comments are used to provide
    explanations or notes within the code for developers to understand the purpose of certain lines
    of code. In this case, the comment is disabling the background color setting in the `draw`
    function of the p5.js sketch. The `background(255)` function call would typically set the
    background color of the sketch to white (RGB value of 255), but since it is commented out, it is
    not being executed. */
    $_p.background(2);  
    $_p.stroke(255);
    $_p.strokeWeight(2);
    $_p.fill(0);
    $_p.textSize(20);
    $_p.text("Puzzle " + currentPuzzle, 10, 30);
    for (let i = 0; i < puzzles[currentPuzzle].shapes.length; i++) {
      let shape = puzzles[currentPuzzle].shapes[i];
      drawShape(shape);
    }


  
  }
}

if (window.p5instance) window.p5instance.remove();
window.p5instance = new p5(window.s1);