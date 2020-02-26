// let hours = 0;
// let minutes = 0;
// let seconds = 0;
let ms = 0;
let timer;
let isRunning = false;
let laps = [];


function onStartClick() {
    console.log("start clicked");
    timer = setInterval(increment, 10);
    isRunning = true;
}

function onStopClick() {
    console.log("stop clicked");
    if (timer) {
        clearInterval(timer);
        isRunning = false;
        laps.push(ms);
        // laps.push("Lap " + (laps.length + 1) + ": " + numToString(hours) + ":" + numToString(minutes) + ":" + numToString(seconds) + "." + numToString(ms));
        updateLapsDisplay();
    }
    console.log(isRunning);
}

function onLapClick() {
    console.log("lap clicked");
    console.log("isRunning = ", isRunning)
    if (!isRunning) {
        ms = 0;
        laps = [];
    } else {
        laps.push(ms);
        // laps.push("Lap " + (laps.length + 1) + ": " + numToString(hours) + ":" + numToString(minutes) + ":" + numToString(seconds) + "." + numToString(ms));
    }
    updateLapsDisplay();
    updateTimerDisplay();
}

function increment() {
    ms++;
    // if (ms === 100) {
    //     seconds++;
    //     ms = 0;
    // }

    // if (seconds === 60) {
    //     minutes++;
    //     seconds = 0;
    // }

    // if (minutes === 60) {
    //     hours++;
    //     minutes = 0;
    // }

    updateTimerDisplay();
}

function numToString(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num.toString();
    }
}

// function msToString(ms) {
//     let msString = ms.toString();
//     if (msString.length < 3) {
//         msString = "0" + msString;
//         return msToString(msString);
//     } else {
//         return msString;
//     }
// }

function updateTimerDisplay() {
    let timeEl = document.getElementById('time-string');
    // let hrsEl = document.getElementById('hrs');
    // let minEl = document.getElementById('min');
    // let secEl = document.getElementById('sec');
    // let msEl = document.getElementById('ms');

    // hrsEl.innerText = numToString(hours);
    // minEl.innerText = numToString(minutes);
    // secEl.innerText = numToString(seconds);
    // msEl.innerText = numToString(ms);
    timeEl.innerText = convertMsToTimeString(ms);
}

function updateLapsDisplay() {
    let lapsEl = document.getElementById('lap-history');
    lapsEl.innerHTML = "";
    for (i = 0; i < laps.length; i++) {
        // lapsEl.innerHTML += "<label>" + laps[i] + "</label>";
        let thisLap = laps[i];
        let msDiff = thisLap;
        if (i > 0) {
            let previousLap = laps[i - 1];
            msDiff = thisLap - previousLap;
        }

        lapsEl.innerHTML += `<label>Lap ${numToString(i + 1)} - ${convertMsToTimeString(msDiff)} - ${convertMsToTimeString(thisLap)}</label>`;
    }
}

function convertMsToTimeString(msToBeConverted) {
    let s = Math.floor(msToBeConverted / 100);
    let milis = msToBeConverted % 100;
    let m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;

    return `${numToString(h)}:${numToString(m)}:${numToString(s)}.${numToString(milis)}`;
}
