class Timestamp {
    constructor(time, action) {
        this.time = time;
        this.action = action;
    }
}

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const lapBtn = document.getElementById('lapBtn');
const timeEl = document.getElementById('time-string');
const lapsEl = document.getElementById('lap-history');

let tenths = 1;
let timer;
let isRunning = false;
let tsArr = [];
let elapsedTime = 0;
let blurTS;

let s = 0;
let m = 0;
let h = 0;

function onStartClick() {
    timer = setInterval(increment, 100);
    tsArr.push(new Timestamp(Date.now(), 'START'));
    isRunning = true;
    startBtn.setAttribute('disabled', 'true');
    stopBtn.removeAttribute('disabled');
    lapBtn.removeAttribute('disabled');
}

function onStopClick() {
    tsArr.push(new Timestamp(Date.now(), 'STOP'));
    clearInterval(timer);
    // if (timer) {
    // clearInterval(timer);
    isRunning = false;
    startBtn.removeAttribute('disabled');
    stopBtn.setAttribute('disabled', 'true');
    updateLapsDisplay();
    // }
}

function onLapClick() {
    if (!isRunning) {
        tenths = 0;
        s = 0;
        m = 0;
        h = 0;
        tsArr = [];
        elapsedTime = 0;
        startBtn.removeAttribute('disabled');
        lapBtn.setAttribute('disabled', 'true');
        stopBtn.setAttribute('disabled', 'true');
        updateTimerDisplay();
        tenths = 1;
    } else {
        tsArr.push(new Timestamp(Date.now(), 'LAP'));

    }
    updateLapsDisplay();
}

function increment() {
    updateTimerDisplay();
    tenths++;
}

function numToString(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num.toString();
    }
}

function msToString(milis) {
    let msString = milis.toString();
    if (msString.length < 3) {
        msString = "0" + msString;
        return msToString(msString);
    } else {
        return msString;
    }
}

function updateTimerDisplay() {
    // let timeEl = document.getElementById('time-string');
    // timeEl.innerText = convertToTimeString(/*tenths*/);
    timeEl.textContent = convertToTimeString();
}

function convertToTimeString(/*tenthsToBeConverted*/) {
    // s = Math.floor(tenthsToBeConverted / 10);
    // let temptenths = tenthsToBeConverted % 10;
    // m = Math.floor(s / 60);
    // s = s % 60;
    // h = Math.floor(m / 60);
    // m = m % 60;

    // return `${numToString(h)}:${numToString(m)}:${numToString(s)}.${temptenths}`;
    // let temptenths = tenths % 10;
    if (tenths === 10) {
        tenths = 0;
        s++;
    }
    if (s === 60) {
        s = 0;
        m++;
    }
    if (m === 60) {
        m = 0;
        h++;
    }
    // return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${tenths}`;
    return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0') + '.' + tenths;
}

function convertMsToObject(msToConvert) {
    let s = Math.floor(msToConvert / 1000);
    let milis = msToConvert % 1000;
    let m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;

    return { hours: h, minutes: m, seconds: s, miliseconds: milis };
}

function updateLapsDisplay() {
    // let lapsEl = document.getElementById('lap-history');
    lapsEl.innerHTML = "";
    let elapsed = 0;
    let lapCount = 0;
    // if stop has been pressed, then record that as an end to a lap, but need to not count time betwen Stop and ReStart
    for (let i = 0; i < tsArr.length; i++) {
        let current = tsArr[i];
        let currentAct = current.action;
        let currTime = current.time;
        let j = i - 1 < 0 ? 0 : i - 1;
        let prev = tsArr[j];
        let prevTime = prev.time;
        let prevAct = prev.action;
        diff = currTime - prevTime;
        if (prevAct !== 'STOP') {
            // count as elapsed time
            elapsed += diff;
        }

        if (currentAct !== 'START') {
            lapCount++;
        }

        // console.log(elapsed);
        let diffObj = convertMsToObject(diff);
        let elapObj = convertMsToObject(elapsed);
        // console.log(elapObj);
        if (i > 0 && currentAct !== 'START') {
            // lapsEl.innerHTML += `<p>Lap ${numToString(lapCount)} - ${numToString(diffObj.hours)}:${numToString(diffObj.minutes)}:${numToString(diffObj.seconds)}.${msToString(diffObj.miliseconds)} - ${numToString(elapObj.hours)}:${numToString(elapObj.minutes)}:${numToString(elapObj.seconds)}.${msToString(elapObj.miliseconds)}</p>`;
            lapsEl.innerHTML += `<p>Lap ${lapCount.toString().padStart(2, '0')} - ${numToString(diffObj.hours)}:${numToString(diffObj.minutes)}:${numToString(diffObj.seconds)}.${msToString(diffObj.miliseconds)} - ${numToString(elapObj.hours)}:${numToString(elapObj.minutes)}:${numToString(elapObj.seconds)}.${msToString(elapObj.miliseconds)}</p>`;
        }

    }
}

// function updateLapsDisplay2() {
//     let newLapText = "";
//     let newLapPara = document.createElement('p');
//     let lastTSIndex = tsArr.length - 1;
//     let prevTSIndex = tsArr.length - 2 < 0 ? 0 : tsArr.length - 2;
//     let lastTS = tsArr[lastTSIndex];
//     let prevTS = tsArr[prevTSIndex];

//     diff = lastTS.time - prevTS.time;
//     if (prevTS.action !== 'STOP') {
//         elapsedTime += diff;
//     }
//     let lapCount = tsArr.filter(ts => ts.action !== 'START').length;
//     let diffObj = convertMsToObject(diff);
//     let elapObj = convertMsToObject(elapsedTime);
//     if (lastTS.action !== 'START') {
//         newLapText = `Lap ${lapCount.toString().padStart(2,'0')} - ${diffObj.hours.toString().padStart(2, '0')}:${diffObj.minutes.toString().padStart(2, '0')}:${diffObj.seconds.toString().padStart(2, '0')}.${diffObj.miliseconds.toString().padStart(3, '0')} - ${elapObj.hours.toString().padStart(2, '0')}:${elapObj.minutes.toString().padStart(2, '0')}:${elapObj.seconds.toString().padStart(2, '0')}.${msToString(elapObj.miliseconds)}`;
//         newLapPara.textContent = newLapText;
//         lapsEl.appendChild(newLapPara);
//     }


// }

window.onblur = (event) => {
    if (timer && isRunning) {
        blurTS = new Timestamp(Date.now(), 'BLUR');
        clearInterval(timer);
    }
    // console.log(event);
}

window.onfocus = (event) => {
    let nowms = Date.now();
    // console.log(event);
    // console.log(blurTS);
    if (blurTS) {
        // determine difference between now and blurTS
        let difftime = nowms - blurTS.time;
        // console.log(difftime);
        // add difference to existing amount of time that passed
        // first, convert displayed time-passed to milliseconds
        let currentMS = (tenths * 100) + (s * 1000) + (m * 60000) + (h * 3600000);
        // console.log(currentMS);
        let newMS = difftime + currentMS;
        // console.log(newMS);
        // then update the displayed times
        let currentDisplayTimeObj = convertMsToObject(newMS);
        // console.log(currentDisplayTimeObj);
        h = currentDisplayTimeObj.hours;
        m = currentDisplayTimeObj.minutes;
        s = currentDisplayTimeObj.seconds;
        tenths = Math.floor(currentDisplayTimeObj.miliseconds / 100) + 1;//add one because interval executes after 100ms
        // restart interval, which will update display
        timer = setInterval(increment, 100);
    }
    blurTS = null;
}
