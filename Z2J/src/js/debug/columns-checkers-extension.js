(function() {

var checkVersion = Model.Game.checkVersion;

Model.Game.checkVersion = function(design, name, value) {
  if (name !== "columns-checkers-extension") {
     checkVersion(design, name, value);
  }
}

var PostActions = Model.Game.PostActions;

Model.Game.PostActions = function(board) {
  PostActions(board);
  for (var i in board.moves) {
       var m = board.moves[i];
       var captured = [];
       var piece = null;
       for (var j in m.actions) {
            var fp = m.actions[j][0];
            var tp = m.actions[j][1];
            var pc = m.actions[j][2];
            if ((fp !== null) && (tp !== null)) {
                if (piece === null) {
                    piece = board.getPiece(fp[0]);
                }
                if ((pc !== null) && (Object.prototype.toString.call(pc[0]) === "[object Object]")) {
                    piece.pop();
                    piece.push(pc[0]);
                }
                while (captured.length > 0) {
                    piece.unshift(captured.pop());
                }
                m.actions[j][2] = [ piece ];
            }
            if ((fp !== null) && (tp === null)) {
                var p = board.getPiece(fp[0]);
                captured.push(p.pop());
                if (p.length > 0) {
                    m.actions[j][1] = fp;
                    m.actions[j][2] = [ p ];
                }
            }
       }
  }
}

})();
