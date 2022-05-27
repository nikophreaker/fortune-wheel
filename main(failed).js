let game
let attempts
var diluc
var ganyu
var keqing
var mona
var qiqi
var venti
var zhongli
var baal

let listDegrees = [90, 60, 30, 100, 60, 30, 60, 30]

// Setelah index html di muat
window.onload = function () {
    // konfigurasi
    const gameConfig = {
        autoStart: true,
        scene: {
            preload: preload,
            create: create
        },

        // resolution in px dan scale
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'canvas',
            width: 600,
            height: 800
        },
        dom: {
            createContainer: true
        },

        //game background
        backgroundColor: 0x000000
    }

    // game constructor
    game = new Phaser.Game(gameConfig)

    // pure javascript to give focus to page/frame
    window.focus()
}

function preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            fill: '#ffffff'
        }
    });

    var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            fill: '#ffffff'
        }
    });

    percentText.setOrigin(0.5, 0.5);
    loadingText.setOrigin(0.5, 0.5);

    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(250, 280, 300 * value, 30);
        percentText.setText(parseInt(value * 100) + '%');
    });

    this.load.on('fileprogress', function (file) {

    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
    });

    this.load.image('diluc', '/img/diluc.png');
    this.load.image('ganyu', '/img/ganyu.png');
    this.load.image('keqing', '/img/keqing.png');
    this.load.image('mona', '/img/mona.png');
    this.load.image('qiqi', '/img/qiqi.png');
    this.load.image('venti', '/img/venti.png');
    this.load.image('zhongli', '/img/zhongli.png');
    this.load.image('baal', '/img/baal.png');
}

