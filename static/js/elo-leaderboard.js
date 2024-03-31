(function($) {
    "use strict"; // Start of use strict

    let hasSetup = false;
    let hasSetupMatchHistory = false;
    var leaderboardArray;
    var matchHistory;

    $.get("https://sheets.googleapis.com/v4/spreadsheets/1fCYFD3kxZ2smVV8FFFjE8gfQYtb2UJ1CW5H_U8HAjY8/values/Sheet1!B1:D2000?key=AIzaSyBIzZa8oXWdByQBMlBT_oOxNSaNFDe6boE", (data, status) => {
        matchHistory = GenerateMatchHistory(data.values);
        hasSetupMatchHistory = true;
        if(hasSetup && hasSetupMatchHistory)
            SetupTopTen($("#top-ten-body"), leaderboardArray, matchHistory);
    });

    $.get("https://sheets.googleapis.com/v4/spreadsheets/1K5ksuiCRIQx5VKMyUHGGNMotAFO24Oia14c05qqLd4U/values/Sheet1!B1:C1000?key=AIzaSyBIzZa8oXWdByQBMlBT_oOxNSaNFDe6boE", (data, status) => {
        leaderboardArray = GeneratePlayerList(data.values);
        for(var i = 0; i < leaderboardArray.length; i++)
        {
            $("#player-list").append('<option value="' + leaderboardArray[i].name + '">' + leaderboardArray[i].name + '</option>');
        }
        $("#top-ten-body").empty();
        hasSetup = true;
        if(hasSetupMatchHistory && hasSetup)
            SetupTopTen($("#top-ten-body"), leaderboardArray, matchHistory);
    });
    
    $("#submitBtn").on("click", function(e) {
        if(!hasSetup)
            return;
        $("#search-table").css("display", "table");

        var chosenName = $("#player-list-input").val();
        var foundEntry;
        for(var i = 0; i < leaderboardArray.length; i++)
        {
            if(leaderboardArray[i].name == chosenName)
            {
                foundEntry = leaderboardArray[i];
                i = leaderboardArray.length;
            }
        }
        $("#search-body").empty();
        AddTableEntry($("#search-body"), foundEntry, matchHistory);
    });

    $("#headToHeadSubmit").on("click", function(e) {
        if(!hasSetupMatchHistory)
            return;
        $("#player-one").empty();
        $("#player-two").empty();
        $("#score").empty();
        var p1Name = $("#p1-list-input").val();
        var p2Name = $("#p2-list-input").val();

        var scoreObj = GetScoreResults(p1Name, p2Name, matchHistory);
        $("#player-one").append("<h1>" + p1Name + "</h1>");
        $("#player-two").append("<h1>" + p2Name + "</h1>");
        $("#score").append(
            "<h1>" + scoreObj.p1Sets + " - " + scoreObj.p2Sets + "</h1>" + 
            "<h3>" + scoreObj.p1Matches + " - " + scoreObj.p2Matches + "<h3>" + 
            "<h5 class='text-muted'>" + scoreObj.p1Percent + " - " + scoreObj.p2Percent + "</h5>");

        $("#player-one").show();
        $("#score").show();
        $("#player-two").show();
    });

    $("#game-select-input").on("change", function(e) {
        console.log("Selected");
    });
    
})(jQuery);


function SetupTopTen(htmlElement, listOfEntrants, matchHistory)
{
    var entrants = listOfEntrants;
    entrants.sort(function (a, b) {
        return b.points - a.points;
    })
    for(var i = 0; i < entrants.length && i < 15; i++)
    {
        AddTableEntry(htmlElement, entrants[i], matchHistory);
    }
}

function GenerateMatchHistory(values)
{
    var matchHistory = [];
    for(var i = 1; i < values.length; i++)
    {
        var score = values[i][2];
        var partsArr = score.split("-");
        matchHistory.push( {
            p1: values[i][0],
            p2: values[i][1],
            p1Score: parseInt(partsArr[0]),
            p2Score: parseInt(partsArr[1])
        });
    }
    return matchHistory;
}

