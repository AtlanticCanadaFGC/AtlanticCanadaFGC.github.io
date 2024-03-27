(function($) {
    "use strict"; // Start of use strict

    let hasSetup = false;
    let hasSetupMatchHistory = false;
    var leaderboardArray;
    $.get("https://sheets.googleapis.com/v4/spreadsheets/1K5ksuiCRIQx5VKMyUHGGNMotAFO24Oia14c05qqLd4U/values/Sheet1!B1:C1000?key=AIzaSyBIzZa8oXWdByQBMlBT_oOxNSaNFDe6boE", (data, status) => {
        leaderboardArray = GeneratePlayerList(data.values);
        for(var i = 0; i < leaderboardArray.length; i++)
        {
            $("#player-list").append('<option value="' + leaderboardArray[i].name + '">' + leaderboardArray[i].name + '</option>');
        }
        $("#top-ten-body").empty();
        SetupTopTen($("#top-ten-body"), leaderboardArray);
        hasSetup = true;
    });

    $.get("https://sheets.googleapis.com/v4/spreadsheets/1K5ksuiCRIQx5VKMyUHGGNMotAFO24Oia14c05qqLd4U/values/Sheet1!B1:C1000?key=AIzaSyBIzZa8oXWdByQBMlBT_oOxNSaNFDe6boE", (data, status) => {
        
        hasSetupMatchHistory = true;
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
        AddTableEntry($("#search-body"), foundEntry);
    });

    $("#player-list-input").on("change", function(e) {
        console.log("Selected");
    });
})(jQuery);


function SetupTopTen(htmlElement, listOfEntrants)
{
    var entrants = listOfEntrants;
    entrants.sort(function (a, b) {
        return b.points - a.points;
    })
    for(var i = 0; i < entrants.length && i < 15; i++)
    {
        AddTableEntry(htmlElement, entrants[i]);
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
        })
    }
    return playerList;
}

function AddTableEntry(htmElement, entryFound)
{
    htmElement.append( 
        '<tr>' + 
        '<td scope="row">' + entryFound.rank + '</td>' + 
        '<td>' + entryFound.name + '</td>' + 
        '<td>' + entryFound.elo + '</td>' + 
        '</tr>'
    );
}