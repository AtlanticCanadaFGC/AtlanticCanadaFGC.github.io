(function($) {
    "use strict"; // Start of use strict
    var leaderboardArray = [
        {name: "Ayeti", points: -10, handle: "@AYeti", prov: "NS", rank: 4},
        {name: "OneKenBoi", points: 10, handle: "@Kenny", prov: "NS", rank: 3},
        {name: "Rhyllis", points: 50000, handle: "@oldguy", prov: "NB", rank: 1},
        {name: "Execution", points: 11, handle: "@modernhonda", prov: "PE", rank: 2}
    ]
    for(var i = 0; i < leaderboardArray.length; i++)
    {
        $("#player-list").append('<option value="' + leaderboardArray[i].name + '">' + leaderboardArray[i].name + '</option>');
    }
    $("#top-ten-body").empty();
    SetupTopTen($("#top-ten-body"), leaderboardArray);


    $("#submitBtn").on("click", function(e) {
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
    for(var i = 0; i < entrants.length; i++)
    {
        AddTableEntry(htmlElement, entrants[i]);
    }
    
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