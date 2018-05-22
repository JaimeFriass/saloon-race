
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
        this.add(this.saloon);
        this.car = new Car({});
        this.add(this.car);
        this.createLights();
        //this.lamp = this.createLamp();
        //this.add(this.lamp);
        this.createCamera(renderer);
        this.axis = new THREE.AxisHelper (35);
        this.axis.visible = false;
        this.add (this.axis);
        this.sound = this.createMusic();
        // Audio in scene
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        

        this.fog = new THREE.Fog(new THREE.Color( 0xF5986E ), 500, 630);
        this.background = new THREE.Color( 0xF5986E );
        //this.add(this.fog);
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

    stopMusic() {
        this.sound.stop();
    }

    playMusic() {
        this.sound.play();
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

    createLights() {
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.8);
        this.add (this.ambientLight);

        //var skygroundlight = new THREE.HemisphereLight (0xaaaaff, 0xaaffaa);
        //this.add(skygroundlight);

        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight( 0xffffff );
        this.spotLight.position.set( 200, 200, 200 );
        this.spotLight.castShadow = true;

        this.viewpoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 50, 50), new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true}));
        this.viewpoint.position.set(0, 40, 0);
        // the shadow resolution
        this.spotLight.shadow.mapSize.width=2048
        this.spotLight.shadow.mapSize.height=2048;
        this.spotLight.target = this.viewpoint;
        this.spotLight.intensity = 0.3;
        this.spotLight.penumbra = 0.2;
        this.add(this.viewpoint);
        this.add (this.spotLight);
    }

    createLamp() {
        var lamp = new THREE.Object3D();
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('models/');
    
        mtlLoader.load('lamp.mtl', function (materials) {
            materials.preload();
            var objLoader = new THREE.OBJLoader()
            objLoader.setMaterials(materials);
            objLoader.setPath('models/');
            objLoader.load('lamp.obj', 
            function(object) {
                object.position.y = 30;
                object.position.x = -125;
                object.rotation.x = (Math.PI/180)*270;
                object.rotation.z = (Math.PI/180)*90;
                object.scale.y = 1;
                object.castShadow = true;
                lamp.add(object);
            });
        });
    
        var light = new THREE.PointLight(0xFFFFFF, 1, 200);
        light.position.y=20;
        lamp.add(light);
        return lamp;
    }

    setCamera(type) {
        switch (type) {
            case 1:
                this.camera.position.set (0, 200, 100);
                break;
            case 2:
                this.camera.position.set(-50, 30, 130);
                break;
            case 3:
                this.camera.position.set(-30, 30, -100);
                break;
        }
        this.voltear = false;
    }

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

    update() {
        /*
        if (this.lamp.position.z > -600) {
            this.lamp.position.z = this.lamp.position.z - this.velocity;
        } else {
            this.lamp.position.z = 600;
        }
        */

        this.saloon.updateGround();
        if (this.spotLight.position.z > -500) {
            this.spotLight.position.z = this.spotLight.position.z - this.velocity;
            this.viewpoint.position.z = this.viewpoint.position.z - this.velocity;
        } else {
            this.spotLight.position.z = 700;
            this.viewpoint.position.z = 700;
        }
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