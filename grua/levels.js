/////////////////////////////////////////////////
//               LEVEL SETTINGS                //
/////////////////////////////////////////////////

function setLevel(num) {
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
                distanceForBoxSpawn: 1000,
                lights: true,
            }
            showText("You died", "little piece of shit");
            document.getElementById("level_id").innerHTML = "Dead";
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
                distanceForBoxSpawn: 1000,
                lights: true,
            }
            document.getElementById("level_id").innerHTML = "";
            break;
        case 1:
            room.car.position.y = 0;
            level = {
                current: 1,
                velocity: 1.5,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                distanceForBoxSpawn: 70,
                lights: true,
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
                distanceForBoxSpawn: 60,
                ligths: true,
            };
            document.getElementById("level_id").innerHTML = "Level 2";
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
                distanceForBoxSpawn: 8,
                lights: false,
            }
            document.getElementById("level_id").innerHTML = "Level 3";
            showText("Level 3", "Slowly, but more boxes");
            //room.turnOffLights();
            document.getElementById("level_id").style.color = "white";
            break;
        case 4:
            level = {
                current: 3,
                velocity: 10,
                acceleration: 1.0001,
                nBoxes: 1,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                distanceForBoxSpawn: 100,
                lights: false,
            }
            document.getElementById("level_id").innerHTML = "Level 4";
            showText("Level 4", "Fuck u");
            //room.turnOnLights();
            document.getElementById("level_id").style.color = "red";
            break; 
    }
    room.setVelocity(level.velocity);

}
