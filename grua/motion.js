var particlesPool = [];
var particlesInUse = [];

var boxesPool = [];
var clockPool = [];
var doorPool = [];
var heartsPool = [];
var listener;
var sound;
var audioLoader;
var lastVelocity;

// Player variables
var player = {
    points: 0,
    clocks: 0,
    hearts: 0,
    choose_level: false,
    max_level: 1,
    life: 100,
}

// Store values
var Store = {
    clock: 200,
    heart: 50,
    choose_level: 1,
}

function initSound() {
    listener = new THREE.AudioListener();
    room.camera.add(listener);
    sound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();
}
var level;

function loop() {

    // Object spawning settings
    if (Math.floor(level.distance) % level.distanceForBoxSpawn == 0 && 
        Math.floor(level.distance) > level.boxLastSpawn) {
        level.boxLastSpawn = Math.floor(level.distance);
        boxesHolder.spawnBoxes();
    }

    if (Math.floor(level.distance) % 600 == 0 && Math.floor(level.distance) > level.doorLastSpawn) {
        level.doorLastSpawn = Math.floor(level.distance);
        doorHolder.spawnDoor();
    }

    if (Math.floor(level.distance) % level.distanceForHeartSpawn == 0 && 
        Math.floor(level.distance) > level.heartLastSpawn) {
        level.heartLastSpawn = Math.floor(level.distance);
        heartHolder.spawnHearts();
    }

    if (Math.floor(level.distance) % level.distanceForClockSpawn == 0 && 
        Math.floor(level.distance) > level.clockLastSpawn) {
        level.clockLastSpawn = Math.floor(level.distance);
        clockHolder.spawnClock();
    }

    // When clock effect has ended
    if (level.slowed == 0) {
        level.velocity = lastVelocity;
        level.slowed = -1;
        $('#game').css("filter", "none");
    }
    if (level.slowed == -1)
        level.velocity = level.velocity * level.acceleration;
    else {
        level.velocity = lastVelocity/2;
        level.slowed--;
    }

    room.setVelocity(level.velocity);

    // For each 1000 cms change level
    if (level.distance > 1000 && level.current > 0) {
        setLevel(level.current + 1);
    }

    player.points = player.points + 0.1;
    level.distance++;
}

////////////////////////////////////////////////////////////////////////////////////
//                        PARTICLE                                                //
////////////////////////////////////////////////////////////////////////////////////

Particle = function () {
    var geom = new THREE.TetrahedronGeometry(5, 0);
    var mat = new THREE.MeshPhongMaterial({
        color: 0x009999,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true
    });
    this.mesh = new THREE.Mesh(geom, mat);
}

// How a particle explode:
//  * pos - position
//  * col - particle color
//  * scale
//  * far - max particle distance
Particle.prototype.explode = function (pos, col, scale, far) {

    var _this = this;
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(col);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    var targetX = pos.x + (-1 + Math.random() * 2) * far;
    var targetY = pos.y + (-1 + Math.random() * 2) * far;
    var speed = 0.6 + Math.random() * 0.2;
    TweenMax.to(this.mesh.rotation, speed, { x: Math.random() * 12, y: Math.random() * 12 });
    TweenMax.to(this.mesh.scale, speed, { x: .1, y: .1, z: .1 });
    TweenMax.to(this.mesh.position, speed, {
        x: targetX, y: targetY, delay: Math.random() * .1, ease: Power2.easeOut, onComplete: function () {
            if (_p) _p.remove(_this.mesh);
            _this.mesh.scale.set(1, 1, 1);
            particlesPool.unshift(_this);
        }
    });
}

ParticlesHolder = function () {
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function (pos, density, color, scale, far) {

    var nParticles = density;
    
    for (var i = 0; i < nParticles; i++) {
        var particle;
        if (particlesPool.length) {
            particle = particlesPool.pop();
        } else {
            particle = new Particle();
        }
        this.mesh.add(particle.mesh);
        particle.mesh.visible = true;
        var _this = this;
        particle.mesh.position.y = pos.y;
        particle.mesh.position.x = pos.x - 8;
        particle.mesh.position.z = pos.z;
        particle.explode(pos, color, scale, far);
    }
    var rand = Math.floor(Math.random()*10);
    
    if (rand > 3) {
        var glass = "models/glass1.wav";
    } else  if (rand > 7) {
        var glass = "models/glass2.wav";
    } else {
        var glass = "models/glass3.wav";
    }
    audioLoader.load(glass, function (buffer ) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.isPlaying = false;
        sound.setVolume(0.2);
        sound.play(); 
     });
     
}

