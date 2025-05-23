let cookieGesamt = 2000;
let cookieAdd = 1;
let cookieAddauto = 1;
let cookieAddgustavo = 3;
let cookie_bild = document.getElementById("pizza-bild");
let gesamtcookies = 20;
const geldd = document.getElementById("geld").value;
const autoclicker = document.getElementById("autoclicker");
let pizza_meiste = 0;

function saveGame() {
    const gameState = {
        cookieGesamt: cookieGesamt,
        gesamtcookies: gesamtcookies,
        upgrades: upgrades,
        pizza_meiste: pizza_meiste,
        innerHTML: {
            geld: document.getElementById("geld").innerHTML,
            gesamtCookies: document.getElementById("gesamt-cookies").innerHTML,
            upgradeNames: upgrades.map((_, x) => document.getElementById("up" + x + "-name").innerHTML),
            upgradePreise: upgrades.map((_, x) => document.getElementById("up" + x + "-preis").innerHTML),
        },
    };
    document.cookie = `gameState=${encodeURIComponent(JSON.stringify(gameState))}; path=/; max-age=31536000`; // Speichert für 1 Jahr
}

function loadGame() {
    const cookies = document.cookie.split("; ");
    const gameStateCookie = cookies.find(row => row.startsWith("gameState="));
    if (gameStateCookie) {
        const gameStateString = decodeURIComponent(gameStateCookie.split("=")[1]);
        const gameState = JSON.parse(gameStateString);

        // Wiederherstellen der gespeicherten Werte
        cookieGesamt = gameState.cookieGesamt;
        gesamtcookies = gameState.gesamtcookies;
        upgrades = gameState.upgrades;
        pizza_meiste = gameState.pizza_meiste;

        // Wiederherstellen der innerHTML-Inhalte
        document.getElementById("geld").innerHTML = gameState.innerHTML.geld;
        document.getElementById("gesamt-cookies").innerHTML = gameState.innerHTML.gesamtCookies;

        upgrades.forEach((_, x) => {
            document.getElementById("up" + x + "-name").innerHTML = gameState.innerHTML.upgradeNames[x];
            document.getElementById("up" + x + "-preis").innerHTML = gameState.innerHTML.upgradePreise[x];
        });
    }
}

function Kommastelle(zahl) {
    if (zahl >= 1000) {
        return (zahl / 1000).toFixed(1).replace(".0", "") + "k"; // Teilt durch 1000, entfernt ".0" und fügt "k" hinzu
    } else {
        return zahl.toFixed(1).replace(".0", ""); // Zeigt Nachkommastelle nur, wenn nötig
    }
}


// Führt farbe aus wenn die Seite geladen wird
document.addEventListener("DOMContentLoaded", function() {
   // loadGame(); 
    farbe(); 
});

//Preise und Anzahl der Upgrades
let upgrades = 
   [{id: "up0" ,name: "Autoclicker", preis: 10, anzahl: 0}, 
    {id: "up1" ,name: "Gustavo", preis: 120, anzahl: 0},
    {id: "up2" ,name: "TomatenSauce", preis: 1500, anzahl: 0}, 
    {id: "up3" ,name: "Käse", preis: 1800, anzahl: 0},
    {id: "up4" ,name: "Ofen", preis: 2000, anzahl: 0},
    {id: "up5" ,name: "Teig", preis: 2500, anzahl: 0},
    {id: "up6" ,name: "Salami", preis: 3000, anzahl: 0},
    {id: "up7" ,name: "Paprika", preis: 3500, anzahl: 0},
];

function maxgeld() {
    if (cookieGesamt > pizza_meiste) 
    {
        pizza_meiste = cookieGesamt; 
    }
    }

//Farbe ändern wenn man nicht genug Pizzen hat
function farbe() {
    saveGame();

    // 1. Übernächste Upgrades verstecken
    for (let i = 0; i < upgrades.length - 3; i++) {
        let ups3 = upgrades[i + 3].id;
        let ups2 = upgrades[i + 2].id;
        let ups1 = upgrades[i + 1].id;
        
        if (upgrades[i].anzahl == 0) {
            document.getElementById(ups3).classList.add("versteckt");
        } else {
            
            document.getElementById(ups2).classList.remove("versteckt");
            document.getElementById(ups1).classList.remove("versteckt");
        }
    }

    // 2. Preisfarben, Namen, Bildfarben
    for (let x = 0; x < upgrades.length; x++) {
        
        if(upgrades[x].anzahl >= 1){
    
        
            let itemanzahl = document.getElementsByClassName("upanzahl")[x];
        
            itemanzahl.innerHTML = upgrades[x].anzahl;  
        
         }
        


        let itemid = upgrades[x].id;
        let item = document.getElementById(itemid);

        if(item.classList.contains("versteckt"))
        {
            continue;
        }
        
        // Preis rot färben

        if (upgrades[x].preis > cookieGesamt) {
            document.getElementById("up" + x + "-preis").classList.add("zuwenig");
        } else {
            document.getElementById("up" + x + "-preis").classList.remove("zuwenig");
        }

        // Namen einblenden
        if (upgrades[x].preis <= pizza_meiste || upgrades[x].anzahl > 0) {
            document.getElementById("up" + x + "-name").innerHTML = upgrades[x].name;
            document.getElementById("up" + x).classList.remove("uupgrade");
            document.getElementById("up" + x).classList.add("upgrade");
        } else {
            document.getElementById("up" + x + "-name").innerHTML = "???";
            document.getElementById("up" + x).classList.add("uupgrade");
            document.getElementById("up" + x).classList.remove("upgrade");
        }

        // Bild einfärben/schwärzen
        if (upgrades[x].anzahl > 0) {
            document.getElementById("up" + x + "-img").classList.remove("uupgrade-img");
            document.getElementById("up" + x + "-img").classList.add("upgrade-img");
        } else {
            document.getElementById("up" + x + "-img").classList.remove("upgrade-img");
            document.getElementById("up" + x + "-img").classList.add("uupgrade-img");
        }
    }

    // Spezielle Pizza-Bild-Änderung
    if (upgrades[2].anzahl == 1) {
        document.getElementById("pizza-bild").src = "Cookies/Pizza2.png";
    }
    if (upgrades[3].anzahl == 1) {
        document.getElementById("pizza-bild").src = "Cookies/Pizza3.png";
    }
}

