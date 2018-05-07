var particlesPool = [];
var particlesInUse = [];

Particle = function() {
    var geom = new THREE.TetrahedronGeometry(3,0);
    var mat  = new THREE.MeshPhongMaterial({
        color: 0x009999,
        shininess:0,
        specular: 0xffffff,
        shading:THREE.FlatShading
    });
    this.mesh = new THREE.Mesh(geom,mat);
}

//function Particle(pos, col, scale) {
Particle.prototype.explode = function(pos, col, scale) {
    var _this = this; 
    var _p = this.mesh.parent;
    this.mesh.material.color = new THREE.Color(col);
    this.mesh.material.needsUpdate = true;
    this.mesh.scale.set(scale, scale, scale);
    var targetX = pos.x + (-1 + Math.random()*2)*50;
    var targetY = pos.y + (-1 + Math.random()*2)*50;
    var speed = 0.6 + Math.random()*0.2;
    TweenMax.to(this.mesh.rotation, speed, {x:Math.random()*12, y:Math.random()*12});
    TweenMax.to(this.mesh.scale, speed, {x:.1, y:.1, z:.1});
    TweenMax.to(this.mesh.position, speed, {x:targetX, y:targetY, delay:Math.random() *.1, ease:Power2.easeOut, onComplete:function(){
        if(_p) _p.remove(_this.mesh);
        _this.mesh.scale.set(1,1,1);
        particlesPool.unshift(_this);
    }});
}

ParticlesHolder = function() {
    this.mesh = new THREE.Object3D();
    this.particlesInUse = [];
}

ParticlesHolder.prototype.spawnParticles = function(pos, density, color, scale){

    var nPArticles = density;
    for (var i=0; i<nPArticles; i++){
      var particle;
      if (particlesPool.length) {
        particle = particlesPool.pop();
      }else{
        particle = new Particle();
      }
      this.mesh.add(particle.mesh);
      particle.mesh.visible = true;
      var _this = this;
      particle.mesh.position.y = pos.y;
      particle.mesh.position.x = pos.x;
      particle.explode(pos,color, scale);
    }
  }

  function createParticles() {
      for (i = 0; i < 10; i++) {
          var particle = new Particle();
          particlesPool.push(particle);
      }

      particlesHolder = new ParticlesHolder();
      room.add(particlesHolder.mesh);
  }