function createParticles() {
    for (i = 0; i < 5; i++) {
        var particle = new Particle();
        particlesPool.push(particle);
    }

    particlesHolder = new ParticlesHolder();
    room.add(particlesHolder.mesh);
}

////////////////////////////////////////////////////////////////////////////////////
//                        BOXES / Obstacles                                       //
////////////////////////////////////////////////////////////////////////////////////

var BoxColor = [
    0xf25346, 0xd8d0d1, 0x59332e, 0xF5986E, 0x23190f, 0x68c3c0,
]

Box = function () {
    var random = Math.random()*15;
    var box_color = BoxColor[Math.floor(Math.random()*(BoxColor.length - 1))];

    if (random > 4 && random <= 10) {
        var height = Math.floor( Math.random() * 35);
        var geom = new THREE.BoxGeometry(13, 10 + height, 8);
    } else if (random > 0 && random <= 4) {
        var height = 0;
        var geom = new THREE.TetrahedronGeometry(8, 2);
    } else {
        var height = Math.floor( Math.random() * 35);
        var geom = new THREE.ConeGeometry( 20, 20 + height, 4 );
    }

    var mat = new THREE.MeshPhongMaterial({
        color: box_color,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true
    });

    this.color = box_color;
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.rotation.y = Math.random()*6 - 3;
    this.mesh.position.y = height/2;
    this.mesh.castShadow = true;
}


BoxesHolder = function () {
    this.mesh = new THREE.Object3D();
    this.boxesInUse = [];
}

BoxesHolder.prototype.spawnBoxes = function () {
    var width_spawn = 245;

    for (var i = 0; i < level.nBoxes; i++) {
        var box;
        if (boxesHolder.length)
            box = BoxesPool.pop();
        else {
            box = new Box();
        }

        box.mesh.position.x = Math.floor(Math.random() * width_spawn ) - width_spawn/2;
        box.mesh.position.z = 500 + Math.floor(Math.random() * 50) - 25;

        this.mesh.add(box.mesh);
        this.boxesInUse.push(box);

    }
}


BoxesHolder.prototype.update = function (car_position) {
    for (var i = 0; i < this.boxesInUse.length; i++) {
        var box = this.boxesInUse[i];
        box.mesh.position.z -= level.velocity;

        //var diffPos = car_position.sub(box.mesh.position.clone());
        var difX = Math.abs(car_position.x - box.mesh.position.x);
        var difZ = Math.abs(car_position.z - box.mesh.position.z);
        //console.log(d);
        if (difX < 13 && difZ < 15) {
            //console.log("COLISIONA!!");
            particlesHolder.spawnParticles(car_position, 15, box.color, 3, 50);
            boxesPool.unshift(this.boxesInUse.splice(i, 1)[0]);
            this.mesh.remove(box.mesh);
            collition();
            i--;
        } else if (box.mesh.position.z < -500) {
            boxesPool.unshift(this.boxesInUse.splice(i, 1)[0]);
            this.mesh.remove(box.mesh);
            i--;
        }
    }
}

function createBoxes() {
    for (var i = 0; i < 10; i++) {
        var box = new Box();
        boxesPool.push(box);
    }

    boxesHolder = new BoxesHolder();
    room.add(boxesHolder.mesh);
}

////////////////////////////////////////////////////////////////////////////////////
//                                HEARTS                                          //
////////////////////////////////////////////////////////////////////////////////////

