/**
 * WCLN.ca
 * Hockey Matchup
 * @author Shaun Agostinho (shaunagostinho@gmail.com)
 * July 2019
 */

let FPS = 24;
let gameStarted = false;
let STAGE_WIDTH, STAGE_HEIGHT;
let stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas

//reset this every category TODO
let cardBoxes = new Map();

let moneyBalance = new Map();

/*TODO:
    - Show the amount of money the person has to start:
        - 5 X $2.00
        - 3 X $1.00
        - 4 X $.25
        - 5 X $.10
        - 10 X $.05
    - When the player chooses an item, it will prompt them with a screen for them to
    choose which types of change they will have to use.
    - If a player chooses the wrong amount, it will show and error and have them try again.
    - If a player chooses the correct amount, it will prompt them to do it with a new category.
    ^ that repeats for every category until it's gone through all of them
    - There will also be back buttons for if they want to change the item they choose.
    - When it has gone through all categories, it will show the amount of money they used.
    - add sounds like a cash register sound and such

 */

// bitmap letiables
let background;

let cards = new Map();

let json = {
    categories: [{
        name: "Vegetables",
        options: [
            {
                name: "Carrot1",
                price: 12.87,
                image: "img/vegetables/carrot.png"
            },
            {
                name: "Carrot2",
                price: 2.99,
                image: "img/vegetables/carrot.png"
            },
            {
                name: "Carrot3",
                price: 9.99,
                image: "img/vegetables/carrot.png"
            },
            {
                name: "Carrot4",
                price: 99.99,
                image: "img/vegetables/carrot.png"
            }, {
                name: "Carrot5",
                price: 188.99,
                image: "img/vegetables/carrot.png"
            },
            {
                name: "Carrot6",
                price: 1.35,
                image: "img/vegetables/carrot.png"
            },
            {
                name: "Carrot7",
                price: 122.4,
                image: "img/vegetables/carrot.png"
            },
            {
                name: "Carrot8",
                price: 12.33,
                image: "img/vegetables/carrot.png"
            }
        ]
    }
    ]
};

/*let json = {
    categories: [{
        name: "Vegetables",
        options: [
            {
                name: "Carrot",
                price: 1.35,
                image: "/img/vegetables/carrot.png"
            },
            {
                name: "Peas",
                price: 2.00,
                image: "/img/vegetables/peas.png"
            },
            {
                name: "Asparagus",
                price: 3.30,
                image: "/img/vegetables/asparagus.png"
            },
            {
                name: "Corn on the Cob",
                price: 0.50,
                image: "/img/vegetables/corncob.png"
            },
            {
                name: "Broccoli",
                price: 1.90,
                image: "/img/vegetables/broccoli.png"
            }
        ]
    },
        {
            name: "Protein",
            options: [
                {
                    name: "Steak",
                    price: 3.25,
                    image: "/img/protein/steak.png"
                },
                {
                    name: "Chicken",
                    price: 2.50,
                    image: "/img/protein/chicken.png"
                },
                {
                    name: "Bacon",
                    price: 1.75,
                    image: "/img/protein/bacon.png"
                },
                {
                    name: "Ribs",
                    price: 2.00,
                    image: "/img/protein/ribs.png"
                },
                {
                    name: "Eggs (2)",
                    price: 2.00,
                    image: "/img/protein/eggs.png"
                }
            ]
        },
        {
            name: "Fruit",
            options: [
                {
                    name: "Pineapple",
                    price: 1.40,
                    image: "/img/fruit/pineapple.png"
                },
                {
                    name: "Apple",
                    price: 0.75,
                    image: "/img/fruit/apple.png"
                },
                {
                    name: "Blueberries",
                    price: 2.25,
                    image: "/img/fruit/blueberries.png"
                },
                {
                    name: "Kiwi",
                    price: 0.75,
                    image: "/img/fruit/kiwi.png"
                },
                {
                    name: "Cantaloupe",
                    price: 2.00,
                    image: "/img/fruit/cantaloupe.png"
                }
            ]
        },
        {
            name: "Drinks",
            options: [
                {
                    name: "Apple Juice",
                    price: 1.75,
                    image: "/img/drinks/applejuice.png"
                },
                {
                    name: "Chocolate Milk",
                    price: 2.00,
                    image: "/img/drinks/chocolatemilk.png"
                },
                {
                    name: "Yop",
                    price: 1.50,
                    image: "/img/drinks/yop.png"
                },
                {
                    name: "Hot Chocolate",
                    price: 2.25,
                    image: "/img/drinks/hotchocolate.png"
                }
            ]
        },
        {
            name: "Dessert",
            options: [
                {
                    name: "Ice Cream",
                    price: 2.10,
                    image: "/img/dessert/icecream.png"
                },
                {
                    name: "Brownie",
                    price: 1.85,
                    image: "/img/dessert/brownie.png"
                },
                {
                    name: "Pie",
                    price: 2.75,
                    image: "/img/dessert/pie.png"
                },
                {
                    name: "Pudding",
                    price: 1.95,
                    image: "/img/dessert/pudding.png"
                }
            ]
        },
    ]
};*/

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

/*
 * Displays the end game screen and score.
 */
function endGame() {
    //todo show win screen
    gameStarted = false;
}

