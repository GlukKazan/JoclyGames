(function() {

var checkVersion = Model.Game.checkVersion;
var superKo = null;
var numKo = 1;

Model.Game.checkVersion = function(design, name, value) {
  if (name == "ko") {
     if (value == "true") {
         superKo = 0;
     }
     if (value == "position") {
         superKo = 1;
     }
     if (value == "sitiation") {
         superKo = 2;
     }
     if (value == "3") {
         superKo = 2;
         numKo   = 2;
     }
  } else {
     (checkVersion)(design, name, value);
  }
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  if (superKo !== null) {
      for (var i in board.moves) {
           var r = 0;
           var m = board.moves[i];
           var b = board.apply(m);
           if (superKo === 0) {
               if (typeof board.parent !== "undefined") {
                   if (b.equals(board.parent) === true) {
                       r = 1;
                   }
               }
           } else {
               var p = board;
               while (typeof p.parent !== "undefined") {
                   var q = p.parent;
                   if ((superKo === 1) || (q.player === b.player)) {
                       if (q.equals(b) === true) {
                           r++;
                           if (numKo < 2) {
                               break;
                           }
                       }
                   }
                   p = q;
               }
           }
           if (r >= numKo) {
               m.failed = true;
           }
      }
  }
  (CheckInvariants)(board);
}

})();