function clickanzahl(){
    
    const posX = event.clientX;
    const posY = event.clientY;

    let randomNumber = ((Math.random() * 8) - 1).toFixed(1);

    let anzeige = document.createElement("div")
    anzeige.className = "clickaddanzahl";

    anzeige.style.top = `${posY - 30}px`;
    anzeige.style.left = `${posX - 10 - randomNumber}px`;
    anzeige.innerText = "+" + cookieAdd;


    document.body.appendChild(anzeige);
    setTimeout(() => anzeige.remove(), 2900);


}


cookie_bild.addEventListener("click", function() {
    gesamtcookies = gesamtcookies + cookieAdd;
    cookieGesamt = cookieGesamt + cookieAdd;
    document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
    document.getElementById("gesamt-cookies").innerHTML = Kommastelle(gesamtcookies);
    maxgeld();
    farbe();
    clickanzahl()
})

const sounds = [
    "Cookies/clickb1.mp3",
    "Cookies/clickb2.mp3",
    "Cookies/clickb3.mp3",
    "Cookies/clickb4.mp3",
    "Cookies/clickb5.mp3",
    "Cookies/clickb6.mp3",
    "Cookies/clickb7.mp3",
]

//Spiel die Klickgeräusche ab

function playClickSound() {
    const randomIndex = Math.floor(Math.random() * sounds.length); 
    const sound = new Audio(sounds[randomIndex]); 
    sound.volume = 0.2; 
    sound.play();
}

cookie_bild.addEventListener("mousedown", function () {
    playClickSound();
    isHeld = false; 
    holdTimer = setTimeout(() => {
        isHeld = true; 
    }, 300); 
});

cookie_bild.addEventListener("mouseup", function () {
    clearTimeout(holdTimer);
    if (isHeld) {
        playClickSound();
    } 
});

//Die Kaufgeräusche 

buysound = [
    "cookies/Buy1.mp3",
    "cookies/Buy2.mp3",
    "cookies/Buy3.mp3",
    "cookies/Buy4.mp3",
]

//Spielt die Kaufgeräusche ab

function playBuySound() {
    const randomIndex = Math.floor(Math.random() * buysound.length); 
    const sound = new Audio(buysound[randomIndex]); 
    sound.volume = 0.2; 
    sound.play();
}

function shake(upgrade) {
    const up = document.getElementById(upgrade);
    up.classList.add("shake"); 
    setTimeout(() => {
        up.classList.remove("shake");
    }, 500);
}



//Upgrade 0

function autoclick(){
    gesamtcookies = gesamtcookies + cookieAdd;
    cookieGesamt = cookieGesamt + cookieAdd;
    document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
    document.getElementById("gesamt-cookies").innerHTML = Kommastelle(gesamtcookies);
    maxgeld();
    farbe();
}

function up0kauf(event)
{
    if(cookieGesamt >= upgrades[0].preis)
        {
        cookieGesamt = cookieGesamt - upgrades[0].preis;
        upgrades[0].preis = (upgrades[0].preis * 1.45);
        setInterval(autoclick, 3000);
        upgrades[0].anzahl++;
        document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
        document.getElementById("up0-preis").innerHTML = Kommastelle(upgrades[0].preis);
        farbe();
        playBuySound();
        }
    else
        {
            shake("shake0");
        }
    
}

function sekundenrechner(){

    // 0.up  
    let autoclickerplus = (cookieAdd / 3) * upgrades[0].anzahl
    // 1.up
    let gustavoplus = (7.5 / 2.5) * upgrades[1].anzahl;
    // 2.up


    
}


//upgrade 1

function gustavo(){
    gesamtcookies = gesamtcookies + 7.5;
    cookieGesamt = cookieGesamt + 7.5;
    document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
    document.getElementById("gesamt-cookies").innerHTML = Kommastelle(gesamtcookies);
    maxgeld();
    farbe();
}

function up1kauf(event)
{
    if(cookieGesamt >= upgrades[1].preis)
        {
        cookieGesamt = cookieGesamt - upgrades[1].preis;
        upgrades[1].preis = (upgrades[1].preis * 1.45);
        setInterval(gustavo, 2500);
        upgrades[1].anzahl++;
        document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
        document.getElementById("up1-preis").innerHTML = Kommastelle(upgrades[1].preis);
        farbe();
        playBuySound();
        }
    else
        {
            shake("shake1");
        }
}



//Upgrade 2

function tomatensauce(){
    cookieAdd = cookieAdd + 10;
    //document.getElementById("up1-anzahl").innerHTML = upgrades[1].anzahl;
}

function up2kauf(event)
{
    if(cookieGesamt >= upgrades[2].preis)
        {
        cookieGesamt = cookieGesamt - upgrades[2].preis;
        upgrades[2].preis = (upgrades[2].preis * 1.45);
        document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
        document.getElementById("up2-preis").innerHTML = Kommastelle(upgrades[2].preis);
        upgrades[2].anzahl++;
        tomatensauce();
        farbe();
        playBuySound();
        }
    else
        {
            shake("shake2");
        }
}











