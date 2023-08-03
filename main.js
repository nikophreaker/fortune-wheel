import {
    initializeApp
} from "firebase/app";
import {
    uploadString,
    getStorage,
    uploadBytes,
    uploadBytesResumable,
    ref,
    getDownloadURL
} from "firebase/storage";
import {
    getFirestore,
    query,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    where,
    orderBy,
    limit,
    updateDoc
} from "firebase/firestore";

// CONFIGURASI FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyBdFMZoNwEWNqCOfUezoSB-TewpOBUfX98",
    authDomain: "mgoalindo---app.firebaseapp.com",
    databaseURL: "https://mgoalindo---app-default-rtdb.firebaseio.com",
    projectId: "mgoalindo---app",
    storageBucket: "mgoalindo---app.appspot.com",
    messagingSenderId: "909481590933",
    appId: "1:909481590933:web:a0626d75765bd850a5db9c",
    measurementId: "G-RLCM7JVYFY"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
// const database = getDatabase(app);

// Initialize Firestore Database and get document
const db = getFirestore(app);
const col = "luckyspin-mobile";
const col2 = "kupon-mobile";
const col3 = "prizespinwheel-mobile";
const col4 = "luckyspin-mobile-settings";
const colRef = collection(db, col);
const colRef2 = collection(db, col2);
const docRef = doc(db, col4, "1");

// the game itself
let game;
var kode;
var userpull;
var getSlices = [];
var sliceSize = [];
var settings;
var first = true;
var inresult = false;

let gameOptions;
let textStyle;
let dpr;
let scaleSprite;

const gettingData = async () => {
    // GET SLICE DATA
    const q = query(colRef, orderBy("id", "asc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        let datas = {
            id: data.id,
            startColor: data.startColor,
            endColor: data.endColor,
            rings: data.rings,
            type: data.type,
            text: data.text,
            sliceText: data.sliceText,
            icon: data.icon,
            percentage: data.percentage
        }
        getSlices.push(datas);
    });
};

const gettingSettingData = async () => {
    //Get Setting Data
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // console.log(docSnap.data())
        return docSnap.data()
    } else {
        console.log("No such Document!")
    }
}

window.onload = new Promise(() => {
    return gettingData().then(_ => {
        games()
        gettingSettingData().then( data => {
            console.log(data)
            settings = data
            document.title = data.name
        })
    })
});

// once the window loads...
const games = function () {

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
        dom: {
            createContainer: true
        },
        // game background color
        // backgroundColor: 0x560000,

        transparent: true,

        // scenes used by the game
        scene: [playGame, kuponVoucher]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame
    window.focus()
}
// Kupon Voucher scene
class kuponVoucher extends Phaser.Scene {

    // contructor
    constructor() {
        super("KuponVoucher");
    }

    init() {

        //init canvas size
        this.gameWidth = this.sys.game.scale.width;
        this.gameHeight = this.sys.game.scale.height;
        this.halfWidth = this.gameWidth / 2;
        this.halfHeight = this.gameHeight / 2;
        dpr = window.devicePixelRatio
    }

    preload() {
        this.load.image("bgDialog", "https://firebasestorage.googleapis.com/v0/b/mgoalindo---app.appspot.com/o/luckspin-mobile%2Ffieldvoucher.png?alt=media&token=5c1bb5d7-5513-4fee-8c37-69f05370c10b");
        this.load.image("okButton", "https://firebasestorage.googleapis.com/v0/b/mgoalindo---app.appspot.com/o/luckspin-mobile%2FokButton.png?alt=media&token=346ad3ee-b1b2-47dc-b880-0f08aa3d7b0d");
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
    }