function create() {
    diluc = this.add.sprite(0, 0, 'diluc');
    ganyu = this.add.sprite(0, 0, 'ganyu');
    keqing = this.add.sprite(0, 0, 'keqing');
    mona = this.add.sprite(0, 0, 'mona');
    qiqi = this.add.sprite(0, 0, 'qiqi');
    venti = this.add.sprite(0, 0, 'venti');
    zhongli = this.add.sprite(0, 0, 'zhongli');
    baal = this.add.sprite(0, 0, 'baal');

    const wheelOptions = {

        // slices configuration
        slices: [{
                degrees: listDegrees[0],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: diluc,
                iconScale: 0.3,
                text: 'Diluc',
                enabled: true
            },
            {
                degrees: listDegrees[1],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: ganyu,
                iconScale: 0.3,
                text: 'Ganyu',
                enabled: true
            },
            {
                degrees: listDegrees[2],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: keqing,
                iconScale: 0.3,
                text: 'Keqing',
                enabled: true
            },
            {
                degrees: listDegrees[3],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: mona,
                iconScale: 0.3,
                text: 'Mona',
                enabled: true
            },
            {
                degrees: listDegrees[4],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: qiqi,
                iconScale: 0.3,
                text: 'Qiqi',
                enabled: true
            },
            {
                degrees: listDegrees[5],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: venti,
                iconScale: 0.3,
                text: 'Venti',
                enabled: true
            },
            {
                degrees: listDegrees[6],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: zhongli,
                iconScale: 0.3,
                text: 'Zhongli',
                enabled: true
            },
            {
                degrees: listDegrees[7],
                startColor: 0xadebeb,
                endColor: 0x1f7a7a,
                rings: 200,
                icon: baal,
                iconScale: 0.3,
                text: 'Baal',
                enabled: true
            },
        ],

        // estimasi durasi roda dalam milisecond
        rotationTimeRange: {
            min: 3000,
            max: 4500
        },

        // roda berputar sebelum berhenti
        wheelRounds: {
            min: 6,
            max: 16
        },

        // derajat roda akan berputar ke arah yang berlawanan sebelum berhenti
        backSpin: {
            min: 6,
            max: 16
        },

        // radius roda dalam pixels
        wheelRadius: 250,

        // warna garis tepi
        strokeColor: 0xffffff,

        // lebar garis tepi
        strokeWidth: 2
    }

    // mulai dari derajat
    let startDegrees = -90

    // buat grafik objek tanpa menambahkan ke game
    const graphics = this.make.graphics({
        x: 0,
        y: 0,
        add: false
    })

    // array yang mengandung derajat yang diperbolehkan
    this.allowedDegrees = []

    // tambah kontainer ke grup roda dan ikon
    this.wheelContainer = this.add.container(950, 300)

    // array yang akan ber isi semua ikon
    const iconArray = []

    // perulangan melalui tiap potong
    for (let i = 0; i < wheelOptions.slices.length; i++) {
        // jika irisan diaktifkan, itu jika hadiahnya dapat dimenangkan
        if (wheelOptions.slices[i].enabled) {
            // .... kami memasukkan semua derajat irisan ke dalam array AllowDegrees
            for (let j = 0; j < wheelOptions.slices[i].degrees; j++) {
                this.allowedDegrees.push(270 - startDegrees - j)
            }
        }

        // konversi warna dari 0xRRGGBB format ke warna objek
        const startColor = Phaser.Display.Color.ValueToColor(wheelOptions.slices[i].startColor)
        const endColor = Phaser.Display.Color.ValueToColor(wheelOptions.slices[i].endColor)

        for (let j = wheelOptions.slices[i].rings; j > 0; j--) {
            // interpolate warna
            const ringColor = Phaser.Display.Color.Interpolate.ColorWithColor(startColor, endColor, wheelOptions.slices[i].rings, j)

            // konversi interpolasi warna ke 0xRRGGBB format
            const ringColorString = Phaser.Display.Color.RGBToString(Math.round(ringColor.r), Math.round(ringColor.g), Math.round(ringColor.b), 0, "0x")

            // setting fill style
            graphics.fillStyle(+ringColorString, 1)

            // gambar potongan
            graphics.slice(wheelOptions.wheelRadius + wheelOptions.strokeWidth, wheelOptions.wheelRadius + wheelOptions.strokeWidth, j * wheelOptions.wheelRadius / wheelOptions.slices[i].rings, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + wheelOptions.slices[i].degrees), false)

            graphics.fillPath()
        }

        // setting garis style
        graphics.lineStyle(wheelOptions.strokeWidth, wheelOptions.strokeColor, 1)

        // gambar potongan yang besar
        graphics.slice(wheelOptions.wheelRadius + wheelOptions.strokeWidth, wheelOptions.wheelRadius + wheelOptions.strokeWidth, wheelOptions.wheelRadius, Phaser.Math.DegToRad(startDegrees), Phaser.Math.DegToRad(startDegrees + wheelOptions.slices[i].degrees), false)

        // garis tepi potongan
        graphics.strokePath()

        // tambah icon, jika ada
        if (wheelOptions.slices[i].icon != undefined) {
            // gambar icon
            const icon = this.add.image(wheelOptions.wheelRadius * 0.75 * Math.cos(Phaser.Math.DegToRad(startDegrees + wheelOptions.slices[i].degrees / 2), wheelOptions.wheelRadius * 0.75 * Math.sin(Phaser.Math.DegToRad(startDegrees + wheelOptions.slices[i].degrees / 2)), 'icons', wheelOptions.slices[i].icon))

            // skalakan ikon sesuai dengan preferensi game
            icon.scaleX = wheelOptions.slices[i].iconScale
            icon.scaleY = wheelOptions.slices[i].iconScale

            // rotasi icon
            icon.angle = startDegrees + wheelOptions.slices[i].degrees / 2 + 90

            // tambah icon ke iconArray
            iconArray.push(icon)
        }

        // update degrees
        startDegrees += wheelOptions.slices[i].degrees
    }

    // generate texture "wheel" daru grafik data
    graphics.generateTexture('wheel', (wheelOptions.wheelRadius + wheelOptions.strokeWidth) * 2, (wheelOptions.wheelRadius + wheelOptions.strokeWidth) * 2)

    // membuat sprite dengan gambar roda jika gambar sudah preload
    const wheel = this.add.sprite(0, 0, 'wheel')

    // tambahkan wheel ke kontainer
    this.wheelContainer.add(wheel)

    // tambahkan semuan iconArray item ke container
    this.wheelContainer.add(iconArray)

    // tambahkan pin di tengah kanvas
    this.pin = this.add.sprite(950, 300, 'pin')
    this.pin.setScale(0.1, 0.1)
}