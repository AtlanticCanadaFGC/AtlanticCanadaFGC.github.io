(function($) {
  "use strict"; // Start of use strict

  

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 56)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 56
  });

 var calendarInstances = $( "#calendar1" ).calendarJs( { 
  exportEventsEnabled: true, 
  manualEditingEnabled: true, 
  views: {
      fullMonth: {
          showTimesInEvents: false,
          minimumDayHeight: 0
      }
  },
  manualEditingEnabled: true,
  organizerName: "Your Name",
  organizerEmailAddress: "your@email.address",
  visibleDays: [ 0, 1, 2, 3, 4, 5, 6 ],
  events: getEvents(),
  startOfWeekDay: 6
}, {
  loadedEvent: null
} );

  

})(jQuery); // End of use strict


function getEvents() {
  var events = [];

  for ( var eventIndex = 0; eventIndex < 10; eventIndex++ ) {
      var today = new Date();
      today.setDate( Math.floor( ( Math.random() * 28 ) + 1 ) );
      today.setHours( Math.floor( ( Math.random() * 23 ) + 1 ) );
      today.setMinutes( Math.floor( ( Math.random() * 59 ) + 1 ) );

      var newEvent = {
          from: today,
          to: today,
          title: "Event " + ( eventIndex + 1 ),
          description: "This is a description of the event that has been added, so it can be shown in the pop-up dialog.",
          location: "Teams Meeting",
          group: "Group " + ( eventIndex + 1 )
      };
      console.log("added event");
      events.push( newEvent );
  }

  return events;
}