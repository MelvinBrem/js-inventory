requirejs.config({
  baseUrl: '../dist/scripts/',
  paths: {
      classes-game: '../classes-game',
  }
});

// Start the main app logic.
requirejs(['jquery', 'canvas', 'app/sub'],
function   ($,        canvas,   sub) {
  //jQuery, canvas and the app/sub module are all
  //loaded and can be used here now.
});