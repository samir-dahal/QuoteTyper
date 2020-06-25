const quote = document.querySelector(".quote");
const timer = document.querySelector(".timer");
const quoteInput = document.querySelector(".quote-input");
const congratsOverlay = document.querySelector(".congrats-overlay");
const $ = (element) => document.querySelector(element);
//api url
const quote_url = "https://api.quotable.io/random";
let count = 0;
let timerEnd = false;
let totalSeconds = 0;
let totalErrors = 0;
let totalKeyStrokes = 0;
let currentIndex = 0;
let quoteToType = [];
let totalWords = 0;
function GetRandomQuote(url) {
    //api call
    return fetch(url)
        .then(res => res.json())
        .then(data => data.content);
}
async function RenderNewQuote(element) {
    element.innerHTML = "Generating new quote, please wait...";
    InputEnable(quoteInput, false);
    const newQuote = await GetRandomQuote(quote_url);
    totalWords = newQuote.split(' ').length;
    InputEnable(quoteInput, true);
    element.innerHTML = "";
    //appends quote to specified element
    AppendQuote(element, newQuote);
    //start timer
    StartTimer();
}
RenderNewQuote(quote);
function StartTimer() {
    let interval = setInterval(() => {
        if (timerEnd) {
            EndTimer(interval);
            return;
        }
        timer.innerHTML = ++count;
        totalSeconds++;
    }, 1000);

}
function EndTimer(interval) {
    clearInterval(interval);
}




function BeginTyping(e) {
    if (currentIndex < quoteToType.length - 1) {
        if (e.key.length !== 1) {
            return;
        }
        //check char on input
        if (e.key == quoteToType[currentIndex]) {
            e.target.value = "";
            currentIndex++;
            quote.children[currentIndex].style.color = "#99cc00";
        }
        else {
            quote.children[currentIndex].style.color = "red";
            totalErrors++;
            totalKeyStrokes++
        }
    }
    else {
        if (e.key !== quoteToType[currentIndex]) {
            quote.children[currentIndex].style.color = "red";
            totalErrors++;
            return;
        }
        quote.children[currentIndex].style.color = "#99cc00";
        e.target.removeEventListener("keydown", BeginTyping, false);
        quoteInput.value = "";
        InputEnable(quoteInput, false);
        timerEnd = true;
        CalculateResult();
    }
}
function AppendQuote(element, newQuote) {
    quoteToType = newQuote.split('');
    quoteToType.forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        element.appendChild(charSpan);
    })
    //current color
    quote.children[currentIndex].style.color = "#99cc00";
}

function InputEnable(element, initial) {
    if (initial) {
        element.disabled = false;
        element.focus();
    }
    if (initial == false) {
        element.disabled = true;
    }
}

//calculate result
function CalculateResult() {
    let totalMinutes = (totalSeconds / 60);
    let typingAccuracy = ((quoteToType.length - totalErrors) / quoteToType.length * 100).toFixed(2);
    let wpm = (totalWords / totalMinutes).toFixed(0);
    //show overlay
    $(".congrats-mesg").innerHTML = "Congrats! You completed the typing test.";
    $(".typing-speed").innerHTML = `Typing speed: ${wpm} WPM.`;
    $(".typing-accuracy").innerHTML = `Typing accuracy: ${typingAccuracy}%`;
    $(".total-errors").innerHTML = `Total Typos: ${totalErrors}`;
    congratsOverlay.style.display = "block";
}
$(".replay").onclick = function () {
    congratsOverlay.style.display = "none";
    count = 0;
    timerEnd = false;
    totalSeconds = 0;
    totalErrors = 0;
    totalKeyStrokes = 0;
    currentIndex = 0;
    quoteToType = [];
    totalWords = 0;
    RenderNewQuote(quote)
    AddEvent("keydown");
}
//input event
function AddEvent(evnt) {
    quoteInput.addEventListener(evnt, BeginTyping, false);
}
AddEvent("keydown");