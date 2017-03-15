(function() {

var checkVersion = Model.Game.checkVersion;
var multiMode = false;
var koMode    = false;

Model.Game.checkVersion = function(design, name, value) {
  if (name === "morris-extension") {
      if (value === "multi") {
          multiMode = true;
      }
      if (value === "ko") {
          koMode = true;
      }
  } else {
      checkVersion(design, name, value);
  }
}

var getEmptyPositions = function(board) {
  return _.chain(_.range(Model.Game.design.positions.length))
   .filter(function(pos) {
       return (board.getPiece(pos) === null);
    })
   .value();
}

var getEnemyPositions = function(board) {
  return _.chain(_.range(Model.Game.design.positions.length))
   .filter(function(pos) {
       var piece = board.getPiece(pos);
       if (piece === null) return false;
       return (piece.player !== board.player);
    })
   .push(null)
   .value();
}

var getFriendPositions = function(board) {
  return _.chain(_.range(Model.Game.design.positions.length))
   .filter(function(pos) {
       var piece = board.getPiece(pos);
       if (piece === null) return false;
       return (piece.player === board.player);
    })
   .value();
}

var isFriend = function(board, pos, player) {
   if (pos === null) return false;
   var piece = board.getPiece(pos);
   if (piece === null) return false;
   return (piece.player === player);
}

var countLines = function(board, pos, player) {
  var r = 0;
  var design = Model.Game.design;
  _.chain(_.range(design.dirs.length))
   .each(function(dir) {
       var p = design.navigate(player, pos, dir);
       if (isFriend(board, p, player)) {
           p = design.navigate(player, p, dir);
           if (isFriend(board, p, player)) r++;
           p = design.navigate(0, pos, dir);
           if (isFriend(board, p, player)) r++;
       }
    });
  return r;
}

var createResultMoves = function(board, src, dests) {
  dests = _.filter(function(p) {
      var m = Model.Game.createMove();
      m.movePiece(src, p, null, 1);
      var b = board.apply(m);
      return countLines(b, p, board.player) > 0;
  });
  if (dests.length > 0) {
      var move = Model.Game.createMove();
      move.actions.push([ [src], dests, null, 1]);
      move.actions.push([ getEnemyPositions(board), null, null, 1]);
      board.moves.push(move);
  }
}

var createNoResultMoves = function(board, src, dests) {
  dests = _.filter(function(p) {
      var m = Model.Game.createMove();
      m.movePiece(src, p, null, 1);
      var b = board.apply(m);
      return countLines(b, p, board.player) === 0;
  });
  if (dests.length > 0) {
      var move = Model.Game.createMove();
      move.actions.push([ [src], dests, null, 1]);
      board.moves.push(move);
  }
}

var isMovePhase = function(board) {
  if (board.moves.length === 0) return false;
  if (board.moves[0].actions.length === 0) return false;
  var fp = board.moves[0].actions[0][0];
  var tp = board.moves[0].actions[0][1];
  return (fp !== null) && (tp !== null);
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  var design = Model.Game.design;
  var friends = getFriendPositions(board);
  if ((isMovePhase(board) === true) && (friends.length === 3)) {
      board.moves = [];
      _.each(friends, function(pos) {
          var e = getEmptyPositions(board);
          createResultMoves(board, pos, e);
          createNoResultMoves(board, pos, e);
      });
      CheckInvariants(board);
      return;
  }
  _.each(board.moves, function(m) {
      var b = board.apply(m);
      _.chain(m.actions)
       .filter(function(action) {
           return (action[1] !== null);
        })
       .first();
       .each(function(action) {
           fp = action[0];
           tp = action[1];
           pn = action[3];
           var cnt = countLines(b, tp[0], board.player);
           if (cnt > 0) {
               if ((koMode === true) && (fp !== null)) {
                   if (countLines(board, fp[0], board.player) > 0) {
                       m.failed = true;
                   }
               }
               if (multiMode !== true) {
                   cnt = 1;
               }
               var all = getEnemyPositions(board);
               var captured = _.filter(all, function(pos) {
                   if (pos === null) return true;
                   var piece = board.getPiece(pos);
                   if (piece === null) return false;
                   return countLines(board, pos, piece.player) === 0;
               });
               if (captured.length === 0) {
                   captured = all;
               }
               if (captured.length > 0) {
                   for (k = 0; k < cnt; k++) {
                        m.actions.push([captured, null, null, pn]);
                   }
               }
           }
        });
  });
  CheckInvariants(board);
}

})();
