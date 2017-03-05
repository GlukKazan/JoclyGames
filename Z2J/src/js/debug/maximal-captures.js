(function() {

var checkVersion = Model.Game.checkVersion;
var mode = 0;

Model.Game.checkVersion = function(design, name, value) {
  if (name == "maximal-captures") {
     if (value == "false") {
         mode = 0;
     }
     if (value == "true") {
         mode = 1;
     }
     if (value == "2") {
         mode = 2;
     }
     if (mode === null) {
         design.failed = true;
     }
  } else {
     checkVersion(design, name, value);
  }
}

var PostActions = Model.Game.PostActions;

Model.Game.PostActions = function(board) {
  PostActions(board);
  var captures = function(move) {
    return _.chain(move.actions)
     .filter(function(action) {
         return (action[0] !== null) && (action[1] === null);
      })
     .map(function(action) {
         return board.getPiece(action[0]);
      })
     .filter(function(piece) {
         return piece !== null;
      })
     .map(function(piece) {
         return piece.type;
      })
     .countBy(function(type) {
         return (type === 0) ? "Mans" : "Kings";
      })
     .defaults({ Mans: 0, Kings: 0 })
     .value();
  };
  if (mode !== 0) {
      var caps = _.map(board.moves, captures);
      var all = _.chain(caps)
       .map(function(captured) {
          return captured.Mans + captured.Kings;
        })
       .max()
       .value();
      var kings = _.chain(caps)
       .map(function(captured) {
          return captured.Kings;
        })
       .max()
       .value();
      board.moves = _.chain(board.moves)
       .filter(function(move) {
           var c = captures(move);
           if ((mode === 2) && (kings > 0)) {
               return c.Kings >= kings;
           } else {
               return c.Mans + c.Kings >= all;
           }
        })
       .value();
  }
}

})();