    async create() {
        if (settings != undefined) {
            this.load.image("bgDialog1", settings.field_voucher)
            this.load.image("okButton1", settings.button)
        }
        if (window.mobilecheck() == 1) {
            this.add.graphics().setDepth(0).fillStyle(0x000000, 0.8).fillRect(0, 0, this.gameWidth, this.gameHeight);
            var dialogBg = this.add.sprite(this.halfWidth, this.halfHeight, "bgDialog");
            dialogBg.setScale(0.25 * dpr);
            this.inputText = this.add.rexInputText(this.halfWidth, this.halfHeight + (28 * dpr), 120 * dpr, 100 * dpr, {
                // Style properties
                align: "center",
                fontSize: `${12 * dpr}px`,
                color: '#ffffff',
                border: 0,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                outline: 'none',
                direction: 'ltr',
            });
            let inputText = this.inputText;
            this.inputText.on('textchange', function (inputs, e) {
                inputText.setText(inputs.text.toString().toUpperCase());
            }, this);
            let world = this;
            this.btnOk = this.add.sprite(this.halfWidth, this.halfHeight + (90 * dpr), "okButton");
            this.btnOk.setScale(0.25 * dpr);
            this.btnOk.setInteractive();
            this.btnOk.on("pointerover", function () {
            });
            this.btnOk.on("pointerout", function () {
            });
            this.btnOk.on("pointerdown", async function () {
                let txt = inputText.text
                // GET KODE DATA
                const q = query(colRef2, where("kode", "==", txt), where("active", "==", true));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.size == 0) {
                    alert("Kode tidak ditemukan!");
                } else {
                    querySnapshot.forEach(async (docs) => {
                        let data = docs.data();
                        const docChange = doc(db, col2, `${data.id}`);
                        await updateDoc(docChange, {
                            active: false
                        });
                        world.scene.resume("PlayGame", { txt });
                        world.scene.stop("KuponVoucher");
                    });
                }
            });
        } else {
            var dialogBg = this.add.sprite(this.halfWidth + (300 * dpr), this.halfHeight, "bgDialog");
            dialogBg.setScale(0.5);
            this.inputText = this.add.rexInputText(this.halfWidth + (300 * dpr), this.halfHeight + (55 * dpr), 300 * dpr, 100 * dpr, {
                // Style properties
                align: "center",
                fontSize: `${24 * dpr}px`,
                color: '#ffffff',
                border: 0,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                outline: 'none',
                direction: 'ltr',
            });
            let inputText = this.inputText;
            this.inputText.on('textchange', function (inputs, e) {
                inputText.setText(inputs.text.toString().toUpperCase());
            }, this);
            let world = this;
            this.btnOk = this.add.sprite(this.halfWidth + (300 * dpr), this.halfHeight + (165 * dpr), "okButton");
            this.btnOk.setScale(0.5 * dpr);
            this.btnOk.setInteractive();
            this.btnOk.on("pointerover", function () {
            });
            this.btnOk.on("pointerout", function () {
            });
            this.btnOk.on("pointerdown", async function () {
                let txt = inputText.text
                // GET KODE DATA
                const q = query(colRef2, where("kode", "==", txt), where("active", "==", true));
                const querySnapshot = await getDocs(q);
                if (querySnapshot.size == 0) {
                    alert("Kode tidak ditemukan!");
                } else {
                    querySnapshot.forEach(async (docs) => {
                        let data = docs.data();
                        const docChange = doc(db, col2, `${data.id}`);
                        await updateDoc(docChange, {
                            active: false
                        });
                        world.scene.resume("PlayGame", { txt });
                        world.scene.stop("KuponVoucher");
                    });
                }
            });
        }
    }
}

// PlayGame scene
class playGame extends Phaser.Scene {

    // constructor
    constructor() {
        super("PlayGame");
    }

    // scaling sprite atau lainnya dengan mempertahankan ratio pixel
    scaleWithRatioPixel(offset) {
        return ((1 * window.devicePixelRatio) / 4) - offset;
    }

