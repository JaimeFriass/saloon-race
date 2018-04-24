
class Room extends THREE.Scene {
    constructor (renderer) {
        super();
        this.ambientLight = null;
        this.spotLight = null;
        this.trackballControls = null;
        this.camera = null;

        this.ground = new THREE.Mesh (
          new THREE.BoxGeometry (100, 0.2, 100, 1, 1, 1),
          new THREE.MeshPhongMaterial ({color: 0xf4af37, specular: 0xfff804, shininess: 70}));
        this.ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,-0.1,0));
        this.ground.receiveShadow = true;
        this.ground.autoUpdateMatrix = false;
        this.add (this.ground);
        this.car = new Car({});
        this.add(this.car);
        this.createLights();
        this.createCamera(renderer);
      }

    createCamera (renderer) {
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set (10, 50, 10);
        var look = new THREE.Vector3 (0,10,0);
        this.camera.lookAt(look);
        this.add(this.camera);

        this.trackballControls = new THREE.TrackballControls (this.camera, renderer);
        this.trackballControls.rotateSpeed = 5;
        this.trackballControls.zoomSpeed = -2;
        this.trackballControls.panSpeed = 0.5;
        this.trackballControls.target = look;

    }

    createLights() {
        this.ambientLight = new THREE.AmbientLight(0xccddee, 0.8);
        this.add (this.ambientLight);

        var skygroundlight = new THREE.HemisphereLight (0xaaaaff, 0xaaffaa);
        this.add(skygroundlight);

        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight( 0xffffff );
        this.spotLight.position.set( 60, 60, 40 );
        this.spotLight.castShadow = true;
        // the shadow resolution
        this.spotLight.shadow.mapSize.width=2048
        this.spotLight.shadow.mapSize.height=2048;
        this.add (this.spotLight);
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