var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};


class Car extends THREE.Object3D {
    constructor() {

        super();
        this.ancho = 6;
        this.lamp1 = null;
        this.lamp2 = null;
        this.viewpoint = null;
        this.car = new THREE.Object3D();
        this.createDefinedCar();
        //this.createCar();
        //this.add(this.car);
    }

    getPos() {
        var globalCarPosition = new THREE.Vector3();
        globalCarPosition.setFromMatrixPosition(this.matrixWorld);
        return globalCarPosition;
    }

    turnOnLamps() {
        this.lamp1.intensity = 0.7;
        this.lamp2.intensity = 0.7;
    }

    turnOffLamps() {
        this.lamp1.intensity = this.lamp2.intensity = 0;
    }

    createDefinedCar() {
        var d_car = new THREE.Object3D();
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath('models/');
        mtlLoader.load('car.mtl', function (materials) {
      
            materials.preload();
            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.setPath('models/');
            objLoader.load('car.obj', 
            
            function (object) {
                object.position.y = 0;
                object.scale.y = 0.3;
                object.scale.x = 0.3;
                object.scale.z = 0.3;
                object.rotation.x = -Math.PI / 2;
                object.castShadow = true;
  
                d_car.add(object);
      
            });
      
        });
        this.add(d_car);

        this.viewpoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 50, 50), 0);
        this.viewpoint.position.set(0, 20, 240);

        this.lamp1 = new THREE.SpotLight( 0xffffff, 1, 400 );
        this.lamp2 = new THREE.SpotLight( 0xffffff, 1, 400 );
        //lamp1.intensity = 0.5;
        this.lamp1.castShadow = true;
        this.lamp2.castShadow = true;

        this.lamp1.penumbra = this.lamp2.penumbra = 0.6;

        this.lamp1.target = this.viewpoint;
        this.lamp2.target= this.viewpoint;

        this.lamp1.position.set(-5, 3,14);
        this.lamp2.position.set(5, 3, 14);

        this.add(this.lamp1);
        this.add(this.lamp2);

        this.add(this.viewpoint);

        //return d_car;
    }
    createCar() {
        var rueda1 = this.createTire();
        var rueda2 = this.createTire();
        var rueda3 = this.createTire();
        var rueda4 = this.createTire();

        rueda1.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-3,3,2));
        rueda2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (3,3,2));
        rueda3.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (3,-3,2));
        rueda4.geometry.applyMatrix (new THREE.Matrix4().makeTranslation (-3,-3,2));
        
        this.car.add(rueda1);
        this.car.add(rueda2);
        this.car.add(rueda3);
        this.car.add(rueda4);


        this.car.add(this.createBody());

    }

    createBody() {
        var body = new THREE.Mesh (
            new THREE.BoxGeometry(13, 3, this.ancho),
            new THREE.MeshPhongMaterial({color:Colors.red, flatShading: true})
        )
        body.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,3,0));

        var body2 = new THREE.Mesh (
            new THREE.BoxGeometry(0.5, 3, this.ancho),
            new THREE.MeshPhongMaterial({color:Colors.red, flatShading: true})
        )
        body2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-3.6,5,0));

        var body3 = new THREE.Mesh (
            new THREE.BoxGeometry(0.5, 2.6, this.ancho),
            new THREE.MeshPhongMaterial({color:Colors.pink, flatShading: true})
        )
        body3.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-3.8,5,0));


        var cristales = new THREE.Mesh (
            new THREE.BoxGeometry(6, 2.7, this.ancho),
            new THREE.MeshPhongMaterial({color:Colors.red, flatShading: true})
        )
        cristales.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-0.4,5.6,0));
       
        var cristales2 = new THREE.Mesh (
            new THREE.BoxGeometry(0.3, 2.2, this.ancho-0.5),
            new THREE.MeshPhongMaterial({color:Colors.blue, flatShading: true})
        )
        cristales2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(2.7,5.6,0));
        
        body.add(body2);
        body.add(body3);
        body.add(cristales);
        body.add(cristales2);
        body.castShadow = true;
        return body;
    }

    createTire() {
        var rueda = new THREE.Mesh (
            new THREE.CylinderGeometry (1.6, 1.5, 2, 20, 1),
            new THREE.MeshPhongMaterial({color:Colors.brown, flatShading: true})
        )
        rueda.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        rueda.castShadow = true;
        return rueda;
    }
    
}