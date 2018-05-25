var particlesPool = [];
var particlesInUse = [];

var boxesPool = [];
var lampPool = [];
var doorPool = [];
var listener;
var sound;
var audioLoader;

function initSound() {
    listener = new THREE.AudioListener();
    room.camera.add(listener);
    sound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();
}

var level;

function loop() {
    if (Math.floor(level.distance) % level.distanceForBoxSpawn == 0 && 
        Math.floor(level.distance) > level.boxLastSpawn) {
        level.boxLastSpawn = Math.floor(level.distance);
        boxesHolder.spawnBoxes();
    }

    if (Math.floor(level.distance) % 600 == 0 && Math.floor(level.distance) > level.doorLastSpawn) {
        level.doorLastSpawn = Math.floor(level.distance);
        doorHolder.spawnDoor();
    }

    level.distance++;
    level.velocity = level.velocity * level.acceleration;
    room.setVelocity(level.velocity);

    // For each 1000 cms change level
    if (level.distance > 1000 && level.current > 0) {
        setLevel(level.current + 1);
    }

    document.getElementById("distance").innerHTML = level.distance + " cms";
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

Particle.prototype.explode = function (pos, col, scale) {

    var _this = this;
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(col);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    var targetX = pos.x + (-1 + Math.random() * 2) * 50;
    var targetY = pos.y + (-1 + Math.random() * 2) * 50;
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

ParticlesHolder.prototype.spawnParticles = function (pos, density, color, scale) {

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
        particle.explode(pos, color, scale);
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
//                        BOXES                                                   //
////////////////////////////////////////////////////////////////////////////////////

var BoxColor = [
    0xf25346,
    0xd8d0d1,
    0x59332e,
    0xF5986E,
    0x23190f,
    0x68c3c0,
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
            particlesHolder.spawnParticles(car_position, 15, box.color, 3);
            boxesPool.unshift(this.boxesInUse.splice(i, 1)[0]);
            this.mesh.remove(box.mesh);
            collition();
            i--;
        } else if (box.mesh.position.z < -450) {
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

Lamp = function () {
    var lamp = new THREE.Object3D();
    this.lamp = new THREE.Object3D();
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('models/');

    mtlLoader.load('lamp.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('lamp.obj', 
        function(object) {
            object.position.y = 30;
            object.scale.y = 2;
            object.castShadow = true;
            lamp.add(object);
        });
    });

    this.lamp.add(lamp);
}

LampHolder = function () {
    this.lamp = new THREE.Object3D();
    this.lampsInUse = [];
}

LampHolder.prototype.spawnLamp = function () {
        var lamp;
        if (doorHolder.length)
            lamp = LampPool.pop();
        else {
            lamp = new Lamp();
        }
            
        //lamp.lamp.position.z = 500 + Math.floor(Math.random() * 50) - 25;
        lamp.lamp.position.z = 0;
        this.lamp.add(lamp.lamp);
        this.lampsInUse.push(lamp);
}

LampHolder.prototype.update = function () {
    for (var i = 0; i < this.lampsInUse.length; i++) {
        var lamp = this.lampsInUse[i];
        //lamp.lamp.position.z -= level.velocity;

        if (lamp.lamp.position.z < -350) {
            lampPool.unshift(this.lampsInUse.splice(i, 1)[0]);
            this.lamp.remove(lamp.lamp);
            i--;
        }
    }
}

function createLamps() {
    for (var i = 0; i < 2; i++) {
        var lamp = new Lamp();
        lampPool.push(lamp);
    }

    lampHolder = new LampHolder();
    room.add(lampHolder.lamp);
}


function collition() {
    if (level.life - 15 > 0) { 
        level.life = level.life - 15;
    } else {
        die();
    }
}

function die() {
    setLevel(-1);
    died = true;
}