function setupManifest() {
    manifest = [
        {
            src: "img/bg.png",
            id: "background"
        }
    ];

    for (let category = 0; category < json.categories.length; category++) {
        for (let card = 0; card < json.categories[category].options.length; card++) {
            manifest.push({
                src: json.categories[category].options[card].image,
                id: "card-" + category + "-" + card
            });
        }
    }
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

function handleFileLoad(event) {
    console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
    if (event.item.id == "background") {
        background = new createjs.Bitmap(event.result);
    }

    if (event.item.id.startsWith("card")) {
        cards.set(event.item.id, new createjs.Bitmap(event.result));
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

    //stage.addChild(background);

    initGraphics();
}

/**
 * Load the basic stuff
 *
 */
function initGraphics() {
    gameStarted = true;

    moneyBalance.set(2.00, 5);
    moneyBalance.set(1.00, 3);
    moneyBalance.set(0.25, 4);
    moneyBalance.set(0.10, 5);
    moneyBalance.set(0.05, 10);
    balanceTextUpdate();

    console.log(moneyBalance);

    loadCardScreen(0);
}

let cardNameText = new Map();
let cardPriceText = new Map();

function loadCardScreen(num) {
    stage.removeChild(balanceText);
    balanceTextUpdate();

    for (let i = 0; i < json.categories[num].options.length; i++) {
        let cardKey = "card-" + num + "-" + i;
        let bitmap = cards.get(cardKey);
        bitmap.scaleX = ((STAGE_WIDTH / 12)) / (bitmap.image.width);
        bitmap.scaleY = ((STAGE_HEIGHT / 6)) / (bitmap.image.height);

        cardBoxes.set(cardKey, new createjs.Shape());
        cardBoxes.get(cardKey).graphics.beginStroke("pink").beginFill("white");

        let cardBoxNums = i > 3 ? i - 4 : i;
        let topOffset = i > 3 ? STAGE_HEIGHT - (STAGE_HEIGHT / 3) - 120 : 40;

        let nameText = new createjs.Text(json.categories[num].options[i].name, "20px Arial", "#6E3AAF");
        nameText.textAlign = "center";
        nameText.textBaseline = "alphabetic";

        let priceText = new createjs.Text("$" + json.categories[num].options[i].price, "20px Arial", "#6E3AAF");
        priceText.textAlign = "center";
        priceText.textBaseline = "alphabetic";

        if (cardBoxNums < 2) {
            cardBoxes.get(cardKey).graphics.drawRect(
                ((STAGE_WIDTH / 4) * cardBoxNums) + 20,
                topOffset,
                (STAGE_WIDTH / 6),
                STAGE_HEIGHT / 3);
            bitmap.x = ((STAGE_WIDTH / 4) * cardBoxNums) +
                20 +
                (STAGE_WIDTH / 6 / 4);
            bitmap.y = topOffset + 10;

            nameText.x = ((STAGE_WIDTH / 4) * cardBoxNums) +
                20 +
                (STAGE_WIDTH / 6 / 2);
            nameText.y = topOffset + 50 + (bitmap.image.height * bitmap.scaleY);

            priceText.x = ((STAGE_WIDTH / 4) * cardBoxNums) +
                20 +
                (STAGE_WIDTH / 6 / 2);
            priceText.y = topOffset + 75 + (bitmap.image.height * bitmap.scaleY);
        } else {
            cardBoxes.get(cardKey).graphics.drawRect(
                STAGE_WIDTH -
                (20 + (STAGE_WIDTH / 6)) -
                ((STAGE_WIDTH / 4) * (cardBoxNums - 2)),

                topOffset,
                (STAGE_WIDTH / 6),
                STAGE_HEIGHT / 3);

            bitmap.x = STAGE_WIDTH -
                (20 + (STAGE_WIDTH / 6) - (STAGE_WIDTH / 6 / 4)) -
                ((STAGE_WIDTH / 4) * (cardBoxNums - 2));
            bitmap.y = topOffset + 10;

            nameText.x = STAGE_WIDTH -
                (20 + (STAGE_WIDTH / 6) - (STAGE_WIDTH / 6 / 2)) -
                ((STAGE_WIDTH / 4) * (cardBoxNums - 2));
            nameText.y = topOffset + 50 + (bitmap.image.height * bitmap.scaleY);

            priceText.x = STAGE_WIDTH -
                (20 + (STAGE_WIDTH / 6) - (STAGE_WIDTH / 6 / 2)) -
                ((STAGE_WIDTH / 4) * (cardBoxNums - 2));
            priceText.y = topOffset + 75 + (bitmap.image.height * bitmap.scaleY);
        }
        //(horizontal offset, vertical offset, width, height)

        bitmap.on("click", function (event) {
            cardClickHandler(event);
        });
        cardBoxes.get(cardKey).on("click", function (event) {
            cardClickHandler(event, cardKey);
        });

        cardNameText.set(cardKey, nameText);
        cardPriceText.set(cardKey, priceText);

        stage.addChild(cardBoxes.get(cardKey));
        stage.addChild(bitmap);
        stage.addChild(nameText);
        stage.addChild(priceText);
    }
}

/*
 * TODO
 *  - Make it show the clipart of the coins when someone clicks on an item in the category.
 *  - Display the name of the category at the top of the cards
 *  - Check if the amount that the person clicked for the money is correct for that item
 *  - Reset the values & move to the next category
 *  - Once all categories are done, end the game and display how much they saved vs the most expensive options?
 */

let clickedCardKey = "";

function cardClickHandler(event, cardKey) {
    //event.target

    clickedCardKey = cardKey;
    console.log("true " + cardKey);
}

let balanceText;

function balanceTextUpdate() {
    //stage.removeChild(balanceText);

    let balance = 0.00;
    moneyBalance.forEach(function (value, key, map) {
        balance += key * value;
    });
    balanceText = new createjs.Text("Balance: $" + balance, "20px Arial", "#6E3AAF");
    balanceText.textBaseline = "alphabetic";

    balanceText.y = STAGE_HEIGHT - 30;
    balanceText.x = 20;

    stage.addChild(balanceText);
}

/**
 * Update the stage. (Tween Ticker)
 *
 * @param event
 */

function update(event) {
    stage.update(event);
}