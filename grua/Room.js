
class Room extends THREE.Scene {
    constructor (renderer) {
        super();
        this.ambientLight = null;
        this.velocity = 1.5;
        this.voltear = false;
        this.spotLight = null;
        this.trackballControls = null;
        this.camera = null;
        this.viewpoint = null;
        
        this.saloon = new Saloon({});
        this.car = new Car({});
        this.createLights();
        this.createCamera(renderer);

        this.sound = this.createMusic();

        this.add(this.saloon);
        this.add(this.car);

        // Audio in scene
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        
        this.fog = new THREE.Fog(new THREE.Color( 0xF5986E ), 500, 630);
        this.background = new THREE.Color( 0xF5986E );
    }

    createMusic() {
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
        return sound;
    }

    setVelocity(vel) {
        this.velocity = vel;
        this.saloon.velocity = vel;
    }

    // MUSIC CONTROL
    stopMusic() {
        this.sound.stop();
    }

    playMusic() {
        this.sound.play();
    }

    createCamera (renderer) {
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.rotation.y = 90 * Math.PI /100;
        this.camera.position.set (0, 200, 100);
        
        this.add(this.camera);

        this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
        this.trackballControls.rotateSpeed = 5;
        this.trackballControls.zoomSpeed = -2;
        this.trackballControls.panSpeed = 0.5;

    }

    createLights() {
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.8);
        this.add (this.ambientLight);

        this.spotLight = new THREE.SpotLight( 0xffffff );
        this.spotLight.position.set( 200, 200, 200 );
        this.spotLight.castShadow = true;

        this.viewpoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 50, 50),0);
        this.viewpoint.position.set(0, 40, 0);
        this.spotLight.shadow.mapSize.width=2048
        this.spotLight.shadow.mapSize.height=2048;
        this.spotLight.target = this.viewpoint;
        this.spotLight.intensity = 0.3;
        this.spotLight.penumbra = 0.2;
        this.add(this.viewpoint);
        this.add (this.spotLight);
    }

    // Sets a type of camera
    setCamera(type) {
        switch (type) {
            case 1:
                this.camera.position.set (0, 200, 100);
                break;
            case 2:
                this.camera.position.set(-50, 30, 130);
                break;
            case 3:
                this.camera.position.set(-30, 45, -100);
                break;
        }
        this.voltear = false;
    }

    // Camera update
    updateCamera(type) {
        switch (type) {
            case 1:
                if (this.voltear)
                    this.camera.position.z = this.camera.position.z - 0.2;
                else
                    this.camera.position.z = this.camera.position.z + 0.2;

                if (this.camera.position.z > 180)
                    this.voltear = true;
                
                if (this.camera.position.z < 10)
                    this.voltear = false;

                if (level.slowed > 150) {
                    this.camera.position.y = this.camera.position.y + 0.5;
                } else if (level.slowed > 50)
                    this.camera.position.y = this.camera.position.y + 0.02;
                else if (level.slowed > 0)
                    this.camera.position.y = this.camera.position.y - 0.52;
                else
                    this.camera.position.y = 200;
                break;
            case 2:
                if (this.voltear)
                    this.camera.position.x = this.camera.position.x - 0.2;
                else
                    this.camera.position.x = this.camera.position.x + 0.2;

                if (this.camera.position.x > 100)
                    this.voltear = true;
                
                if (this.camera.position.x < -100)
                    this.voltear = false;
                break;

            case 3:
                if (this.voltear)
                    this.camera.position.x = this.camera.position.x - 0.2;
                else
                    this.camera.position.x = this.camera.position.x + 0.2;

                if (this.camera.position.x > 100)
                    this.voltear = true;
                
                if (this.camera.position.x < -100)
                    this.voltear = false;
                break;
        }
    }

    // Room update
    update() {
        this.saloon.updateGround();
        if (this.spotLight.position.z > -700) {
            this.spotLight.position.z = this.spotLight.position.z - this.velocity;
            this.viewpoint.position.z = this.viewpoint.position.z - this.velocity;
        } else {
            this.spotLight.position.z = 800;
            this.viewpoint.position.z = 800;
        }
    }

    updateCar(targetX, targetY) {
        // X - IZQ / DER
        // Y - ARRIBA / ABAJO

        this.car.position.x += (targetX - this.car.position.x)*0.1;   
        this.car.rotation.y = (targetX - this.car.position.x)*0.0128;
        this.car.position.z = 40 - (targetY - this.car.position.z)*0.4;
    }

    // LIGHTS CONTROL
    turnOffLights() {
        this.spotLight.intensity = this.ambientLight.intensity = 0.1;
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