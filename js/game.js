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
        },
        {
            word: "grape",
            definition: "lil ting that grows on a vine"
        },
        {
            word: "minecraft",
            definition: "lego but virtual"
        },
        {
            word: "cisco",
            definition: "large company that makes the internet run"
        },
        {
            word: "target",
            definition: "used for playing the game called darts bloop bleep blah glah glewe"
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


// Box Settings
let length = 300;
let sideGap = 20;
let height = 55;
let verticalGap = 20;
let boxCount = 6; // 6 fits perfectly so this will be the actual maximum

let vocabList = [];
let definitionsList = [];

function shuffleLists() {
    for (let i = 0; i < json.vocabulary.length; i++) {
        vocabList.push(json.vocabulary[i].word);
        definitionsList.push(json.vocabulary[i].definition);
    }

    vocabList = shuffle(vocabList);
    definitionsList = shuffle(definitionsList);
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Draw the vocab boxes
 *
 */

function drawBoxes() {

    if (json.vocabulary.length < 6) {
        boxCount = json.vocabulary.length;
    }

    //vocab boxes
    for (let i = 0; i < boxCount; i++) {
        vocabBoxes[i] = new createjs.Shape();

        vocabBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
            sideGap, 100 + (verticalGap * i) + (i * height), length, height,
            10, 10, 10, 10);

        stage.addChild(vocabBoxes[i]);

        vocabBoxes[i].on("click", function (event) {
            clickVocabBox(event);
        });
    }

    //definition boxes
    for (let i = 0; i < boxCount; i++) {
        definitionBoxes[i] = new createjs.Shape();

        definitionBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
            STAGE_WIDTH - (length + sideGap),
            100 + (verticalGap * i) + (i * height), length, height,
            10, 10, 10, 10);
        stage.addChild(definitionBoxes[i]);

        definitionBoxes[i].on("click", function (event) {
            clickDefinitionBox(event);
        });
    }

    drawBoxText();
}

let vocabBoxText = [];
let definitionBoxText = [];

function drawBoxText() {
    shuffleLists();

    //vocab boxes
    for (let i = 0; i < boxCount; i++) {

        let textSize = 24;
        let fakeTextForSizing = new createjs.Text(vocabList[i], textSize + "px Comic Sans MS", "#FFFFFF");
        while (fakeTextForSizing.getMeasuredWidth() >= length - sideGap * 2) {
            textSize -= 1;
            fakeTextForSizing = new createjs.Text(vocabList[i], textSize + "px Comic Sans MS", "#FFFFFF");
        }

        vocabBoxText[i] = new createjs.Text(vocabList[i], textSize + "px Comic Sans MS", "#000");
        vocabBoxText[i].textBaseline = "alphabetic";
        vocabBoxText[i].textAlign = 'center';
        vocabBoxText[i].x = vocabBoxes[i].graphics.command.x + length / 2;
        vocabBoxText[i].y = vocabBoxes[i].graphics.command.y + height / 2 + vocabBoxText[i].getMeasuredHeight() / 4;

        stage.addChild(vocabBoxText[i]);
    }

    //definition boxes
    for (let i = 0; i < boxCount; i++) {

        let newDefinitionText = "";
        let splitLength = definitionsList[i].split(" ").length;
        console.log(splitLength);
        for (let def = 0; def < splitLength; def++) {
            if (def !== parseInt(definitionsList[i].split(" ").length / 2)) {
                newDefinitionText += definitionsList[i].split(" ")[def] + " ";
            } else {
                newDefinitionText += definitionsList[i].split(" ")[def] + "\n";
            }
        }

        let textSize = 22;
        let fakeTextForSizing = new createjs.Text(
            newDefinitionText != "" ? newDefinitionText :
                definitionsList[i], textSize + "px Comic Sans MS", "#FFFFFF");
        while (fakeTextForSizing.getMeasuredWidth() >= length + sideGap * 6.5) {
            textSize -= 1;
            fakeTextForSizing = new createjs.Text(
                newDefinitionText != "" ? newDefinitionText :
                    definitionsList[i], textSize + "px Comic Sans MS", "#FFFFFF");
        }

        console.log(newDefinitionText);

        definitionBoxText[i] = new createjs.Text(
            newDefinitionText != "" ? newDefinitionText :
                definitionsList[i], textSize + "px Comic Sans MS", "#000");
        definitionBoxText[i].textBaseline = "alphabetic";
        definitionBoxText[i].textAlign = 'center';
        definitionBoxText[i].x = definitionBoxes[i].graphics.command.x + length / 2;
        definitionBoxText[i].y = definitionBoxes[i].graphics.command.y + height / 2
            + (newDefinitionText != "" ? -definitionBoxText[i].getMeasuredHeight() / 8 : definitionBoxText[i].getMeasuredHeight() / 4);

        stage.addChild(definitionBoxText[i]);
    }
}

let matchedBoxes = {
    matched:
        []
};

/**
 * Check if a vocab and definition already are matched
 * To check one of them, set the other as null.
 * Only once can be checked, not compared.
 *
 * @param vocab
 * @param definition
 * @returns {boolean}
 */

function checkIfAlreadyMatched(vocab, definition) {
    if (vocab != null) {
        for (let v = 0; v < matchedBoxes.matched.length; v++) {
            if (matchedBoxes.matched[v].vocab === vocab) {
                return true;
            }
        }
    }

    if (definition != null) {
        for (let d = 0; d < matchedBoxes.matched.length; d++) {
            if (matchedBoxes.matched[d].definition === definition) {
                return true;
            }
        }
    }
}

/**
 * Match Box Outline Colors
 *
 * @type {*[]}
 */

