// the game itself
let game;
var ticket;
var userpull;
var getSlices = [];
var first = true;
var inresult = false;

let gameOptions;
let textStyle;

// once the window loads...
window.onload = function () {

    // game configuration object
    let gameConfig = {

        // resolution and scale mode
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: window.innerWidth * window.devicePixelRatio,
            height: window.innerHeight * window.devicePixelRatio
        },

        // game background color
        backgroundColor: 0x560000,

        // scenes used by the game
        scene: [playGame]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame
    window.focus()
}

// PlayGame scene
class playGame extends Phaser.Scene {

    // constructor
    constructor() {
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload() {

        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect((window.innerWidth * window.devicePixelRatio / 2) - (320 / 2), window.innerHeight * window.devicePixelRatio / 2, 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var textLoading = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                fontFamily: 'Arial Black',
                fontSize: 12 * window.devicePixelRatio,
                fill: '#ffffff'
            }
        });

        var precentText = this.make.text({
            x: width / 2,
            y: height / 2 + 5,
            text: '0%',
            style: {
                fontFamily: 'Arial Black',
                fontSize: 12 * window.devicePixelRatio,
                fill: '#ffffff'
            }
        });

        textLoading.setOrigin(0.5, 0.5);
        precentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            progressBar.clear();
            precentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(((window.innerWidth * window.devicePixelRatio / 2) - (300 / 2)), (window.innerHeight * window.devicePixelRatio / 2) + 10, 300 * value, 30);
        });

        this.load.on('complete', function (value) {
            progressBar.destroy();
            progressBox.destroy();
            textLoading.destroy();
            precentText.destroy();
        });

        fetch('https://api.msportsid.com/api/game/tiket', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }).then(res => {
            res.json().then(res2 => {
                ticket = res2.data[0].tiket;
                console.log(`User's Ticket : ${ticket}`);
            })
        }).catch(err => {
            console.log(err);
        });

        fetch('https://api.msportsid.com/api/game/history_today', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }).then(res => {
            res.json().then(res2 => {
                // const value = `Name: ${res2.posts.id}`
                userpull = res2;
                console.log(`User's Pull : ${res2}`);
            })
        }).catch(err => {
            console.log(err);
        });

        fetch('https://api.msportsid.com/api/game/fortunewheel', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }).then(res => {
            res.json().then(res2 => {
                // ticket = res2.data_tiket[0].tiket;
                res2.data_game.forEach(element => {
                    let data = {
                        startColor: element.start_color,
                        endColor: element.end_color,
                        rings: 3,
                        type: element.text,
                        text: element.text,
                        sliceText: element.text,
                        icon: element.icon
                    }
                    getSlices.push(data);
                });
                console.log(getSlices.length);
            });
        }).catch(err => {
            console.log(err);
        });

        textStyle = {
                fontFamily: "Arial Black",
                fontSize: 12 * window.devicePixelRatio,
                fontStyle: "normal",
                align: "center"
            },

            // setting gameOptions
            gameOptions = {

                // slices configuration

                // {
                //     degrees: 125,
                //     startColor: 0xff00ff,
                //     endColor: 0x0000ff,
                //     rings: 10,
                //     text: "BLUE TEXT, WHITE STROKE",
                //     sliceText: "BLUE",
                //     sliceTextStyle: {
                //         fontFamily: "Arial Black",
                //         fontSize: 36,
                //         color: "#000077"
                //     },
                //     sliceTextStroke: 8,
                //     sliceTextStrokeColor: "#ffffff"
                // },

                // slices: [{
                //         id: 1,
                //         degrees: 45,
                //         startColor: "9960FC",
                //         endColor: "6104FF",
                //         rings: 3,
                //         iconFrame: 0,
                //         iconScale: 0.4,
                //         text: "BAAL",
                //         icon: "/img/resized/baal.png"
                //     },
                //     {
                //         id: 2,
                //         degrees: 45,
                //         startColor: "ff0000",
                //         endColor: "550000",
                //         rings: 3,
                //         iconFrame: 1,
                //         iconScale: 0.4,
                //         text: "DILUC",
                //         icon: "/img/resized/diluc.png"
                //     },
                //     {
                //         id: 3,
                //         degrees: 40,
                //         startColor: "58C2FF",
                //         endColor: "00A2FF",
                //         rings: 3,
                //         iconFrame: 2,
                //         iconScale: 0.4,
                //         text: "GANYU",
                //         icon: "/img/resized/ganyu.png"
                //     },
                //     {
                //         id: 4,
                //         degrees: 40,
                //         startColor: "9960FC",
                //         endColor: "6104FF",
                //         rings: 3,
                //         iconFrame: 3,
                //         iconScale: 0.4,
                //         text: "KEQING",
                //         icon: "/img/resized/keqing.png"
                //     },
                //     {
                //         id: 5,
                //         degrees: 35,
                //         startColor: "65E1FF",
                //         endColor: "00CDFF",
                //         rings: 3,
                //         iconFrame: 4,
                //         iconScale: 0.4,
                //         text: "MONNA",
                //         icon: "/img/resized/mona.png"
                //     },
                //     {
                //         id: 6,
                //         degrees: 35,
                //         startColor: "C9F4F7",
                //         endColor: "7CF7FF",
                //         rings: 3,
                //         iconFrame: 5,
                //         iconScale: 0.4,
                //         text: "QIQI",
                //         icon: "/img/resized/qiqi.png"
                //     },
                //     {
                //         id: 7,
                //         degrees: 20,
                //         startColor: "574529",
                //         endColor: "54380E",
                //         rings: 3,
                //         iconFrame: 6,
                //         iconScale: 0.4,
                //         text: "ZHONGLI",
                //         icon: "/img/resized/zhongli.png"
                //     },
                //     {
                //         id: 8,
                //         degrees: 40,
                //         startColor: "6FF78F",
                //         endColor: "35EF60",
                //         rings: 3,
                //         iconFrame: 7,
                //         iconScale: 0.4,
                //         text: "VENTI",
                //         icon: "/img/resized/venti.png"
                //     },
                //     {
                //         id: 9,
                //         degrees: 60,
                //         startColor: "000000",
                //         endColor: "ffff00",
                //         rings: 3,
                //         text: "POO :(",
                //         sliceText: "ZONK",
                //         sliceTextStyle: {
                //             fontFamily: "Arial Black",
                //             fontSize: 24
                //         },
                //     }
                // ],

                // slices: [{
                //         startColor: "9960FC",
                //         endColor: "6104FF",
                //         rings: 3,
                //         type: "prize",
                //         text: "HOODIE",
                //         sliceText: "HOODIE",
                //         icon: "./img/prize/hudis.png"
                //     },
                //     {
                //         startColor: "000000",
                //         endColor: "ff4500",
                //         rings: 3,
                //         type: "zonk",
                //         text: "POO :(",
                //         sliceText: "ZONK",
                //     },
                //     {
                //         startColor: "58C2FF",
                //         endColor: "00A2FF",
                //         rings: 3,
                //         type: "prize",
                //         text: "T-SHIRT",
                //         sliceText: "T-SHIRT",
                //         icon: "./img/prize/hudis.png"
                //     },
                //     {
                //         startColor: "000000",
                //         endColor: "ff4500",
                //         rings: 3,
                //         type: "zonk",
                //         text: "POO :(",
                //         sliceText: "ZONK",
                //     },
                //     {
                //         startColor: "65E1FF",
                //         endColor: "00CDFF",
                //         rings: 3,
                //         type: "prize",
                //         text: "MReferral 5000",
                //         sliceText: "MReferral\n5000",
                //         // icon: "./img/prize/mreferral.png"
                //     },
                //     {
                //         startColor: "000000",
                //         endColor: "ff4500",
                //         rings: 3,
                //         type: "zonk",
                //         text: "POO :(",
                //         sliceText: "ZONK",
                //     },
                //     {
                //         startColor: "574529",
                //         endColor: "54380E",
                //         rings: 3,
                //         type: "prize",
                //         text: "MPoint 10000",
                //         sliceText: "MPoint\n10000",
                //         // icon: "./img/prize/mpoints.png"
                //     },
                //     {
                //         startColor: "000000",
                //         endColor: "ff4500",
                //         rings: 3,
                //         type: "zonk",
                //         text: "POO :(",
                //         sliceText: "ZONK",
                //     },
                //     {
                //         startColor: "574529",
                //         endColor: "54380E",
                //         rings: 3,
                //         type: "prize",
                //         text: "MPoint 1000",
                //         sliceText: "MPoint\n1000",
                //         // icon: "./img/prize/mpoints.png"
                //     },
                //     {
                //         startColor: "000000",
                //         endColor: "ff4500",
                //         rings: 3,
                //         type: "zonk",
                //         text: "POO :(",
                //         sliceText: "ZONK",
                //     },
                //     {
                //         startColor: "574529",
                //         endColor: "54380E",
                //         rings: 3,
                //         type: "prize",
                //         text: "MReferral 500",
                //         sliceText: "MReferral\n500",
                //         // icon: "./img/prize/mreferral.png"
                //     },
                //     {
                //         startColor: "000000",
                //         endColor: "ff4500",
                //         rings: 3,
                //         type: "zonk",
                //         text: "POO :(",
                //         sliceText: "ZONK",
                //     },
                // ],
                // slices: [],

                // wheel rotation duration range, in milliseconds
                rotationTimeRange: {
                    min: 1500,
                    max: 2000
                },

                // wheel rounds before it stops
                wheelRounds: {
                    min: 4,
                    max: 9
                },

                // degrees the wheel will rotate in the opposite direction before it stops
                backSpin: {
                    min: 0,
                    max: 0
                },

                // wheel radius, in pixels
                wheelRadius: 150 * window.devicePixelRatio,

                // color of stroke lines
                strokeColor: 0xffffff,

                // width of stroke lines
                strokeWidth: 1.5 * window.devicePixelRatio
            }
        // getSlices = getSlices;
        // this.load.image('diluc', '/img/diluc.png');
        // this.load.image('ganyu', '/img/ganyu.png');
        // this.load.image('keqing', '/img/keqing.png');
        // this.load.image('monna', '/img/mona.png');
        // this.load.image('qiqi', '/img/qiqi.png');
        // this.load.image('venti', '/img/venti.png');
        // this.load.image('zhongli', '/img/zhongli.png');
        // this.load.image('baal', '/img/baal.png');

        for (let i = 0; i < getSlices.length; i++) {
            if (getSlices[i].icon != undefined) {
                this.load.image(`picture${i}`, getSlices[i].icon);
            }
        }

        // loading pin image
        this.load.image("pin", "./img/pin.png");
        this.load.image("circle", "./img/circle.png");
        this.load.image("outer", "./img/outer.png");

        this.load.image('yougot', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/back.jpg?token=AIEJHUX5QOTUCFFYWAEQI7265DL4U');
        this.load.image('restart', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/restart.png?token=AIEJHUTPRGASQSETEX4ABQK65CBRS');
        this.load.audio('sound', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/sound.mp3?token=AIEJHUQ3OVWNLZO3BAZOFFK65CBTI');
        this.load.audio('drum', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/drum.mp3?token=AIEJHUWNNKXYQMDHCQ6MOES65CBYE');
        this.load.audio('zonk', './sounds/oof.mp3');
        this.load.audio('spin', './sounds/spinsound.mp3');

        // loading icons spritesheet
        // this.load.spritesheet("icons", "/img/spritesheet.png", {
        //     frameWidth: 200,
        //     frameHeight: 200
        // });

    }

    // method to be executed once the scene has been created
    create() {

        this.drumSfx = this.sound.add('drum');
        this.zonkSfx = this.sound.add('zonk');
        this.spinSfx = this.sound.add('spin');
        this.yougot = this.add.sprite(600, 600, 'yougot');
        this.yougot.visible = false;
        this.restart = this.add.sprite(400, 170, 'restart').setScale(0.30);
        this.restart.visible = false;
        this.showTicket = this.add.text(20, 20, `Current Ticket: ${ticket}`, {
            fontSize: 20 * window.devicePixelRatio,
            fontStyle: "bold",
            fontFamily: "Arial Black"
        });
        this.showTicket.visible = true;

        // this.createSpin();


    }

    createSpin() {
        // starting degrees
        let startDegrees = -90;

        // making a graphic object without adding it to the game
        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false
        });

        // adding a container to group wheel and icons
        this.wheelContainer = this.add.container(game.config.width / 2, game.config.height / 2);

        // array which will contain all icons
        let iconArray = [];

        // looping through each slice
        for (let i = 0; i < getSlices.length; i++) {

            // converting colors from 0xRRGGBB format to Color objects
            let startColor = Phaser.Display.Color.ValueToColor(getSlices[i].startColor);
            let endColor = Phaser.Display.Color.ValueToColor(getSlices[i].endColor);

            for (let j = getSlices[i].rings; j > 0; j--) {

                // interpolate colors
                let ringColor = Phaser.Display.Color.Interpolate.ColorWithColor(startColor, endColor, getSlices[i].rings, j);

                // converting the interpolated color to 0xRRGGBB format
                let ringColorString = Phaser.Display.Color.RGBToString(Math.round(ringColor.r), Math.round(ringColor.g), Math.round(ringColor.b), 0, "0x");

                // setting fill style
                graphics.fillStyle(ringColorString, 1);

                // drawing the slice
                graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, j * gameOptions.wheelRadius / getSlices[i].rings, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length)), false);
                // graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, j * gameOptions.wheelRadius / getSlices[i].rings, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees), false);

                // filling the slice
                graphics.fillPath();
            }

            // setting line style
            graphics.lineStyle(gameOptions.strokeWidth, gameOptions.strokeColor, 1);

            // drawing the biggest slice
            graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length)), false);
            // graphics.slice(gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius + gameOptions.strokeWidth, gameOptions.wheelRadius, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees), false);

            // stroking the slice
            graphics.strokePath();

            // add the icon using icon link not spreadsheet
            // if (getSlices[i].icon != undefined) {

            //     // icon image
            //     let icon = this.add.image(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), `picture${i}`);
            //     // let icon = this.add.image(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), `picture${i}`);

            //     // scaling the icon according to game preferences
            //     icon.scaleX = getSlices[i].iconScale;
            //     icon.scaleY = getSlices[i].iconScale;

            //     // rotating the icon
            //     icon.angle = startDegrees + (360 / getSlices.length) / 2 + 90;
            //     // icon.angle = startDegrees + getSlices[i].degrees / 2 + 90;

            //     // add icon to iconArray
            //     iconArray.push(icon);
            // }

            // // add the icon, if any using spreadsheet
            // if (getSlices[i].iconFrame != undefined) {

            //     // icon image
            //     let icon = this.add.image(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), 'icons', getSlices[i].iconFrame);

            //     // scaling the icon according to game preferences
            //     icon.scaleX = getSlices[i].iconScale;
            //     icon.scaleY = getSlices[i].iconScale;

            //     // rotating the icon
            //     icon.angle = startDegrees + getSlices[i].degrees / 2 + 90;

            //     // add icon to iconArray
            //     iconArray.push(icon);
            // }

            // add slice text, if any
            if (getSlices[i].sliceText != undefined) {

                // the text
                let text = this.add.text(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), getSlices[i].sliceText, textStyle);
                // let text = this.add.text(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), getSlices[i].sliceText, getSlices[i].sliceTextStyle);

                // set text origin to its center
                text.setOrigin(0.5);

                // set text angle
                text.angle = startDegrees + (360 / getSlices.length) / 2 + 90;
                // text.angle = startDegrees + getSlices[i].degrees / 2 + 90;

                // stroke text, if required
                if (getSlices[i].sliceTextStroke && getSlices[i].sliceTextStrokeColor) {
                    text.setStroke(getSlices[i].sliceTextStrokeColor, getSlices[i].sliceTextStroke);
                }

                // add text to iconArray
                iconArray.push(text);
            }

            // updating degrees
            startDegrees += (360 / getSlices.length);
            // startDegrees += getSlices[i].degrees;

        }

        // generate a texture called "wheel" from graphics data
        graphics.generateTexture("wheel", (gameOptions.wheelRadius + gameOptions.strokeWidth) * 2, (gameOptions.wheelRadius + gameOptions.strokeWidth) * 2);

        // creating a sprite with wheel image as if it was a preloaded image
        let wheel = this.add.sprite(0, 0, "wheel");

        // adding the wheel to the container
        this.wheelContainer.add(wheel);

        // adding all iconArray items to the container
        this.wheelContainer.add(iconArray);

        // adding the pin in the middle of the canvas
        this.circle = this.add.sprite(game.config.width / 2, game.config.height / 2, "circle");
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");
        this.outer = this.add.sprite(game.config.width / 2, game.config.height / 2, "outer");
        this.pin.displayWidth = 150 * window.devicePixelRatio;
        this.pin.displayHeight = 150 * window.devicePixelRatio;
        this.circle.displayWidth = 500 * window.devicePixelRatio;
        this.circle.displayHeight = 500 * window.devicePixelRatio;
        this.outer.displayWidth = 630 * window.devicePixelRatio;
        this.outer.displayHeight = 630 * window.devicePixelRatio;
        this.pin.setInteractive();

        // this.pin.on('pointerdown', function (pointer) {
        //     this.spinWheel();
        // }, this);

        // adding the text field
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 20, "Spin the wheel", {
            font: "bold 32px Arial",
            align: "center",
            color: "white"
        });

        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.pin.on("pointerdown", this.startTheGame, this);
        // // this.input.on("pointerdown", this.spinWheel, this);)
        // if (getSlices.length == 0) {
        //     var container = document.getElementById("thegame");
        //     var content = container.innerHTML;
        //     container.innerHTML = content;
        // }
    }

    update() {
        this.showTicket.setText(`Current Ticket: ${ticket}`);
        if (getSlices.length != 0 && first) {
            first = false;
            this.createSpin();
        }
    }

    // function to spin the wheel
    spinWheel() {
        // can we spin the wheel?
        if (this.canSpin && ticket >= 1) {
            this.spinSfx.play();
            // resetting text field
            this.prizeText.setText("");

            // the wheel will spin round for some times. This is just coreography
            let rounds = Phaser.Math.Between(gameOptions.wheelRounds.min, gameOptions.wheelRounds.max);

            // get degree per slice 
            let sliceDegrees = 360 / getSlices.length;
            let slicesLength = getSlices.length;

            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            let randDegrees = Phaser.Math.Between(0, 360);
            let grandPrize = [350, 290, 250, 165]
            let degrees =
                ((randDegrees >= (sliceDegrees * (slicesLength - 1))) && (randDegrees <= (sliceDegrees * slicesLength))) ||
                ((randDegrees >= (sliceDegrees * (slicesLength - 3))) && (randDegrees <= (sliceDegrees * (slicesLength - 2)))) ||
                ((randDegrees >= (sliceDegrees * (slicesLength - 5))) && (randDegrees <= (sliceDegrees * (slicesLength - 4)))) ||
                ((randDegrees >= (sliceDegrees * (slicesLength - 7))) && (randDegrees <= (sliceDegrees * (slicesLength - 6)))) ?
                userpull % 50 == 0 ? grandPrize[Math.floor(Math.random() * grandPrize.length)] : Phaser.Math.Between(0, 150) : userpull % 50 == 0 ? grandPrize[Math.floor(Math.random() * grandPrize.length)] : randDegrees;
            console.log(`randDegrees GET = ${randDegrees}`);
            console.log(`DEGREES GET = ${degrees}`);

            // then will rotate back by a random amount of degrees
            let backDegrees = Phaser.Math.Between(gameOptions.backSpin.min, gameOptions.backSpin.max);

            // before the wheel ends spinning, we already know the prize
            let prizeDegree = 0;

            // looping through slices
            for (let i = getSlices.length - 1; i >= 0; i--) {

                // adding current slice angle to prizeDegree
                prizeDegree += (360 / getSlices.length);
                console.log(`PRIZESSSS DEGREE = ${prizeDegree}`);
                // prizeDegree += getSlices[i].degrees;

                // if it's greater than the random angle...
                if (prizeDegree > degrees - backDegrees) {

                    // we found the prize
                    console.log(`CONGRATS YOU GOT ${i}`);
                    console.log(`CONGRATS YOU GOT2 ${getSlices[i].text}`);
                    var prize = i;
                    break;
                }
            }

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel container to tween targets
                targets: [this.wheelContainer],

                // angle destination
                angle: 360 * rounds + degrees,

                // tween duration
                duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max),

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function (tween) {
                    this.spinSfx.stop();
                    // another tween to rotate a bit in the opposite direction
                    this.tweens.add({
                        targets: [this.wheelContainer],
                        angle: this.wheelContainer.angle - backDegrees,
                        duration: Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max) / 2,
                        ease: "Cubic.easeIn",
                        callbackScope: this,
                        onComplete: function (tween) {
                            // displaying prize text
                            this.prizeText.setText(getSlices[prize].text);
                            this.wheelContainer.visible = false;
                            this.pin.visible = false;
                            this.circle.visible = false;
                            this.outer.visible = false;

                            if (getSlices[prize].type != "zonk") {
                                this.drumSfx.play();
                                this.yougot.visible = true;
                                if (getSlices[prize].icon != undefined) {
                                    this.waifumu = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 20, `picture${prize}`);
                                    this.waifumu.setDisplaySize(300, 350);
                                    this.waifumu.visible = true;
                                }

                                this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `You got \n ${getSlices[prize].text}! \n Congrats :D`, {
                                    fontSize: 24 * window.devicePixelRatio,
                                    fontFamily: 'Arial Black',
                                    color: 'red',
                                    backgroundColor: 'transparent',
                                    align: 'center'
                                }).setOrigin(0.5);



                            } else {
                                this.zonkSfx.play();
                                this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `You got zonk...`, {
                                    fontSize: 24 * window.devicePixelRatio,
                                    fontFamily: 'Arial Black',
                                    color: 'red',
                                    backgroundColor: 'transparent'
                                }).setOrigin(0.5);

                            }

                            // this.restart.visible = true;
                            // player can spin again
                            this.canSpin = false;
                            this.input.on("pointerdown", this.restartGame, this);
                        }
                    })
                }
            });
        } else if (ticket < 1) {
            console.log("Out of ticket")
        }
    }

    startTheGame() {
        fetch('https://api.msportsid.com/api/game/fortunewheel/start', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }).then(res => {
            res.json().then(res2 => {
                if (res2.messege != undefined) {
                    // promt view to know your ticket insufficient
                    Android.showToast(res2.messege);
                    console.log(res2.messege);
                } else {
                    this.spinWheel();
                    ticket = res2.data[0].tiket - 1;
                    console.log("PUTAR PUTAR");
                }
            });
        });
    }

    claimPrize(idPrize) {
        fetch('https://api.msportsid.com/api/game/fortunewheel/claim', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: {
                "reward": idPrize
            }
        }).then(res => {
            res.json().then(res2 => {
                // response after claim prize

            });
        });
    }

    restartGame() {
        this.drumSfx.stop();
        this.zonkSfx.stop();
        this.scene.restart();
        this
        first = true;
    }
}