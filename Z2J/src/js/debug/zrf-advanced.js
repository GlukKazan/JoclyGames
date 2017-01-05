(function() {

var checkVersion  = Model.Game.checkVersion;
var checkOption   = Model.Game.checkOption;
var cloneMove     = Model.Game.cloneMove;

var modes = [];
var simpleMode    = false;
var compositeMode = false;
var attrMode      = false;
var markMode      = false;
var forkMode      = false;

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
     if ((aValue === "attribute") || (aValue === "true")) {
         mode = aValue;
         attrMode = true;
     }
     if ((aValue === "mark")      || (aValue === "true")) {
         mode = aValue;
         markMode = true;
     }
     if ((aValue === "fork")      || (aValue === "true")) {
         mode = aValue;
         forkMode = true;
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
     (checkOption)(aDesign, aName, aValue);
  }
}

Model.Game.cloneMove = function(aGen, aMove) {
  if (forkMode) {
      for (var i in aMove.actions) {
          if (aMove.actions[3] !== -aGen.level) {
              aGen.move.movePiece(aMove.actions[0], aMove.actions[1], aMove.actions[2], aMove.actions[3]);
          }
      }
  } else {
     (cloneMove)(aGen, aMove);
  }
}

Model.Game.getAttrInternal = function (aName, aPos) {
  if (attrMode) {
      if (typeof this.attrs[aPos] === "undefined") {
          return null;
      }
      if (typeof this.attrs[aPos][aName] === "undefined") {
          return null;
      }
      return this.attrs[aPos][aName];
  }
  return null;
}

Model.Game.getValueInternal = function (aGen, aName, aPos) {
  if (compositeMode) {
      if (aGen.parent !== null) {
          return aGen.parent.getValue(aName, aPos);
      }
  }
  return null;
}

var getPiece = Model.Game.getPiece;

Model.Game.getPiece = function(aGen, aPos) {
  if (simpleMode) {
      return Model.Game.getPieceInternal(aGen, aPos);
  } else {
     (getPiece)(aGen, aPos);
  }
}

Model.Game.getMark = function(aGen) {
  if (markMode) {
      if (aGen.backs.length === 0) {
          return null;
      }
      aGen.pos = aGen.backs.pop();
  } else {
      return aGen.mark;
  }
}

Model.Game.setMark = function(aGen) {
  if (markMode) {
      aGen.backs.push(aGen.pos);
  } else {
      aGen.mark = aGen.pos;
  }
}

})();