Heart = function () {
    var x = 0; var y = 0;
    var heartShape = new THREE.Shape();
    
    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    
    var mat = new THREE.MeshBasicMaterial( {color: Colors.red
                                         } );

                                        
    var extrudeSettings = { amount: 1, 
        bevelEnabled: true, bevelSegments: 20, 
        steps: 10, bevelSize: 3, bevelThickness: 3 };

    var geom = new THREE.ExtrudeBufferGeometry( heartShape, extrudeSettings );
  
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.scale.set(0.6, 0.6, 0.6);
    this.mesh.rotation.x = (Math.PI/180)*10;
    this.mesh.rotation.z = (Math.PI/180)*180;
    this.mesh.position.y = 15;
    this.mesh.castShadow = true;
} 

HeartHolder = function () {
    this.mesh = new THREE.Object3D();
    this.heartsInUse = [];
}

HeartHolder.prototype.spawnHearts = function () {
    var width_spawn = 245;
    var heart;
    if (heartHolder.length)
        heart =  HeartsPool.pop();
    else
        heart = new Heart();

    heart.mesh.position.x = Math.floor(Math.random() * width_spawn ) - width_spawn/2;
    heart.mesh.position.z = 500 + Math.floor(Math.random() * 50) - 25;

    this.mesh.add(heart.mesh);
    this.heartsInUse.push(heart);
}

HeartHolder.prototype.update = function (car_position){
    for (var i = 0; i < this.heartsInUse.length; i++) {
        var heart = this.heartsInUse[i];
        heart.mesh.position.z -= level.velocity;
        heart.mesh.rotation.y += 0.07;

        var difX = Math.abs(car_position.x - heart.mesh.position.x);
        var difZ = Math.abs(car_position.z - heart.mesh.position.z);

        if (difX < 13 && difZ < 15) {
            particlesHolder.spawnParticles(car_position, 15, Colors.red, 3, 50);
            heartsPool.unshift(this.heartsInUse.splice(i,1)[0]);
            this.mesh.remove(heart.mesh);
            addLife();
            i--;
        } else if (heart.mesh.position.z < -500) {
            heartsPool.unshift(this.heartsInUse.splice(i, 1)[0]);
            this.mesh.remove(heart.mesh);
            i--;
        }
    }
}

function createHearts() {
    for (var i = 0; i < 10; i++) {
        var heart = new Heart();
        heartsPool.push(heart);
    }

    heartHolder = new HeartHolder();
    room.add(heartHolder.mesh);
}

////////////////////////////////////////////////////////////////////////////////////
//                                DOORS                                           //
////////////////////////////////////////////////////////////////////////////////////

Door = function () {

    this.door = new THREE.Mesh (
        new THREE.BoxGeometry(5, 260, 100),
        new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true})
    )

    this.door.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0, 260/2, 0));

    var p1 = new THREE.Mesh (
        new THREE.BoxGeometry(3, 20, 100),
        new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true})
    )

    p1.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(5, 250, 0));

    var p2 = new THREE.Mesh (
        new THREE.BoxGeometry(3, 20, 100),
        new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true})
    )

    p2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(5, 150, 0));

    var p3 = new THREE.Mesh (
        new THREE.BoxGeometry(3, 20, 100),
        new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true})
    )

    p3.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(5, 5, 0));

    var p4 = new THREE.Mesh (
        new THREE.BoxGeometry(3, 260, 20),
        new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true})
    )

    p4.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(5, 260/2, 40));

    var p5 = new THREE.Mesh (
        new THREE.BoxGeometry(3, 260, 20),
        new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true})
    )

    p5.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(5, 260/2, -40));

    var manubrio = new THREE.Mesh (
        new THREE.SphereGeometry(6, 6, 5, 5),
        new THREE.MeshPhongMaterial({color:Colors.white, flatShading: true})
    )

    manubrio.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(5, 150, -40));

    this.door.add(p1);
    this.door.add(p2);
    this.door.add(p3);
    this.door.add(p4);
    this.door.add(p5);
    this.door.add(manubrio);
    this.door.castShadow = false;
}

DoorHolder = function () {
    this.door = new THREE.Object3D();
    this.doorsInUse = [];
}

