class Timestamp {
    constructor(time, action){
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
    clearInterval(timer);
    tsArr.push(new Timestamp(Date.now(), 'STOP'));
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
        elapsed = 0;
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
    tenths++;
    updateTimerDisplay();
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
    timeEl.innerText = convertToTimeString(/*tenths*/);
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
    if (m === 60){
        m = 0;
        h++;
    }
    // return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${tenths}`;
    return h.toString().padStart(2,'0') + ':' + m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0') + '.' + tenths;
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

        if (currentAct !== 'START'){
            lapCount++;
        }

        // console.log(elapsed);
        let diffObj = convertMsToObject(diff);
        let elapObj = convertMsToObject(elapsed);
        // console.log(elapObj);
        if (i > 0 && currentAct !== 'START') {
            // lapsEl.innerHTML += `<p>Lap ${numToString(lapCount)} - ${numToString(diffObj.hours)}:${numToString(diffObj.minutes)}:${numToString(diffObj.seconds)}.${msToString(diffObj.miliseconds)} - ${numToString(elapObj.hours)}:${numToString(elapObj.minutes)}:${numToString(elapObj.seconds)}.${msToString(elapObj.miliseconds)}</p>`;
            lapsEl.innerHTML += `<p>Lap ${lapCount.toString().padStart(2,'0')} - ${numToString(diffObj.hours)}:${numToString(diffObj.minutes)}:${numToString(diffObj.seconds)}.${msToString(diffObj.miliseconds)} - ${numToString(elapObj.hours)}:${numToString(elapObj.minutes)}:${numToString(elapObj.seconds)}.${msToString(elapObj.miliseconds)}</p>`;
        }
        
    }
}