    init(data) {
        dpr = window.devicePixelRatio;
        scaleSprite = this.scaleWithRatioPixel(0);

        window.mobilecheck = function () {
            let check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        // init canvas size
        this.gameWidth = this.sys.game.scale.width
        this.gameHeight = this.sys.game.scale.height
        this.halfWidth = this.gameWidth / 2;
        this.halfHeight = this.gameHeight / 2;
        this.kode = data.kode;
    }

    // method to be executed when the scene preloads
    preload() {
        kode = this.kode != undefined ? this.kode : "-";
        getSlices = [];
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

        userpull = 0;
        let inputImg = this;

        // setting gameOptions
        gameOptions = {
            // wheel rotation duration range, in milliseconds
            rotationTimeRange: {
                min: 2000,
                max: 2000
            },
            // wheel rounds before it stops
            wheelRounds: {
                min: 7,
                max: 9
            },
            // degrees the wheel will rotate in the opposite direction before it stops
            backSpin: {
                min: 0,
                max: 0
            },
            // wheel radius, in pixels
            wheelRadius: 200 * window.devicePixelRatio,
            // color of stroke lines
            strokeColor: 0x3D3D3D, //0xffffff,
            // width of stroke lines
            strokeWidth: 1.5 * window.devicePixelRatio
        }

        // loading pin image
        this.load.image("pin", "https://firebasestorage.googleapis.com/v0/b/mgoalindo---app.appspot.com/o/luckspin-mobile%2Fpin.png?alt=media&token=3547962a-e591-4497-86d1-49ef72914187");
        this.load.image("circle", "./img/circle.png");
        this.load.image("outer", "https://firebasestorage.googleapis.com/v0/b/mgoalindo---app.appspot.com/o/luckspin-mobile%2Fouter.png?alt=media&token=4053d615-1da2-4e0e-948a-595faf37aa55");
        this.load.image("bg", "https://firebasestorage.googleapis.com/v0/b/mgoalindo---app.appspot.com/o/luckspin-mobile%2Fbg.jpg?alt=media&token=d6ee63a7-35f6-40b2-8674-a13a5ae4c2e3");
        this.load.image("button", "./img/claim.png");
        this.load.image('yougot', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/back.jpg?token=AIEJHUX5QOTUCFFYWAEQI7265DL4U');
        this.load.image('restart', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/restart.png?token=AIEJHUTPRGASQSETEX4ABQK65CBRS');
        this.load.audio('sound', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/sound.mp3?token=AIEJHUQ3OVWNLZO3BAZOFFK65CBTI');
        this.load.audio('drum', 'https://raw.githubusercontent.com/prateeksawhney97/Spin-And-Win-Game-JavaScript/master/Assets/drum.mp3?token=AIEJHUWNNKXYQMDHCQ6MOES65CBYE');
        this.load.audio('zonk', './sounds/oof.mp3');
        this.load.audio('spin', './sounds/spinsound.mp3');
        this.load.spritesheet('handcursor', './img/handcursorsprite.png', {
            frameWidth: 480,
            frameHeight: 480,
            startFrame: 0,
            endFrame: 17
        });
    }

    // method to be executed once the scene has been created
    async create() {
        this.canSpin = false;
        this.scale.displaySize.setAspectRatio(window.innerWidth / window.innerHeight);
        this.scale.refresh();
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;
        const bg = this.add.image(0, 0, "bg").setOrigin(0);
        bg.setScale(Math.max(cameraWidth / bg.width, cameraHeight / bg.height));

        var world = this;
        this.events.on("resume", (scene, data) => {
            this.showTicket.setText(`Current Kode: ${data.txt}`);
            world.kuponData = data.txt;
            if (world.wheelContainer != undefined && (window.mobilecheck() != 1)) {
                world.tweens.add({
                    targets: [world.wheelContainer, world.circle, world.pin, world.outer], x: world.halfWidth, duration: 1500, ease: 'Power3',
                    onComplete: function () {
                        let animConfig = {
                            key: "hand",
                            frames: world.anims.generateFrameNumbers("handcursor"),
                            frameRate: 12,
                            repeat: -1,
                        };
                        world.anims.create(animConfig);

                        // display the sprite
                        world.hand = world.add.sprite(world.halfWidth, world.halfHeight, 'handcursor');
                        world.hand.anims.play("hand");
                        world.canSpin = true;
                    }
                });
            } else if (world.wheelContainer != undefined && (window.mobilecheck() == 1)) {
                let animConfig = {
                    key: "hand",
                    frames: world.anims.generateFrameNumbers("handcursor"),
                    frameRate: 12,
                    repeat: -1,
                };
                world.anims.create(animConfig);

                // display the sprite
                world.hand = world.add.sprite(world.halfWidth, world.halfHeight, 'handcursor');
                world.hand.anims.play("hand");
                world.canSpin = true;
            } else {
                console.log("ups something wrong");
            }
        }, this);

        // GET LEADERBOARD DATA (Highest Score)
        const q = query(colRef, orderBy("id", "asc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let datas = {
                id: data.id,
                startColor: data.startColor,
                endColor: data.endColor,
                rings: data.rings,
                type: data.type,
                text: data.text,
                sliceText: data.sliceText,
                icon: data.icon,
                percentage: data.percentage
            }
            getSlices.push(datas);
        });

        // For load image from array getSlice[i].icon
        if (getSlices.length != 0) {
            for (let i = 0; i < getSlices.length; i++) {
                if (getSlices[i].icon != undefined) {
                    this.load.image(`pictures${i}`, getSlices[i].icon);
                }
            }
        }

        this.drumSfx = this.sound.add('drum');
        this.zonkSfx = this.sound.add('zonk');
        this.spinSfx = this.sound.add('spin');
        this.yougot = this.add.sprite(600, 600, 'yougot');
        this.yougot.visible = false;
        this.restart = this.add.sprite(400, 170, 'restart').setScale(0.30);
        this.restart.visible = false;
        this.showTicket = this.add.text(20, 20, `Current Kode: ${kode}`, {
            fontSize: 20 * window.devicePixelRatio,
            fontStyle: "bold",
            fontFamily: "Arial Black"
        });
        this.showTicket.visible = true;
    }

    createSpin() {
        // starting degrees
        let startDegrees = -90;

        // making a graphic object without adding it to the game
        let graphics = this.make.graphics({
            x: 0,
            y: 0,
            add: false,
        });

        // if (window.mobilecheck() == 1) {
        //     console.log("true");
        // } else {
        //     console.log("false");
        // }

        // adding a container to group wheel and icons
        this.wheelContainer = window.mobilecheck() == 1 ? this.add.container(game.config.width / 2, game.config.height / 2) : this.add.container(this.halfWidth - (200 * dpr), game.config.height / 2);

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

                let slice = {
                    startAngle: startDegrees + 90,
                    endAngle: (startDegrees + 90) + (360 / getSlices.length),
                    precentage: getSlices[i].percentage,
                }
                sliceSize.push(slice);
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
            if (getSlices[i].icon != undefined) {

                // icon image
                // let icon = this.add.image(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), 'icons', getSlices[i].iconFrame);
                let icon = this.add.image(gameOptions.wheelRadius * 0.60 * Math.cos(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), gameOptions.wheelRadius * 0.60 * Math.sin(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), `pictures${i}`);
                
                // let icons = this.add.image(500, 100, `pictures1`);
                // console.log("test");
                // console.log(icon);
                // scaling the icon according to game preferences
                icon.scaleX = 0.07 * window.devicePixelRatio; //getSlices[i].iconScale; //0.1 without text
                icon.scaleY = 0.07 * window.devicePixelRatio; //getSlices[i].iconScale; //0.1 without text

                // rotating the icon
                icon.angle = startDegrees + (360 / getSlices.length) / 2 + 90;
                // icon.angle = startDegrees + getSlices[i].degrees / 2 + 90;

                // add icon to iconArray
                iconArray.push(icon);

                // // retexture without text
                // this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                //     // texture loaded so use instead of the placeholder
                //     iconArray[i].setTexture(`pictures${i}`)
                // });

                // retexture with text
                this.load.once(Phaser.Loader.Events.COMPLETE, () => {
                    // texture loaded so use instead of the placeholder
                    iconArray[i+i].setTexture(`pictures${i}`)
                });

                this.load.removeListener('progress');
                this.load.start();
            }

            // // add slice text, if any
            if (getSlices[i].sliceText != undefined) {

                textStyle = {
                    fontFamily: "Arial Black",
                    fontSize: 12 * window.devicePixelRatio,
                    fontStyle: "normal",
                    align: "center",
                    wordWrap: { width: (3.14 * gameOptions.wheelRadius) / getSlices.length, useAdvancedWrap: true },
                }

            //     // the text
                let text = this.add.text(gameOptions.wheelRadius * 0.82 * Math.cos(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), gameOptions.wheelRadius * 0.82 * Math.sin(Phaser.Math.DegToRad(startDegrees + (360 / getSlices.length) / 2)), getSlices[i].sliceText, textStyle);
            //     // let text = this.add.text(gameOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), gameOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + getSlices[i].degrees / 2)), getSlices[i].sliceText, getSlices[i].sliceTextStyle);
               
            //     // set text origin to its center
                text.setOrigin(0.5);

                //fix blurry text
                text.setResolution(10);

            //     // set text angle
                text.angle = startDegrees + (360 / getSlices.length) / 2 + 90;
            //     // text.angle = startDegrees + getSlices[i].degrees / 2 + 90;

            //     // stroke text, if required
            //     if (getSlices[i].sliceTextStroke && getSlices[i].sliceTextStrokeColor) {
            //         text.setStroke(getSlices[i].sliceTextStrokeColor, getSlices[i].sliceTextStroke);
            //     }

            //     // add text to iconArray
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
        this.circle = window.mobilecheck() == 1 ? this.add.sprite(game.config.width / 2, game.config.height / 2, "circle") : this.add.sprite(this.halfWidth - (200 * dpr), game.config.height / 2, "circle");
        this.pin = window.mobilecheck() == 1 ? this.add.sprite(game.config.width / 2, game.config.height / 2, "pin") : this.add.sprite(this.halfWidth - (200 * dpr), game.config.height / 2, "pin");
        this.outer = window.mobilecheck() == 1 ? this.add.sprite(this.halfWidth - (5 * dpr), this.halfHeight + (5 * dpr), "outer") : this.add.sprite(this.halfWidth - (200 * dpr), this.halfHeight + (5 * dpr), "outer");
        // old2 // this.outer = window.mobilecheck() == 1 ? this.add.sprite(this.halfWidth - (20 * dpr), this.halfHeight + (10 * dpr), "outer") : this.add.sprite(this.halfWidth - (225 * dpr), this.halfHeight + (10 * dpr), "outer");
        
        this.pin.displayWidth = 150 * window.devicePixelRatio;
        this.pin.displayHeight = 150 * window.devicePixelRatio;
        this.circle.displayWidth = 500 * window.devicePixelRatio;
        this.circle.displayHeight = 500 * window.devicePixelRatio;
        this.outer.displayWidth = 460 * window.devicePixelRatio; //550 (old2)
        this.outer.displayHeight = 460 * window.devicePixelRatio; //550 (old2)
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
        // this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.pin.on("pointerdown", this.spinWheel, this);

        this.scene.pause("PlayGame");
        this.scene.launch("KuponVoucher");
        // // this.input.on("pointerdown", this.spinWheel, this);)
        // if (getSlices.length == 0) {
        //     var container = document.getElementById("thegame");
        //     var content = container.innerHTML;
        //     container.innerHTML = content;
        // }
    }

    update() {
        if (this.showTicket != undefined) {
            // this.showTicket.setText(`Current Ticket: ${ticket}`);
        }
        if (getSlices.length != 0 && first) {
            first = false;
            this.createSpin();
        }
    }

    // function to spin the wheel
    async spinWheel() {
        this.hand.setVisible(false);
        // can we spin the wheel?
        if (this.canSpin) {

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            this.spinSfx.play();
            // resetting text field
            this.prizeText.setText("");

            // the wheel will spin round for some times. This is just coreography
            let rounds = Phaser.Math.Between(gameOptions.wheelRounds.min, gameOptions.wheelRounds.max);

            // get degree per slice 
            let sliceDegrees = 360 / getSlices.length;
            let slicesLength = getSlices.length;

            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            // let randDegrees = Phaser.Math.Between(0, 360);
            let grandPrize = [350, 290, 250, 165];
            // let degrees = Math.floor(Math.random() * 360);

            // algorithm for precentage
            var array = [];
            for (var i = 0; i < sliceSize.length; i++) {
                var item = sliceSize[i];
                var chance = sliceSize[i].precentage / 10;
                for (var j = 0; j < chance; j++) {
                    array.push(item);
                }
            }
            var idx = Math.floor(Math.random() * array.length);
            // let randDegrees = Phaser.Math.Between(array[idx].startAngle, array[idx].endAngle - 1);
            let randDegrees = array[idx].startAngle + ((360 / getSlices.length) / 2);
            // let degrees = Phaser.Math.Between(array[idx].startAngle, array[idx].endAngle);
            // let degrees = Math.floor(Math.random() * array[idx].endAngle);

            // console.log(setsat[Math.floor(Math.random() * setsat.length)]);
            // sliceSize.forEach((el, idx) => {
            //     console.log(el);
            // if (el.startAngle <= ((setsat[idx] / 100) * 360) && el.endAngle > ((setsat[idx] / 100) * 360)) {
            //     console.log(setsat[idx]);
            //     randDegrees = Phaser.Math.Between(el.startAngle, el.endAngle);
            // }
            // });
            // let degrees =
            //     ((randDegrees >= (sliceDegrees * (slicesLength - 1))) && (randDegrees <= (sliceDegrees * slicesLength))) ||
            //         ((randDegrees >= (sliceDegrees * (slicesLength - 3))) && (randDegrees <= (sliceDegrees * (slicesLength - 2)))) ||
            //         ((randDegrees >= (sliceDegrees * (slicesLength - 5))) && (randDegrees <= (sliceDegrees * (slicesLength - 4)))) ||
            //         ((randDegrees >= (sliceDegrees * (slicesLength - 7))) && (randDegrees <= (sliceDegrees * (slicesLength - 6)))) ?
            //         userpull % 50 == 0 ? grandPrize[Math.floor(Math.random() * grandPrize.length)] : Phaser.Math.Between(0, 150) : userpull % 50 == 0 ? grandPrize[Math.floor(Math.random() * grandPrize.length)] : randDegrees;
            // console.log(`randDegrees GET = ${randDegrees}`);
            // console.log(`DEGREES GET = ${degrees}`);

            // then will rotate back by a random amount of degrees
            // let backDegrees = Phaser.Math.Between(gameOptions.backSpin.min, gameOptions.backSpin.max);

            // before the wheel ends spinning, we already know the prize
            let prizeDegree = 0;

            // looping through slices
            for (let i = 0; i <= getSlices.length - 1; i++) {
                // for (let i = getSlices.length - 1; i >= 0; i--) {

                // adding current slice angle to prizeDegree
                prizeDegree += (360 / getSlices.length);
                // console.log(`PRIZESSSS DEGREE = ${prizeDegree}`);
                // prizeDegree += getSlices[i].degrees;

                // if it's greater than the random angle...
                if (prizeDegree > randDegrees) {
                    // if (prizeDegree > degrees - backDegrees) {

                    // we found the prize
                    // console.log(`CONGRATS YOU GOT ${i}`);
                    // console.log(`CONGRATS YOU GOT2 ${getSlices[i].text}`);
                    var prize = i;

                    // dapatkan waktu dalam indonesia
                    var date = new Date();
                    var tahun = date.getFullYear();
                    var bulan = date.getMonth();
                    var tanggal = date.getDate();
                    var hari = date.getDay();
                    var jam = date.getHours();
                    var menit = date.getMinutes();
                    var detik = date.getSeconds();
                    switch (hari) {
                        case 0: hari = "Minggu"; break;
                        case 1: hari = "Senin"; break;
                        case 2: hari = "Selasa"; break;
                        case 3: hari = "Rabu"; break;
                        case 4: hari = "Kamis"; break;
                        case 5: hari = "Jum'at"; break;
                        case 6: hari = "Sabtu"; break;
                    }
                    switch (bulan) {
                        case 0: bulan = "Januari"; break;
                        case 1: bulan = "Februari"; break;
                        case 2: bulan = "Maret"; break;
                        case 3: bulan = "April"; break;
                        case 4: bulan = "Mei"; break;
                        case 5: bulan = "Juni"; break;
                        case 6: bulan = "Juli"; break;
                        case 7: bulan = "Agustus"; break;
                        case 8: bulan = "September"; break;
                        case 9: bulan = "Oktober"; break;
                        case 10: bulan = "November"; break;
                        case 11: bulan = "Desember"; break;
                    }
                    var tampilTanggal = "Tanggal: " + hari + ", " + tanggal + " " + bulan + " " + tahun;
                    var tampilWaktu = "Jam: " + jam + ":" + menit + ":" + detik;
                    // Add a new document in collection "cities"
                    await addDoc(collection(db, col3), {
                        kupon: this.kuponData,
                        prize: getSlices[i].text,
                        tanggal: tampilTanggal,
                        waktu: tampilWaktu
                    });
                    break;
                }
            }

            //initiate scene
            let worlds = this;
            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel container to tween targets
                targets: [this.wheelContainer],

                // angle destination
                angle: 360 * rounds - randDegrees,

                // tween duration
                duration: 11000, //Phaser.Math.Between(gameOptions.rotationTimeRange.min, gameOptions.rotationTimeRange.max),

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function (tween) {
                    // another tween to rotate a bit in the opposite direction
                    this.tweens.add({
                        targets: [this.wheelContainer],
                        angle: this.wheelContainer.angle, //- backDegrees,
                        duration: 0,
                        ease: "Cubic.easeOut",
                        callbackScope: this,
                        onComplete: function (tween) {
                            this.spinSfx.stop();
                            // displaying prize text
                            this.prizeText.setText(getSlices[prize].text);
                            this.wheelContainer.visible = false;
                            this.pin.visible = false;
                            this.circle.visible = false;
                            this.outer.visible = false;

                            if (getSlices[prize].text != "ZONK") {
                                this.drumSfx.play();
                                this.yougot.visible = true;
                                if (getSlices[prize].icon != undefined) {
                                    this.waifumu = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 20, `pictures${prize}`);
                                    let scaling = window.mobilecheck() == 1 ? 0.2 * dpr : 0.4 * dpr;
                                    this.waifumu.setScale(scaling);
                                    // this.waifumu.setDisplaySize(300, 350);
                                    this.waifumu.visible = true;
                                    this.claimButton = this.add.sprite(this.waifumu.x, this.waifumu.y + 350, 'button');
                                    this.claimButton.setInteractive();
                                    this.claimButton.on("pointerover", function () {
                                    });
                                    this.claimButton.on("pointerout", function () {
                                    });
                                    this.claimButton.on("pointerdown", function () {
                                        worlds.claimPrize(prize, worlds.kuponData)
                                    });
                                }

                                // this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `You got \n ${getSlices[prize].text}! \n Congrats :D`, {
                                //     fontSize: 24 * window.devicePixelRatio,
                                //     fontFamily: 'Arial Black',
                                //     color: 'red',
                                //     backgroundColor: 'transparent',
                                //     align: 'center'
                                // }).setOrigin(0.5);
                            } else {
                                this.zonkSfx.play();
                                this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `You got zonk...`, {
                                    fontSize: 24 * window.devicePixelRatio,
                                    fontFamily: 'Arial Black',
                                    color: 'red',
                                    backgroundColor: 'transparent'
                                }).setOrigin(0.5);

                            }

                            // const barScene = this.scene.get('PlayGame');

                            // barScene.events.once('destroy', function () {
                            //     console.log("destroy");
                            //     worlds.scene.add('PlayGame', this, true);
                            // }, this);
                            // barScene.events.once('remove', function () {
                            //     console.log("remove");
                            //     worlds.scene.add('PlayGame', this, true);
                            // }, this);

                            // this.restart.visible = true;
                            // player can spin again
                            this.canSpin = false;
                            // this.input.on("pointerdown", this.restartGame, this);
                        }
                    })
                }
            });
        }
    }