DoorHolder.prototype.spawnDoor = function () {
        var door;
        var rote;
        if (doorHolder.length)
            door = DoorPool.pop();
        else {
            door = new Door();
        }

        var random = Math.floor( Math.random() * 10 );
    
        if (random > 5) {
            door.door.rotation.y = (Math.PI/180) * 180;
            door.door.position.x = 131.5;
        } else {
            door.door.position.x = -131.5;
        }
            
        door.door.position.z = 500 + Math.floor(Math.random() * 50) - 25;


        this.door.add(door.door);
        this.doorsInUse.push(door);
}

DoorHolder.prototype.update = function () {
    for (var i = 0; i < this.doorsInUse.length; i++) {
        var door = this.doorsInUse[i];
        door.door.position.z -= level.velocity;

        if (door.door.position.z < -350) {
            doorPool.unshift(this.doorsInUse.splice(i, 1)[0]);
            this.door.remove(door.door);
            i--;
        }
    }
}

function createDoors() {
    for (var i = 0; i < 2; i++) {
        var door = new Door();
        doorPool.push(door);
    }

    doorHolder = new DoorHolder();
    room.add(doorHolder.door);
}


////////////////////////////////////////////////////////////////////////////////////
//                                DOORS                                           //
////////////////////////////////////////////////////////////////////////////////////

Clock = function () {
    var clock = new THREE.Object3D();
    this.clock = new THREE.Object3D();
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/');

    mtlLoader.load('clock.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('clock.obj', 
        function(object) {
            object.position.y = 10;
            object.scale.set(0.23, 0.23, 0.23);
            object.castShadow = true;
            clock.add(object);
        });
    });

    this.clock.add(clock);
}

ClockHolder = function () {
    this.clock = new THREE.Object3D();
    this.clocksInUse = [];
}

ClockHolder.prototype.spawnClock = function () {
        var clock;
        var width_spawn = 230;
        if (doorHolder.length)
            clock = ClockPool.pop();
        else {
            clock = new Clock();
        }
        
        clock.clock.position.x = Math.floor(Math.random() * width_spawn ) - width_spawn/2;
        clock.clock.position.z = 500 + Math.floor(Math.random() * 50) - 25;
        this.clock.add(clock.clock);
        this.clocksInUse.push(clock);
}

ClockHolder.prototype.update = function (car_position) {
    for (var i = 0; i < this.clocksInUse.length; i++) {
        var clock = this.clocksInUse[i];
        clock.clock.position.z -= level.velocity;
        clock.clock.rotation.y += 0.05;

        var difX = Math.abs(car_position.x - clock.clock.position.x);
        var difZ = Math.abs(car_position.z - clock.clock.position.z);

        if (difX < 13 && difZ < 15) {
            particlesHolder.spawnParticles(car_position, 30, 0xffffff, 3, 150);
            heartsPool.unshift(this.clocksInUse.splice(i,1)[0]);
            this.clock.remove(clock.clock);
            ralentize();
            i--;
        } else if (clock.clock.position.z < -350) {
            clockPool.unshift(this.clocksInUse.splice(i, 1)[0]);
            this.clock.remove(clock.clock);
            i--;
        }
    }
}

function createClocks() {
    for (var i = 0; i < 2; i++) {
        var clock = new Clock();
        clockPool.push(clock);
    }

    clockHolder = new ClockHolder();
    room.add(clockHolder.clock);
}

// Other functions

function collition() {
    if (player.life - 15 > 0) { 
        $('#level_bar2').animate({opacity: '1'}, 100);
        $('#level_bar2').animate({opacity: '0.2'}, 160);
        $('#level_bar2').animate({opacity: '1'}, 100);
        player.life = player.life - Math.floor(Math.random()*10 + level.current*2);
    } else {
        die();
    }
}

function addLife() {
    $('#level_bar2').animate({opacity: '1'}, 100);
    $('#level_bar2').animate({opacity: '0.2'}, 160);
    $('#level_bar2').animate({opacity: '1'}, 100);
    player.life = player.life + 10;
    if (player.life > 100) player.life = 100;
}

function ralentize() {
    lastVelocity = level.velocity;
    level.slowed = 200;
    $('#game').css("filter", "grayscale(50%)");

}

function die() {
    setLevel(-1);
    died = true;
}

