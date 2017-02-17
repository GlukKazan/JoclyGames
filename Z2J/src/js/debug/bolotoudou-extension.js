(function() {

var checkVersion = Model.Game.checkVersion;
var strongMode = false;

Model.Game.checkVersion = function(design, name, value) {
  if (name === "bolotoudou-extension") {
      if (value === "strong") {
          strongMode = true;
      }
  } else {
      checkVersion(design, name, value);
  }
}

var markEnemies = function(board, pos, dir, captured) {
  var design = Model.Game.design;
  var opposite = design.players[0][dir];
  for (var i = 0; i < design.dirs.length; i++) {
       var d = design.dirs[i];
       if ((d !== dir) && (d !== opposite)) {
           var p = design.navigate(board.player, pos, d);
           if (p !== null) {
               var piece = board.getPiece(p);
               if ((piece !== null) && (piece.player !== board.player)) {
                   if (Model.find(captured, p) < 0) {
                       captured.push(p);
                   }
               }
           }
       }
  }
}

var checkLine = function(board, pos, dir, player, captured, line) {
  var design = Model.Game.design;
  line.push(pos);
  var p = design.navigate(player, pos, dir);
  if (p === null) return false;
  var piece = board.getPiece(p);
  if (piece === null) return false;
  if (piece.player !== player) return false;
  line.push(p);
  p = design.navigate(player, p, dir);
  if (p === null) return false;
  piece = board.getPiece(p);
  if (piece === null) return false;
  if (piece.player !== player) return false;
  line.push(p);
  var opposite = design.navigate(0, pos, dir);
  for (var i in lines) {
      markEnemies(board, lines[i], dir, opposite, captured);
  }
  return true;
}

var checkMiddle = function(board, pos, dir, opposite, player, captured, line) {
  var design = Model.Game.design;
  line.push(pos);
  var p = design.navigate(player, pos, dir);
  if (p === null) return false;
  var piece = board.getPiece(p);
  if (piece === null) return false;
  if (piece.player !== player) return false;
  line.push(p);
  p = design.navigate(player, pos, opposite);
  if (p === null) return false;
  piece = board.getPiece(p);
  if (piece === null) return false;
  if (piece.player !== player) return false;
  line.push(p);
  for (var i in lines) {
      markEnemies(board, lines[i], dir, opposite, captured);
  }
  return true;
}

var checkLines = function(board, pos, player, captured) {
  var r = false;
  var design = Model.Game.design;
  var len = design.dirs.length;
  for (var d = 0; d < len; d++) {
       var line = [];
       if (checkLine(board, pos, design.dirs[d], player, captured, line) === true) {
           r = true;
       }
  }
  var dirs = [];
  for (var d = 0; d < len; d++) {
       var o = design.navigate(0, pos, design.dirs[d]);
       if (Model.find(dirs, o) < 0) {
           var line = [];
           if (checkMiddle(board, pos, design.dirs[d], o, player, captured, line) === true) {
               r = true;
           }
           dirs.push(design.dirs[d]);
       }
  }
  return r;
}

var isCapturePresent = function(move) {
  for (var j in move.actions) {
       var fp = m.actions[j][0];
       var tp = m.actions[j][1];
       if ((fp === null) && (tp !== null)) {
           return true;
       }
  }
  return false;
}

var clearAttributes = function(board, player, move, line) {
  var len = design.positions.length;
  for (var p = 0; p < len; p++) {
       var piece = board.getPiece(p);
       if (piece !== null) 
           if ((piece.player === player) && (piece.getValue(0) === true)) {
               var ix = Model.find(line, p);
               if (ix < 0) {
                   var q = Model.Game.createPiece(piece.type, piece.player);
                   for (var j in move.actions) {
                        var tp = m.actions[j][1];
                        if (tp === p) {
                            m.actions[j][2] = [q];
                            q = null;
                            break;
                        }
                   }
                   if (q !== null) {
                       m.actions.push([ [p], [p], [q], 1]);
                   }
               }
           }
       }
  }
}

var copyMove = function(old, new, move, captured, line) {
  if (captured.length > 0) {
      var m = move.copy();
      m.actions.push([captured, null, null, 1]);
      var len = line.length;
      for (var i = 0; i < len; i++) {
          var f = true;
          for (var j in move.actions) {
               var fp = m.actions[j][0];
               var tp = m.actions[j][1];
               if ((tp !== null) && (tp[0] === line[i])) {
                   var pos = tp[0];
                   if (fp !== null) {
                       pos = fp[0];
                   }
                   var piece = new.getPiece(pos);
                   if (piece !== null) {
                       piece = piece.setValue(0, true);
                       m.actions[j][2] = [piece];
                       f = false;
                       break;
                   }
               }
          }
          if (f === true) {
              var pos = line[i];
              var piece = new.getPiece(pos);
              if (piece !== null) {
                  piece = piece.setValue(0, true);
                  m.actions.push([ [pos], [pos], [piece], 1]);
              }
          }
      }
      clearAttributes(new, old.player, m, line);
      old.moves.push(m);
  }
}

var intersect = function(a, b) {
    var r = [];
    for (var i in b) {
        if (Model.find(a, b[i]) >= 0) {
            r.push(b[i]);
        }
    }
    return r;
}

var join = function(a, b) {
    for (var i in b) {
        if (Model.find(a, b[i]) < 0) {
            a.push(b[i]);
        }
    }
    return a;
}

var minus = function(a, b) {
    var r = [];
    for (var i in a) {
        if (Model.find(b, a[i]) < 0) {
            r.push(a[i]);
        }
    }
    return r;
}

var separate = function(moves) {
  var m = moves;
  while (moves.length > 0) {
     moves = [];
     for (var i in m) {
         for (var j = i + 1; j < m.length; j++) {
              var captures = intersect(m[i][0], m[j][0]);
              if (captures.length > 0) {
                  m[i].failed = true;
                  m[j].failed = true;
                  moves.push([ captures, join(m[i][1], m[j][1]) ]);
                  var s = minus(m[i][0], captures);
                  if (s.length > 0) {
                      moves.push([s, m[i][1]]);
                  }
                  s = minus(m[j][0], captures);
                  if (s.length > 0) {
                      moves.push([s, m[j][1]]);
                  }
              }
         }
         if (typeof m[i].failed === "undefined") {
             moves.push(m[i]);
         }
     }
  }
  moves = m;
}

var CheckInvariants = Model.Game.CheckInvariants;

Model.Game.CheckInvariants = function(board) {
  var priority = false;
  var design = Model.Game.design;
  for (var i in board.moves) {
       var m = board.moves[i];
       for (var j in m.actions) {
            var fp = m.actions[j][0];
            var tp = m.actions[j][1];
            if ((fp !== null) && (tp !== null)) {
                var piece = board.getPiece(fp[0]);
                if (piece !== null) {
                    if (piece.getValue(0) === true) {
                        priority = true;
                        break;
                    }
                }
            }
       }
  }
  var bl = board.moves.length;
  for (var i = 0; i < bl; i++) {
       var moves = [];
       var m = board.moves[i];
       for (var j in m.actions) {
            var fp = m.actions[j][0];
            var tp = m.actions[j][1];
            var pn = m.actions[j][3];
            if ((fp === null) && (tp !== null)) {
                if (checkLines(board, tp[0], board.player, []) === true) {
                   m.failed = true;
                   break;
                }
            }
            if ((fp !== null) && (tp !== null)) {
                var piece = board.getPiece(fp[0]);
                if ((priority === true) && (piece.getValue(0) !== true)) {
                    m.failed = true;
                    break;
                }
                var b = board.apply(m);
                if (strongMode === true) {
                    if (isCapturePresent(m) === false) {
                        var len = design.dirs.length;
                        for (var d = 0; d < len; d++) {
                             var line = [];
                             var captured = [];
                             if (checkLine(b, tp[0], design.dirs[d], board.player, captured, line) === true) {
                                 moves.push([captured, line]);
                             }
                        }
                        var dirs = [];
                        for (var d = 0; d < len; d++) {
                             var o = design.navigate(0, pos, design.dirs[d]);
                             if (Model.find(dirs, o) < 0) {
                                 var line = [];
                                 var captured = [];
                                 if (checkMiddle(b, tp[0], design.dirs[d], o, board.player, captured, line) === true) {
                                     moves.push([captured, line]);
                                 }
                                 dirs.push(design.dirs[d]);
                             }
                        }
                        clearAttributes(b, board.player, m, []);
                    }
                } else {
                    var captured = [];
                    if (checkLines(b, tp[0], board.player, captured) === true) {
                        if (captured.length > 0) {
                            captured.push(null);
                            m.actions.push([captured, null, null, pn]);
                        }
                    }
                }
                break;
            }
       }
       separate(moves);
       for (var i in moves) {
            var c = moves[i][0];
            var l = moves[i][1];
            copyMove(board, b, m, c, l);
       }

  }
  CheckInvariants(board);
}

})();
