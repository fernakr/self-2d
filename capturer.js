const CAPTURE = true;
  
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




if (CAPTURE){
    $_p.frameCount === 1 && capturer.start();
    //console.log(canvas.canvas);
    capturer.capture(canvas.canvas);      
    
  }