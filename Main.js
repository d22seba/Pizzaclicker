let pizzaGesamt = 100000;
let pizzenoverall = 0;
let cookieAdd = 1;
let cookie_bild = document.getElementById("pizza-bild");
let pizza_meiste = 0;
let autoclick = 8000;

let pizzakonto = document.getElementById("geld");

let plusprosek = []; 
let intervalle = {};


let gamegesperrt;
let gesperrt;

let gustavoAdd = 6;
let ofenAdd = 10;
let pizzabotAdd = 30;



function saveGame() {
    const gameState = {
        pizzaGesamt: pizzaGesamt,
        pizzenoverall: pizzenoverall,
        upgrades: upgrades,
        pizza_meiste: pizza_meiste,
        gesperrt: gesperrt,
        cookieAdd: cookieAdd,
        plusupgesamt: plusupgesamt,
        autoclick: autoclick,

        innerHTML: {
            geld: document.getElementById("geld").innerHTML,
            pizzenoverall: document.getElementById("gesamt-cookies").innerHTML,
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
        pizzaGesamt = gameState.pizzaGesamt;
        pizzenoverall = gameState.pizzenoverall;
        upgrades = gameState.upgrades;
        pizza_meiste = gameState.pizza_meiste;
        gesperrt = gameState.gesperrt;
        cookieAdd = gameState.cookieAdd;
        plusupgesamt = gameState.plusupgesamt;
        autoclick = gameState.autoclick;


        // Wiederherstellen der innerHTML-Inhalte
        document.getElementById("geld").innerHTML = gameState.innerHTML.geld;
        document.getElementById("gesamt-cookies").innerHTML = gameState.innerHTML.pizzenoverall;

        upgrades.forEach((_, x) => {
            document.getElementById("up" + x + "-name").innerHTML = gameState.innerHTML.upgradeNames[x];
            document.getElementById("up" + x + "-preis").innerHTML = gameState.innerHTML.upgradePreise[x];
        });


    }
}

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

function Kommastelle(zahl) {

    if (typeof zahl !== 'number') return zahl;

    if (zahl >= 1000 && zahl < 1000000) {
        return  zahl.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +"K"; 
    } 
    else if(zahl >= 1000000){
        zahl = zahl / 1000000;
        return zahl.toFixed(3) + "M";
    }
    else {
        return  zahl.toFixed(0);
    }
}


// Führt farbe aus wenn die Seite geladen wird
document.addEventListener("DOMContentLoaded", function() {
    //loadGame(); 
    farbe(); 
    starteAlleIntervalle();
    
    if(upgrades[2].anzahl > 0){  
        evolutionunlock();
    }
    else{
        evolutionlock();
    }
    
});

document.getElementById("sloteinsatz").max = pizzaGesamt;
let slotbutton = document.getElementById("spinbutton");
let minigame = document.getElementById("minigame");
let minigamename = document.getElementById("gamename");
let einsatz = document.getElementById("sloteinsatz");
let maxbet = document.getElementById("maxbet");
let autospin = document.getElementById("autospin");
let display = document.getElementById("ausgabedisplay");
let pressed = false;

minigame.addEventListener("click", () =>{
    minigame.style.left = "3%";
    minigame.style.height = "70%"
    minigame.classList.remove("zu");
})

let minigamebutton = document.getElementById("minigamebutton");
minigamebutton.addEventListener("click", () =>{
    event.stopPropagation();
    minigame.style.left = "-39%";
    minigame.style.height = "60%"
    minigame.classList.add("zu");

})

maxbet.addEventListener("click", function() {
    sloteinsatz.value = pizzaGesamt;
    einsatz.blur();
});



slotbutton.addEventListener("click", function() {

    
    if (sloteinsatz.value > pizzaGesamt) {
        return;
    }
    else{
        pizzaGesamt -= sloteinsatz.value;
        pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
        gamestart();
    }

    
});

einsatz.addEventListener("blur", function () {
    if (this.value < 100) {
        this.value = 100;
    }
});

let slotergebniss = [null, null, null];

function gamestart(){


    let einsatz
    slotbutton.disabled = true;
    display.innerHTML = "Spinning..."; 

    let spin1 = setInterval(() => spinslots(1), 60);
    let spin2 = setInterval(() => spinslots(2), 60);
    let spin3 = setInterval(() => spinslots(3), 60);

    setTimeout(() => clearInterval(spin1), 3000);
    setTimeout(() => clearInterval(spin2), 4000);
    setTimeout(() => {
        clearInterval(spin3); 
        slotbutton.disabled = false;
        slotergebniss[0] = document.getElementById("slot1").src;
        slotergebniss[1] = document.getElementById("slot2").src;
        slotergebniss[2] = document.getElementById("slot3").src;
        slotausgabe();
    }, 5000);


    
}

function spinslots(input){
    let pizzabild = document.getElementById("pizza-bild").src;
    let slotsbilder = [
    "Cookies/Autoclicker.png",
    "Cookies/Autoclicker.png",
    "Cookies/Autoclicker.png",
    "Cookies/Autoclicker.png",
    "Cookies/Autoclicker.png",
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

function slotausgabe(){
    let einsatzslots = Number(document.getElementById("sloteinsatz").value);

    let win1 = document.getElementById("up0-img").src;
    let win2 = document.getElementById("up1-img").src;
    let win3 = document.getElementById("up4-img").src;
    let win4 = document.getElementById("pizza-bild").src;
    

    if (slotergebniss[0] === slotergebniss[1] && slotergebniss[1] === slotergebniss[2]) {

        if (slotergebniss[0] == win1) {

            display.innerHTML = "Du hast"+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            let gewinn = einsatzslots * 100;
            pizzaGesamt += gewinn;
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
            
        } else if (slotergebniss[0] == win2) {

            display.innerHTML = "Du hast"+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            let gewinn = einsatzslots * 250;
            pizzaGesamt += gewinn;
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);

        } else if (slotergebniss[0] == win3) {

            display.innerHTML = "Du hast"+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            let gewinn = einsatzslots * 500;
            pizzaGesamt += gewinn;
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);

        } else if (slotergebniss[0] == win4) {

            display.innerHTML = "Du hast"+ Kommastelle(gewinn) + " Pizzen gewonnen!";
            let gewinn = einsatzslots * 1000;
            pizzaGesamt += gewinn;
            pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
        }
    }
    else{display.innerHTML = "Leider nichts gewonnen!";}


}





//Preise und Anzahl der Upgrades
let upgrades = [
    {id: "up0", name: "Autoclicker", preis: 10, anzahl: 0},
    {id: "up1", name: "Gustavo", preis: 120, anzahl: 0},
    {id: "up2", name: "TomatenSauce", preis: 1000, anzahl: 0, plus: 10},
    {id: "up3", name: "Ofen", preis: 3200, anzahl: 0},
    {id: "up4", name: "Käse", preis: 9600, anzahl: 0, plus: 30},
    {id: "up5", name: "Pizzabot", preis: 16200, anzahl: 0},
    {id: "up6", name: "Sucuk", preis: 32000, anzahl: 0, plus: 40},
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
    "Cookies/Autoclicker.png",
    "Cookies/pizzabäcker.png",
    "Cookies/Tomatensauce.png",
    "Cookies/pizzaofen.png",
    "Cookies/cheese.png",
    "Cookies/pizzabot.png",
    "Cookies/sucuk.png",
]

let evosarray = [
    {name: "Starker Click", beschreibung: "Erhöht deine Klickkraft um 20%. Mehr Wumms pro Pizza!", preis: 1500, funktion: () => { cookieAdd *= 1.20; intervalrest(0); }},
    {name: "Schneller Clicker", beschreibung: "Dein Autoclicker klickt jetzt doppelt so schnell.", preis: 2500, funktion: () => { autoclick /= 2; intervalrest(0); }},
    {name: "Der Löffel", beschreibung: "Gustavo bekommt ein Spezialwerkzeug – doppelte Produktion!", preis: 3000, funktion: () => { gustavoAdd *= 2; intervalrest(1); }},
    {name: "Chefhut", beschreibung: "Mit Hut kommt Ehre – Gustavo bringt doppelt so viel!", preis: 3500, funktion: () => { gustavoAdd *= 2; intervalrest(1); }},
    {name: "Premium Tomate", beschreibung: "Verbesserte Tomatensauce: 20% mehr Pizzen pro Klick.", preis: 2000, funktion: () => { cookieAdd *= 1.20; }},
    {name: "Basilikum", beschreibung: "Ein bisschen Grün und Zack – Autoclicker wird schneller.", preis: 3000, funktion: () => { autoclick /= 2; }},
    {name: "OlivenHolz", beschreibung: "Neue Pizzaschieber aus Olivenholz verdoppeln die Produktion.", preis: 3500, funktion: () => { gustavoAdd *= 2; intervalrest(3); }},
    {name: "Mehr Platz!!!", beschreibung: "Mehr Öfen, mehr Pizzen – doppelte Leistung!", preis: 5000, funktion: () => { gustavoAdd *= 2; intervalrest(3); }}
];


function intervalrest(id){

    if (intervalle[id]) {
        intervalle[id].forEach(intervalID => clearInterval(intervalID));
        intervalle[id] = []; 
    }

    if(upgrades[id].anzahl > 0){

        for(let i = 0; i < upgrades[id].anzahl; i++){
            
        let interval = setInterval(funktion, interval);
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
    if (upgrades[2].anzahl == 1 && upgrades[4].anzahl == 0) {
        document.getElementById("pizza-bild").src = "Cookies/pizzabild2.png";
    }
    if (upgrades[4].anzahl == 1 && upgrades[6].anzahl == 0) {
        document.getElementById("pizza-bild").src = "Cookies/pizzabild3.png";
    }
    if (upgrades[6].anzahl == 1) {
        document.getElementById("pizza-bild").src = "Cookies/pizzabild4.png";
    }

    //verstecke das Minigame oder zeige es an
    if (upgrades[3].anzahl == 1){
        let gamediv = document.getElementById("gamediv");
        gamediv.style.display = "block";
        let lockdiv = document.getElementById("lockdiv");
        if (lockdiv) {
            lockdiv.remove();
        }
        minigame.classList.add("unlocked")
    }
    else if(upgrades[3].anzahl == 0 && !gamegesperrt){
        let gamediv = document.getElementById("gamediv");
        gamediv.style.display = "none";
        gamegesperrt = true;
        
        let lockdiv = document.createElement("div")
        let lockbutton = document.createElement("button");
        lockdiv.id = "lockdiv";
        lockbutton.id = "lockbutton";
        lockbutton.innerHTML = "🔒 GESPERRT";
        
        minigame.appendChild(lockdiv);
        lockdiv.appendChild(lockbutton);
    }

    
        document.querySelectorAll(".buttonimg").forEach(img => {
        img.src = document.getElementById("pizza-bild").src;
        });
    

}

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
        if(itemname !== "???" && plusprosek[num] !== undefined) {
            
            
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
        else if(itemname !== "???" && plusprosek[num] == undefined) {

            name.innerHTML = upgrades[num].name
            beschreibungbox.innerHTML = upgradeBeschreibung[num];
            statsolo.innerHTML = "Erhöht den Wert der Pizza um " + "<span style='font-weight: bold;'>"+upgrades[num].plus+"</span>";
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

    //autoclicker
    plusprosek[0] = (cookieAdd / (autoclick / 1000)); 
    //gustavo
    plusprosek[1] = gustavoAdd; 
    //ofen
    plusprosek[3] = ofenAdd;
    //pizzabot
    plusprosek[5] = pizzabotAdd;


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



function kaufinterval(id, funktion, intervalzeit) {

    if (pizzaGesamt >= upgrades[id].preis) {
        pizzaGesamt -= upgrades[id].preis;
        upgrades[id].preis = Math.round(upgrades[id].preis * 1.30);
        upgrades[id].anzahl++;

        if (!intervalle[id]) {
            intervalle[id] = [];
        }

        let interval = setInterval(funktion, intervalzeit);
        intervalle[id].push(interval);

        pizzakonto.innerHTML = Kommastelle(pizzaGesamt);
        document.getElementById("up" + id + "-preis").innerHTML = Kommastelle(upgrades[id].preis);
        farbe();
        playBuySound();
    } else {
        shake("shake" + id);
    }
}

function kaufup(id, funktion){

    if(pizzaGesamt >= upgrades[id].preis)
        {
        pizzaGesamt -= upgrades[id].preis;
        upgrades[id].preis = Math.round(upgrades[id].preis * 1.45);
        upgrades[id].anzahl++;
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
    cookieAdd += 10;
}

//upgrade 3
function ofen(){
    intervalupgrade(3, ofenAdd)
}

//upgrade 4
function cheese(){
    cookieAdd += 30;
}

//upgrade 5
function pizzabot(){
    intervalupgrade(5, pizzabotAdd)
}

//upgrade 6
function sucuk(){
    cookieAdd += 50
}