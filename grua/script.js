
/// Several functions, including the main

/// The room graph
room = null;

/// The GUI information
GUIcontrols = null;

/// The object for the statistics
stats = null;

/// A boolean to know if the left button of the mouse is down
mouseDown = false;

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

/// It renders every frame
function render() {
  requestAnimationFrame(render);
  
  stats.update();
  room.getCameraControls().update ();
  //room.animate(GUIcontrols);
  
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
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
  
  // create a room, that will hold all our elements such as objects, cameras and lights.
  room = new Room (renderer.domElement);
 
  createGUI(true);

  render();
});
