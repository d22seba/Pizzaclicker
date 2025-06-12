let pizzaGesamt = 0;
let pizzenoverall = 0;
let cookieAdd = 1;
let cookie_bild = document.getElementById("pizza-bild");
let pizza_meiste = 0;
let autoclick = 8000;

let pizzakonto = document.getElementById("geld");

let plusprosek = []; 
let gekaufteEvos = [];
let intervalle = {};


let reset;
let gamegesperrt;
let gesperrt;
let autospinning = false;
let spininterval = null;
let maxbetnum = 0;

let gustavoAdd = 6;
let ofenAdd = 15;
let pizzabotAdd = 40;

let tomatensauceAdd = 10;
let cheeseAdd = 30;
let sucukAdd = 50;


window.addEventListener("beforeunload", saveGame);


//Speicher Funktion mit Ki gemacht aber auch selber angepasst
function saveGame() {
    try {
        const gameState = {
            pizzaGesamt,
            pizzenoverall,
            upgrades,
            pizza_meiste,
            gesperrt,
            cookieAdd,
            gustavoAdd,
            ofenAdd,
            pizzabotAdd,
            plusprosek,
            plusupgesamt,
            autoclick,
            gekaufteEvos,
            reset,
            innerHTML: {
                geld: document.getElementById("geld").innerHTML,
                pizzenoverall: document.getElementById("gesamt-cookies").innerHTML,
                upgradeNames: upgrades.map((_, x) => document.getElementById("up" + x + "-name").innerHTML),
                upgradePreise: upgrades.map((_, x) => document.getElementById("up" + x + "-preis").innerHTML),
            }
        };
        localStorage.setItem("pizzaGameState", JSON.stringify(gameState));
    } catch (e) {
        console.error("Fehler beim Speichern:", e);
    }
}


//Lade Funktion mit Ki gemacht aber auch selber angepasst
function loadGame() {
    try {
        const saved = localStorage.getItem("pizzaGameState");
        if (!saved) return;

        const gameState = JSON.parse(saved);

        pizzaGesamt = gameState.pizzaGesamt;
        pizzenoverall = gameState.pizzenoverall;
        upgrades = gameState.upgrades;
        pizza_meiste = gameState.pizza_meiste;
        gesperrt = gameState.gesperrt;
        cookieAdd = gameState.cookieAdd;
        gustavoAdd = gameState.gustavoAdd;
        ofenAdd = gameState.ofenAdd;
        pizzabotAdd = gameState.pizzabotAdd;
        plusprosek = gameState.plusprosek;
        plusupgesamt = gameState.plusupgesamt;
        autoclick = gameState.autoclick;
        gekaufteEvos = gameState.gekaufteEvos || [];
        reset = gameState.reset;

        gekaufteEvos.forEach(id => {
            const evoElement = document.querySelector(`.evos[data-id="${id}"]`);
            if (evoElement) evoElement.remove();
        });


        document.getElementById("geld").innerHTML = gameState.innerHTML.geld;
        document.getElementById("gesamt-cookies").innerHTML = gameState.innerHTML.pizzenoverall;

        upgrades.forEach((_, x) => {
            document.getElementById("up" + x + "-name").innerHTML = gameState.innerHTML.upgradeNames[x];
            document.getElementById("up" + x + "-preis").innerHTML = gameState.innerHTML.upgradePreise[x];
        });
    } catch (e) {
        console.error("Fehler beim Laden:", e);
    }
}

function deleteSave(){
    let sure = window.confirm("Bist du sicher dass du deinen Spielstand löschen willst?");
    if(!sure) return;
    reset = true;
    window.location.reload();
}

// Startet alle Intervalle
function starteAlleIntervalle() {
    for (let i = 0; i < upgrades.length; i++) {
        const upgrade = upgrades[i];
        if(i == 0){       
            
            setInterval(() => {

                intervalupgrade(i, upgrade.anzahl * cookieAdd);
            }, autoclick);}

        else if(plusprosek[i] > 0 && upgrade.anzahl > 0) {


            setInterval(() => {

                intervalupgrade(i, upgrade.anzahl * plusprosek[i]);
            }, 1000);
        }
    }
}

