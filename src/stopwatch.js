class Timestamp {
    constructor(time, action){
        this.time = time;
        this.action = action;
    }
}

let ms = 0;
let timer;
let isRunning = false;
let laps = [];
let tsArr = [];

function onStartClick() {
    
    tsArr.push(new Timestamp(Date.now(), 'START'));
    timer = setInterval(increment, 100);
    isRunning = true;
    document.getElementById('startBtn').setAttribute('disabled', 'true');
    document.getElementById('stopBtn').removeAttribute('disabled');
    document.getElementById('lapBtn').removeAttribute('disabled');
    console.log(tsArr);
}

function onStopClick() {
    tsArr.push(new Timestamp(Date.now(), 'STOP'));
    console.log(tsArr);
    if (timer) {
        clearInterval(timer);
        isRunning = false;
        document.getElementById('startBtn').removeAttribute('disabled');
        document.getElementById('stopBtn').setAttribute('disabled', 'true');
        laps.push(ms);
        // updateLapsDisplay();
        updateLapsDisplayMoreAccurately();
    }
}

function onLapClick() {
    if (!isRunning) {
        ms = 0;
        laps = [];
        tsArr = [];
        elapsed = 0;
        document.getElementById('startBtn').removeAttribute('disabled');
        document.getElementById('lapBtn').setAttribute('disabled', 'true');
        document.getElementById('stopBtn').setAttribute('disabled', 'true');
    } else {
        tsArr.push(new Timestamp(Date.now(), 'LAP'));
        console.log(tsArr);
        laps.push(ms);

    }
    // updateLapsDisplay();
    updateLapsDisplayMoreAccurately();
    updateTimerDisplay();
}

function increment() {
    ms++;
    updateTimerDisplay();
}

function numToString(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num.toString();
    }
}

function msToString(ms) {
    let msString = ms.toString();
    if (msString.length < 3) {
        msString = "0" + msString;
        return msToString(msString);
    } else {
        return msString;
    }
}

function updateTimerDisplay() {
    let timeEl = document.getElementById('time-string');
    timeEl.innerText = convertMsToTimeString(ms);
}

function updateLapsDisplay() {
    let lapsEl = document.getElementById('lap-history');
    lapsEl.innerHTML = "";
    for (let i = 0; i < laps.length; i++) {
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
    let s = Math.floor(msToBeConverted / 10);
    let milis = msToBeConverted % 10;
    let m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;

    return `${numToString(h)}:${numToString(m)}:${numToString(s)}.${milis}`;
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

function updateLapsDisplayMoreAccurately() {
    let lapsEl = document.getElementById('lap-history');
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

        console.log(elapsed);
        let diffObj = convertMsToObject(diff);
        let elapObj = convertMsToObject(elapsed);
        console.log(elapObj);
        if (i > 0 && currentAct !== 'START') {
            lapsEl.innerHTML += `<label>Lap ${numToString(lapCount)} - ${numToString(diffObj.hours)}:${numToString(diffObj.minutes)}:${numToString(diffObj.seconds)}.${msToString(diffObj.miliseconds)} - ${numToString(elapObj.hours)}:${numToString(elapObj.minutes)}:${numToString(elapObj.seconds)}.${msToString(elapObj.miliseconds)}</label>`;
        }
        
    }
}