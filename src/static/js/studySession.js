function start() {
    selectTime();
    setTimer();
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
var sessionHour = 0;
var sessionMinute = 0;
var sessionSecond = 0;
var breakHour = 0;
var breakMinute = 0;
var breakSecond = 0;

// Time displayed in String
var sessionHourString = "00";
var sessionMinuteString = "00";
var sessionSecondString = "00";
var breakHourString = "00";
var breakMinuteString = "00";
var breakSecondString = "00";

// Store Exp
var exp = 0;

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
    if (sessionHourString == "00" && sessionMinuteString == "00" && sessionSecondString == "00")
        setTimer();

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

                    // Send post request to Flask about the amount of exp the user has earned
                    fetch("/study-session", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8" // Ensure the header matches the data being sent
                        },
                        body: JSON.stringify({
                            exp: exp
                        })
                    })
                    .then(data => {
                        console.log("Exp Update Success:", data);
                    })
                    .catch(error => {
                        console.error('Exp Update Error:', error);
                    });

                    // This is needed to update what is displayed, since getting the value updated using {{ }} requires refreshing and this reset everything
                    currentLevel = parseInt(document.getElementById("level").innerHTML); // Retrieve level before update
                    currentExp = parseInt(document.getElementById("exp").innerHTML); // Retrieve exp before update
                    currentMaxExp = parseInt(document.getElementById("maxExp").innerHTML); // Retrieve max exp before update

                    updatedExp = currentExp + exp;// Update displayed exp

                    // Used to update what is displayed due to the problem describe in the previous comment
                    if (updatedExp >= currentMaxExp) {
                        // If exp reaches or exceeds max_exp, the exceeded exp will remain, the max_exp will increase by 50 and the the user will level up
                        updatedExp -= currentMaxExp;
                        document.getElementById("maxExp").innerHTML = currentMaxExp + 50;
                        document.getElementById("level").innerHTML = currentLevel + 1;
                    }

                    document.getElementById("exp").innerHTML = updatedExp;
                    document.getElementById("progress").style.width = (updatedExp / currentMaxExp * 100) + "%"; // Update exp progress bar

                    exp = 0; // Reset exp
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

                    // Decrement hour
                    if (sessionMinute == 0 && sessionSecond == 0) {
                        sessionMinute = 60;
                        sessionHour--;
                    }
                    // Decrement minute
                    if (sessionSecond == 0) {
                        sessionSecond = 60;
                        sessionMinute--;
                    }

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

                    // Decrement second
                    sessionSecond--;

                    // Exp counter
                    exp++;
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

    onSession = true;
    running = false;
    currentSession = 1;
    
    sessionHour = 0;
    sessionMinute = 0;
    sessionSecond = 0;
    breakHour = 0;
    breakMinute = 0;
    breakSecond = 0;

    setTimer();

    exp = 0;
}