// Konvertiert die Zahl in lesbare Form
function Kommastelle(zahl) {

    if (typeof zahl !== 'number') return zahl;

    if (zahl >= 1000 && zahl < 1000000) {
        return  zahl.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +"K"; 
    } 
    else if(zahl >= 1000000 && zahl < 1000000000){
        zahl = zahl / 1000000;
        return zahl.toFixed(3) + "M";
    }
    else if(zahl >= 1000000000 && zahl < 1000000000000){
        zahl = zahl / 1000000000
        return zahl.toFixed(3) + "B"
    }
    else if(zahl >= 1000000000000 && zahl < 1000000000000000){
        zahl = zahl / 1000000000000
        return zahl.toFixed(3) + "T"
    }
    else {
        return  zahl.toFixed(0);
    }
}


// Führt ein paar Funktion beim aufruf der Seite auf
document.addEventListener("DOMContentLoaded", function() {
   
    if(reset == undefined) loadGame();
    if(reset == true) reset = false;
    farbe(); 
    starteAlleIntervalle();
    
    if(upgrades[2].anzahl > 0){  
        evolutionunlock();
    }
    else{
        evolutionlock();
    }

    setInterval(saveGame, 15000);
    
});

//Deklarierungen für das Minigame
document.getElementById("sloteinsatz").max = pizzaGesamt;
let slotbutton = document.getElementById("spinbutton");
let minigame = document.getElementById("minigame");
let minigamename = document.getElementById("gamename");
let einsatzinput = document.getElementById("sloteinsatz");
let maxbet = document.getElementById("maxbet");
let autospin = document.getElementById("autospin");
let display = document.getElementById("ausgabedisplay");
let slotsinfos = document.getElementById("slotsinfos");
let tomatensauceslots = document.getElementById("tomatensauceslots")
let pressed = false;

//Öffnet das Minigame onclick
minigame.addEventListener("click", () =>{
    minigame.style.left = "3%";
    minigame.style.height = "70%"
    minigame.classList.remove("zu");
    slotsinfos.style.width = "110%"
    
})

//Schließt es wieder per Button
let minigamebutton = document.getElementById("minigamebutton");
minigamebutton.addEventListener("click", () =>{
    event.stopPropagation();
    minigame.style.left = "-39%";
    minigame.style.height = "60%"
    minigame.classList.add("zu");
    slotsinfos.style.width = "80%"

})


//Prüft ob der Wert genug oder ein Buchstabe ist
einsatzinput.addEventListener("blur", function () {
    this.value = parseFloat(this.value);

    if (isNaN(this.value) || this.value < 100) 
        {
            this.value = 100; 
        } 
});

//Maxbet Button
maxbet.addEventListener("click", function() {

    if(pizzaGesamt < 1000) einsatzinput.value = pizzaGesamt.toFixed(1);
    else {
        einsatzinput.value = pizzaGesamt.toFixed(0);
    }
    einsatzinput.blur();
});

//Der Spinbutton Click
slotbutton.addEventListener("click", function() {

    
    if (einsatzinput.value > pizzaGesamt || einsatzinput.value < 100) {
        einsatzinput.classList.add("shake");
        einsatzinput.style.backgroundColor = "red";
        setTimeout(() => {
            einsatzinput.classList.remove("shake");
            einsatzinput.style.backgroundColor = "#e27d51"
        }, 500);
        return;
    }
    else{
        pizzaGesamt -= einsatzinput.value;
        pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
        gamestart();
    }

    
});

//Autospin Button
autospin.addEventListener("click", function() {

    if (autospinning == false && !slotbutton.disabled) {
        autospin.classList.add("autospinon");
        autospinning = true;
        slotbutton.disabled = true;

        if (einsatzinput.value <= pizzaGesamt) {
            pizzaGesamt -= einsatzinput.value;
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
            gamestart();
        }

        spininterval = setInterval(() => {
            if (einsatzinput.value > pizzaGesamt) {
                autospinning = false;
                clearInterval(spininterval);
                autospin.classList.remove("autospinon");
                slotbutton.disabled = false;
                return;
            }
            else{
                pizzaGesamt -= einsatzinput.value;
                pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
                gamestart();
            }
        }, 6000);
    }
    else if (autospinning == true){
        autospin.classList.remove("autospinon");
        autospinning = false;
        clearInterval(spininterval);
        slotbutton.disabled = false;
    }
});

let slotergebniss = [null, null, null];

//Die Spin Funktion
function gamestart(){



    if(autospinning == false) slotbutton.disabled = true;
    display.innerHTML = "Spinning..."; 
    
    let spin1 = setInterval(() => spinslots(1), 60);
    let spin2 = setInterval(() => spinslots(2), 60);
    let spin3 = setInterval(() => spinslots(3), 60);

    setTimeout(() => clearInterval(spin1), 3000);
    setTimeout(() => clearInterval(spin2), 4000);
    setTimeout(() => {
        clearInterval(spin3); 
        if(autospinning == false) slotbutton.disabled = false;
        slotergebniss[0] = document.getElementById("slot1").src;
        slotergebniss[1] = document.getElementById("slot2").src;
        slotergebniss[2] = document.getElementById("slot3").src;
        slotausgabe();
    }, 5000);


    
}

function spinslots(input){
    let pizzabild = document.getElementById("pizza-bild").src;
    let slotsbilder = [
    "Cookies/tomatenSauce.png",
    "Cookies/tomatenSauce.png",
    "Cookies/autoclicker.png",
    "Cookies/autoclicker.png",
    "Cookies/autoclicker.png",
    "Cookies/autoclicker.png",
    "Cookies/autoclicker.png",
    "Cookies/pizzabäcker.png",
    "Cookies/pizzabäcker.png",
    "Cookies/pizzabäcker.png",
    "Cookies/pizzabäcker.png",
    "Cookies/cheese.png",
    "Cookies/cheese.png",
    "Cookies/cheese.png",
    pizzabild,
    pizzabild,
]

    let slot = document.getElementById("slot" + input);
    let randomnum = Math.floor(Math.random() * slotsbilder.length);

    slot.src = slotsbilder[randomnum];

}

//Zeigt an ob man gewonnen hat und gibt Gewinn aus
function slotausgabe(){

    let win1 = document.getElementById("up0-img").src;
    let win2 = document.getElementById("up1-img").src;
    let win3 = document.getElementById("up4-img").src;
    let win4 = document.getElementById("pizza-bild").src;
    

    if (slotergebniss[0] === slotergebniss[1] && slotergebniss[1] === slotergebniss[2]) {

        if (slotergebniss[0] == win1) {

            let gewinn = einsatzinput.value * 100;
            pizzaGesamt += gewinn;
            pizzenoverall += gewinn;
            display.innerHTML = "Du hast "+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
            
        } else if (slotergebniss[0] == win2) {

            let gewinn = einsatzinput.value * 250;
            pizzaGesamt += gewinn;
            pizzenoverall += gewinn;
            display.innerHTML = "Du hast "+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);

        } else if (slotergebniss[0] == win3) {

            let gewinn = einsatzinput.value * 500;
            pizzaGesamt += gewinn;
            pizzenoverall += gewinn;
            display.innerHTML = "Du hast "+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);

        } else if (slotergebniss[0] == win4) {

            let gewinn = einsatzinput.value * 1000;
            pizzaGesamt += gewinn;
            pizzenoverall += gewinn;
            display.innerHTML = "Du hast "+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
        }
        }else{display.innerHTML = "Leider nichts gewonnen!";}


}





//Preise und Anzahl der Upgrades
let upgrades = [
    {id: "up0", name: "Autoclicker", preis: 10, startpreis: 10, anzahl: 0, plus: 0},
    {id: "up1", name: "Gustavo", preis: 120, startpreis: 120, anzahl: 0, plus: 0},
    {id: "up2", name: "TomatenSauce", preis: 1200, startpreis: 1200, anzahl: 0, plus: 10},
    {id: "up3", name: "Ofen", preis: 7200, startpreis: 7200, anzahl: 0, plus: 0},
    {id: "up4", name: "Käse", preis: 14600, startpreis: 14600, anzahl: 0, plus: 30},
    {id: "up5", name: "Pizzabot", preis: 32800, startpreis: 32800, anzahl: 0, plus: 0},
    {id: "up6", name: "Sucuk", preis: 48000, startpreis: 48000, anzahl: 0, plus: 50},
    {id: "up7", name: "???", preis: "???", startpreis: "???", anzahl: "???", plus: "???"},
];


