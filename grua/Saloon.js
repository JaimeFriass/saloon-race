var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

class Saloon extends THREE.Object3D {
    constructor() {
        super();
        this.walls = null;
        this.ground = null;
        this.carpet = null;
        this.table = new THREE.Object3D();
        this.box = null;
        this.velocity = 1;
        this.createGround();
        this.createWalls();
        this.createCarpets();
        this.createBox();
        this.createTable();
    }

    createWalls() {
        var wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(400, 300, 1),
            new THREE.MeshPhongMaterial({color:Colors.pink, shading:THREE.FlatShading})
        )
        wall1.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0, 150,200));
        //this.add(wall1);

        var wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(400, 300, 1),
            new THREE.MeshPhongMaterial({color:Colors.pink, shading:THREE.FlatShading})
        )
        wall2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0, 150, -200));
        //this.add(wall2);
        var wall3 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 300, 600),
            new THREE.MeshPhongMaterial({color:Colors.pink, shading:THREE.FlatShading})
        )
        wall3.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-200, 150,0));
        this.add(wall3);
        
        var wall4 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 300, 600),
            new THREE.MeshPhongMaterial({color:Colors.red, flatShading: true})
        )
        wall4.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(200, 150,0));
        this.add(wall4);
    }

    createGround() {
        var wood = new THREE.TextureLoader().load("imgs/wood.jpg");
        wood.wrapS = THREE.RepeatWrapping;
        wood.wrapT = THREE.RepeatWrapping;
        wood.repeat.set( 8, 8 );
        this.ground = new THREE.Mesh (
          new THREE.BoxGeometry (400, 0.2, 800, 1, 1, 1),
          new THREE.MeshPhongMaterial ({map: wood}));
        this.ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,-0.1,0));
        this.ground.receiveShadow = true;
        this.ground.autoUpdateMatrix = false;

        this.add (this.ground);
    }

    createBox() {
        this.box = new THREE.Mesh (
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshPhongMaterial({color:Colors.brownDark, flatShading: true})
        )
        this.box.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-100, 10, -200));

        this.add(this.box);
    }

    getPosBox() {
        var globalBoxPosition = new THREE.Vector3();
        globalBoxPosition.setFromMatrixPosition(this.box.matrixWorld);
        return globalBoxPosition;
    }

    updateGround() {
        // Ground
        if (this.ground.position.z > -200) {
            this.ground.position.z = this.ground.position.z - this.velocity;
        } else {
            this.ground.position.z = 100;
        }

        // Carpet
        if (this.ground.position.z > -400) {
            this.carpet.position.z = this.carpet.position.z - this.velocity;
        } else {
            this.carpet.position.z = 400;
            this.carpet.position.x = 100 - Math.floor((Math.random() * 100));
        }

        // Boxes
        if (this.box.position.z > -200) {
            this.box.position.z = this.box.position.z - this.velocity;
        } else {
            this.box.position.z = 440;
            this.box.position.x = 100 - Math.floor((Math.random() * 200));
        }


        // Table
        if (this.table.position.z > -400) {
            this.table.position.z = this.table.position.z - this.velocity;
        } else {
            this.table.position.z = 440;
            this.table.position.x = 100 - Math.floor((Math.random() * 200));
        }
    }

    createCarpets() {
        this.carpet = new THREE.Mesh (
            new THREE.BoxGeometry (100, 0.2, 300),
            new THREE.MeshPhongMaterial({color:Colors.red, flatShading: true})
        )
        this.carpet.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(130, 0.4 , 300));
        this.add(this.carpet);
    }

    createTable() {
        var altura = 70;
        var ancho = 40;
        var largo = 50;
        var pata1 = new THREE.Mesh (
            new THREE.BoxGeometry (4, altura, 4),
            new THREE.MeshPhongMaterial({color:Colors.blue, flatShading: true})
        )
        pata1.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-ancho, altura/2 , -largo));
        this.table.add(pata1);

        var pata2 = new THREE.Mesh (
            new THREE.BoxGeometry (4, altura, 4),
            new THREE.MeshPhongMaterial({color:Colors.blue, flatShading: true})
        )
        pata2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-ancho, altura/2 , largo));
        this.table.add(pata2);

        var pata3 = new THREE.Mesh (
            new THREE.BoxGeometry (4, altura, 4),
            new THREE.MeshPhongMaterial({color:Colors.blue, flatShading: true})
        )
        pata3.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(ancho, altura/2 , -largo));
        this.table.add(pata3);

        var pata4 = new THREE.Mesh (
            new THREE.BoxGeometry (4, altura, 4),
            new THREE.MeshPhongMaterial({color:Colors.blue, flatShading: true})
        )
        pata4.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(ancho, altura/2 , largo));
        this.table.add(pata4);

        var tabla = new THREE.Mesh (
            new THREE.BoxGeometry (ancho*2.3, 2, largo*2.3),
            new THREE.MeshPhongMaterial({color:Colors.blue, flatShading: true})
        )
        tabla.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0, altura , 0));

        
        this.table.add(tabla);
        this.table.position.z = 300;
        this.table.position.x = 100 - Math.floor((Math.random() * 200));
        this.add(this.table);
    }

}