    async startTheGame(kode) {
        // fetch('https://api.msportsid.com/api/game/fortunewheel/start', {
        //     method: 'get',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${userToken}`
        //     }
        // }).then(res => {
        //     res.json().then(res2 => {
        //         if (res2.messege != undefined) {
        //             // promt view to know your ticket insufficient
        //             Android.showToast(res2.messege);
        //             console.log(res2.messege);
        //         } else {
        //             this.spinWheel();
        //             ticket = res2.data[0].tiket - 1;
        //             console.log("PUTAR PUTAR");
        //         }
        //     });
        // });

        // if (ticket != undefined) {
        //     ticket = ticket - 1
        // }
    }
    
    exportCanvasAsPNG(fileName, dataUrl) {
        // var canvasElement = document.getElementById(id);
        var MIME_TYPE = "image/png";
        var imgURL = dataUrl;
        var dlLink = document.createElement('a');
        dlLink.download = fileName;
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);

        // Data URL string
        var time = Date.now().toString();
        const storage = getStorage();
        const storageRef = ref(storage, `ssPrize/${time}.png`);
        uploadString(storageRef, imgURL, 'data_url').then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
            });
        });
    }

    claimPrize(idPrize, kode) {
        // Build formData object.
        let world = this;
        let formData = new FormData();
        formData.append('reward', `${idPrize}`);
        this.game.renderer.snapshot(function (image) {
            image.style.width = '160px';
            image.style.height = '120px';
            image.style.paddingLeft = '2px';
            document.body.appendChild(image);
            // scene.exportCanvasAsPNG('snapshot', image.src);
            // Data URL string
            var time = Date.now().toString();
            const storage = getStorage();
            const storageRef = ref(storage, `ssPrize/${time}.png`);
            uploadString(storageRef, image.src, 'data_url').then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    var msg = `Saya Mendapatkan *${getSlices[idPrize].text}* dari M88Spin dengan kode voucher *${kode}* \n\n${downloadURL}`;
                    // var url = 'https://t.me/+6281288522088'; //tele
                    if (settings.numberphone != undefined) {
                        var url = `https://wa.me/?phone=${settings.numberphone}&text=` + encodeURIComponent(msg); // wa
                        navigator.clipboard.writeText(msg);
                        // alert(msg);

                        var s = window.open(url, '_blank');

                        if (s && s.focus) {
                            s.focus();
                        }
                        else if (!s) {
                            window.location.href = url;
                        }
                    }
                });
            });
        });
        // fetch('https://api.msportsid.com/api/game/fortunewheel/claim', {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //         'Authorization': `Bearer ${userToken}`
        //     },
        //     body: formData
        // }).then(res => {
        //     res.json().then(res2 => {
        //         // response after claim prize

        //         console.log(res2);
        //     });
        // });
    }

    restartGame() {
        this.drumSfx.stop();
        this.zonkSfx.stop();
        this.scene.restart();

        // this
        first = true;
    }
}