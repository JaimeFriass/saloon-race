
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

click_sound = null;
text_sound = null;
music = true;

crash = false;

/// It creates the GUI and, optionally, adds statistic information
/**
 * @param withStats - A boolean to show the statictics or not
 */
function createGUI (withStats) {
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
      } else if (pause) {
        hidePause();
        pause = false;
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
  if (level.current != -1) {
    var targetX = normalize(mousePos.x, -1, 1, -100, 100);
    var targetY = normalize(mousePos.y, -1, 1, 25, 175);

    room.updateCar(targetX, targetY);
  } else {
    //console.log("POS X: " + room.car.getPos().x + " POS Z: " + room.car.getPos().z);
    room.car.position.y = room.car.position.y + 0.5;
    room.car.position.z = room.car.position.z - 1;
  }
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
  //document.getElementById("pause").style.display = "block";
  $("#pause").fadeIn(500);
  
}

function hidePause() {
  document.getElementById("game").style.filter = "none";
  //document.getElementById("pause").style.display = "none";
  $("#pause").fadeOut(500);
  pause = false;
  click_sound.play();
}

function settings() {
  //document.getElementById("pause").style.display = "none";
  $("#pause").fadeOut(500);
  //document.getElementById("settings").style.display = "block";
  $("#settings").fadeIn(500);
  document.getElementById("st-lights").innerHTML = "Lights: " + level.lights;
  document.getElementById("st-velocity").innerHTML = "Velocity: " + Math.floor(level.velocity);
  click_sound.play();
}

function hideSettings() {
  //document.getElementById("settings").style.display = "none";
  $("#settings").fadeOut(500);
  //document.getElementById("pause").style.display = "block";
  $("#pause").fadeIn(500);
  click_sound.play();

}

function showStart() {
  document.getElementById("start").style.display = "block";
}

function hideStart() {
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.filter = "none";
  window.addEventListener ("keydown", onKeyDown, false);
  setLevel(1);
  click_sound.play();
}

function increaseVelocity() {
  level.velocity = (level.velocity + 1)%8;
  document.getElementById("st-velocity").innerHTML = "Velocity: " + Math.floor(level.velocity);
}

function showText(title, subtitle) { 
  $("#text").html(title + "<p>" + subtitle + "</p>");
  $("#text").fadeIn(2000).fadeOut(2500);
  text_sound.play();
}

function showRestart() {
  $("#restart").fadeIn(700);
}

function restart() {
  $("#restart").fadeOut(700);
  setLevel(1);
}

function showChooseLevel() {
  $("#pause").fadeOut(500);
  $("#choose_level").fadeIn(500);
  $("#current_level").html("Current level: " + level.current);
}

function hideChooseLevel() {
  $("#choose_level").fadeOut(500);
  $("#pause").fadeIn(500);
  click_sound.play();
}

function settingLevel(number) {
  $("#choose_level").fadeOut(500);
  document.getElementById("game").style.filter = "none";
  setLevel(number);
  click_sound.play();
  pause = false;
}

function setLights(light) {
  if (light) {
    room.turnOnLights();
    room.car.turnOffLamps();
    $("#text").css("color", "rgb(150, 89, 10)");
    $("#level_id").css("color", "rgb(150, 89, 10)");
  } else {
    room.turnOffLights();
    room.car.turnOnLamps();
    $("#text").css("color", "white");
    $("#level_id").css("color", "white");
  }
}

function toggleLights() {
  if (level.lights) {
    setLights(false);
    $("#st-lights").text("Lights: Off");
  } else {
    setLights(true);
    $("#st-lights").text("Lights: On");
  }
}

function toggleMusic() {
  
  if (music) {
    room.stopMusic();
    $("#st-music").text("Music: Off");
    music = false;
  } else {
    room.playMusic();
    $("#st-music").text("Music: On");
    music = true;
  }
}

/// It renders every frame
function render() {
  if (!pause) {
    room.update();
    room.updateCamera(level.camera);
    loop();
    updateLife();
    updateCar();
    //stats.update();
    room.getCameraControls().update ();
    //room.animate(GUIcontrols);
    boxesHolder.update(room.car.getPos());
    doorHolder.update();
    lampHolder.update();
  }
  requestAnimationFrame(render);
  renderer.render(room, room.getCamera());
}

/// The main function
$(function () {
  // create a render and set the size
  renderer = createRenderer();
  renderer.sortObjects = false;
  // add the output of the renderer to the html element
  $("#WebGL-output").append(renderer.domElement);
  // liseners
  window.addEventListener ("resize", onWindowResize);
  window.addEventListener('mousemove', onMouseMove, false);
  window.addEventListener ("mousedown", onMouseDown, true);
  window.addEventListener ("mousewheel", onMouseWheel, true);   // For Chrome an others
  window.addEventListener ("DOMMouseScroll", onMouseWheel, true); // For Firefox
  
  // create a room, that will hold all our elements such as objects, cameras and lights.
  room = new Room (renderer.domElement);
  music = true;
  click_sound = document.getElementById("audio_click");
  text_sound = document.getElementById("audio_text");
  setLevel(0);
  createParticles();
  createBoxes();
  createDoors();
  createLamps();
  initSound();

  
  $("#start").fadeIn(3500);
  createGUI(false);

  render();
});
