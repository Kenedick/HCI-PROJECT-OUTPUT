let currentLang = "en";

const texts = {
en: {
    amount: "Enter Amount (₱)",
    placeholder: "Enter amount",
    choose: "Choose Coins:",
    exchange: "EXCHANGE COINS",
    clear: "CLEAR",
    fake: "FAKE MONEY",
    breakdown: "Coin Breakdown",
    total: "Total",

    invalidAmount: "Please enter a valid amount.",
    chooseCoin: "Please choose at least one coin.",
    remaining: "Remaining amount: ₱",
    success: "Exchange successful!",
    enterFirst: "Please enter an amount first.",
    fakeMsg: "FAKE MONEY DETECTED!",

    voiceExchange: "Exchange Coins",
    voiceClear: "Clear",
    voiceFake: "Fake Money",
    voiceFakeSpeak: "Your money is fake",
    voiceInvalid: "Please enter a valid amount",
    voiceChoose: "Please choose at least one coin",
    voiceRemaining: "Remaining amount",
    voiceSuccess: "Exchange successful",
    voiceEnterFirst: "Please enter an amount first",
    voiceCoin: "peso coin",
    voiceLang: "English"
},

tl: {
    amount: "Ilagay ang Halaga (₱)",
    placeholder: "Ilagay ang halaga",
    choose: "Pumili ng Barya:",
    exchange: "PALITAN NG BARYA",
    clear: "I-CLEAR",
    fake: "PEKENG PERA",
    breakdown: "Detalye ng Barya",
    total: "Kabuuan",

    invalidAmount: "Maglagay ng wastong halaga.",
    chooseCoin: "Pumili ng kahit isang barya.",
    remaining: "Natitirang halaga: ₱",
    success: "Matagumpay ang pagpapalit!",
    enterFirst: "Maglagay muna ng halaga.",
    fakeMsg: "PEKE ANG PERA MO!",

    voiceExchange: "Palitan ng barya",
    voiceClear: "I-clear",
    voiceFake: "Pekeng pera",
    voiceFakeSpeak: "Peke ang pera mo",
    voiceInvalid: "Maglagay ng wastong halaga",
    voiceChoose: "Pumili ng kahit isang barya",
    voiceRemaining: "Natitirang halaga",
    voiceSuccess: "Matagumpay ang pagpapalit",
    voiceEnterFirst: "Maglagay muna ng halaga",
    voiceCoin: "pisong barya",
    voiceLang: "Tagalog"
}

};

// ===============================
// VOICE FUNCTION
// ===============================

function speak(text) {

window.speechSynthesis.cancel();

let voice = new SpeechSynthesisUtterance(text);

voice.volume = 1;
voice.pitch = 1;

if (currentLang === "tl") {

    voice.lang = "fil-PH";
    voice.rate = 0.85;

    let voices = window.speechSynthesis.getVoices();

    let filVoice = voices.find(v =>
        v.lang === "fil-PH" ||
        v.lang === "fil" ||
        v.lang.startsWith("fil") ||
        v.name.toLowerCase().includes("filipino") ||
        v.name.toLowerCase().includes("tagalog")
    );

    if (filVoice) {
        voice.voice = filVoice;
    }

} else {

    voice.lang = "en-US";
    voice.rate = 1;
}

window.speechSynthesis.speak(voice);

}

window.speechSynthesis.onvoiceschanged = function () {
window.speechSynthesis.getVoices();
};

// ===============================
// LANGUAGE
// ===============================

function setLanguage(lang) {
currentLang = lang;

let t = texts[lang];

speak(t.voiceLang);

document.getElementById("label-amount").innerHTML = t.amount;

document.getElementById("amount").placeholder = t.placeholder;

document.getElementById("label-choose").innerHTML = t.choose;

document.getElementById("btn-exchange").innerHTML = t.exchange;

document.getElementById("btn-clear").innerHTML = t.clear;

document.getElementById("btn-fake").innerHTML = t.fake;

document.getElementById("label-breakdown").innerHTML = t.breakdown;

document.getElementById("label-total").innerHTML = t.total;

document.getElementById("lang-screen").classList.add("hidden");

document.getElementById("machine").classList.remove("hidden");

}

// ===============================
// EXCHANGE COINS
// ===============================

