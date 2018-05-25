/////////////////////////////////////////////////
//               LEVEL SETTINGS                //
/////////////////////////////////////////////////

function setLevel(num) {
    if (level != undefined)
        var previous_camera = level.camera;
    switch (num) {
        case -1:
            level = {
                current: -1,
                velocity: 0.5,
                acceleration: 0.999,
                nBoxes: 0,
                distance: 0,
                life: 1,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 1000,
                lights: true,
                camera: 1,
            }
            showText("You died", "little piece of shit");
            document.getElementById("level_id").innerHTML = "Dead";
            showRestart();
            break;
        case 0:
            
            level = {
                current: 0,
                velocity: 1,
                acceleration: 1,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 1000,
                lights: true,
                camera: 2,
            }
            document.getElementById("level_id").innerHTML = "";
            break;
        case 1:
            room.car.position.y = 0;
            level = {
                current: 1,
                velocity: 3,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 100,
                lights: true,
                camera: 1,
            };
            document.getElementById("level_id").innerHTML = "Level 1";
            showText("Level 1", "Easy for beginners");
            break;
        case 2:
            level = {
                current: 2,
                velocity: 3,
                acceleration: 1.0001,
                nBoxes: 5,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 60,
                lights: true,
                camera: 1,
            };
            //document.getElementById("level_id").innerHTML = "Level 2";
            $("#level_id").text("Level 2");
            showText("Level 2", "A bit faster");
            break;
        case 3:
            level = {
                current: 3,
                velocity: 1.5,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 10,
                lights: true,
                camera: 2,
            }
            document.getElementById("level_id").innerHTML = "Level 3";
            showText("Level 3", "Slowly, but more boxes");
            document.getElementById("level_id").style.color = "white";
            break;
        case 4:
            level = {
                current: 4,
                velocity: 2,
                acceleration: 1.0001,
                nBoxes: 2,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 25,
                lights: false,
                camera: 3,
            }
            document.getElementById("level_id").innerHTML = "Level 4";
            showText("Level 4", "Where are the lights??");
            break; 

        case 5:
            level = {
                current: 5,
                velocity: 4,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 40,
                lights: true,
                camera: 1,
            }
            document.getElementById("level_id").innerHTML = "Level 5";
            showText("Level 5", "Harder");
            break;

        case 6:
            level = {
                current: 6,
                velocity: 6,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 70,
                lights: true,
                camera: 1,
            }
            document.getElementById("level_id").innerHTML = "Level 6";
            showText("Level 6", "Fuck u");
            break; 
        case 7:
            level = {
                current: 7,
                velocity: 6,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 70,
                lights: true,
                camera: 1,
            }
            document.getElementById("level_id").innerHTML = "Level 7";
            showText("Level 7", "Fuck u");
            break;
        case 8:
            level = {
                current: 8,
                velocity: 6,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                doorLastSpawn: 0,
                distanceForBoxSpawn: 70,
                lights: true,
                camera: 1,
            }
            document.getElementById("level_id").innerHTML = "Level 6";
            showText("Level 8", "Fuck u");
            document.getElementById("level_id").style.color = "red";
            break;
    }
    room.setVelocity(level.velocity);
    setLights(level.lights);
    if (previous_camera != level.camera)
        room.setCamera(level.camera);

}
