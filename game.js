class Level extends Phaser.Scene {
    preload() {
        this.load.path = "assets/";
        this.load.image("placeholder", "sillyguy.png");
        this.load.image("ground", "ground-proto.png");
    }
    create() {
        this.player = this.physics.add.image(100, 100, "placeholder");
        this.player.setScale(0.1);
        this.player.setCollideWorldBounds(true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.ground = this.physics.add.image(400, 600, "ground");
        this.ground.body.allowGravity = false;
        this.ground.body.setImmovable(true);
        this.leftButton = this.add.text(100, 500, "<");
        this.leftButton.setInteractive();
        this.rightButton = this.add.text(300, 500, ">");
        this.rightButton.setInteractive();

        this.physics.add.collider(this.player, this.ground);

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
        else {
            this.player.setVelocityX(0);
        }

        if (up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-250);
        }
    
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