let plusupgesamt = new Array(upgrades.length).fill(0);


let upgradeBeschreibung = [
    '"Klickt alle 8 Sekunden automatisch für dich!"',
    '"Ein erfahrener Pizzabäcker der dir automatisch Pizzen generiert"',
    '"Fügt eine leckere Tomatensauce zur Pizza hinzu was ihren Wert erhöht"',
    '"Ein Pizzaofen der passiv Pizzen generiert"',
    '"Erhöht den Wert der Pizzen um 20"',
    '"Erhöht den Wert der Pizzen um 30"',
    '"Erhöht den Wert der Pizzen um 40"',
    '"Erhöht den Wert der Pizzen um 50"',
];

let upgradeBilder = [
    "Cookies/autoclicker.png",
    "Cookies/pizzabäcker.png",
    "Cookies/tomatenSauce.png",
    "Cookies/pizzaofen.png",
    "Cookies/cheese.png",
    "Cookies/pizzabot.png",
    "Cookies/sucuk.png",
]

let evosarray = [
    {name: "Starker Click", beschreibung: "Erhöht deine Klickkraft um 20%. Mehr Wumms pro Pizza!", preis: 7000, funktion: () => { cookieAdd *= 1.20; intervalreset(0, autoclicker, autoclick);}},
    {name: "Schneller Clicker", beschreibung: "Dein Autoclicker klickt jetzt doppelt so schnell.", preis: 12500, funktion: () => { autoclick /= 2; intervalreset(0, autoclicker, autoclick);}},
    {name: "Der Löffel", beschreibung: "Gustavo bekommt ein Spezialwerkzeug – doppelte Produktion!", preis: 30000, funktion: () => { gustavoAdd *= 2; intervalreset(1, gustavo, 1000);}},
    {name: "Chefhut", beschreibung: "Mit Hut kommt Ehre – Gustavo bringt doppelt so viel!", preis: 35000, funktion: () => { gustavoAdd *= 2; intervalreset(1, gustavo, 1000);}},
    {name: "Premium Tomate", beschreibung: "Verbesserte Tomatensauce: 20% mehr Pizzen pro Klick.", preis: 16200, funktion: () => { cookieAdd *= 1.20; }},
    {name: "Basilikum", beschreibung: "Ein bisschen Grün und Zack – ein Klick wird 20% mehr Wert.", preis: 24500, funktion: () => { cookieAdd *= 1.20; }},
    {name: "OlivenHolz", beschreibung: "Neue Pizzaschieber aus Olivenholz verdoppeln die Produktion.", preis: 38500, funktion: () => { ofenAdd *= 2; intervalreset(3, ofen, 1000);}},
    {name: "Mehr Platz!!!", beschreibung: "Mehr Öfen, mehr Pizzen – doppelte Leistung!", preis: 50000, funktion: () => { ofenAdd *= 2; intervalreset(3, ofen, 1000);}}
];

//Resetet die Intervalle damit die Evos wirken
function intervalreset(id, funktion, timestamp){

    if (intervalle[id]) {
        intervalle[id].forEach(intervalID => clearInterval(intervalID));
        intervalle[id] = []; 
    }

    if(upgrades[id].anzahl > 0){

        for(let i = 0; i < upgrades[id].anzahl; i++){
            
        let interval = setInterval(funktion, timestamp);
        intervalle[id].push(interval);

        }

    }
}


