const jsonFileName = '../levels.json';
const githubFileName = 'https://raw.githubusercontent.com/PeterHoppers/Countdown/master/.brackets.json';

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
    
    let startTime = new Date().getTime();
    
    let clickingFunction = function()
    {
        console.log(`In this function ${stage}`);
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
            
            //timer
            startTime = new Date().getTime();
        }
        else
        {
            modifyButton(btn, "Finished");
            restart.style["display"] = "inline";
            lvlInfo.style["display"] = "inline";            
            
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
                
            
            mainDisplay.textContent = didWin ? "Success!\n" : "Failure!\n";
            
            mainDisplay.textContent += `\nYour time was ${countdownValue} seconds.`;    
            
        }
    }
    
    btn.addEventListener("click", clickingFunction);
    restart.addEventListener("click", clickingFunction);
    restart.style["display"] = "none";
    
    loadJSON(function(response) {
      // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        console.log(actual_JSON);
     });
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
    if (levelNumber < json.levels.length)
        return json.levels[levelNumber - 1].time;
    else
        return json.levels[json.levels.length - 1].time;
}

function getRange()
{
    if (levelNumber < json.levels.length)
        return json.levels[levelNumber - 1].range;
    else
        return json.levels[json.levels.length - 1].range;
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