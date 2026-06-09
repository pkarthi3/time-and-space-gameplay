class Level extends Phaser.Scene {

    constructor(key){
        super(key);
    }

    preload() {
        this.load.path = "assets/";
        this.load.image("placeholder", "sillyguy.png"); //will be replaced with actual main character in final game
        this.load.image("ground", "ground-proto.png");
        this.load.image("nextAreaPlaceholder", "sparkles.png"); //will be replaced with portal in final game
        this.load.image("testObject", "coin.png");
    }
    create() {

        let objectsFound = false;

        this.player = this.physics.add.image(100, 100, "placeholder");
        this.player.setScale(0.05);
        this.player.setCollideWorldBounds(true);
        
        this.cursors = this.input.keyboard.createCursorKeys();

        this.ground = this.physics.add.image(400, 600, "ground");
        this.ground.body.allowGravity = false;
        this.ground.body.setImmovable(true);

        this.portal = this.physics.add.image(700, 400, "nextAreaPlaceholder");
        this.portal.setScale(0.1);
        this.portal.body.allowGravity = false;
        this.portal.body.setImmovable(true);

        this.testObject = this.physics.add.image(400, 300, "testObject");
        this.testObject.setScale(0.025);
        this.testObject.body.allowGravity = false;
        this.testObject.body.setImmovable(true);

        this.leftButton = this.add.text(50, 500, "<");
        this.leftButton.setFontSize(50);
        this.leftButton.setInteractive();
        this.leftButton.on("pointerdown", () => {
            this.player.setVelocityX(-150);
        })
        this.leftButton.on("pointerup", () => {
            this.player.setVelocityX(0);
        })

        this.upButton = this.add.text(650, 500, "^");
        this.upButton.setFontSize(50);
        this.upButton.setInteractive();
        this.upButton.on("pointerdown", () => {
            this.player.setVelocityY(-250);
        });

        this.rightButton = this.add.text(150, 500, ">");
        this.rightButton.setInteractive();
        this.rightButton.setFontSize(50);
        this.rightButton.on("pointerdown", () => {
            this.player.setVelocityX(150);
        })
        this.rightButton.on("pointerup", () => {
            this.player.setVelocityX(0);
        })

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.overlap(this.player, this.testObject, () => {
            objectsFound = true;
            this.itemdesc = this.add.text(100, 100, "(item description in universe)");
            this.tweens.add({
                targets: this.itemdesc,
                alpha: 0,
                duration: 3000,
                delay: 1000,
            });
        });
        this.physics.add.overlap(this.player, this.portal, () => {
            this.itemdesc.setAlpha(0);
            if(objectsFound) {
                this.portaldesc = this.add.text(100, 100, "(go to next area, lore is likely shared here)");
            }
            else {
                this.portaldesc = this.add.text(100, 100, "before delving deeper, find what you can about the past first");
            }

            this.tweens.add({
                targets: this.portaldesc,
                alpha: 0,
                duration: 3000,
                delay: 1000,
            });
        });


    }
    update() {
        // based off example at https://labs.phaser.io/phaser4-view.html?src=src%5Cphysics%5Carcade%5Cbody%20on%20a%20path.js&return=phaser4-index.html%3Fpath%3Dphysics%252Farcade
        const { left, right, up } = this.cursors;
        if (left.isDown) {
            this.player.setVelocityX(-150);
        }
        else if (right.isDown) {
            this.player.setVelocityX(150);
        }

        left.on("up", () => {
            this.player.setVelocityX(0);
        })

        right.on("up", () => {
            this.player.setVelocityX(0);
        })


        if (up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-250);
        }
    
    }

}

class Example extends Level {
    constructor() {
        super('example');
    }
}



let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: 0x000000,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true,
        }
    },
    scene: [ Example ]
}

let game = new Phaser.Game(config);

