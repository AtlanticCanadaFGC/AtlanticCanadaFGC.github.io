(function($) {
    "use strict"; // Start of use strict

    let hasSetup = false;
    var leaderboardArray;
    $.get("https://sheets.googleapis.com/v4/spreadsheets/138r0B4gZyRnHLk2ZVE4uCuOlr5j3fZy_3-ER0eAB8BY/values/Sheet1!A1:D1000?key=AIzaSyBIzZa8oXWdByQBMlBT_oOxNSaNFDe6boE", (data, status) => {
        leaderboardArray = GeneratePlayerList(data.values);
        for(var i = 0; i < leaderboardArray.length; i++)
        {
            $("#player-list").append('<option value="' + leaderboardArray[i].name + '">' + leaderboardArray[i].name + '</option>');
        }
        $("#top-ten-body").empty();
        SetupTopTen($("#top-ten-body"), leaderboardArray);
        hasSetup = true;
    });
    /*
    var leaderboardArray = [
        {name: "Ayeti", points: -10, handle: "@AYeti", prov: "NS", rank: 4},
        {name: "OneKenBoi", points: 10, handle: "@Kenny", prov: "NS", rank: 3},
        {name: "Rhyllis", points: 50000, handle: "@oldguy", prov: "NB", rank: 1},
        {name: "Execution", points: 11, handle: "@modernhonda", prov: "PE", rank: 2}
    ]*/
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
            points: values[i][1],
            handle: values[i][2],
            prov: values[i][3]
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
        '<td>' + entryFound.prov + '</td>' + 
        '<td>' + entryFound.points + '</td>' + 
        '<td>' + entryFound.handle + '</td>' +
        '</tr>'
    );
}