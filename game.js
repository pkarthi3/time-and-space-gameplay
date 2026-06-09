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
        this.load.audio("bgm", "levelbg.wav");
        this.load.audio("itemFound", "itemfound.wav");
    }
    
    create() {

        this.totalItems = 0;
        this.itemsFound = 0;

        this.bgm = this.sound.add('bgm');
        this.bgm.setLoop(true);
        this.sound.play(this.bgm.key);

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

        this.testObject = this.add.existing(new PastItem(this, 400, 300, 'testObject', '(item description)'));
        this.testObject.setScale(0.025);

        this.leftButton = this.add.existing(new Button(this, 50, 500, "<"));
        this.leftButton.on("pointerdown", () => {
            this.player.setVelocityX(-150);
        })
        this.leftButton.on("pointerup", () => {
            this.player.setVelocityX(0);
        })

        this.upButton = this.add.existing(new Button(this, 650, 500, "^"));
        this.upButton.on("pointerdown", () => {
            this.player.setVelocityY(-250);
        });

        this.rightButton = this.add.existing(new Button(this, 150, 500, ">"));
        this.rightButton.on("pointerdown", () => {
            this.player.setVelocityX(150);
        })
        this.rightButton.on("pointerup", () => {
            this.player.setVelocityX(0);
        })



        this.physics.add.collider(this.player, this.ground);
        this.physics.add.overlap(this.player, this.testObject, () => {
            if (this.testObject.found == false) {
                this.testObject.found = true;
                this.itemsFound++;
                this.sound.play('itemFound');
            }
            this.itemdesc = this.add.text(100, 50, this.testObject.description);
            this.tweens.add({
                targets: this.itemdesc,
                alpha: 0,
                duration: 3000,
                delay: 1000,
            });
        });
        this.physics.add.overlap(this.player, this.portal, () => {
            if(this.itemsFound == this.totalItems) {
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

class Button extends Phaser.GameObjects.Text {
     constructor(scene, x, y, text) {
        super(scene, x, y, text);
        this.setFontSize(50);
        this.setInteractive();
     }       
}

class PastItem extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, description) {
        super(scene, x, y, texture);
        this.description = description;
        scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setImmovable(true);
        this.found = false;
        scene.totalItems++;
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
    scene: [ Level ]
}

let game = new Phaser.Game(config);

