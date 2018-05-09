
class Room extends THREE.Scene {
    constructor (renderer) {
        super();
        this.ambientLight = null;
        this.velocity = 1.5;
        this.voltear = false;
        this.spotLight = null;
        this.trackballControls = null;
        this.camera = null;
        this.saloon = new Saloon({});
        this.add(this.saloon);
        this.car = new Car({});
        this.add(this.car);
        this.createLights();
        this.createCamera(renderer);
        //this.prueba = this.createPrueba();
        //this.add(this.prueba);
        this.axis = new THREE.AxisHelper (35);
        this.axis.visible = false;
        this.add (this.axis);

        // Audio in scene
        var listener = new THREE.AudioListener();
        this.camera.add(listener);
        
        var sound = new THREE.Audio(listener);
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load('models/background.ogg', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.7);
            sound.play();
});
        this.fog = new THREE.Fog(new THREE.Color( 0xF5DA81 ), 300, 1000);
        //this.add(this.fog);
      }

    setVelocity(vel) {
        this.velocity = vel;
        this.saloon.velocity = vel;
    }

    createCamera (renderer) {
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        //this.camera.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        this.camera.rotation.y = 90 * Math.PI /100;
        this.camera.position.set (0, 200, 100);
        
        //var look = new THREE.Vector3 (0,0,0);
        //this.camera.lookAt(look);
        this.add(this.camera);

        this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
        this.trackballControls.rotateSpeed = 5;
        this.trackballControls.zoomSpeed = -2;
        this.trackballControls.panSpeed = 0.5;
        //this.trackballControls.target = look;

    }

    createPrueba() {
        var prueba = new THREE.Mesh(
            new THREE.BoxGeometry(10, 10, 10),
            new THREE.MeshPhongMaterial({color:Colors.pink, flatShading:true})
        )
        prueba.name = "cajita";

        prueba.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0, 5, 0));
        prueba.position.x = 20;

        return prueba;
    }

    createLights() {
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.8);
        this.add (this.ambientLight);

        //var skygroundlight = new THREE.HemisphereLight (0xaaaaff, 0xaaffaa);
        //this.add(skygroundlight);

        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight( 0xffffff );
        this.spotLight.position.set( 200, 200, 200 );
        this.spotLight.castShadow = true;
        // the shadow resolution
        this.spotLight.shadow.mapSize.width=2048
        this.spotLight.shadow.mapSize.height=2048;
        this.spotLight.intensity = 0.5;
        this.add (this.spotLight);
    }

    update() {
        if (this.voltear) {
            this.camera.position.z = this.camera.position.z - 0.2;
        } else {
            this.camera.position.z = this.camera.position.z + 0.2;
        }

        if (this.camera.position.z > 180) {
            this.voltear = true;
        }
        if (this.camera.position.z < 3) {
            this.voltear = false;
        }

        this.saloon.updateGround();
        if (this.spotLight.position.z > -600) {
            this.spotLight.position.z = this.spotLight.position.z - this.velocity;
        } else {
            this.spotLight.position.z = 600;
        }

        /*
        if (this.prueba.position.z > -100) {
            this.prueba.position.z = this.prueba.position.z - this.velocity;
        } else {
            this.prueba.position.z = 200;
        }
        var globalBoxPosition = this.saloon.getPosBox();
        var vectorBetweenObjects = new THREE.Vector2();
        /*
        vectorBetweenObjects.subVectors(new THREE.Vector2 (this.saloon.getPosBox().x, this.saloon.getPosBox().z),
                                        new THREE.Vector2 (this.car.getPos().x, this.car.getPos().z));
        */
        /*
        var disX = Math.abs(this.prueba.position.x - this.car.getPos().x);
        var disZ = Math.abs(this.prueba.position.z - this.car.getPos().z);
        */
       /*
        //var diffPos = globalCarPosition.sub(globalBoxPosition);
        var d = vectorBetweenObjects.length;
        //console.log(disX);
        if (disX < 10 && disZ < 20) {
            particlesHolder.spawnParticles(this.prueba.position, 15, Colors.red, 3);
            this.remove(this.prueba);
            var object = this.getObjectByName(this.prueba.name);
            this.remove(object);
            this.prueba.visible = false;
        }
        */
    }



    updateCar(targetX, targetY) {
        // X - IZQ / DER
        // Y - ARRIBA / ABAJO

        this.car.position.x += (targetX - this.car.position.x)*0.1;
        
        this.car.rotation.y = (targetX - this.car.position.x)*0.0128;

        //this.car.rotation.y = (this.car.position.z - targetX)*0.0064;
        //this.car.position.x = targetX;
        this.car.position.z = 40 - (targetY - this.car.position.z)*0.4;
    }

    turnOffLights() {
        this.spotLight.intensity = this.ambientLight.intensity = 0;
    }

    turnOnLights() {
        this.spotLight.intensity = this.ambientLight.intensity = 1;
    }




    

    /// It returns the camera
    /**
     * @return The camera
     */
    getCamera () {
        return this.camera;
    }
    
    /// It returns the camera controls
    /**
     * @return The camera controls
     */
    getCameraControls () {
        return this.trackballControls;
    }

    /// It updates the aspect ratio of the camera
    /**
     * @param anAspectRatio - The new aspect ratio for the camera
     */
    setCameraAspect (anAspectRatio) {
        this.camera.aspect = anAspectRatio;
        this.camera.updateProjectionMatrix();
    }

}