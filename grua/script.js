
/// Several functions, including the main

/// The room graph
room = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

// Mouse Position
mousePos = {x:0, y:0};

// A boolean to know if the game is on pause
pause = false;

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
  GUIcontrols = new function() {
    this.axis = true;
    this.lightIntensity = 0.5;
    this.rotation = 6;
    this.distance = 10;
    this.height   = 10;
    this.addBox   = function () {
      setMessage ("Añadir cajas clicando en el suelo");
      applicationMode = Theroom.ADDING_BOXES;
    };
    this.moveBox  = function () {
      setMessage ("Mover y rotar cajas clicando en ellas");
      applicationMode = Theroom.MOVING_BOXES;
    };
    this.takeBox  = false;
  }
  
  var gui = new dat.GUI();
  var axisLights = gui.addFolder ('Axis and Lights');
    axisLights.add(GUIcontrols, 'axis').name('Axis on/off :');
    axisLights.add(GUIcontrols, 'lightIntensity', 0, 1.0).name('Light intensity :');
  
  if (withStats)
    stats = initStats();
}

/// It adds statistics information to a previously created Div
/**
 * @return The statistics object
 */
function initStats() {
  
  var stats = new Stats();
  
  stats.setMode(0); // 0: fps, 1: ms
  
  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  
  $("#Stats-output").append( stats.domElement );
  
  return stats;
}

/// It processes the clic-down of the mouse
/**
 * @param event - Mouse information
 */
function onMouseDown (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    room.getCameraControls().enabled = true;
  } else {  
    room.getCameraControls().enabled = false;
  }
}

function onMouseMove(event) {
  var tx = -1 + (event.clientX / window.innerWidth)*2;
  var ty = 1 - (event.clientY / window.innerHeight)*2;
  mousePos = {x:tx, y:ty};
}

function onKeyDown(event) {
  event = event || window.event;
  var keycode = event.keyCode;

  switch(keycode) {
    case 32: // SPACE BAR
      if (!pause) {
        showPause();
        pause = true;
        console.log("Pausando");
      } else if (pause) {
        hidePause();
        pause = false;
        console.log("Despausando");
      }
      break;
  }
}

/// It processes the wheel rolling of the mouse
/**
 * @param event - Mouse information
 */
function onMouseWheel (event) {
  if (event.ctrlKey) {
    // The Trackballcontrol only works if Ctrl key is pressed
    room.getCameraControls().enabled = true;
  } else {  
    room.getCameraControls().enabled = false;
    if (mouseDown) {
      switch (applicationMode) {
        case Theroom.MOVING_BOXES :
          room.moveBox (event, Theroom.ROTATE_BOX);
          break;
      }
    }
  }
}

/// It processes the window size changes
function onWindowResize () {
  room.setCameraAspect (window.innerWidth / window.innerHeight);
  renderer.setSize (window.innerWidth, window.innerHeight);
}

/// It creates and configures the WebGL renderer
/**
 * @return The renderer
 */
function createRenderer () {
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  return renderer;  
}

function updateCar() {
  var targetX = normalize(mousePos.x, -1, 1, -100, 100);
  var targetY = normalize(mousePos.y, -1, 1, 25, 175);

  room.updateCar(targetX, targetY);
}

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max (Math.min(v, vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
} 

function updateLife() {
  document.getElementById("level_progress").style.width = level.life + "%";
  document.getElementById("level_progress").style.backgroundColor = "red";
  document.getElementById("level_progress").style.backgroundColor = "rgb(240, 158, 51)";
}

function showPause() {
  document.getElementById("game").style.filter = "blur(5px)";
  document.getElementById("pause").style.display = "block";
  
}

function hidePause() {
  document.getElementById("game").style.filter = "none";
  document.getElementById("pause").style.display = "none";
  console.log("HIDE PAUSE()");
}

/// It renders every frame
function render() {
  if (!pause) {
    room.update();
    loop();
    updateLife();
    updateCar();
    stats.update();
    room.getCameraControls().update ();
    //room.animate(GUIcontrols);
    boxesHolder.update(room.car.getPos());
    
  }
  requestAnimationFrame(render);
  renderer.render(room, room.getCamera());
}

/// The main function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // liseners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener ("keydown", onKeyDown, false);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
  
  // create a room, that will hold all our elements such as objects, cameras and lights.
  room = new Room (renderer.domElement);
  createParticles();
  createBoxes();
  setLevel(1);
 
  createGUI(true);

  render();
});
