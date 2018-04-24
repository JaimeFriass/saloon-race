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
        
        this.car = new THREE.Object3D();

        this.createCar();
        this.add(this.car);
    }


    createCar() {
        var rueda1, rueda2, rueda3, rueda4;
        var rueda = new THREE.Mesh (
            new THREE.CylinderGeometry (2, 2, 2, 16, 1),
            new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading})
        )
        rueda.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

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
            new THREE.BoxGeometry(13, 3, 6),
            new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading})
        )
        body.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0,3,0));

        var cristales = new THREE.Mesh (
            new THREE.BoxGeometry(6, 2.7, 5.4),
            new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading})
        )
        cristales.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-0.4,5.6,0));
       
        var cristales2 = new THREE.Mesh (
            new THREE.BoxGeometry(0.3, 2.2, 5),
            new THREE.MeshPhongMaterial({color:Colors.blue, shading:THREE.FlatShading})
        )
        cristales2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(2.7,5.6,0));
        
        
        body.add(cristales);
        body.add(cristales2);
        return body;
    }

    createTire() {
        var rueda = new THREE.Mesh (
            new THREE.CylinderGeometry (2, 2, 2, 16, 1),
            new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading})
        )
        rueda.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        return rueda;
    }
}