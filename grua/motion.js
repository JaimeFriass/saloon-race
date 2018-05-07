var particlesPool = [];
var particlesInUse = [];
var boxesPool = [];

var level;

function loop() {
    if (Math.floor(level.distance) % level.distanceForBoxSpawn == 0 && 
        Math.floor(level.distance) > level.boxLastSpawn) {
        level.boxLastSpawn = Math.floor(level.distance);
        boxesHolder.spawnBoxes();
    }
    level.distance++;
    level.velocity = level.velocity * level.acceleration;
    room.setVelocity(level.velocity);

    if (level.distance > 1000) {
        setLevel(level.current + 1);
    } 
}

function setLevel(num) {
    switch (num) {
        case 1:
            level = {
                current: 1,
                velocity: 1.5,
                acceleration: 1.0001,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                distanceForBoxSpawn: 70,
            };
            room.setVelocity(1.5);
            document.getElementById("level_id").innerHTML = "Level 1";
            break;
        case 2:
            level = {
                current: 2,
                velocity: 3,
                acceleration: 1.0001,
                distance: 0,
                life: 100,
                boxLastSpawn: 0,
                distanceForBoxSpawn: 40,
            };
            room.setVelocity(3);
            document.getElementById("level_id").innerHTML = "Level 2";
            break;
            
    }
}

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

//function Particle(pos, col, scale) {
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
        particle.explode(pos, color, scale);
    }
}

function createParticles() {
    for (i = 0; i < 5; i++) {
        var particle = new Particle();
        particlesPool.push(particle);
    }

    particlesHolder = new ParticlesHolder();
    room.add(particlesHolder.mesh);
}

var BoxColor = [
    0xf25346,
    0xd8d0d1,
    0x59332e,
    0xF5986E,
    0x23190f,
    0x68c3c0,
]


Box = function () {
    var geom = new THREE.TetrahedronGeometry(8, 2);
    var box_color = BoxColor[Math.floor(Math.random()*(BoxColor.length - 1))];
    var mat = new THREE.MeshPhongMaterial({
        color: box_color,
        shininess: 0,
        specular: 0xffffff,
        flatShading: true
    });
    this.color = box_color;
    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.castShadow = true;
}

BoxesHolder = function () {
    this.mesh = new THREE.Object3D();
    this.boxesInUse = [];
}

BoxesHolder.prototype.spawnBoxes = function () {
    var nBoxes = 1;

    for (var i = 0; i < nBoxes; i++) {
        var box;
        if (boxesHolder.length)
            box = BoxesPool.pop();
        else {
            box = new Box();
            //console.log("Creando caja");
        }

        box.mesh.position.x = Math.floor(Math.random() * 258 ) - 129;
        box.mesh.position.z = 300 + Math.floor(Math.random() * 50) - 25;

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
        var difY = Math.abs(car_position.z - box.mesh.position.z);
        //console.log(d);
        if (difX < 15 && difY < 15) {
            //console.log("COLISIONA!!");
            particlesHolder.spawnParticles(box.mesh.position.clone(), 15, box.color, 3);
            boxesPool.unshift(this.boxesInUse.splice(i, 1)[0]);
            this.mesh.remove(box.mesh);
            collition();
            i--;
        } else if (box.mesh.position.z < -260) {
            boxesPool.unshift(this.boxesInUse.splice(i, 1)[0]);
            this.mesh.remove(box.mesh);
            i--;
        }
    }
}

function collition() {
    if (level.life - 15 > 0) { 
        level.life = level.life - 15;
    } else {
        die();
        setLevel(1);
    }
}

function die() {
    console.log("MUERTO");
}

function createBoxes() {
    for (var i = 0; i < 10; i++) {
        var box = new Box();
        boxesPool.push(box);
    }

    boxesHolder = new BoxesHolder();
    room.add(boxesHolder.mesh);
}