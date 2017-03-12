(function() {

function ZrfMoveList(board) {
  this.board  = board;
  this.stack  = [];
  this.stack.push({
     moves: board.moves, 
     level: 1,
     stage: 0 
  });
  this.move = new ZrfMove();
  this.undo = new ZrfMove();
  this.from = null;
}

Model.Game.getMoveList = function(board) {
  board.generate();
  return new ZrfMoveList(board);
}

ZrfMoveList.prototype.getLevel = function() {
  return this.stack.length;
}

ZrfMoveList.prototype.getMoves = function() {
  var frame = this.stack.peekBack();
  if (frame.moves.length > 0) {
      return frame.moves;
  } else {
      return [ this.move ];
  }
}

ZrfMoveList.prototype.back = function(view) {
  if (this.stack.length > 1) {
      var frame = this.stack.pop();
      if (view !== null) {
          this.undo.changeView(frame.level, view);
      }
      this.move.back(frame.level);
      this.undo.back(frame.level);
  }
  this.from = null;
}

ZrfMoveList.prototype.getCapturing = function() {
  var r = [];
  var frame = this.stack.peekBack();
  for (var i in frame.moves) {
       var m = frame.moves[i];
       for (var j in m.actions) {
            var pn = m.actions[j][3];
            if (pn === frame.level) {
                var fp = m.actions[j][0];
                var tp = m.actions[j][1];
                if (tp !== null) {
                    for (var k in tp) {
                         var pos = tp[k];
                         if (this.board.getPiece(pos) !== null) {
                             if (Model.find(r, pos) < 0) {
                                 r.push(pos);
                             }
                         }
                    }
                }
                if ((fp !== null) && (tp === null)) {
                    for (var k in tp) {
                         var pos = fp[k];
                         if (this.board.getPiece(pos) !== null) {
                             if (Model.find(r, pos) < 0) {
                                 r.push(pos);
                             }
                         }
                    }
                }
            }
       }
  }
  for (var i = 0; i < r.length; i++) {
       r[i] = Model.Game.posToString(r[i]);
  }
  return r;
}

var isUniqueDest = function(moves, pos, level) {
  var r = false;
  for (var i in moves) {
       var m = moves[i];
       for (var j in m.actions) {
            var pn = m.actions[j][3];
            if (pn === level) {
                var fp = m.actions[j][0];
                var tp = m.actions[j][1];
                if ((fp !== null) && (tp === null) &&
                    (Model.find(fp, pos) >= 0)) {
                    return false;
                }
                if ((fp === null) && (tp !== null) &&
                    (Model.find(tp, pos) >= 0)) {
                    return false;
                }
            }
       }
       for (var j in m.actions) {
            var pn = m.actions[j][3];
            if (pn === level) {
                var fp = m.actions[j][0];
                var tp = m.actions[j][1];
                if ((fp !== null) && (tp !== null)) {
                    if (Model.find(tp, pos) >= 0) {
                        if ((fp.length !== 1) ||
                            (r === true)) {
                            return false;
                        }
                        r = true;
                    }
                    break;
                }               
            }
       }
  }
  return r;
}

ZrfMoveList.prototype.getPositions = function() {
  var r = [];
  var frame = this.stack.peekBack();
  for (var i in frame.moves) {
       var m = frame.moves[i];
       var isMove = false;
       for (var j in m.actions) {
            var pn = m.actions[j][3];
            if (pn === frame.level) {
                var fp = m.actions[j][0];
                var tp = m.actions[j][1];
                if ((fp !== null) && (tp !== null)) {
                    isMove = true;
                    if (frame.stage === 0) {
                        for (var k in fp) {
                             if (Model.find(r, fp[k]) < 0) {
                                 r.push(fp[k]);
                             }
                        }
                        if (Model.Game.smartShow === true) {
                             for (var k in tp) {
                                 if ((isUniqueDest(frame.moves, tp[k], pn) === true) &&
                                     (Model.find(r, tp[k]) < 0)) {
                                     r.push(tp[k]);
                                 }
                             }
                        }
                    }
                    if (frame.stage === 1) {
                        for (var k in fp) {
                             if (Model.find(r, tp[k]) < 0) {
                                 r.push(tp[k]);
                             }
                        }
                    }
                    break;
                }
            }
       }
       for (var j in m.actions) {
            var pn = m.actions[j][3];
            if (pn === frame.level) {
                var fp = m.actions[j][0];
                var tp = m.actions[j][1];
                if ((fp !== null) && (tp === null)) {
                    if (((fp.length === 1) && (frame.stage === 0) && (isMove === false)) ||
                        ((fp.length > 1) && (frame.stage === 2))) {
                        for (var k in fp) {
                             if (Model.find(r, fp[k]) < 0) {
                                 r.push(fp[k]);
                             }
                        }
                    }
                }
                if ((fp === null) && (tp !== null)) {
                    if (((tp.length === 1) && (frame.stage === 0) && (isMove === false)) ||
                        ((tp.length > 1) && (frame.stage === 2))) {
                        for (var k in tp) {
                             if (Model.find(r, tp[k]) < 0) {
                                 r.push(tp[k]);
                             }
                        }
                    }
                }
            }
       }
  }
  for (var i = 0; i < r.length; i++) {
       r[i] = Model.Game.posToString(r[i]);
  }
  return r;
}

ZrfMoveList.prototype.canPass = function() {
  var frame = this.stack.peekBack();
  for (var i in frame.moves) {
       var m = frame.moves[i];
       if (m.isIncluding(this.move)) {
           return true;
       }
  }
  return false;
}

ZrfMoveList.prototype.pass = function() {
  if (this.canPass() === false) {
      return null;
  }
  var frame = this.stack.peekBack();
  this.stack.push({
     moves: [ this.move ], 
     level: frame.level + 1,
     stage: 0 
  });
  return "Pass";
}

ZrfMoveList.prototype.movePiece = function(fPos, tPos, p, n) {
  this.move.actions.push([ fPos ], [ tPos ], p, n);
  this.undo.actions.push([ tPos ], [ fPos ], p, n);
  var piece = this.board.getPiece(tPos);
  if (piece !== null) {
      this.undo.actions.push(null, [ tPos ], [ piece ], n);
  }
}

ZrfMoveList.prototype.capturePiece = function(pos, n) {
  this.move.actions.push([ pos ], null, null, n);
  var piece = this.board.getPiece(pos);
  if (piece !== null) {
      this.undo.actions.push(null, [ pos ], [ piece ], n);
  }
}

ZrfMoveList.prototype.dropPiece = function(pos, p, n) {
  this.move.actions.push(null, [ pos ], p, n);
  this.undo.actions.push([ pos ], null, null, n);
}

ZrfMoveList.prototype.setPosition = function(name, view) {
  var pos = Model.Game.stringToPos(name);
  var oldFrame = this.stack.peekBack();
  var newFrame = {
     moves: [], 
     level: oldFrame.level,
     stage: oldFrame.stage
  };
  var isFirst = true;
  var isLast  = true;
  var isND    = false;
  for (var i in oldFrame.moves) {
       var m = oldFrame.moves[i];
       var isMove    = false;
       var isMatched = false;
       this.from     = null;
       for (var j in m.actions) {
            var pn = m.actions[j][3];
            if (pn > oldFrame.level) {
                isLast = false;
                continue;
            }
            if (pn === oldFrame.level) {
                var fp = m.actions[j][0];
                var tp = m.actions[j][1];
                if (((fp !== null) && (tp === null) && (fp.length > 1)) ||
                    ((fp === null) && (tp !== null) && (tp.length > 1))) {
                    isND = true;
                    continue;
                }
                if ((fp !== null) && (tp !== null)) {
                   var fPos = fp[0];
                   var tPos = tp[0];
                   if (oldFrame.stage === 0) {
                       fPos = pos;
                   } else {
                       tPos = pos;
                   }
                   if (isMove === true) {
                       if (isFirst === true) {
                           this.movePiece(fPos, tPos, m.actions[j][2], pn);
                       }
                       continue;
                   }
                   if ((oldFrame.stage === 0) && ((Model.Game.smartTo === true) || (Model.Game.smartFrom === true))) {
                       if ((fp.length === 1) && 
                           (Model.Game.smartTo === true) &&
                           (Model.isIncluding(tp, [ pos ]) === true)) {
                           if (isFirst === true) {
                               this.movePiece(fPos, tPos, m.actions[j][2], pn);
                           }
                           newFrame.moves.push(m);
                           isMatched = true;
                           isMove = true;
                           continue;
                       }
                       if ((tp.length === 1) &&
                           (Model.Game.smartFrom === true) &&
                           (Model.isIncluding(fp, [ pos ]) === true)) {
                           this.movePiece(fPos, tPos, m.actions[j][2], pn);
                           if (isFirst === true) {
                               newFrame.moves.push(m);
                           }
                           isMatched = true;
                           isMove = true;
                           continue;
                       }
                   }
                   if ((oldFrame.stage === 0) &&
                       (Model.isIncluding(fp, [ pos ]) === true)) {
                       this.from = pos;
                       newFrame.moves.push(m);
                       newFrame.stage = oldFrame.stage + 1;
                       isMatched = true;
                       isMove = true;
                       break;
                   }
                   if ((oldFrame.stage === 1) &&
                       (Model.isIncluding(fp, [ this.from ]) === true)
                       (Model.isIncluding(tp, [ pos ]) === true)) {
                       if (isFirst === true) {
                           this.movePiece(this.from, pos, m.actions[j][2], pn);
                       }
                       newFrame.moves.push(m);
                       this.from = null;
                       isMatched = true;
                       isMove = true;
                       continue;
                   }
                }
            }
       }
       if (isMove === true) {
           if (isFirst === true) {
               for (var j in m.actions) {
                    var pn = m.actions[j][3];
                    if (pn === oldFrame.level) {
                        var fp = m.actions[j][0];
                        var tp = m.actions[j][1];
                        var pc = m.actions[j][2];
                        if ((fp !== null) && (tp === null)) {
                            this.capturePiece(fp[0], oldFrame.level);
                        }
                        if ((fp === null) && (tp !== null) && (pc !== null)) {
                            this.dropPiece(tp[0], pc, oldFrame.level);
                        }
                    }
               }
           }
       } else {
           if ((oldFrame.stage === 0) || (oldFrame.stage > 1)) {
               isND = false;
               var cnt = 1;
               if (oldFrame.stage > 1) {
                   cnt = oldFrame.stage - 1;
               }
               for (var i in oldFrame.moves) {
                    var m = oldFrame.moves[i];
                    for (var j in m.actions) {
                         var pn = m.actions[j][3];
                         if (pn === oldFrame.level) {
                             var fp = m.actions[j][0];
                             var tp = m.actions[j][1];
                             if ((fp !== null) && (tp === null) && 
                                 (Model.isIncluding(fp, [ pos ]) === true)) {
                                 if (cnt === 0) {
                                     isND = true;
                                     break;
                                 }
                                 cnt--;
                                 if (cnt === 0) {
                                     if (isFirst === true) {
                                         this.capturePiece(fp[0], pn);
                                     }
                                     newFrame.moves.push(m);                        
                                 }
                                 continue;
                             }
                             if ((fp === null) && (tp !== null) && 
                                 (Model.isIncluding(tp, [ pos ]) === true)) {
                                 if (cnt === 0) {
                                     isND = true;
                                     break;
                                 }
                                 cnt--;
                                 if (cnt === 0) {
                                     if (isFirst === true) {
                                         this.dropPiece(tp[0], m.actions[j][2], pn);
                                     }
                                     newFrame.moves.push(m);                        
                                 }
                                 break;
                             }
                         }
                    }
               }
           }
       }
       if ((isLast === true) && (isFirst === true)) {
           for (var j in m.actions) {
                var pn = m.actions[j][3];
                if (pn < 0) {
                    var fp = m.actions[j][0];
                    var tp = m.actions[j][1];
                    var pc = m.actions[j][2];
                    if ((fp !== null) && (tp === null)) {
                        this.capturePiece(fp[0], oldFrame.level);
                    }
                    if ((fp === null) && (tp !== null) && (pc !== null)) {
                        this.dropPiece(tp[0], pc, oldFrame.level);
                    }
                }
           }
       }
       if (isMatched === true) {
           isFirst = false;
       }
  }
  if (newFrame.moves.length === 0) {
      return null;
  }
  this.stack.push(newFrame);
  if (newFrame.stage === oldFrame.stage) {
      if (isND === true) {
          if (newFrame.stage === 0) {
              newFrame.stage = 2;
          } else {
              newFrame.stage++;
          }
      } else {
          if (view !== null) {
              this.move.changeView(newFrame.level, view);
          }
          newFrame.stage = 0;
          newFrame.level++;
      }
  }
  return this.move.toString(oldFrame.level);
}

})();