function maxgeld() {
    if (pizzaGesamt > pizza_meiste) 
    {
        pizza_meiste = pizzaGesamt; 
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

    //Zeigt die evos an
    let a = 6;
    for (let i = 3; i < upgrades.length; i++){

        let item1 = document.querySelector('.evos[data-id="' + a + '"]');
        let item2 = document.querySelector('.evos[data-id="' + (a + 1) + '"]');

        if (upgrades[i].anzahl > 0 && item1 && item2){
            item1.style.display = "block"
            item2.style.display = "block"
        }
        else{
            if(item1 && item2){
            item1.style.display = "none"
            item2.style.display = "none"
            }
        }

        a += 2;
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

        if (upgrades[x].preis > pizzaGesamt) {
            document.getElementById("up" + x + "-preis").classList.add("zuwenig");
        } else {
            document.getElementById("up" + x + "-preis").classList.remove("zuwenig");
        }

        let preisinfo = document.querySelector(".preisinfo")
        
        if(preisinfo && !preisinfo.dataset.id){
            
            if (upgrades[num].preis > pizzaGesamt){
                preisinfo.style.color = "red";
                
            }else{
                preisinfo.style.color = "rgb(27, 197, 27)";
                
            }
            
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
    
    let preisinfoevo = document.getElementById("preisinfo")
    if(preisinfoevo){
        
        if(evosarray[numevo].preis <= pizzaGesamt){
            preisinfoevo.style.color = "rgb(27, 197, 27)";
        }else{
            preisinfoevo.style.color = "red";
        }
        
    }    
    
    // Spezielle Pizza-Bild-Änderung
    if (upgrades[2].anzahl > 0 && upgrades[4].anzahl == 0) {
        document.getElementById("pizza-bild").src = "Cookies/pizzabild2.png";
    }
    if (upgrades[4].anzahl > 0 && upgrades[6].anzahl == 0) {
        document.getElementById("pizza-bild").src = "Cookies/pizzabild3.png";
    }
    if (upgrades[6].anzahl > 0) {
        document.getElementById("pizza-bild").src = "Cookies/pizzabild4.png";
    }

    //verstecke das Minigame oder zeige es an
    if (upgrades[4].anzahl > 0){
        let gamediv = document.getElementById("gamediv");
        gamediv.style.display = "block";
        let lockdiv = document.getElementById("lockdiv");
        if (lockdiv) {
            lockdiv.remove();
        }
        minigame.classList.add("unlocked")
    }
    else if(upgrades[4].anzahl == 0 && !gamegesperrt){
        let gamediv = document.getElementById("gamediv");
        gamediv.style.display = "none";
        gamegesperrt = true;
        
        let lockdiv = document.createElement("div")
        let lockbutton = document.createElement("button");
        let title = document.createElement("p")
        lockdiv.id = "lockdiv";
        lockbutton.id = "lockbutton";
        title.className = "lockedtext";
        lockbutton.innerHTML = "🔒 GESPERRT";
        title.innerHTML = "Ab Upgrade 5 verfügbar!!!"
        
        minigame.appendChild(lockdiv);
        lockdiv.appendChild(lockbutton);
        lockdiv.appendChild(title);
    }

    
        document.querySelectorAll(".buttonimg").forEach(img => {
        img.src = document.getElementById("pizza-bild").src;
        });

        document
    

}

//Der Hover Text der zeigt wie viel man pro Click bekommen hat
function clickanzahl(){
    
    const posX = event.clientX;
    const posY = event.clientY;

    let randomNumber = ((Math.random() * 8) - 1).toFixed(1);

    let anzeige = document.createElement("div")
    anzeige.className = "clickaddanzahl";

    anzeige.style.top = `${posY - 30}px`;
    anzeige.style.left = `${posX - 20 - randomNumber}px`;
    anzeige.innerText = "+" + Kommastelle(cookieAdd);


    document.body.appendChild(anzeige);
    setTimeout(() => anzeige.remove(), 2900);


}

let brett = document.querySelector("#evolution");
let brettbild = document.querySelector("#evolution > img");

lockedbereich = document.createElement("div");
locked = document.createElement("div");
text = document.createElement("p");


lockedbereich.id = "evolutionslockedbereich";
locked.id = "evolutionlocked";
text.className = "lockedtext"

function evolutionlock(){
    
    document.getElementById("evoarea").style.display = "none";

    brettbild.style.filter = "brightness(0.5)";

    


    brett.appendChild(lockedbereich);
    lockedbereich.appendChild(locked);
    lockedbereich.appendChild(text);
    
    
    locked.innerHTML = "🔒 GESPERRT"
    text.innerHTML = "Erst ab Upgrade 3 verfügbar!!!"
    gesperrt = true;
    
}

function evolutionunlock(){
    
    document.getElementById("evoarea").style.display = "block";

    brettbild.style.filter = "none";

    if (lockedbereich.parentNode === brett) {
        brett.removeChild(lockedbereich);
    }

    gesperrt = false;
}



//Die Info-Box einblendung
let intervallive;
let num;
document.querySelectorAll(".upgrade-img, .uupgrade-img").forEach(img => {

    img.addEventListener("mouseover", function(event) {

    num = event.target.dataset.num;
    let item = event.target;
    let itemname = document.getElementById("up" + num + "-name").textContent;

     if(num && !document.querySelector(".infos")){


        // Die Elemente der Info-BoxBox
        let info = document.createElement("div")
        let boxoben = document.createElement("div")
        let boxunten = document.createElement("div");
        let img = document.createElement("img")
        let name = document.createElement("h3")
        let beschreibungbox = document.createElement("p")
        let statsliste = document.createElement("ul");
        let statsolo = document.createElement("li");
        let statall = document.createElement("li");
        let statgesamt  = document.createElement("li");
        let preis = document.createElement("b");
        let pizza = document.createElement("img")

        // Element Klasse, Position und Styles geben
        info.className = "infos";
        const posY = event.clientY;
        info.style.top = `${posY - 50}px`;
        info.style.right = `${120}px`;

        preis.classList = "preisinfo"
        
        pizza.src = "Cookies/1_30_0026__01_03.png"
        pizza.id = "pizzabildinfo"
        img.src = upgradeBilder[num];
        img.className = "infosbild";
        
        //Die Info-Box wird erstellen
        document.body.appendChild(info)
        info.appendChild(boxoben);
        info.appendChild(boxunten);
        boxoben.appendChild(img);
        boxoben.appendChild(name);
        boxoben.appendChild(beschreibungbox)
        boxunten.appendChild(statsliste);
        statsliste.appendChild(statsolo);
        statsliste.appendChild(statall);
        statsliste.appendChild(statgesamt);
        boxunten.appendChild(pizza)
        boxunten.appendChild(preis);

        
        
        
        //Fügt der Info-Box die Informationen hinzu
        if(itemname !== "???" && plusprosek[num] > 0) {
            
            
            name.innerHTML = upgrades[num].name
            beschreibungbox.innerHTML = upgradeBeschreibung[num];
            statsolo.innerHTML = "Jeder " + upgrades[num].name + " generiert: " + "<span style='font-weight: bold;'>"+plusprosek[num].toFixed(2)+"</span>" + " Pizzen pro Sekunde";
            statall.innerHTML = upgrades[num].anzahl + " " + upgrades[num].name + " generieren: " + "<span style='font-weight: bold;'>"+ (plusprosek[num] * upgrades[num].anzahl).toFixed(1) +"</span>" + " Pizzen pro Sekunde";
            statgesamt.innerHTML = "Bisher hat " + upgrades[num].name + " " + "<span id='plusupgesamtlive' style='font-weight: bold;'>"+ Kommastelle(plusupgesamt[num]) +"</span>" + " Pizzen generiert";
            preis.innerHTML = Kommastelle(upgrades[num].preis);
            
            function aktualisieren(){

               let liveload = document.getElementById("plusupgesamtlive");
               liveload.innerHTML = ""
               liveload.innerHTML = Kommastelle(plusupgesamt[num]);

            }

            intervallive = setInterval(aktualisieren, 100);

        }
        else if(itemname !== "???" && plusprosek[num] == 0) {

            name.innerHTML = upgrades[num].name
            beschreibungbox.innerHTML = upgradeBeschreibung[num];
            statsolo.innerHTML = "Erhöht den Wert der Pizza um " + "<span style='font-weight: bold;'>"+ Kommastelle(upgrades[num].plus) +"</span>";
            preis.innerHTML = Kommastelle(upgrades[num].preis);

        }
        else{
            info.textContent = "???";
        }
        if (upgrades[num].anzahl == 0) {

            img.style.filter = "brightness(0)";

        }
    }
    farbe();
});

img.addEventListener("mousemove", function (event) {
    //Es wird geguckt ob die Info-Box existiert weil man sonst immer wieder neue erschaffen würde
    let info = document.querySelector(".infos");
  if (info) {

        //Ändert die position der Info-Box abghängig von der Mausposition
        const posY = event.clientY;
        info.style.top = `${posY - 50}px`;

        if (upgrades[num].preis > pizzaGesamt) {
            document.querySelector(".preisinfo").classList.add("zuwenig");
        } else {
            document.querySelector(".preisinfo").classList.remove("zuwenig");
        }
  }
});
    //Entfernt die Info-Box wenn man nicht mehr rüber hovert
    img.addEventListener("mouseout", function () {


    if(intervallive) clearInterval(intervallive);

     let infoDiv = document.querySelector(".infos");


    if (infoDiv) {
        infoDiv.remove();
    }

});
});

//Das kaufsystem der evos
let numevo
document.querySelectorAll(".evos").forEach(evoslot  =>{
    
    evoslot.addEventListener("mouseover", function(event){
        let item = event.target;
        numevo = item.dataset.id
        let infoDiv = document.querySelector(".infos");


if(!infoDiv){

        let info = document.createElement("div")
        let boxoben = document.createElement("div")
        let boxunten = document.createElement("div");
        let img = document.createElement("img")
        let name = document.createElement("h3")
        let beschreibungbox = document.createElement("p")
        let preis = document.createElement("b");
        let pizza = document.createElement("img");

        info.className = "infos";
        let posX = event.clientX;
        info.style.left = `${posX - 50}px`;
        info.style.bottom = `${180}px`;

        preis.id = "preisinfo"
        beschreibungbox.id = "beschreibungevo";

        boxoben.style.display = "flex";

        name.classList.add("infosevoname");

        pizza.src = "Cookies/1_30_0026__01_03.png"
        pizza.id = "pizzabildinfo"
        
        img.src = "Cookies/evo" + numevo + ".png";
        img.className = "infosbild";

        document.body.appendChild(info)
        info.appendChild(boxoben);
        info.appendChild(boxunten)
        boxoben.appendChild(img);
        boxoben.appendChild(name);
        boxunten.appendChild(beschreibungbox)
        boxunten.appendChild(pizza)
        boxunten.appendChild(preis)

            
            name.innerHTML = evosarray[numevo].name
            beschreibungbox.innerHTML = evosarray[numevo].beschreibung;
            preis.innerHTML = Kommastelle(evosarray[numevo].preis);

}
farbe();

    })

    evoslot.addEventListener("mousemove", function (event) {
        //Es wird geguckt ob die Info-Box existiert weil man sonst immer wieder neue erschaffen würde
        let info = document.querySelector(".infos");
      if (info) {

            //Ändert die position der Info-Box abghängig von der Mausposition
            let posX = event.clientX;
            info.style.left = `${posX - 50}px`;
      }
    });
        //Entfernt die Info-Box wenn man nicht mehr rüber hovert
    evoslot.addEventListener("mouseout", function () {



         let infoDiv = document.querySelector(".infos");


        if (infoDiv) {
            infoDiv.remove();
        }

    });
    
    //Eventlistener für die Evolustions
    evoslot.addEventListener("mousedown", function(event){
        let item = event.target;
        item.style.filter = "brightness(0.5)"
    })

    evoslot.addEventListener("mouseup", function(event){

        let item = event.target;

        item.style.filter = "brightness(1)";

    })
    
    evoslot.addEventListener("click", function(event){
        
        let item = event.target;
        numevo = item.dataset.id
        let infoDiv = document.querySelector(".infos");

        if(evosarray[numevo].preis <= pizzaGesamt){

            gekaufteEvos.push(Number(numevo));
            saveGame();
            infoDiv.remove();
            pizzaGesamt -= evosarray[numevo].preis;
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
            playBuySound();
            if(item.src){item.parentNode.remove();}
            else{item.remove();}
            evosarray[numevo].funktion();
            farbe();

        }


    })      
});

// Der Click auf die Pizza
cookie_bild.addEventListener("click", function() {
    pizzenoverall += cookieAdd;
    pizzaGesamt += cookieAdd;
    pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
    document.getElementById("gesamt-cookies").innerHTML = Kommastelle(pizzenoverall);
    maxgeld();
    farbe();
    clickanzahl()
})

//Die Klickgeräusche
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

//Damit der sound doppelt kommt wenn man länger gedrückt hält und los lässt
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

//Rechnet aus wie viele pizzen ein Upgrade pro Sekunde generiert 
function sekundenrechner(){

    plusprosek[0] = (cookieAdd / (autoclick / 1000)); 
    plusprosek[1] = gustavoAdd; 
    plusprosek[2] = 0;
    plusprosek[3] = ofenAdd;
    plusprosek[4] = 0;
    plusprosek[5] = pizzabotAdd;
    plusprosek[6] = 0;


    let autoclickergesamtplus = plusprosek[0] * upgrades[0].anzahl;
    let gustavogesamtplus = plusprosek[1] * upgrades[1].anzahl;
    let ofengesamtplus = plusprosek[3] * upgrades[3].anzahl;
    let pizzabotgesamtplus = plusprosek[5] * upgrades[5].anzahl;

    let plusinsgesamt = autoclickergesamtplus + gustavogesamtplus + ofengesamtplus + pizzabotgesamtplus;

    if (plusinsgesamt < 100) {
    document.getElementById("eingabe").innerHTML = (plusinsgesamt).toFixed(2);
    }
    else{
    document.getElementById("eingabe").innerHTML = Kommastelle(plusinsgesamt);
    }
    
}


//Kauf Funktion für Intervall Upgrades
function kaufinterval(id, funktion, intervalzeit) {

    if (pizzaGesamt >= upgrades[id].preis) {
        pizzaGesamt -= upgrades[id].preis;
        upgrades[id].anzahl++;
        upgrades[id].preis = Math.round(upgrades[id].startpreis * Math.pow(1.15, upgrades[id].anzahl));
        

        if (!intervalle[id]) {
            intervalle[id] = [];
        }

        let interval = setInterval(funktion, intervalzeit);
        intervalle[id].push(interval);

        if (id === 1) gustavoAdd *= 1.05;
        if (id === 3) ofenAdd *= 1.05;
        if (id === 5) pizzabotAdd *= 1.05;

        pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
        document.getElementById("up" + id + "-preis").innerHTML = Kommastelle(upgrades[id].preis);
        farbe();
        saveGame();
        playBuySound();
    } else {
        shake("shake" + id);
    }
}

//Kauf Funktion für Upgrades
function kaufup(id, funktion){

    if(pizzaGesamt >= upgrades[id].preis)
        {
        pizzaGesamt -= upgrades[id].preis;
        upgrades[id].anzahl++;
        upgrades[id].preis = Math.round(upgrades[id].startpreis * Math.pow(1.15, upgrades[id].anzahl));
        pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
        document.getElementById("up"+id+"-preis").innerHTML = Kommastelle(upgrades[id].preis);
        farbe();
        playBuySound();
        funktion();
        }
    else
        {
            shake("shake" + id);
        }
    
}

//Funktion für die Intervalle
function intervalupgrade(id, anzahl){
    
    pizzenoverall += anzahl;
    pizzaGesamt += anzahl;
    plusupgesamt[id] += anzahl;

    pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
    document.getElementById("gesamt-cookies").innerHTML = Kommastelle(pizzenoverall);
    maxgeld();
    farbe();
}

//Die Upgrades

//Upgrade 0
function autoclicker(){
    intervalupgrade(0, cookieAdd)
}

//upgrade 1
function gustavo(){
    intervalupgrade(1, gustavoAdd)
}

//Upgrade 2
function tomatensauce(){
    upgrades[2].plus *= 1.02;
    cookieAdd += upgrades[2].plus;
}

//upgrade 3
function ofen(){
    intervalupgrade(3, ofenAdd)
}

//upgrade 4
function cheese(){
    upgrades[4].plus *= 1.02
    cookieAdd += upgrades[4].plus;
}

//upgrade 5
function pizzabot(){
    intervalupgrade(5, pizzabotAdd)
}

//upgrade 6
function sucuk(){
    upgrades[6].plus *= 1.02;
    cookieAdd += upgrades[6].plus;
}
