
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
died = false;

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
  console.log(keycode);
  switch(keycode) {
    case 32: // SPACE BAR
      if (!pause && !died) {
        showPause();
        pause = true;
      } else if (pause && $('#pause').css("display") != "none") {
        hidePause();
        pause = false;
      }
      break;
    case 67: // C
      use(1);
      break;
    case 72: // H
      use(2);
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

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max (Math.min(v, vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
} 

function updateLife() {
  document.getElementById("level_progress2").style.width = player.life + "%";
  if (player.life > 85) {
    $('#level_progress2').css('backgroundColor', 'rgb(159, 255, 81)');
  } else if (player.life > 30) {
    $('#level_progress2').css('backgroundColor', 'rgb(243, 255, 81)');
  } else {
    $('#level_progress2').css('backgroundColor', 'rgb(255, 174, 81)');
  }
}

// PAUSE MENU

function showPause() {
  document.getElementById("game").style.filter = "blur(5px)";
  $("#pause").fadeIn(500);
  
}

function hidePause() {
  document.getElementById("game").style.filter = "none";
  $("#pause").fadeOut(500);
  pause = false;
  click_sound.play();
}

// SETTINGS MENU

function settings() {
  $("#pause").fadeOut(500);
  $("#settings").fadeIn(500);
  document.getElementById("st-lights").innerHTML = "Lights: " + level.lights;
  document.getElementById("st-velocity").innerHTML = "Velocity: " + Math.floor(level.velocity);
  click_sound.play();
}

function hideSettings() {
  $("#settings").fadeOut(500);
  $("#pause").fadeIn(500);
  click_sound.play();
}

// START MENU

function showStart() {
  document.getElementById("start").style.display = "block";
}

function hideStart() {
  document.getElementById("start").style.display = "none";
  document.getElementById("game").style.filter = "none";
  window.addEventListener ("keydown", onKeyDown, false);
  setLevel(1);
  click_sound.play(); 
  $("#help").fadeIn(4000);
  $("#help").fadeOut(4000);
}

// RESTART MENU

function showRestart() {
  $("#restart").fadeIn(700);
}

function restart() {
  $("#restart").fadeOut(700);
  click_sound.play();
  setLevel(1);
  died = false;
}

// CHOOSE LEVEL MENU

function showChooseLevel() {
  $("#pause").fadeOut(500);
  $("#current_level").html("Current level: " + level.current);
  $("#choose_level").fadeIn(500);
}

function hideChooseLevel() {
  $("#choose_level").fadeOut(500);
  $("#pause").fadeIn(500);
  click_sound.play();
}

// Set a level
function settingLevel(number) {
  $("#choose_level").fadeOut(500); 
  document.getElementById("game").style.filter = "none";
  setLevel(number);
  click_sound.play();
  pause = false;
}

// In-game titles
function showText(title, subtitle) { 
  $("#text").html(title + "<p>" + subtitle + "</p>");
  $("#text").fadeIn(2000).fadeOut(2500);
  text_sound.play();
}

// STORE MENU
function showStore() {
  $("#pause").fadeOut(500);
  $("#store").fadeIn(500);
  refreshStore();
  click_sound.play();
}

function hideStore() {
  $("#store").fadeOut(500);
  $("#pause").fadeIn(500);
  click_sound.play();
}

function buy(item) {
  switch (item) {
    case 1: // CLOCK
      if (player.points >= Store.clock) {
        player.clocks++;
        player.points -= Store.clock;
      } else {

      }
      break;
    case 2: // HEART
      if (player.points >= Store.heart) {
        player.hearts++;
        player.points -= Store.heart;
      } else {

      }
      break;
    case 3: // CHOOSE LEVEL MENU
      if (player.points >= Store.choose_level) {
        player.choose_level = true;
        player.points -= Store.choose_level;
      }
  }
  refreshStore();
}

function use(item) {
  switch (item) {
    case 1: // CLOCK
      if (player.clocks > 0 && level.slowed == -1) {
        player.clocks--;
        ralentize();
      }
      break; 
    case 2: // HEART
      if (player.hearts > 0 && player.life != 100) {
        player.hearts--;
        addLife();
      }
      break;
  }
  refreshStore();

}

function refreshStore() {
  $("#points").html("Points: " + Math.floor(player.points));

  if (player.points >= Store.clock)
    $('#buy_clock').removeClass("disabled");
  else
    $('#buy_clock').addClass("disabled");

  if (player.points >= Store.heart)
    $('#buy_heart').removeClass("disabled");
  else
    $('#buy_heart').addClass("disabled");

  if (player.clocks > 0) {
    $('#clocks').css("display", "block");
    $('#nclocks').html(player.clocks);
  } else {
    $('#clocks').css("display", "none");
  }

  if (player.hearts > 0) {
    $('#hearts').css("display", "block");
    $('#nhearts').html(player.hearts);
  } else {
    $('#hearts').css("display", "none");
  }

  if (player.choose_level) {
    $('#choose_level_btn').removeClass('disabled');
    $('#buy_cmenu').addClass('disabled');
  } else {
    $('#choose_level_btn').addClass('disabled');
    $('#buy_cmenu').removeClass('disabled');
  }
}

// Set the lights on or off
function setLights(light) {
  if (light) {
    room.turnOnLights();
    room.car.turnOffLamps();
    $("#text").css("color", "rgb(235, 177, 101)");
    $("#level_id").css("color", "rgb(235, 177, 101)");
  } else {
    room.turnOffLights();
    room.car.turnOnLamps();
    $("#text").css("color", "white");
    $("#level_id").css("color", "white");
  }
}

// Toggle the lights between on or off
function toggleLights() {
  if (level.lights) {
    setLights(false);
    level.lights = false;
    $("#st-lights").text("Lights: Off");
  } else {
    setLights(true);
    level.lights = true;
    $("#st-lights").text("Lights: On");
  }
  click_sound.play();
}

// Get the cursor and convert it to a movement in scene
function updateCar() {
  room.car.d_spring.rotation.y += 0.07;
  if (level.current != -1) {
    var targetX = normalize(mousePos.x, -1, 1, -100, 100);
    var targetY = normalize(mousePos.y, -1, 1, 25, 175);

    if (level.camera != 3) {
      room.updateCar(targetX, targetY);
    } else {
      room.updateCar(-targetX, targetY);
    }
  } else {
    room.car.position.y = room.car.position.y + 0.5;
    room.car.position.z = room.car.position.z - 1;

  }
}

// Toggle the music between on or off
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
  click_sound.play();
}

// Increase velocity
function increaseVelocity() {
  level.velocity = (level.velocity + 1)%9 + 1;
  document.getElementById("st-velocity").innerHTML = "Velocity: " + Math.floor(level.velocity);
}

function createDistanceBar() {
  var height = $('body').height();
  $('#distance').css("height", height*0.8 + "px");
}

function updateDistance() {
  if (level.current != 8 && level.current != -1) {
    $('#distance').css("height", ($('body').height()*0.8)* (level.distance/1000) + "px");
  } else {
    $('#distance').css("height", "0px");
  }
}

/// It renders every frame
function render() {
  if (!pause) {
    room.update();
    room.updateCamera(level.camera);
    loop();
    updateLife();
    updateDistance();
    updateCar();
    //stats.update();
    room.getCameraControls().update ();

    // Objects
    boxesHolder.update(room.car.getPos());
    doorHolder.update();
    heartHolder.update(room.car.getPos());
    clockHolder.update(room.car.getPos());
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
  // listeners
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
  createDistanceBar();
  createParticles();
  createBoxes();
  createHearts();
  createClocks();
  createDoors();
  initSound();

  
  $("#start").fadeIn(3500);
  createGUI(false);

  render();
});
