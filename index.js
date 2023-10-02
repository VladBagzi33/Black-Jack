let dealerSum = 0; // zbir karata dilera;
let yourSum = 0; // zbir karata igraca;

let dealerAceCount = 0; // broji koliko je 'A'(keceva) izvuceno, biramo da li je 1 ili 11. A(11) + 10 = 21 ili A(1) + 10 + 10 = 21;
let yourAceCount = 0;

let hidden; // varijabla koja prati okrenutu kartu;
let deck; // spil karata (mora biti 52 karte);

let canHit = true; //dozvoljava igracu da izvlaci karte dok yourSum <= 21;

window.onload = () => {
    buildDeck();
    shuffleDeck();
    startGame();
};

// ova funkcija pravi spil karata;
function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]; // vrednosti karata;
    let types = ["C", "D", "H", "S"]; // tipovi karata (karo, pik, srce, tref);
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); // ovde prolazimo kroz nizove(vrednost i tip karata) i spajamo sve tipove sa svim vrednostima A-C,2-C,3-C...;
        }
    }
}

// ova funkcija mesa karte;
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

// funkcija koja pokrece igru
function startGame() {
    hidden = deck.pop(); // izvlaci poslednju kartu iz spila i 'hidden' postaje njena vredost
    dealerSum += getValue(hidden); // gledamo koja je karta u hidden da bi mogli da je sabiramo
    dealerAceCount += checkAce(hidden); // proverava da li je karta A(kec)

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }


    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    const hitBtn = document.getElementById("hit");
    hitBtn.addEventListener("click", hit);
    const stayBtn = document.getElementById("stay");
    stayBtn.addEventListener("click", stay);
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    
    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
    }
}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    const result = document.getElementById("results");

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21) {
        message = "You Win!!!";
        result.style.color = "indianred";
    } else if (yourSum == dealerSum) {
        message = "Tie!";
    } else if (yourSum > dealerSum) {
        message = "You Win!!!";
        result.style.color = "indianred";
    } else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    
    const dealerResult = document.getElementById("dealer-sum");
    const yourResult = document.getElementById("your-sum");
    result.innerText = message;
    dealerResult.innerText = dealerSum;
    yourResult.innerText = yourSum;
}

// funkcija koja prikazuje vrednost karte koja je u 'hidden'
function getValue(card) {
    let data = card.split("-"); // ova linija koda razdvaja kartu (2-D -> "2", "D") gde je 2 vrednost a tip karte je D(karo)
    let value = data[0]; // data[0] je 2 jer je u nizu ["2", "D"] dvojka na indexu 0

    if (isNaN(value)) { // postavljamo uslov ako vrednost nije broj a to su (A, J, Q, K);
        if (value == "A") {
            return 11; // i ovde uslov ako je A(kec) vraca 11;
        }
        return 10; // a ovde ako je (J, Q, K) vraca 10;
    }
    return parseInt(value); // ova metoda uzima prvi broj iz stringa i vraca ga kao broj '2' = 2;
}

// funkcija koja proverava da li je karta A(kec)
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}