/**
 * WCLN.ca
 * Hockey Matchup
 * @author Shaun Agostinho (shaunagostinho@gmail.com)
 * Febuary 2020 (Whoops, this shouldn't have taken so long, darn college is so busy.)
 */

let FPS = 24;
let gameStarted = false;
let STAGE_WIDTH, STAGE_HEIGHT;
let stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas

// bitmap letiables
let background;
let startScreen, endScreen;

//mute
let muted;
let mute, unmute;

//vocabulary config
let json = {
    vocabulary: [
        {
            word: "potato",
            definition: "ground thing like apple but ground"
        },
        {
            word: "apple",
            definition: "like a tree potato"
        }
    ]
};

/*
 * Called by body onload
 */
function init() {
    STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
    STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

    // init state object
    stage.mouseEventsEnabled = true;
    stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

    setupManifest(); // preloadJS
    startPreload();

    gameStarted = false;

    stage.update();
}

function playSound(id) {
    if (muted == false) {
        createjs.Sound.play(id);
    }
}

function toggleMute() {

    if (muted == true) {
        muted = false;
    } else {
        muted = true;
    }

    if (muted == true) {
        stage.addChild(unmute);
        stage.removeChild(mute);
    } else {
        stage.addChild(mute);
        stage.removeChild(unmute);
    }
}

function initMuteUnMute() {
    var hitArea = new createjs.Shape();
    hitArea.graphics.beginFill("#000").drawRect(0, 0, mute.image.width, mute.image.height);
    mute.hitArea = unmute.hitArea = hitArea;

    mute.x = unmute.x = STAGE_WIDTH - (mute.image.width * 1.5);
    mute.y = unmute.y = STAGE_HEIGHT - (mute.image.height * 1.5);

    mute.cursor = "pointer";
    unmute.cursor = "pointer";

    mute.on("click", toggleMute);
    unmute.on("click", toggleMute);

    stage.addChild(mute);
}

function startPreload() {
    let preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

// not currently used as load time is short
function handleFileProgress(event) {
    /*progressText.text = (preload.progress*100|0) + " % Loaded";
    progressText.x = STAGE_WIDTH/2 - progressText.getMeasuredWidth() / 2;
    stage.update();*/
}

/**
 * Update the stage. (Tween Ticker)
 *
 * @param event
 */

function update(event) {
    stage.update(event);
}

function setupManifest() {
    manifest = [
        {
            src: "img/bg.png",
            id: "background"
        },
        {
            src: "img/startscreen.png",
            id: "startscreen"
        },
        {

            src: "img/unmute.png",
            id: "mute"
        },
        {
            src: "img/mute.png",
            id: "unmute"
        }
    ];
}

function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
    if (event.item.id == "background") {
        background = new createjs.Bitmap(event.result);
    }
    if (event.item.id == "startscreen") {
        startScreen = new createjs.Bitmap(event.result);
    }
    if (event.item.id.startsWith("mute")) {
        mute = new createjs.Bitmap(event.result);
    }
    if (event.item.id.startsWith("unmute")) {
        unmute = new createjs.Bitmap(event.result);
    }
}

function loadError(evt) {
    console.log("Error!", evt.text);
}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    createjs.Ticker.setFPS(FPS);
    createjs.Ticker.addEventListener("tick", update); // call update function

    stage.addChild(background);
    stage.addChild(startScreen);
    startScreen.on("click", function (event) {
        startGame(event);
        stage.removeChild(startScreen);
        initMuteUnMute();
    });
}

function startGame() {
    gameStarted = true;

    /** Below this is actual game code. **/

    drawBoxes();

}

/** START GAME CODE **/

let vocabBoxes = [];
let definitionBoxes = [];

function drawBoxes() {

    length = 300;
    sideGap = 20;
    height = 55;
    verticalGap = 20;

    boxCount = 6;

    //vocab boxes
    for (let i = 0; i < boxCount; i++) {
        vocabBoxes[i] = new createjs.Shape();

        vocabBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
            sideGap, 100 + (verticalGap * i) + (i * height), length, height,
            10, 10, 10, 10);
        stage.addChild(vocabBoxes[i]);
    }

    //definition boxes
    for (let i = 0; i < boxCount; i++) {
        definitionBoxes[i] = new createjs.Shape();

        definitionBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
            STAGE_WIDTH - (length + sideGap),
            100 + (verticalGap * i) + (i * height), length, height,
            10, 10, 10, 10);
        stage.addChild(definitionBoxes[i]);
    }
}


/** END GAME CODE **/

function endGame() {
    gameStarted = false;

    /** Below this is actual game code. **/
}