function exchangeCoins() {
let t = texts[currentLang];

let amount = Number(
    document.getElementById("amount").value
);

let msg = document.getElementById("message");


// Check amount
if (!amount || amount <= 0) {

    msg.className = "message";

    msg.innerHTML = t.invalidAmount;

    speak(t.voiceInvalid);

    return;
}


// Get selected coins
let coins = [...document.querySelectorAll(".coin:checked")]
    .map(c => Number(c.value))
    .sort((a, b) => b - a);


// Check selected coins
if (coins.length === 0) {

    msg.className = "message";

    msg.innerHTML = t.chooseCoin;

    speak(t.voiceChoose);

    return;
}


// Coin counts
let count = {
    20: 0,
    10: 0,
    5: 0,
    1: 0
};


/*
   IMPORTANT:

   Every selected coin must be included.

   Example:

   Amount = 1000

   Selected:
   20, 10, 5, 1

   First give 1 of each:

   20 + 10 + 5 + 1 = 36

   Remaining = 964

   Then distribute the remaining amount.
*/


let minimum = coins.reduce(
    (sum, coin) => sum + coin,
    0
);


// Amount is too small to use every selected coin
if (amount < minimum) {

    msg.className = "message";

    msg.innerHTML =
        "Amount must be at least ₱" + minimum +
        " to use all selected coins.";

    return;
}


let remaining = amount;


// Give one coin to every selected denomination
for (let coin of coins) {

    count[coin] = 1;

    remaining -= coin;
}


/*
   Add the remaining amount.

   Because ₱1 exists, any whole-peso amount
   can be completed exactly when ₱1 is selected.
*/

for (let coin of coins) {

    if (coin === 1) {
        continue;
    }

    let extra = Math.floor(remaining / coin);

    count[coin] += extra;

    remaining -= extra * coin;
}


// Put leftover amount into ₱1 coins
if (coins.includes(1) && remaining > 0) {

    count[1] += remaining;

    remaining = 0;
}


// Display breakdown
document.getElementById("coin20").innerHTML =
    count[20];

document.getElementById("coin10").innerHTML =
    count[10];

document.getElementById("coin5").innerHTML =
    count[5];

document.getElementById("coin1").innerHTML =
    count[1];


// Calculate total
let total =
    (20 * count[20]) +
    (10 * count[10]) +
    (5 * count[5]) +
    (1 * count[1]);


document.getElementById("total").innerHTML = total;


// Success
if (total === amount && remaining === 0) {

    msg.className = "message success";

    msg.innerHTML = t.success;

    speak(t.voiceSuccess);

} else {

    msg.className = "message";

    msg.innerHTML =
        t.remaining + remaining;

    speak(
        t.voiceRemaining +
        " " +
        remaining
    );
}

}

// ===============================
// FAKE MONEY
// ===============================

function fakeMoney() {
let t = texts[currentLang];

let amountInput =
    document.getElementById("amount");

let msg =
    document.getElementById("message");


// No amount entered
if (
    amountInput.value === "" ||
    Number(amountInput.value) <= 0
) {

    msg.className = "message";

    msg.innerHTML = t.enterFirst;

    speak(t.voiceEnterFirst);

    return;
}


// Only here will the fake-money voice play
speak(t.voiceFakeSpeak);

msg.className = "message";

msg.innerHTML = t.fakeMsg;

}

// ===============================
// CLEAR
// ===============================

function clearMachine() {
let t = texts[currentLang];

speak(t.voiceClear);

document.getElementById("amount").value = "";

document.querySelectorAll(".coin").forEach(c => {
    c.checked = false;
});


[20, 10, 5, 1].forEach(c => {

    document.getElementById(
        "coin" + c
    ).innerHTML = 0;
});


document.getElementById("total").innerHTML = 0;

document.getElementById("message").innerHTML = "";

document.getElementById("message").className =
    "message";

window.speechSynthesis.cancel();

}

// ===============================
// COIN VOICE
// ===============================

document.querySelectorAll(".coin").forEach(
function (coin) {
    coin.addEventListener(
        "change",
        function () {

            if (this.checked) {

                let t = texts[currentLang];

                speak(
                    this.value +
                    " " +
                    t.voiceCoin
                );
            }
        }
    );
}

);
