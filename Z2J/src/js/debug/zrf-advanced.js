(function() {

var checkVersion  = Model.Game.checkVersion;
var checkOption   = Model.Game.checkOption;
var cloneMove     = Model.Game.cloneMove;
var getPiece      = Model.Game.getPiece;
var isLastFrom    = Model.Game.isLastFrom;
var isLastTo      = Model.Game.isLastTo;
var getMark       = Model.Game.getMark;
var setMark       = Model.Game.setMark;

var modes = [];
var simpleMode    = false;
var compositeMode = false;
var markMode      = false;
var forkMode      = false;
var lastMode      = false;

Model.Game.checkVersion = function(aDesign, aName, aValue) {
  if (aName == "zrf-advanced") {
     var mode = null;
     if ((aValue === "simple")    || (aValue === "true")) {
         mode = aValue;
         simpleMode = true;
     }
     if ((aValue === "composite") || (aValue === "true")) {
         mode = aValue;
         compositeMode = true;
     }
     if ((aValue === "mark")      || (aValue === "true")) {
         mode = aValue;
         markMode = true;
     }
     if ((aValue === "fork")      || (aValue === "true")) {
         mode = aValue;
         forkMode = true;
     }
     if ((aValue === "last")      || (aValue === "true")) {
         mode = aValue;
         lastMode = true;
     }
     if ((aValue === "delayed")   || (aValue === "true")) {
         mode = aValue;
         Model.Game.delayedStrike = true;
     }
     if ((aValue === "shared")    || (aValue === "true")) {
         mode = aValue;
         Model.Game.sharedPieces = true;
     }
     if (mode !== null) {
         modes.push(mode);
     } else {
         aDesign.failed = true;
     }
  } else {
     (checkVersion)(aDesign, aName, aValue);
  }
}

Model.Game.checkOption = function(aDesign, aName, aValue) {
  if (aName == "zrf-advanced") {
     return (Model.find(modes, aValue) >= 0) || 
            (Model.find(modes, "true") >= 0);
  } else {
     return (checkOption)(aDesign, aName, aValue);
  }
}

Model.Game.cloneMove = function(aGen, aMove) {
  if (forkMode) {
      return true;
  } else {
     (cloneMove)(aGen, aMove);
  }
}

Model.Game.getAttrInternal = function (aGen, aName, aPos) {
  var r = null;
  if (simpleMode) {
      var piece = aGen.getPieceInternal(aPos);
      if (piece === null) {
          piece = aGen.piece;
      }
      if (piece !== null) {
          var r = piece.getValue(aName);
          if (r === null) {
              var design = aGen.board.game.getDesign();
              r = design.getAttribute(piece.type, aName);
          }
      }
      if (r === null) {
          if (typeof aGen.attrs[aPos] !== "undefined") {
              if (typeof aGen.attrs[aPos][aName] !== "undefined") {
                  r = aGen.attrs[aPos][aName];
              }
          }
      }
      if (r === null) {
          if (aGen.parent !== null) {
              r = Model.Game.getAttrInternal(aGen.parent, aName, aPos);
          }
      }
  }
  return r;
}

Model.Game.getValueInternal = function (aGen, aName, aPos) {
  if (compositeMode) {
      if (aGen.parent !== null) {
          return aGen.parent.getValue(aName, aPos);
      }
  }
  return null;
}

Model.Game.getPiece = function(aGen, aPos) {
  if (simpleMode) {
      return aGen.getPieceInternal(aPos);
  } else {
      return (getPiece)(aGen, aPos);
  }
}

Model.Game.isLastFrom = function(aPos, aBoard) {
  if (lastMode) {
      return false;
  } else {
      return (isLastFrom)(aPos, aBoard);
  }
}

Model.Game.isLastTo = function(aPos, aBoard) {
  if (lastMode) {
      return false;
  } else {
      return (isLastTo)(aPos, aBoard);
  }
}

Model.Game.getMark = function(aGen) {
  if (markMode) {
      if (aGen.backs.length === 0) {
          return null;
      }
      return aGen.backs.pop();
  } else {
      return (getMark)(aGen);
  }
}

Model.Game.setMark = function(aGen) {
  if (markMode) {
      aGen.backs.push(aGen.pos);
  } else {
      (setMark)(aGen);
  }
}

})();