function GetScoreResults(p1Name, p2Name, matchHistory)
{
    var result = matchHistory.filter((element) => {
        return (element.p1 == p1Name && element.p2 == p2Name) || (element.p2 == p1Name && element.p1 == p2Name);
    });
    var scoreResult = {
        p1Sets: 0,
        p2Sets: 0,
        p1Matches: 0,
        p2Matches: 0,
        p1Percent: "0",
        p2Percent: "0"
    };
    for(var i = 0; i < result.length; i++)
    {
        var currentEntrant = result[i];
        if(currentEntrant.p1 == p1Name)
        {
            if(currentEntrant.p1Score > currentEntrant.p2Score)
                scoreResult.p1Sets++;
            else
                scoreResult.p2Sets++;

            scoreResult.p1Matches += currentEntrant.p1Score;
            scoreResult.p2Matches += currentEntrant.p2Score;
        }
        else
        {
            if(currentEntrant.p1Score > currentEntrant.p2Score)
                scoreResult.p2Sets++;
            else
                scoreResult.p1Sets++;

            scoreResult.p1Matches += currentEntrant.p2Score;
            scoreResult.p2Matches += currentEntrant.p1Score;
        }
    }
    var totalMatches = scoreResult.p1Matches + scoreResult.p2Matches;
    var p1Percent = (scoreResult.p1Matches / parseFloat(totalMatches)) * 100.0;
    var p2Percent = (scoreResult.p2Matches / parseFloat(totalMatches)) * 100.0;

    scoreResult.p1Percent = p1Percent.toFixed(1) + "%";
    scoreResult.p2Percent = p2Percent.toFixed(1) + "%";
    return scoreResult;
}

function GetSetAndMatchPercent(p1Name, matchHistory)
{
    var result = matchHistory.filter((element) => {
        return element.p1 == p1Name || element.p2 == p1Name
    });
    var totalMatches = 0, totalSets = result.length;
    var wonSets = 0, wonMatches = 0;
    for(var i = 0; i < result.length; i++)
    {
        var currentEntrant = result[i];
        if(currentEntrant.p1 == p1Name)
        {
            if(currentEntrant.p1Score > currentEntrant.p2Score)
                wonSets++;
            wonMatches += currentEntrant.p1Score;
        }
        else
        {
            if(currentEntrant.p2Score > currentEntrant.p1Score)
                wonSets++;
            wonMatches += currentEntrant.p2Score;
        }
        totalMatches += currentEntrant.p1Score + currentEntrant.p2Score;
    }
    var matchWinPercent = (wonMatches / parseFloat(totalMatches)) * 100.0;
    var setWinPercent = (wonSets / parseFloat(totalSets))  * 100.0;
    
    return {
        matchWinPercent: matchWinPercent.toFixed(1) + "%",
        setWinPercent: setWinPercent.toFixed(1) + "%",
        totalSets: totalSets,
        totalMatches: totalMatches
    }
}

function GeneratePlayerList(values)
{
    var playerList = [];
    values.sort((a, b) => {
        return b[1] - a[1];
    });
    // Values are in name points handle province order
    for(var i = 1; i < values.length; i++)
    {
        playerList.push( {
            rank: i,
            name: values[i][0],
            elo: values[i][1],
        });
    }
    return playerList;
}

function AddTableEntry(htmElement, entryFound, matchHistory)
{
    var matchWinSetWin = GetSetAndMatchPercent(entryFound.name, matchHistory);
    htmElement.append( 
        '<tr>' + 
        '<td scope="row">' + entryFound.rank + '</td>' + 
        '<td>' + entryFound.name + '</td>' + 
        '<td>' + entryFound.elo + '</td>' + 
        '<td>' + matchWinSetWin.matchWinPercent + '</td>' + 
        '<td>' + matchWinSetWin.setWinPercent + '</td>' +
        '<td>' + matchWinSetWin.totalMatches + '</td>' + 
        '<td>' + matchWinSetWin.totalSets + '</td>' +
        '</tr>'
    );
}