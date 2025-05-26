let cookieGesamt = 200;
let cookieAdd = 1;
let cookieAddauto = 1;
let cookieAddgustavo = 3;
let cookie_bild = document.getElementById("pizza-bild");
let gesamtcookies = 20;
const geldd = document.getElementById("geld").value;
const autoclicker = document.getElementById("autoclicker");
let pizza_meiste = 0;
let autoclickerplus;
let gustavoplus;
let autoclickergesamt;
let gustavogesamt;

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
    loadGame(); 
    farbe(); 
});

//Preise und Anzahl der Upgrades
let upgrades = 
   [{id: "up0" ,name: "Autoclicker", preis: 10, anzahl: 0}, 
    {id: "up1" ,name: "Gustavo", preis: 120, anzahl: 0},
    {id: "up2" ,name: "TomatenSauce", preis: 1500, anzahl: 0}, 
    {id: "up3" ,name: "Ofen", preis: 2000, anzahl: 0},
    {id: "up4" ,name: "Käse", preis: 1800, anzahl: 0},
    {id: "up5" ,name: "Salami", preis: 3000, anzahl: 0},
    {id: "up6" ,name: "Paprika", preis: 3500, anzahl: 0},
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
    sekundenrechner();



    // 1. Alles verstecken, außer up0 und 1
    for (let i = 2; i < upgrades.length; i++) {
        document.getElementById(upgrades[i].id).classList.add("versteckt");
    }


    // 3. Wenn ein Upgrade gekauft wurde → zeige die nächsten zwei
    for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].anzahl > 0) {
            if (i + 1 < upgrades.length) {
                document.getElementById(upgrades[i + 1].id).classList.remove("versteckt");
            }
            if (i + 2 < upgrades.length) {
                document.getElementById(upgrades[i + 2].id).classList.remove("versteckt");
            }
        }
    }


    // 2. Preisfarben, Namen, Bildfarben
    for (let x = 0; x < upgrades.length; x++) {
        

        let itemid = upgrades[x].id;
        let item = document.getElementById(itemid);

        if(item.classList.contains("versteckt"))
        {
            continue;
        }
      
      
        if(upgrades[x].anzahl >= 1){
    
        
            let itemanzahl = document.getElementsByClassName("upanzahl")[x];
        
            itemanzahl.innerHTML = upgrades[x].anzahl;  
        
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

document.addEventListener("mouseover", function (event){

    let num = event.target.dataset.num;
    let item = event.target;
    let itemname = document.getElementById("up" + num + "-name").textContent;


     if(num && !item.classList.contains("versteckt") && !document.querySelector(".infos")){

        let itemid = document.getElementById("up" + num)

        const infos = [
            {name: "Autoclicker", beschreibung: '"Klickt alle 8 Sekunden automatisch für dich!"', sekunden: autoclickerplus},
            {name: "Gustavo", beschreibung: '"Ein erfahrener Pizzabäcker der dir automatisch Pizzen generiert"', sekunden: gustavoplus},
        ];

        let info = document.createElement("div")
        let boxoben = document.createElement("div")
        let name = document.createElement("h3")
        let beschreibung = document.createElement("p")
        let statsliste = document.createElement("ul");
        let statsolo = document.createElement("li");
        let statall = document.createElement("li");




        info.className = "infos";
        const posY = event.clientY;
        info.style.top = `${posY - 50}px`;
        
        document.body.appendChild(info)
        info.appendChild(boxoben);
        boxoben.appendChild(name);
        boxoben.appendChild(beschreibung)
        info.appendChild(statsliste);
        statsliste.appendChild(statsolo);
        statsliste.appendChild(statall);

        if(itemname !== "???"){
            
            name.innerHTML = infos[num].name
            beschreibung.innerHTML = infos[num].beschreibung;
            statsolo.innerHTML = "Einzelner pro Sekunde: " + Kommastelle(infos[num].sekunden);
            statall.innerHTML = upgrades[num].anzahl + " pro Sekunde: " + Kommastelle(infos[num].sekunden * upgrades[num].anzahl);
            
        }
        else{
            info.innerHTML = "???";
        }
    }

});

document.addEventListener("mousemove", function (event) {
    let info = document.querySelector(".infos");
  if (info) {

        const posY = event.clientY;
        info.style.top = `${posY - 50}px`;
  }
});

    document.addEventListener("mouseout", function (event) {

    let infoDiv = document.querySelector(".infos");

    if (infoDiv) {
      infoDiv.remove();
    }

});


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

function sekundenrechner(){


    // 0.up  
    autoclickerplus = (cookieAdd / 8) * upgrades[0].anzahl
    // 1.up
    gustavoplus = (3) * upgrades[1].anzahl;
    // 2.up

    let plusinsgesamt = autoclickerplus + gustavoplus;

    document.getElementById("eingabe").innerHTML = Kommastelle(plusinsgesamt);

    
}

//Upgrade 0

function autoclick(){
    gesamtcookies = gesamtcookies + cookieAdd;
    cookieGesamt = cookieGesamt + cookieAdd;
    autoclickergesamt = autoclickergesamt + cookieAdd;

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
        setInterval(autoclick, 8000);
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




//upgrade 1

function gustavo(){
    gesamtcookies = gesamtcookies + 3;
    cookieGesamt = cookieGesamt + 3;
    gustavogesamt = gustavogesamt + 3;
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
        setInterval(gustavo, 1000);
        upgrades[1].anzahl++;
        document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
        document.getElementById("up1-preis").innerHTML = Kommastelle(upgrades[1].preis);
        farbe();
        playBuySound();
        }
    else
        {
        shake("shake1")          
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


//upgrade 3

function ofen(){
    gesamtcookies = gesamtcookies + 10;
    cookieGesamt = cookieGesamt + 10;
    document.getElementById("geld").innerHTML = Kommastelle(cookieGesamt);
    document.getElementById("gesamt-cookies").innerHTML = Kommastelle(gesamtcookies);
    maxgeld();
    farbe();
}

function up3kauf(event)
{
    if(cookieGesamt >= upgrades[3].preis)
        {
        cookieGesamt = cookieGesamt - upgrades[3].preis;
        upgrades[1].preis = (upgrades[1].preis * 1.45);
        setInterval(ofen, 2500);
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










