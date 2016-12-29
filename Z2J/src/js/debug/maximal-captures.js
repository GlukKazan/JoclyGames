(function() {

var checkVersion = Model.Game.checkVersion;
var mode = null;

Model.Game.checkVersion = function(aDesign, aName, aValue) {
  if (aName == "maximal-captures") {
     if (aValue == "false") {
         mode = 0;
     }
     if (aValue == "true") {
         mode = 1;
     }
     if (mode === null) {
         aDesign.failed = true;
     }
  } else {
     (checkVersion)(aDesign, aName, aValue);
  }
}

Model.Board.PostActions = function(aGame, aMoves) {
  if (mode !== 0) {
      var moves = [];
      var mx = 0;
      for (var i in aMoves) {
           var vl = 0;
           for (var j in aMoves[i].moves) {
                if (aMoves[i].moves[j][1] === null) {
                    vl++;
                }
           }
           if (vl > mx) {
               mx = vl;
           }
      }
      for (var i in aMoves) {
           var vl = 0;
           for (var j in aMoves[i].moves) {
                if (aMoves[i].moves[j][1] === null) {
                    vl++;
                }
           }
           if (vl == mx) {
                moves.push(aMoves[i]);
           }
      }
      this.mMoves = moves;
  } else {
      this.mMoves = aMoves;
  }
}

})();
