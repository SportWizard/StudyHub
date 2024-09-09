function start() {
    selectTime()
}

// For choosing the time / session length the user desire
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

var onSession = true; // Session on going (True for study session. False for break session)
var currentSession = 1; // The current session the user is on
var timerInterval;
var running = false; // Whether the timer is running

// Store time
var sessionHour;
var sessionMinute;
var sessionSecond;
var breakHour;
var breakMinute;
var breakSecond;

// Time displayed in String
var sessionHourString;
var sessionMinuteString;
var sessionSecondString;
var breakHourString;
var breakMinuteString;
var breakSecondString;

// Gets display on the screen
function updateTimer(hour, minute, second) {
    document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + second;
}

// Convert input acquired from selectTime into String
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

        // Adding an extra zero in front for single digit numbers
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

// Run the timer and also start and stop the timer
function startStopTimer() {
    // Start the timer
    if (!running) {
        document.getElementById("startStopTimer").innerHTML = "Stop";
        running = true;

        if (!timerInterval) {
            timerInterval = setInterval(function() {
                // Study session finished
                if (sessionHour == 0 && sessionMinute == 0 && sessionSecond == 0 && onSession) {
                    document.getElementById("startStopTimer").innerHTML = "Start";
                    document.getElementById("studySession").style.backgroundColor = "white";
                    
                    clearInterval(timerInterval);
                    timerInterval = null;
                    
                    onSession = false;
                    running = false;

                    setTimer();
                }
                // Break session finished
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
                // On going study session
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
                // On going break session
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
    // Stop the timer
    else {
        document.getElementById("startStopTimer").innerHTML = "Start";
        document.getElementById("studySession").style.backgroundColor = "white";
        
        clearInterval(timerInterval);
        timerInterval = null;

        running = false;
    }
}

// Reset the timer to default
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