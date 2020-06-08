const jsonFileName = '../levels.json';
const githubFileName = 'https://raw.githubusercontent.com/PeterHoppers/Countdown/master/levels.json';

let isStart = true;
let stage = 0;
let countdownValue = 0;
let levelNumber = 1;
let json;

function onLoad()
{
    const btn = document.getElementById("mainBtn");
    const lvlInfo = document.getElementById("levelInfo");
    const restart =  document.getElementById("restart");   
    restart.style["display"] = "none";
    
    const mainDisplay = document.getElementById("levelDisplay");
    const timeToHitUi = document.getElementById("targetTime");
    const rangeUi = document.getElementById("range");   
    
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    {
        loadJSON(function(response) {
          // Parse JSON string into object
            json = JSON.parse(response);
            
            mainDisplay.textContent = `Level ${levelNumber}`;
            timeToHitUi.textContent = `Time to Hit: ${getTime()} seconds`;
            rangeUi.textContent = `Range: Within ${getRange()} seconds`;
         });
    }
    else
    {
        fetch(githubFileName).then(function(resp){
            return resp.json();
        })
        .then(function(data)
        {
            console.log(data);
            json = data;
            
            mainDisplay.textContent = `Level ${levelNumber}`;
            timeToHitUi.textContent = `Time to Hit: ${getTime()} seconds`;
            rangeUi.textContent = `Range: Within ${getRange()} seconds`;
        });
    }       
    
    let startTime;
    let clickingFunction = function()
    {
        if (stage >= 2)
            stage = 0;
        else
            stage ++;
        
        if (stage === 0)
        {
            modifyButton(btn, "Start");
            restart.style["display"] = "none";
            lvlInfo.style["display"] = "inline";    
            
            mainDisplay.textContent = `Level ${levelNumber}`;
            timeToHitUi.textContent = `Time to Hit: ${getTime()} seconds`;
            rangeUi.textContent = `Range: Within ${getRange()} seconds`;
            
        }
        else if (stage === 1)
        {
            modifyButton(btn, "Stop");
            lvlInfo.style["display"] = "none";
            mainDisplay.textContent = `Click again when the moment is right.`;
            
            //start the timer
            startTime = new Date().getTime();
        }
        else
        {
            modifyButton(btn, "Finished");
            restart.style["display"] = "inline";
            lvlInfo.style["display"] = "inline"; 
            mainDisplay.textContent = `Level ${levelNumber}`;
            
            //timer
            let countdownValue = (new Date().getTime() - startTime) / 1000;
            
            let timeOff = Math.abs(getTime() - countdownValue);
            
            console.log(`The difference between the two times was ${timeOff}.`);
            
            let didWin = false;
            
            if (timeOff < getRange())
            {
                didWin = true;
                levelNumber++;
            }                
            
            mainDisplay.textContent = didWin ? "Success!" : "Failure!";
            
            mainDisplay.textContent += ` Your time was ${countdownValue} seconds.`;
            
            if (levelNumber - 1 === json.levels.length)
            {
                mainDisplay.innerHTML += "<div><strong><br>Congrats! You've beaten the game!</strong></div>";
                restart.textContent = "Want to play again?"
                restart.onclick = function(){window.location.reload();}; 
            }   
        }
    }
    
    btn.addEventListener("click", clickingFunction);
    restart.addEventListener("click", clickingFunction);    
}

function modifyButton(btn, state)
{
    if (state === "Finished")
    {   
        btn.style["display"] = "none";
    }
    else
    {
        btn.style["display"] = "inline-block";
        btn.className = state;
        btn.textContent = state;
    }
}

function setupStartDisplay()
{
    const mainDisplay = document.getElementById("levelDisplay");
    const timeToHitUi = document.getElementById("targetTime");
    const rangeUi = document.getElementById("range");
    
    mainDisplay.textContent = `Level ${levelNumber}`;
    timeToHitUi.textContent = `Time to Hit: ${getTime()} seconds`;
    rangeUi.textContent = `Range: Within ${getRange()} seconds`;
}

function getTime()
{
    return json.levels[levelNumber - 1].time;
}

function getRange()
{
    return json.levels[levelNumber - 1].range;
}

function loadJSON(callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '../levels.json', false); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }