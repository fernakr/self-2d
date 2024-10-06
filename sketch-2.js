window.s1 = function ($_p)  {
  const maxInstances = 20;
  let currInst = [];
  let currIndex = 0;
  let angle = 0;
  const isEven = (value) => {
    return $_p.abs(parseInt(value)) % 2 === 0
  }
  const CAPTURE = false;
    
  FORMAT = 'webm', WORKERSFOLDER = './assets/capture/',
  VERBOSE = false, DISPLAY = true,
  FPS = 60, FRAMERATE = FPS, FRAMELIMIT = 30 * FPS;

  if (CAPTURE){
    capturer = new CCapture({
      format: FORMAT, workersPath: WORKERSFOLDER,
      verbose: VERBOSE, display: DISPLAY,
      framerate: FRAMERATE, frameLimit: FRAMELIMIT
    });
  }


  // class Checkered{
  //   constructor(color, size){
  //     this.life = 0;
  //     //this.diagonal = diagonal;
      
  //     ;
  //     this.size = size;
      
  //     //this.direction = $_p.random(0,1) > 0.5 ? 1 : -1;
  //     // this.rows = 3;
  //     // this.rowIndex = 1;
  //     this.offset = this.size;
  //     this.position = {
  //       x: - $_p.width/2 + parseInt($_p.random($_p.width/this.size)) * this.size,
  //       y: - $_p.height/2 + parseInt($_p.random($_p.height/this.size)) * this.size,
  //       z: 0
  //     }
  //   }
  //   setSegment(){
  //     this.currSegment = $_p.random(this.minSegment, this.maxSegment);
  //     this.segmentIndex = 0;
  //   }
  //   process(){       
  //     this.segmentIndex++; 
  //     this.position.x += this.size*this.xDirection;
  //     if (this.segmentIndex >= this.currSegment) {
  //       this.setSegment();
  //       this.xDirection *= -1;
  //       this.position.y += this.size;
  //     }
      
  //     $_p.translate(this.position.x,this.position.y,this.position.z);      
      

             
  //     $_p.push(); 
      
        
  //     $_p.noStroke();
  //     $_p.translate(this.size, 0,0);              
  //     $_p.fill(this.color);
  //     // $_p.strokeWeight(1.5);
  //     // $_p.stroke(0);
      
  //     $_p.beginShape();
  //     $_p.vertex(0, 0);
  //     $_p.vertex(this.size, -1 * this.offset);
  //     $_p.vertex(this.size, -1 * this.offset + this.size);
  //     $_p.vertex(0, this.size);
  //     $_p.endShape($_p.CLOSE);
  //     $_p.noFill();        
  //     $_p.rect(0, 0, this.size, this.size);
    
  //     if ($_p.random(1) > 0.95) {
  //       const horiz = ($_p.random(1) > 0.5);
  //       for (let i = 0; i < this.size/3; i++) {
  //         $_p.stroke(this.strokeColor);
  //         $_p.strokeWeight(2);
  //         if (horiz){
  //           $_p.line(0, i*3, this.size, i*3);
  //         }else{
  //           $_p.line(i*3 + 1.5, 0,  i*3 + 1.5, this.size);
  //         }
  //       }
  //     }

    
  //     $_p.pop();  
              
      
  //   }
  // }

  // class Link{
  //   constructor(){
  //     this.life = 0;
  //     this.lifespan = 100;
  //     this.size = $_p.random(10) + 2;      
  //     this.position = {
  //       x: - $_p.width/2 + $_p.random($_p.width),
  //       y: - $_p.height/2 + $_p.random($_p.height),
  //       z: 0
  //     }
  //     // this.initPosition = Object.assign({}, this.position);
  //     // this.rotation = $_p.random(90) + 90;
  //   }
  //   process(){
  //     $_p.translate(this.position.x, this.position.y, this.position.z);      
  //     $_p.push();
  //     //$_p.translate(this.size)
  //     const horiz = this.life % 2 === 0;      
  //     //console.log(horiz);
  //     $_p.stroke(0,$_p.lerp(255,80,1 + $_p.sin(angle)),255);        
  //     $_p.fill($_p.lerp(255,0,1 + $_p.cos(angle)));
  //     $_p.strokeWeight(0.5);
  //     const negDirection = parseInt($_p.random(1000) % 3) === 0; 
  //     const sign = negDirection ? -1 : 1;
  //     $_p.rotateX($_p.PI/2);
  //     $_p.blendMode($_p.MULTIPLY);
  //     if (horiz){
  //       $_p.rotateY($_p.PI/2);
  //       this.position.y += sign * this.size;
  //       //$_p.translate(this.size,0,0);
  //     }else{
  //       this.position.x += sign * this.size;
  //       //$_p.translate(0,this.size,0);
  //     }
  //     $_p.torus(this.size,3,8,8);
  //     $_p.pop();
      
  //   }
  // }

  // class Coils{
  //   constructor(){
  //     this.life = 0;
  //     this.lifespan = 100;
  //     this.size = $_p.random(5) + 2;      
  //     this.position = {
  //       x: - $_p.width/2 + $_p.random($_p.width),
  //       y: - $_p.height/2 + $_p.random($_p.height),
  //       z: 0
  //     }
  //     // this.initPosition = Object.assign({}, this.position);
  //     // this.rotation = $_p.random(90) + 90;
  //   }
  //   process(){
  //     //console.log(angle);
  //     // if (angle > 6){
  //     //   $_p.background(0);
  //     //   angle = 0;
  //     // }
  //     $_p.translate(this.position.x, this.position.y, this.position.z);      
  //     $_p.push();
  //     //$_p.translate(this.size)
  //     const horiz = this.life % 2 === 0;      
  //     //console.log(horiz);
  //     $_p.stroke($_p.lerp(255,80,1 + $_p.sin(angle)),255,20);        
  //     $_p.fill($_p.lerp(255,0,1 + $_p.cos(angle)),0,$_p.lerp(255,0,1 + $_p.cos(angle)));
  //     $_p.strokeWeight(0.5);
  //     const negDirection = parseInt($_p.random(1000) % 3) === 0; 
  //     const sign = negDirection ? -1 : 1;
  //     $_p.rotateZ($_p.PI/4);
  //     //$_p.blendMode($_p.MULTIPLY);
  //     if (horiz){
  //       $_p.rotateY($_p.PI/2);
  //       this.position.y += sign * this.size;
  //       //$_p.translate(this.size,0,0);
  //     }else{
  //       this.position.x += sign * this.size;
  //       //$_p.translate(0,this.size,0);
  //     }
  //     $_p.box($_p.lerp(this.size,this.size/3,1 + $_p.sin(angle)));
  //     $_p.pop();
      
  //   }
  // }


  // const spawn = (index) => {
  //   currIndex++;
    
  //   if (currIndex > 4) currIndex = 0;
  //   //console.log(currIndex);
  //   let inst;
  //   //inst = new Checkered();            
  //   switch (currIndex){
  //     case 0:
  //       inst = new Checkered('red',60);
  //       break;
  //     case 1:
  //       inst = new Checkered('white',15);
  //       break;        
  //     case 2:
  //       inst = new Checkered('black',15);
  //       break;                
  //     case 3:          
  //       inst = new Checkered('white',15);
  //       break;            
        
  //     default:
  //       //console.log('test');
        
  //       inst = new Checkered('red',30);
  //       break;
  //     // case 2:
  //     //   inst = new Coils();            
  //     //   break;
  //   }  
  //   inst.index = index;
  //   currInst.push(inst); 
  // }

  //let bg;
  $_p.setup = () => {
    $_p.frameRate(FRAMERATE);
    canvas = $_p.createCanvas(600,600,$_p.WEBGL);
    $_p.background(255,255,255);
    canvas.parent("#content");
    //currInst = push(new Link());
    //currIndex++;
    // for (let i = 0; i < maxInstances; i++){
    //   spawn(i);
    // }
    //bg = $_p.createGraphics($_p.width, $_p.height, $_p.WEBGL);
  }
  const numDots = 10;
  const size = 500;
  $_p.draw = () => {    
    $_p.background(255,255,255);
    for (let i = 0; i < numDots; i++){
      for (let j = 0; j < numDots; j++){
        $_p.push();
        const x = i * size/numDots - size/2;
        const y = j * size/numDots - size/2;
        $_p.translate(x, y);
        $_p.noStroke();
        $_p.fill(0,0,0);
        $_p.rotate($_p.frameCount * 0.001);
        $_p.box($_p.sin($_p.frameCount*.002) * $_p.abs(x) * $_p.abs(y)/2000);
        $_p.pop();
      }
    }
    if (CAPTURE){
      $_p.frameCount === 1 && capturer.start();
      //console.log(canvas.canvas);
      capturer.capture(canvas.canvas);      
      
    }
  }
    
}
if (window.p5instance) window.p5instance.remove();
window.p5instance = new p5(window.s1);