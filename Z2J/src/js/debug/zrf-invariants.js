Model.Board.PostActions = function(aGame, aMoves) {
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
}
