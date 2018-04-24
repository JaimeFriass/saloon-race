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
        this.car = new THREE.Object3D();
        this.createDefinedCar();
        //this.createCar();
        //this.add(this.car);
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
            new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading})
        )
        body.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,3,0));

        var body2 = new THREE.Mesh (
            new THREE.BoxGeometry(0.5, 3, this.ancho),
            new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading})
        )
        body2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-3.6,5,0));

        var body3 = new THREE.Mesh (
            new THREE.BoxGeometry(0.5, 2.6, this.ancho),
            new THREE.MeshPhongMaterial({color:Colors.pink, shading:THREE.FlatShading})
        )
        body3.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-3.8,5,0));


        var cristales = new THREE.Mesh (
            new THREE.BoxGeometry(6, 2.7, this.ancho),
            new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading})
        )
        cristales.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-0.4,5.6,0));
       
        var cristales2 = new THREE.Mesh (
            new THREE.BoxGeometry(0.3, 2.2, this.ancho-0.5),
            new THREE.MeshPhongMaterial({color:Colors.blue, shading:THREE.FlatShading})
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
            new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading})
        )
        rueda.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        rueda.castShadow = true;
        return rueda;
    }
}