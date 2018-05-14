var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x68c3c0,
};

var GroundTextures = [
    "imgs/wood.jpg",
    "imgs/wood2.jpg",
    "imgs/wood.jpg",
    "imgs/kitchen.jpg",
    "imgs/wood.jpg",
    "imgs/wood2.jpg",
    "imgs/wood.jpg",
]

class Saloon extends THREE.Object3D {
    constructor() {
        super();
        this.walls = null;
        this.ground = null;
        this.carpet = null;
        this.midWall = null;
        this.door = null;
        this.table = new THREE.Object3D();
        this.box = null;
        this.velocity = 1;
        this.ground1 = this.createGround(GroundTextures[0]);
        this.ground2 = this.createGround(GroundTextures[0]);
        this.ground2.position.z = 795;
        this.add(this.ground1);
        this.add(this.ground2);
        this.currentLevel1 = 0;
        this.currentLevel2 = 0;
        this.createWalls();
        this.createCarpets();
        this.box = this.createBox();
        this.createTable();
    }

    createWalls() {
        var wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(500, 300, 1),
            new THREE.MeshPhongMaterial({color:Colors.pink, flatShading: true})
        )
        wall1.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0, 150, 150));
        //this.add(wall1);

        var wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(500, 300, 1),
            new THREE.MeshPhongMaterial({color:Colors.pink, flatShading: true})
        )
        wall2.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(0, 150, -150));
        //this.add(wall2);
        var wall3 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 300, 800),
            new THREE.MeshPhongMaterial({color:Colors.pink, flatShading: true})
        )
        wall3.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-130, 150,0));
        this.add(wall3);
        
        var wall4 = new THREE.Mesh(
            new THREE.BoxGeometry(1, 300, 800),
            new THREE.MeshPhongMaterial({color:Colors.red, flatShading: true})
        )
        wall4.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(130, 150,0));
        this.add(wall4);
    }

    createGround(texture) {
        var wood = new THREE.TextureLoader().load(texture);
        wood.wrapS = THREE.RepeatWrapping;
        wood.wrapT = THREE.RepeatWrapping;
        wood.repeat.set( 8, 8 );
        var ground = new THREE.Mesh (
          new THREE.BoxGeometry (400, 0.2, 800, 1, 1, 1),
          new THREE.MeshPhongMaterial ({map: wood}));
        ground.applyMatrix (new THREE.Matrix4().makeTranslation (0,-0.1,0));
        ground.receiveShadow = true;
        ground.autoUpdateMatrix = false;
        return ground;
    }

    createBox() {
        var box = new THREE.Mesh (
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshPhongMaterial({color:Colors.brownDark, flatShading: true})
        )
        box.geometry.applyMatrix (new THREE.Matrix4().makeTranslation(-100, 10, -200));

        return box;
    }

    getPosBox() {
        var globalBoxPosition = new THREE.Vector3();
        globalBoxPosition.setFromMatrixPosition(this.box.matrixWorld);
        return globalBoxPosition;
    }

    getPosition() {
        return this.box.position;
    }

    updateGround() {
        // Ground
        if (this.ground1.position.z > -793) {
            this.ground1.position.z = this.ground1.position.z - this.velocity;
        } else {
            
            if (level.current != this.currentLevel1 ) {
                console.log("GROUND 1 = level.current: " + level.current + " currentLevel: " + this.currentLevel1);
                this.nextChunk(1);
            } else {
                this.ground1.position.z = 550;
            }
        }
        if (this.ground2.position.z > -793) {
            this.ground2.position.z = this.ground2.position.z - this.velocity;
        } else {
            console.log("GROUND 2 = level.current: " + level.current + " currentLevel: " + this.currentLevel2);
            if (level.current != this.currentLevel2) {
                
                this.nextChunk(2);
            } else {
                this.ground2.position.z = 550;
            }
        }

        if (this.midWall != null) {
            if (this.midWall.position.z > -2000) {
                this.midWall.position.z = this.midWall.position.z - this.velocity;
                //this.door.position.z = this.door.position.z - this.velocity;
            } else {
                this.midWall.position.z = -3000;
                this.remove(this.midWall);
                this.midWall.position.z = -3000;
            }
        }

        // Carpet
        if (this.carpet.position.z > -1000) {
            this.carpet.position.z = this.carpet.position.z - this.velocity;
        } else {
            this.carpet.position.z = 1000;
            this.carpet.position.x = 70 - Math.floor((Math.random() * 70));
        }

        // Boxes
        if (this.box.position.z > -200) {
            this.box.position.z = this.box.position.z - this.velocity;
        } else {
            this.box.position.z = 440;
            this.box.position.x = 100 - Math.floor((Math.random() * 200));
        }

        // Table
        if (this.table.position.z > -700) {
            this.table.position.z = this.table.position.z - this.velocity;
        } else {
            this.table.position.z = 700;
            this.table.position.x = 50 - Math.floor((Math.random() * 100));
        }
    }

    createMidWall() {
        var wall1 = new THREE.Mesh(
            new THREE.BoxGeometry(20, 300, 3),
            new THREE.MeshPhongMaterial({color:Colors.pink, flatShading: true})
        )

        wall1.applyMatrix (new THREE.Matrix4().makeTranslation (-120, 150, 0));
        var wall2 = new THREE.Mesh(
            new THREE.BoxGeometry(20, 300, 3),
            new THREE.MeshPhongMaterial({color:Colors.pink, flatShading: true})
        )
        wall2.applyMatrix (new THREE.Matrix4().makeTranslation (240, 0, 0));

        wall1.add(wall2);
        return wall1;
    }

    nextChunk(number) {
        console.log("NEXT CHUNK: " + number);
        if (number == 1) {
            this.remove(this.ground1);
            this.ground1 = this.createGround(GroundTextures[level.current]);
            this.currentLevel1++;
            this.add(this.ground1);
            this.ground1.position.z = 800;

            this.remove(this.midWall);
            this.midWall = this.createMidWall();
            this.midWall.position.z = 400;
            this.add(this.midWall);
            
        }
        else if (number == 2) {
            this.remove(this.ground2);
            this.ground2 = this.createGround(GroundTextures[level.current]);
            this.currentLevel2++;
            this.add(this.ground2);
            this.ground2.position.z = 800;
            this.remove(this.midWall);
            this.midWall = this.createMidWall();
            this.midWall.position.z = 400;
            this.add(this.midWall);
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