let matchColorsSettings = [
    "#c56cf0", "#ffb8b8", "#e1b12c", "#ff9f1a",
    "#fff200", "#7158e2", "#17c0eb", "#e84393",
    "#ff3838", "#67e6dc"];

/**
 * Vocab & Definition Box Number to make the match
 *
 * @param vocab
 * @param definition
 */

function matchBoxes(vocab, definition) {
    if (!checkIfAlreadyMatched(vocab, null) && !checkIfAlreadyMatched(null, definition)) {
        matchedBoxes.matched.push({vocab: vocab, definition: definition});

        clickedDefinitionBox = undefined;
        clickedVocabBox = undefined;

        vocabBoxes[vocab].graphics.setStrokeStyle(4);
        vocabBoxes[vocab].graphics.beginStroke(matchColorsSettings[(matchedBoxes.matched.length - 1)]);

        vocabBoxes[vocab].graphics.beginFill("#FFF").drawRoundRectComplex(
            sideGap, 100 + (verticalGap * vocab) + (vocab * height), length, height,
            10, 10, 10, 10);

        definitionBoxes[definition].graphics.setStrokeStyle(4);
        definitionBoxes[definition].graphics.beginStroke(matchColorsSettings[(matchedBoxes.matched.length - 1)]);

        definitionBoxes[definition].graphics.beginFill("#FFF").drawRoundRectComplex(
            STAGE_WIDTH - (length + sideGap),
            100 + (verticalGap * definition) + (definition * height), length, height,
            10, 10, 10, 10);

        vocabDefinitionMatchLine(vocab, definition);
    } else {
        console.log("Oh no, an error has been spotted in the wild!")
    }
}

let vocabDefinitionLines = [];

/**
 * Draw the line between matched boxes
 *
 * @param vocab
 * @param definition
 */

function vocabDefinitionMatchLine(vocab, definition) {

    let vpoint = new createjs.Point(vocabBoxes[vocab].graphics.command.x, vocabBoxes[vocab].graphics.command.y);
    let dpoint = new createjs.Point(definitionBoxes[definition].graphics.command.x, definitionBoxes[definition].graphics.command.y);

    let shape = new createjs.Shape();
    let line = stage.addChild(shape);
    line.graphics.beginStroke(matchColorsSettings[(matchedBoxes.matched.length - 1)])
        .setStrokeStyle(4).moveTo(vpoint.x + length, vpoint.y + (height / 2));
    let cmd = line.graphics.lineTo(vpoint.x + length, vpoint.y + (height / 2)).command;

    createjs.Tween.get(cmd, {loop: false}).to({x: dpoint.x, y: dpoint.y + (height / 2)}, 750);

    vocabDefinitionLines.push(shape);
}


let clickedVocabBox;

/**
 * Click a vocab box
 *
 * @param event
 */

function clickVocabBox(event) {
    for (let i = 0; i < vocabBoxes.length; i++) {
        if (vocabBoxes[i] == event.target) {

            alreadyMatched = checkIfAlreadyMatched(i, null);

            if (!alreadyMatched) {

                vocabBoxes[i].graphics.setStrokeStyle(4);
                vocabBoxes[i].graphics.beginStroke("#000");

                vocabBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
                    sideGap, 100 + (verticalGap * i) + (i * height), length, height,
                    10, 10, 10, 10);
            }

            if (clickedVocabBox != i) {
                if (typeof clickedVocabBox !== "undefined") {
                    unClickVocabBox(clickedVocabBox);
                }
                if (!alreadyMatched) {
                    clickedVocabBox = i;
                }
            }

            if (typeof clickedVocabBox !== "undefined" && typeof clickedDefinitionBox !== "undefined") {
                matchBoxes(clickedVocabBox, clickedDefinitionBox);
            }
        }
    }
}

/**
 * Unclick a matched vocab box
 *
 * @param i
 */

function unClickVocabBox(i) {
    vocabBoxes[i].graphics.setStrokeStyle(0);
    vocabBoxes[i].graphics.beginStroke("#FFF");

    vocabBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
        sideGap, 100 + (verticalGap * i) + (i * height), length, height,
        10, 10, 10, 10);
}

let clickedDefinitionBox;

/**
 * Click a definition box
 *
 * @param event
 */

function clickDefinitionBox(event) {
    for (let i = 0; i < definitionBoxes.length; i++) {
        if (definitionBoxes[i] == event.target) {

            alreadyMatched = checkIfAlreadyMatched(null, i);

            if (!alreadyMatched) {

                definitionBoxes[i].graphics.setStrokeStyle(4);
                definitionBoxes[i].graphics.beginStroke("#000");

                definitionBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
                    STAGE_WIDTH - (length + sideGap),
                    100 + (verticalGap * i) + (i * height), length, height,
                    10, 10, 10, 10);
            }

            if (clickedDefinitionBox != i) {
                if (typeof clickedDefinitionBox !== "undefined") {
                    unClickDefinitionBox(clickedDefinitionBox);
                }
                if (!alreadyMatched) {
                    clickedDefinitionBox = i;
                }
            }

            if (typeof clickedVocabBox !== "undefined" && typeof clickedDefinitionBox !== "undefined") {
                matchBoxes(clickedVocabBox, clickedDefinitionBox);
            }
        }
    }
}

/**
 * Unclick a definition box
 *
 * @param i
 */

function unClickDefinitionBox(i) {
    definitionBoxes[i].graphics.setStrokeStyle(0);
    definitionBoxes[i].graphics.beginStroke("#FFF");

    definitionBoxes[i].graphics.beginFill("#FFF").drawRoundRectComplex(
        STAGE_WIDTH - (length + sideGap),
        100 + (verticalGap * i) + (i * height), length, height,
        10, 10, 10, 10);
}

/** END GAME CODE **/

function endGame() {
    gameStarted = false;

    /** Below this is actual game code. **/
}