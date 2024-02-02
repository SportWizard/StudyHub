function start() {
    selectTime()
}

function selectTime() {
    //session
    var sessionHour = document.getElementById("sessionHour");
    var sessionMinute = document.getElementById("sessionMinute");
    var sessionSecond = document.getElementById("sessionSecond");

    //break
    var breakHour = document.getElementById("breakHour");
    var breakMinute = document.getElementById("breakMinute");
    var breakSecond = document.getElementById("breakSecond");
    
    //hour
    for (var i = 0; i < 23; i++) {
        //session
        var sessionHourOption = document.createElement("option");
        
        sessionHourOption.value = i;
        sessionHourOption.text = i;

        sessionHour.append(sessionHourOption);

        //break
        var breakHourOption = document.createElement("option");
        
        breakHourOption.value = i;
        breakHourOption.text = i;

        breakHour.append(breakHourOption);
    }

    //minute and second
    for (var i = 0; i < 60; i++) {
        //session
        var sessionMinuteOption = document.createElement("option");

        sessionMinuteOption.value = i;
        sessionMinuteOption.text = i;

        sessionMinute.append(sessionMinuteOption);

        var sessionSecondOption = document.createElement("option");

        sessionSecondOption.value = i;
        sessionSecondOption.text = i;

        sessionSecond.append(sessionSecondOption);

        //break
        var breakMinuteOption = document.createElement("option");

        breakMinuteOption.value = i;
        breakMinuteOption.text = i;

        breakMinute.append(breakMinuteOption);

        var breakSecondOption = document.createElement("option");

        breakSecondOption.value = i;
        breakSecondOption.text = i;

        breakSecond.append(breakSecondOption);
    }
}

var onSession = true;
var currentSession = 1;
var timerInterval;
var running = false;

var sessionHour;
var sessionMinute;
var sessionSecond;
var breakHour;
var breakMinute;
var breakSecond;

var sessionHourString;
var sessionMinuteString;
var sessionSecondString;
var breakHourString;
var breakMinuteString;
var breakSecondString;

function updateTimer(hour, minute, second) {
    document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + second;
}

function setTimer() {
    //session
    if (onSession) {
        document.getElementById("status").innerHTML = "Status: Study";
        document.getElementById("session").innerHTML = "Session: " + currentSession;

        sessionHour = document.getElementById("sessionHour").value;
        sessionMinute = document.getElementById("sessionMinute").value;
        sessionSecond = document.getElementById("sessionSecond").value;

        sessionHourString = sessionHour;
        sessionMinuteString = sessionMinute;
        sessionSecondString = sessionSecond;

        if (sessionHour <= 9)
            sessionHourString = sessionHour.toString().padStart(2, '0');
        if (sessionMinute <= 9)
            sessionMinuteString = sessionMinute.toString().padStart(2, '0');
        if (sessionSecond <= 9)
            sessionSecondString = sessionSecond.toString().padStart(2, '0');

        updateTimer(sessionHourString, sessionMinuteString, sessionSecondString);
    }
    //break
    else {
        document.getElementById("status").innerHTML = "Status: Break";

        breakHour = document.getElementById("breakHour").value;
        breakMinute = document.getElementById("breakMinute").value;
        breakSecond = document.getElementById("breakSecond").value;

        breakHourString = breakHour;
        breakMinuteString = breakMinute;
        breakSecondString = breakSecond;
        
        if (breakHour <= 9)
            breakHourString = breakHour.toString().padStart(2, '0');
        if (breakMinute <= 9)
            breakMinuteString = breakMinute.toString().padStart(2, '0');
        if (breakSecond <= 9)
            breakSecondString = breakSecond.toString().padStart(2, '0');

        updateTimer(breakHourString, breakMinuteString, breakSecondString);
    }
}

function startStopTimer() {
    if (!running) {
        document.getElementById("startStopTimer").innerHTML = "Stop";
        running = true;

        if (!timerInterval) {
            timerInterval = setInterval(function() {
                if (sessionHour == 0 && sessionMinute == 0 && sessionSecond == 0 && onSession) {
                    document.getElementById("startStopTimer").innerHTML = "Start";
                    document.getElementById("studySession").style.backgroundColor = "white";
                    
                    clearInterval(timerInterval);
                    timerInterval = null;
                    
                    onSession = false;
                    running = false;

                    setTimer();
                }
                else if (breakHour == 0 && breakMinute == 0 && breakSecond == 0 && !onSession) {
                    document.getElementById("startStopTimer").innerHTML = "Start";
                    document.getElementById("studySession").style.backgroundColor = "white";
                    
                    clearInterval(timerInterval);
                    timerInterval = null;
                    
                    onSession = true;
                    running = false;

                    currentSession++;

                    setTimer();
                }
                else if (onSession) {
                    document.getElementById("studySession").style.backgroundColor = "red";

                    if (sessionMinute == 0 && sessionSecond == 0) {
                        sessionMinute = 59;
                        sessionHour--;
                    }
                    if (sessionSecond == 0) {
                        sessionSecond = 59;
                        sessionMinute--;
                    }

                    sessionHourString = sessionHour;
                    sessionMinuteString = sessionMinute;
                    sessionSecondString = sessionSecond;
            
                    if (sessionHour <= 9)
                        sessionHourString = sessionHour.toString().padStart(2, '0');
                    if (sessionMinute <= 9)
                        sessionMinuteString = sessionMinute.toString().padStart(2, '0');
                    if (sessionSecond <= 9)
                        sessionSecondString = sessionSecond.toString().padStart(2, '0');
                
                    updateTimer(sessionHourString, sessionMinuteString, sessionSecondString);

                    sessionSecond--;
                }
                else if (!onSession) {
                    document.getElementById("studySession").style.backgroundColor = "lightblue";

                    if (breakMinute == 0 && breakSecond == 0) {
                        breakMinute = 59;
                        breakHour--;
                    }
                    if (breakSecond == 0) {
                        breakSecond = 59;
                        breakMinute--;
                    }

                    breakHourString = breakHour;
                    breakMinuteString = breakMinute;
                    breakSecondString = breakSecond;
            
                    if (breakHour <= 9)
                        breakHourString = breakHour.toString().padStart(2, '0');
                    if (breakMinute <= 9)
                        breakMinuteString = breakMinute.toString().padStart(2, '0');
                    if (breakSecond <= 9)
                        breakSecondString = breakSecond.toString().padStart(2, '0');
                
                    updateTimer(breakHourString, breakMinuteString, breakSecondString);

                    breakSecond--;
                }
            }, 1000);
        }
    }
    else {
        document.getElementById("startStopTimer").innerHTML = "Start";
        document.getElementById("studySession").style.backgroundColor = "white";
        
        clearInterval(timerInterval);
        timerInterval = null;

        running = false;
    }
}

function resetTimer() {
    document.getElementById("startStopTimer").innerHTML = "Start";
    document.getElementById("studySession").style.backgroundColor = "white";
    
    clearInterval(timerInterval);
    timerInterval = null;
    
    updateTimer("00", "00", "00");  
    document.getElementById("session").innerHTML = "Session:";
    
    onSession = true;
    running = false;
    currentSession = 1;
}