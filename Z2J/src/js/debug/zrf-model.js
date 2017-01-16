(function() {

var Z2J_VERSION = 1;

Model.Move.ZRF_JUMP      = 0;
Model.Move.ZRF_IF        = 1;
Model.Move.ZRF_FORK      = 2;
Model.Move.ZRF_FUNCTION  = 3;
Model.Move.ZRF_IN_ZONE   = 4;
Model.Move.ZRF_GET_FLAG  = 5;
Model.Move.ZRF_SET_FLAG  = 6;
Model.Move.ZRF_GET_PFLAG = 7;
Model.Move.ZRF_SET_PFLAG = 8;
Model.Move.ZRF_GET_ATTR  = 9;
Model.Move.ZRF_SET_ATTR  = 10;
Model.Move.ZRF_PROMOTE   = 11;
Model.Move.ZRF_MODE      = 12;
Model.Move.ZRF_ON_BOARDD = 13;
Model.Move.ZRF_ON_BOARDP = 14;
Model.Move.ZRF_PARAM     = 15;
Model.Move.ZRF_LITERAL   = 16;
Model.Move.ZRF_VERIFY    = 20;
Model.Move.ZRF_SET_POS   = 21;
Model.Move.ZRF_NAVIGATE  = 22;
Model.Move.ZRF_OPPOSITE  = 23;
Model.Move.ZRF_FROM      = 24;
Model.Move.ZRF_TO        = 25;
Model.Move.ZRF_CAPTURE   = 26;
Model.Move.ZRF_FLIP      = 27;
Model.Move.ZRF_END       = 28;

Model.Move.ZRF_NOT       = 0;
Model.Move.ZRF_IS_EMPTY  = 1;
Model.Move.ZRF_IS_ENEMY  = 2;
Model.Move.ZRF_IS_FRIEND = 3;
Model.Move.ZRF_IS_LASTF  = 4;
Model.Move.ZRF_IS_LASTT  = 5;
Model.Move.ZRF_MARK      = 6;
Model.Move.ZRF_BACK      = 7;
Model.Move.ZRF_PUSH      = 8;
Model.Move.ZRF_POP       = 9;

Model.Game.commands = {};

Model.Game.commands[Model.Move.ZRF_JUMP] = function(aGen, aParam) {
   return aParam - 1;
}

Model.Game.commands[Model.Move.ZRF_IF] = function(aGen, aParam) {
   if (aGen.stack.length === 0) {
       return null;
   }
   var f = aGen.stack.pop();
   if (f) {
      return aParam - 1;
   } else {
      return 0;
   }
}

Model.Game.commands[Model.Move.ZRF_FORK] = function(aGen, aParam) {
   var g = aGen.clone();
   g.cmd += aParam - 1;
   aGen.board.addFork(g);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_FUNCTION] = function(aGen, aParam) {
  var game = aGen.board.game;
  if (typeof game.functions[aParam] !== "undefined") {
     return (game.functions[aParam])(aGen);
  }
  return null;
}

Model.Game.commands[Model.Move.ZRF_IN_ZONE] = function(aGen, aParam) {
   var design = aGen.board.game.getDesign();
   var player = aGen.board.mWho;
   if (aGen.pos === null) {
       return null;
   }
   aGen.stack.push(design.inZone(aParam, player, aGen.pos));
   return 0;
}

Model.Game.commands[Model.Move.ZRF_GET_FLAG] = function(aGen, aParam) {
   aGen.stack.push(aGen.getValue(aParam, -1));
   return 0;
}

Model.Game.commands[Model.Move.ZRF_SET_FLAG] = function(aGen, aParam) {
   if (aGen.stack.length === 0) {
       return null;
   }
   value = aGen.stack.pop();
   aGen.setValue(aParam, -1, value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_GET_PFLAG] = function(aGen, aParam) {
   if (aGen.pos === null) {
       return null;
   }
   aGen.stack.push(aGen.getValue(aParam, aGen.pos));
   return 0;
}

Model.Game.commands[Model.Move.ZRF_SET_PFLAG] = function(aGen, aParam) {
   if (aGen.pos === null) {
       return null;
   }
   if (aGen.stack.length === 0) {
       return null;
   }
   value = aGen.stack.pop();
   aGen.setValue(aParam, aGen.pos, value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_GET_ATTR] = function(aGen, aParam) {
   if (aGen.pos === null) {
       return null;
   }
   var value = aGen.getAttr(aParam, aGen.pos);
   if (value === null) {
       return null;
   }
   aGen.stack.push(value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_SET_ATTR] = function(aGen, aParam) {
   if (aGen.pos === null) {
       return null;
   }
   if (aGen.stack.length === 0) {
       return null;
   }
   var value = aGen.stack.pop();
   aGen.setAttr(aParam, aGen.pos, value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_PROMOTE] = function(aGen, aParam) {
   if (typeof aGen.piece === "undefined") {
       return null;
   }
   aGen.piece = aGen.piece.promote(aParam);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_MODE] = function(aGen, aParam) {
   aGen.mode = aParam;
   return 0;
}

Model.Game.commands[Model.Move.ZRF_ON_BOARDD] = function(aGen, aParam) {
   var design = aGen.board.game.getDesign();
   var player = aGen.board.mWho;
   var pos = aGen.pos;
   if (pos === null) {
       return null;
   }
   pos = design.navigate(player, pos, aParam);
   if (pos !== null) {
       aGen.stack.push(true);
   } else {
       aGen.stack.push(false);
   }
   return 0;
}

Model.Game.commands[Model.Move.ZRF_ON_BOARDP] = function(aGen, aParam) {
   var design = aGen.board.game.getDesign();
   if ((aParam >= 0) && (aParam < design.positions.length)) {
       aGen.stack.push(true);
   } else {
       aGen.stack.push(false);
   }
   return 0;
}

Model.Game.commands[Model.Move.ZRF_PARAM] = function(aGen, aParam) {
   var value = aGen.params[aParam];
   aGen.stack.push(value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_LITERAL] = function(aGen, aParam) {
   aGen.stack.push(aParam);
   return 0;
}

Model.Game.functions = {};

Model.Game.functions[Model.Move.ZRF_VERIFY] = function(aGen) {
   if (aGen.stack.length === 0) {
       return null;
   }
   var f = aGen.stack.pop();
   if (f) {
       return 0;
   } else {
       return null;
   }
}

Model.Game.functions[Model.Move.ZRF_SET_POS] = function(aGen) {
   if (aGen.stack.length === 0) {
       return null;
   }
   var pos = aGen.stack.pop();
   var design = aGen.board.game.getDesign();
   if (pos < design.positions.length) {
      aGen.pos = pos;
      return 0;
   } else {
      return null;
   }
}

Model.Game.functions[Model.Move.ZRF_NAVIGATE] = function(aGen) {
   if (aGen.stack.length === 0) {
       return null;
   }
   var dir = aGen.stack.pop();
   var design = aGen.board.game.getDesign();
   var player = aGen.board.mWho;
   var pos = aGen.pos;
   if (pos === null) {
       return null;
   }
   pos = design.navigate(player, pos, dir);
   if (pos === null) {
       return null;
   }
   if (pos < design.positions.length) {
      aGen.pos = pos;
      return 0;
   } else {
      return null;
   }
}

Model.Game.functions[Model.Move.ZRF_OPPOSITE] = function(aGen) {
   if (aGen.stack.length === 0) {
       return null;
   }
   var dir = aGen.stack.pop();
   var design = aGen.board.game.getDesign();
   if (typeof design.players[0] === "undefined") {
       return null;
   }
   if (typeof design.players[0][dir] === "undefined") {
       return null;
   }
   dir = design.players[0][dir];
   aGen.stack.push(dir);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_FROM] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   if (aGen.getPiece(aGen.pos) === null) {
       return null;
   }
   aGen.from  = aGen.pos;
   aGen.piece = aGen.getPiece(aGen.pos);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_TO] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   if (typeof aGen.piece === "undefined") {
       return null;
   }
   aGen.movePiece(aGen.from, aGen.pos, aGen.piece);
   delete aGen.from;
   delete aGen.piece;
   return 0;
}

Model.Game.functions[Model.Move.ZRF_CAPTURE] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   if (aGen.getPiece(aGen.pos) === null) {
       return 0;
   }
   aGen.capturePiece(aGen.pos);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_FLIP] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   if (aGen.getPiece(aGen.pos) === null) {
       return null;
   }
   var piece = aGen.getPiece(aGen.pos).flip();
   aGen.movePiece(aGen.pos, aGen.pos, piece);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_END] = function(aGen) {
   var board = aGen.board;
   if (aGen.moveType === 2) {
       board.replMove(aGen.move);
   }
   if (aGen.moveType === 1) {
       board.addMove(aGen.move);
   }
   aGen.moveType = 0;
   return null;
}

Model.Game.functions[Model.Move.ZRF_NOT] = function(aGen) {
   if (aGen.stack.length === 0) {
       return null;
   }
   var f = aGen.stack.pop();
   aGen.stack.push(!f);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_EMPTY] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   var piece = aGen.board.getPiece(aGen.pos);
   aGen.stack.push(piece === null);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_ENEMY] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   var piece  = aGen.board.getPiece(aGen.pos);
   if (piece === null) {
       aGen.stack.push(false);
       return 0;
   }
   var player = aGen.board.mWho;
   aGen.stack.push(piece.player !== player);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_FRIEND] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   var piece  = aGen.board.getPiece(aGen.pos);
   if (piece === null) {
       aGen.stack.push(false);
       return 0;
   }
   var player = aGen.board.mWho;
   aGen.stack.push(piece.player === player);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_LASTF] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   aGen.stack.push(aGen.isLastFrom(aGen.pos));
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_LASTT] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   aGen.stack.push(aGen.isLastTo(aGen.pos));
   return 0;
}

Model.Game.functions[Model.Move.ZRF_MARK] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   aGen.setMark();
   return 0;
}

Model.Game.functions[Model.Move.ZRF_BACK] = function(aGen) {
   var pos = aGen.getMark();
   if (pos !== null) {
      aGen.pos = pos;
   } else {
      return null;
   }
   return 0;
}

Model.Game.functions[Model.Move.ZRF_PUSH] = function(aGen) {
   aGen.backs.push(aGen.pos);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_POP] = function(aGen) {
   if (aGen.backs.length === 0) {
       return null;
   }
   aGen.pos = aGen.backs.pop();
   return 0;
}

if (typeof Array.indexOf !== "undefined") {
   Model.find = function(array, value) {
     return Array.prototype.indexOf.call(array, value);
   }
} else {
   Model.find = function(array, value) {
      for (var i = 0; i < array.length; i++) {
          if (array[i] === value) return i;
      }
      return -1;
   }
}

if (typeof Int32Array !== "undefined") {
   Model.int32Array = function(array) {
      var a = new Int32Array(array.length);
      a.set(array);
      return a;
   }
} else {
   Model.int32Array = function(array) {
      return array;
   }
}

Model.Game.posToString = function(pos) {
   var design = Model.Game.getDesign();
   if (pos < design.names.length) {
       return design.names[pos];
   } else {
       return "?";
   }
}

Model.Game.stringToPos = function(name) {
   var design = Model.Game.getDesign();
   var pos = Model.find(design.names, name);
   if (pos >= 0) {
       return pos;
   } else {
       return null;
   }
}

function ZrfDesign() {
  this.tnames    = [];
  this.players   = [];
  this.positions = [];
  this.zones     = [];
  this.pieces    = [];
  this.attrs     = [];
  this.names     = [];
  this.types     = [];
  this.dirs      = [];
  this.znames    = [];
  this.pnames    = [];
  this.pall      = [];
  this.templates = [];
  this.options   = [];
  this.modes     = [];
  this.failed    = false;
}

Model.Game.getDesign = function() {
  if (typeof Model.Game.design === "undefined") {
      Model.Game.design = new ZrfDesign();
  }
  return Model.Game.design;
}

Model.Game.delayedStrike   = false;
Model.Game.discardCascades = false;
Model.Game.passPartial     = false;
Model.Game.passTurn        = 0;
Model.Game.sharedPieces    = false;

Model.Game.checkVersion = function(aDesign, aName, aValue) {  
  if (aName == "z2j") {
     if (aValue > Z2J_VERSION) {
         aDesign.failed = true;
     }
  } else {
     if ((aName != "zrf")                && 
         (aName != "pass-turn")          &&
         (aName != "pass-partial")       &&
         (aName != "moves-limit")        &&
         (aName != "discard-cascades")   &&
         (aName != "animate-captures")   &&
         (aName != "animate-drops")      &&
         (aName != "highlight-goals")    &&
         (aName != "prevent-flipping")   &&
         (aName != "progressive-levels") &&
         (aName != "selection-screen")   &&
         (aName != "show-moves-list")    &&
         (aName != "silent-?-moves")     &&
         (aName != "smart-moves")) {
         aDesign.failed = true;
     }
     if ((aName == "discard-cascades") && (aValue === "true")) {
         Model.Game.discardCascades = true;
     }
     if ((aName == "pass-partial") && (aValue === "true")) {
         Model.Game.passPartial = true;
     }
     if ((aName == "pass-turn") && (aValue === "true")) {
         Model.Game.passTurn = 1;
     }
     if ((aName == "pass-turn") && (aValue === "forced")) {
         Model.Game.passTurn = 2;
     }
     if (aName == "moves-limit") {
         Model.Game.movesLimit = aValue;
     }
  }
}

Model.Game.checkOption = function(aDesign, aName, aValue) {
  if (aDesign.options[aName] == aValue) {
      return true;
  }
}

ZrfDesign.prototype.setup = function(aPlayer, aPiece, aPos) {
  // TODO:

}

ZrfDesign.prototype.getTemplate = function(aIx) {
  if (typeof this.templates[aIx] === "undefined") {
      this.templates[aIx] = Model.Game.createTemplate();
  }
  return this.templates[aIx];
}

ZrfDesign.prototype.addCommand = function(aIx, aName, aParam) {
  var aGame = Model.Game;
  var aTemplate = this.getTemplate(aIx);
  aTemplate.addCommand(aGame, aName, aParam);
}

ZrfDesign.prototype.addPriority = function(aMode) {
  this.modes.push(aMode);
}

ZrfDesign.prototype.addAttribute = function(aType, aName, aVal) {
  if (typeof this.attrs[aName] === "undefined") {
      this.attrs[aName] = [];
  }
  this.attrs[aName][aType] = aVal;
}

ZrfDesign.prototype.getAttribute = function(aType, aName) {
  if (typeof this.attrs[aName] === "undefined") {
      return null;
  }
  if (typeof this.attrs[aName][aType] === "undefined") {
      return null;
  }
  return this.attrs[aName][aType];
}

ZrfDesign.prototype.addPiece = function(aName, aType) {
  this.pnames[aType] = aName;
  this.pall.push("1/" + aType);
  this.pall.push("-1/" + aType);
}

ZrfDesign.prototype.addMove = function(aType, aTemplate, aParams, aMode) {
  if (typeof this.pieces[aType] === "undefined") {
      this.pieces[aType] = [];
  }
  this.pieces[aType].push({
     type: 0,
     template: aTemplate,
     params: aParams,
     mode: aMode
  });
}

ZrfDesign.prototype.addDrop = function(aType, aTemplate, aParams, aMode) {
  if (typeof this.pieces[aType] === "undefined") {
      this.pieces[aType] = [];
  }
  this.pieces[aType].push({
     type: 1,
     template: aTemplate,
     params: aParams,
     mode: aMode
  });
}

ZrfDesign.prototype.checkVersion = function(aName, aValue) {
  this.options[aName] = aValue;
  Model.Game.checkVersion(this, aName, aValue);
}

ZrfDesign.prototype.checkOption = function(aName, aValue) {
  return Model.Game.checkOption(this, aName, aValue);
}

ZrfDesign.prototype.addDirection = function(aName) {
  this.dirs.push(aName);
}

ZrfDesign.prototype.addPlayer = function(aPlayer, aSymmetries) {
  var ix = this.tnames.length + 1;
  if (this.tnames.length === 0) {
      ix = 0;
  }
  this.players[ix] = Model.int32Array(aSymmetries);
  this.tnames.push(aPlayer);
}

ZrfDesign.prototype.nextPlayer = function(aPlayer) {
  if (aPlayer + 1 > this.tnames.length) {
      return 1;
  } else {
      return aPlayer + 1;
  }
}

ZrfDesign.prototype.addPosition = function(aName, aLinks) {
  this.names.push(aName);
  this.positions.push(Model.int32Array(aLinks));
}

ZrfDesign.prototype.navigate = function(aPlayer, aPos, aDir) {
  var dir = aDir;
  if (typeof this.players[aPlayer] !== "undefined") {
      dir = this.players[aPlayer][aDir];
  }
  if (this.positions[aPos][dir] !== 0) {
      return aPos + this.positions[aPos][dir];
  } else {
      return null;
  }
}

ZrfDesign.prototype.addZone = function(aName, aPlayer, aPositions) {
  var aZone = Model.find(this.znames, aName);
  if (aZone < 0) {
      aZone = this.znames.length;
      this.znames.push(aName);
  }
  if (typeof this.zones[aZone] === "undefined") {
      this.zones[aZone] = [];
  }
  this.zones[aZone][aPlayer] = Model.int32Array(aPositions);
}

ZrfDesign.prototype.inZone = function(aZone, aPlayer, aPos) {
  if (typeof this.zones[aZone] !== "undefined") {
      if (typeof this.zones[aZone][aPlayer] !== "undefined") {
          return Model.find(this.zones[aZone][aPlayer], aPos) >= 0;
      }
  }
  return false;
}

function ZrfMoveTemplate() {
  this.commands = [];
}

Model.Game.createTemplate = function() {
  return new ZrfMoveTemplate();
}

ZrfMoveTemplate.prototype.addCommand = function(aGame, aName, aParam) {
  if (typeof aGame.commands[aName] !== "undefined") {
      if (typeof aGame.cache === "undefined") {
          aGame.cache = [];
      }
      if (typeof aGame.cache[aName] === "undefined") {
          aGame.cache[aName] = [];
      }
      var offset = aParam;
      if (typeof aGame.cache[aName][offset] === "undefined") {
          aGame.cache[aName][offset] = function(x) {
              return (aGame.commands[aName])(x, offset);
          }
      }
      this.commands.push(aGame.cache[aName][offset]);
  }
}

function ZrfMoveGenerator() {
  this.move     = new ZrfMove();
  this.moveType = 1;
  this.template = null;
  this.params   = null;
  this.mode     = null;
  this.board    = null;
  this.pos      = null;
  this.parent   = null;
  this.pieces   = [];
  this.values   = [];
  this.attrs    = [];
  this.stack    = [];
  this.backs	= [];
  this.cmd      = 0;
  this.level    = 1;
}

Model.Game.createGen = function(aTemplate, aParams) {
  var r = new ZrfMoveGenerator();
  r.template = aTemplate;
  r.params   = Model.int32Array(aParams);
  return r;
}

Model.Game.cloneMove = function(aGen, aMove) {
  if (aMove.actions[3] !== aGen.level) {
      return true;
  } else {
      return false;
  }
}

ZrfMoveGenerator.prototype.cloneMove = function(aMove) {
  var o = true;
  for (var i in this.move.actions) {
      var f = false;
      if ((this.move.actions[0] !== null) && (this.move.actions[1] !== null)) {
          f = true;
          if (Model.Game.discardCascades === true) {
              if (o === false) {
                  f = false;
              }
          }
          o = false;
      } else {
          f = Model.Game.cloneMove(this, this.move);
      }
      if (f) {
          aMove.movePiece(this.move.actions[0], this.move.actions[1], this.move.actions[2], this.move.actions[3]);
      }
  }
}

ZrfMoveGenerator.prototype.copyMove = function(aMove) {
  for (var i in this.move.actions) {
      var l = this.move.actions[3];
      if (Model.Game.delayedStrike === true) {
          if ((this.move.actions[1] === null) && (l === this.level)) {
              l = l + 1;
          }
      }
      aMove.movePiece(this.move.actions[0], this.move.actions[1], this.move.actions[2], l);
  }
}

ZrfMoveGenerator.prototype.init = function(aBoard, aPos) {
  this.board    = aBoard;
  this.pos      = aPos;
}

ZrfMoveGenerator.prototype.clone = function() {
  var r = new ZrfMoveGenerator();
  r.template = this.template;
  r.params   = this.params;  
  r.level    = this.level;
  r.parent   = this.parent;
  r.cmd      = this.cmd;
  r.mode     = this.mode;
  r.board    = this.board;
  r.pos      = this.pos;
  for (var i in this.backs) {
      r.backs[i] = this.backs[i];
  }
  for (var i in this.stack) {
      r.stack[i] = this.stack[i];
  }
  for (var pos in this.pieces) {
      r.pieces[pos] = this.pieces[pos];
  }
  for (var name in this.values) {
      r.values[name] = [];
      for (var pos in this.values[name]) {
           r.values[name][pos] = this.values[name][pos];
      }
  }
  for (var pos in this.attrs) {
      r.attrs[pos] = [];
      for (var name in this.attrs[pos]) {
           r.attrs[pos][name] = this.attrs[pos][name];
      }
  }
  this.cloneMove(r.move);
  return r;
}

ZrfMoveGenerator.prototype.copy = function(aTemplate, aParams) {
  var r = Model.Game.createGen(aTemplate, aParams);
  r.level    = this.level + 1;
  r.parent   = this;
  r.mode     = this.mode;
  r.board    = this.board;
  r.pos      = this.pos;
  this.copyMove(r.move);
  return r;
}

ZrfMoveGenerator.prototype.getPos = function() {
  return this.pos;
}

ZrfMoveGenerator.prototype.movePiece = function(aFrom, aTo, aPiece) {
  if (typeof this.attrs[aTo] === "undefined") {
      for (var name in this.attrs[aTo]) {
           aPiece = aPiece.setValue(name, this.attrs[aTo][name]);
      }
  }
  this.move.movePiece(aFrom, aTo, aPiece, this.level);
  this.lastf = aFrom;
  this.tastt = aTo;
  if (aFrom !== aTo) {
      this.setPiece(aFrom, null);
  }
  this.setPiece(aTo, aPiece);
}

ZrfMoveGenerator.prototype.dropPiece = function(aPos, aPiece) {
  this.move.dropPiece(aPos, aPiece, this.level);
  this.setPiece(aPos, aPiece);
}

ZrfMoveGenerator.prototype.capturePiece = function(aPos) {
  this.move.capturePiece(aPos, this.level);
  if (Model.Game.delayedStrike !== true) {
      this.setPiece(aPos, null);
  }
}

Model.Game.getMark = function(aGen) {
  if (aGen.backs.length === 0) {
      return null;
  } else {
      var pos = aGen.backs.pop();
      aGen.backs.push(pos);
      return pos;
  }
}

ZrfMoveGenerator.prototype.getMark = function() {
  return Model.Game.getMark(this);
}

Model.Game.setMark = function(aGen) {
  if (aGen.backs.length > 0) {
      aGen.backs.pop();
  }
  if (aGen.pos !== null) {
      aGen.backs.push(aGen.pos);
  }
}

ZrfMoveGenerator.prototype.setMark = function() {
  Model.Game.setMark(this);
}

ZrfMoveGenerator.prototype.getPieceInternal = function(aPos) {
  if (typeof this.pieces[aPos] !== "undefined") {
      return this.pieces[aPos];
  }
  if (this.parent !== null) {
      return this.parent.getPieceInternal(aPos);
  }
  return this.board.getPiece(aPos);
}

Model.Game.getPiece = function(aGen, aPos) {
  if (aGen.parent !== null) {
      return aGen.parent.getPieceInternal(aPos);
  }
  return aGen.board.getPiece(aPos);
}

ZrfMoveGenerator.prototype.getPiece = function(aPos) {
  return Model.Game.getPiece(this, aPos);
}

ZrfMoveGenerator.prototype.setPiece = function(aPos, aPiece) {
  this.pieces[aPos] = aPiece;
}

Model.Game.isLastFrom = function(aPos, aBoard) {
  if (typeof aBoard.lastf !== "undefined") {
      return (aBoard.lastf === aPos)
  } else {
      return false;
  }
}

ZrfMoveGenerator.prototype.isLastFrom = function(aPos) {
  if (this.parent !== null) {
      if (typeof this.parent.lastf !== "undefined") {
          return (this.parent.lastf === aPos);
      } else {
          return false;
      }
  }
  return Model.Game.isLastFrom(aPos, this.board);
}

Model.Game.isLastTo = function(aPos, aBoard) {
  if (typeof aBoard.lastt !== "undefined") {
      return (aBoard.lastt === aPos)
  } else {
      return false;
  }
}

ZrfMoveGenerator.prototype.isLastTo = function(aPos) {
  if (this.parent !== null) {
      if (typeof this.parent.lastt !== "undefined") {
          return (this.parent.lastt === aPos);
      } else {
          return false;
      }
  }
  return Model.Game.isLastTo(aPos, this.board);
}

Model.Game.getValueInternal = function(aThis, aName, aPos) {
  return null;
}

ZrfMoveGenerator.prototype.getValue = function(aName, aPos) {
  if (typeof this.values[aName] !== "undefined") {
      if (typeof this.values[aName][aPos] !== "undefined") {
          return this.values[aName][aPos];
      }
  }
  return Model.Game.getValueInternal(this, aName, aPos);
}

ZrfMoveGenerator.prototype.setValue = function(aName, aPos, aValue) {
  if (typeof this.values[aName] === "undefined") {
      this.values[aName] = [];
  }
  this.values[aName][aPos] = aValue;
}

Model.Game.getAttrInternal = function (aGen, aName, aPos) {
  return null;
}

ZrfMoveGenerator.prototype.getAttr = function(aName, aPos) {
  var piece = this.getPiece(aPos);
  if (piece !== null) {
      var value = piece.getValue(aName);
      if (value === null) {
          var design = this.board.game.getDesign();
          value = design.getAttribute(piece.type, aName);
      }
      return value;
  }
  return Model.Game.getAttrInternal(this, aName, aPos);
}

ZrfMoveGenerator.prototype.setAttr = function(aName, aPos, aValue) {
  if (typeof this.attrs[aPos] === "undefined") {
      this.attrs[aPos] = [];
  }
  this.attrs[aPos][aName] = aValue;
  var piece = this.getPieceInternal(aPos);
  if (piece !== null) {
      piece = piece.setValue(aName, aValue);
      this.move.movePiece(aPos, aPos, piece, this.level);
      this.setPiece(aPos, piece);
  }
}

ZrfMoveGenerator.prototype.generate = function() {
  this.cmd = 0;
  while (this.cmd < this.template.commands.length) {
     var r = (this.template.commands[this.cmd++])(this);
     if (r === null) break;
     this.cmd += r;
     if (this.cmd < 0) break;
  }
}

function ZrfPiece(aType, aPlayer) {
  this.type   = aType;
  this.player = aPlayer;
}

Model.Game.createPiece = function(aType, aPlayer) {
  return new ZrfPiece(aType, aPlayer);
}

Model.Game.pieceToString = function(piece) {
  return piece.player + "/" + piece.type;
}

ZrfPiece.prototype.toString = function() {
  // TODO:

  return Model.Game.pieceToString(this);
}

ZrfPiece.prototype.getType = function() {
  var design = Model.Game.getDesign();
  return design.pnames[this.type];
}

ZrfPiece.prototype.getOwner = function() {
  // TODO:

  return null;
}

ZrfPiece.prototype.getValue = function(aName) {
  if (typeof this.values !== "undefined") {
     if (typeof this.values[aName] !== "undefined") {
         return this.values[aName];
     }
  }
  return null;
}

ZrfPiece.prototype.setValue = function(aName, aValue) {
  if (this.getValue(aName) === aValue) {
      return this;
  }
  var piece = new ZrfPiece(this.type, this.player);
  if (typeof piece.values === "undefined") {
     piece.values = [];
  }
  piece.values[aName] = aValue;
  return piece;
}

ZrfPiece.prototype.promote = function(aType) {
  return new ZrfPiece(aType, this.player);
}

ZrfPiece.prototype.changeOwner = function(aPlayer) {
  if (this.player === aPlayer) {
      return this;
  } else {
      return new ZrfPiece(this.type, aPlayer);
  }
}

ZrfPiece.prototype.flip = function() {
  var design = Model.Game.getDesign();
  return new ZrfPiece(this.type, design.nextPlayer(this.player));
}

Model.Game.BuildDesign = function(design) {}

Model.Game.InitGame = function() {
  var  design = Model.Game.getDesign();
  this.BuildDesign(design);
}

Model.Game.DestroyGame = function() {}

Model.Board.getValue = function(aName, aPos) {
  if (typeof this.names[aName] === "undefined") {
      return false;
  }
  if (typeof this.names[aName][aPos] === "undefined") {
      return false;
  }
  return this.names[aName][aPos];
}

Model.Board.setValue = function(aName, aPos, aValue) {
  if (typeof this.names[aName] === "undefined") {
      this.names[aName] = [];
  }
  this.names[aName][aPos] = aValue;
}

Model.Board.addFork = function(aGen) {
  if (typeof Model.Game.movesLimit !== "undefined") {
      if (this.forks.length >= Model.Game.movesLimit) {
          this.failed = true;
          return;
      }
  }
  this.forks.push(aGen);
}

Model.Board.getPiece = function(aPos) {
  if (typeof this.pieces[aPos] === "undefined") {
      return null;
  } else {
      return this.pieces[aPos];
  }
}

Model.Board.setPiece = function(aPos, aPiece) {
  if (aPiece === null) {
     delete this.pieces[aPos];
  } else {
     this.pieces[aPos] = aPiece;
  }
}

Model.Board.Init = function(aGame) {
  this.game     = aGame;
  this.zSign    = 0;
  this.pieces   = [];
  this.forks    = [];
  this.names    = [];
  this.moves    = [];
  this.getValue = Model.Board.getValue;
  this.setValue = Model.Board.setValue;
  this.addFork  = Model.Board.addFork;
  this.getPiece = Model.Board.getPiece;
  this.setPiece = Model.Board.setPiece;
  this.addMove  = Model.Board.addMove;
  this.replMove = Model.Board.replMove;
}

Model.Board.addMove = function(aMove) {
  this.moves.push(aMove);
}

Model.Board.replMove = function(aMove) {
  if (this.moves.length > 0) {
      this.moves.pop();
  }
  this.moves.push(aMove);
}

Model.Board.GetSignature = function() {
  return this.zSign;
}

Model.Board.CopyFrom = function(aBoard) {
  this.mWho  = aBoard.mWho;
  this.zSign = aBoard.zSign;
  for (var pos in aBoard.pieces) {
      this.pieces[pos] = aBoard.pieces[pos];
  }
}

Model.Board.PostActions = function(aGame, aMoves) {
  this.mMoves = aMoves;
}

var CompleteMove = function(aBoard, aGen) {
  var t = 1;
  if (Model.Game.passPartial === true) {
      t = 2;
  }
  for (var pos in aBoard.pieces) {
       var piece = aBoard.pieces[pos];
       if ((piece.player === aBoard.mWho) || (Model.Game.sharedPieces === true)) {
           for (var move in aGame.design.pieces[piece.type]) {
                if ((move.type === 0) && (move.mode === aGen.mode)) {
                    var g = f.copy(move.template, move.params);
                    if (t > 0) {
                        g.moveType = t;
                        g.generate();
                        if (g.moveType === 0) {
                            CompleteMove(aBoard, g);
                        }
                    } else {
                        aBoard.addFork(g);
                    }
                    t = 0;
                }
           }
       }
  }
}

Model.Board.GenerateMoves = function(aBoard) {
  aBoard.moves = [];
  if (typeof aBoard.forks === "undefined") {
      aBoard.forks = [];
  }
  var mx = null;
  for (var pos in aBoard.pieces) {
       var piece = aBoard.pieces[pos];
       if ((piece.player === aBoard.mWho) || (Model.Game.sharedPieces === true)) {
           for (var move in aGame.design.pieces[piece.type]) {
               if (move.type === 0) {
                   var g = Model.Game.createGen(move.template, move.params);
                   g.init(aBoard, pos);
                   aBoard.addFork(g);
                   if (aGame.design.modes.length > 0) {
                       var ix = Model.find(aGame.design.modes, move.mode);
                       if (ix >= 0) {
                           if ((mx === null) || (ix < mx)) {
                               mx = ix;
                           }
                       }
                   }
               }
           }
       }
  }
  for (var tp in aBoard.game.design.pieces) {
       for (var pos in aBoard.game.design.positions) {
           for (var move in aBoard.game.design.pieces[tp]) {
                if (move.type === 1) {
                    var g = Model.Game.createGen(move.template, move.params);
                    g.init(this, pos);
                    g.piece = new ZrfPiece(tp, this.mWho);
                    g.from  = null;
                    g.mode  = move.mode;
                    aBoard.addFork(g);
                    if (aGame.design.modes.length > 0) {
                        var ix = Model.find(aGame.design.modes, move.mode);
                        if (ix >= 0) {
                            if ((mx === null) || (ix < mx)) {
                                mx = ix;
                            }
                        }
                    }
                }
           }
       }
  }
  while (aBoard.forks.length > 0) {
       var f = aBoard.forks.shift();
       if ((mx === null) || (aGame.design.modes[mx] === f.mode)) {
           f.generate();
           if (f.moveType === 0) {
               CompleteMove(aBoard, f);
           }
       }
  }
  Model.Board.PostActions(aBoard);
  if (Model.Game.passTurn === 1) {
      aBoard.moves.push(new ZrfMove());
  }
  if (Model.Game.passTurn === 2) {
      if (aBoard.moves.length === 0) {
          aBoard.moves.push(new ZrfMove());
      }
  }
  // LEGACY:
  Model.Board.mMoves = aBoard.moves;
  if (Model.Board.mMoves.length == 0) {
      Model.Board.mFinished = true;
      Model.Board.mWinner = -this.mWho;
  }
}

Model.Board.ApplyPart = function(aGame, aBoard, aMove, aPart) {  
  var r = false;
  delete aBoard.lastf;
  delete aBoard.lastt;
  for (var i in aMove.actions) {
      var part = aMove.actions[i][3];
      if (part === aPart) {
          var fp = aMove.actions[i][0];
          var tp = aMove.actions[i][1];
          var np = aMove.actions[i][2];
          if ((fp !== null) && (tp !== null)) {
              aBoard.lastf = fp;
              aBoard.lastt = tp;
              if (np === null) {
                  np = aBoard.pieces[fp];
              }
              var piece = aBoard.pieces[fp];
              if (typeof piece !== "undefined") {
                  aBoard.zSign = Model.Game.zupdate(aBoard.zSign, piece.player, piece.type, fp);
                  delete aBoard.pieces[fp];
              }
              var op = aBoard.pieces[tp];
              if (typeof op !== "undefined") {
                  aBoard.zSign = Model.Game.zupdate(aBoard.zSign, op.player, op.type, tp);
              }
              aBoard.zSign = Model.Game.zupdate(aBoard.zSign, np.player, np.type, tp);
              aBoard.pieces[tp] = np;
         }
      }
  }
  for (var i in aMove.actions) {
      var part = aMove.actions[i][3];
      if (part === aPart) {
          var fp = aMove.actions[i][0];
          var tp = aMove.actions[i][1];
          var np = aMove.actions[i][2];
          if ((fp === null) && (tp !== null) && (np !== null)) {
              var op = aBoard.pieces[tp];
              if (typeof op !== "undefined") {
                  aBoard.zSign = Model.Game.zupdate(aBoard.zSign, op.player, op.type, tp);
              }
              aBoard.zSign = Model.Game.zupdate(aBoard.zSign, np.player, np.type, tp);
              aBoard.pieces[tp] = np;
          }
      }
  }
  for (var i in aMove.actions) {
      var part = aMove.actions[i][3];
      if (part === aPart) {
          var fp = aMove.actions[i][0];
          var tp = aMove.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              var piece = aBoard.pieces[fp];
              if (typeof piece !== "undefined") {
                  aBoard.zSign = Model.Game.zupdate(aBoard.zSign, piece.player, piece.type, fp);
                  delete aBoard.pieces[fp];
              }
          }
      }
  }
  return r;
}

Model.Board.ApplyMove = function(aGame, aMove) {
  var part = 1;
  while (Model.Board.ApplyPart(aGame, Model.Board, aMove, part)) {
      part++;
  }
}

function ZrfMove() {
  this.actions = [];
}

Model.Game.createMove = function() {
  return new ZrfMove();
}

ZrfMove.prototype.copy = function() {
  var r = new ZrfMove();
  for (var i in this.actions) {
     r.actions.push(this.actions[i])
  }
  return r;
}

Model.Move.moveToString = function(aMove, aPart) {
  var r = "";
  var l = "";
  for (var i in aMove.actions) {
      var part = aMove.actions[i][3];
      if (part < 0) {
          part = -part;
      }
      if (aPart === 0) {
          part = 0;
      }
      if (part === aPart) {
          if (r !== "") {
              r = r + " ";
          }
          if ((aMove.actions[i][0] !== null) && (aMove.actions[i][1] !== null) && (aMove.actions[i][0] !== aMove.actions[i][1])) {
              if (aMove.actions[i][0] != aMove.actions[i][1]) {
                  if (l !== aMove.actions[i][0]) {
                      r = r + Model.Game.posToString(aMove.actions[i][0]);
                  }
                  r = r + " - ";
                  r = r + Model.Game.posToString(aMove.actions[i][1]);
                  l = aMove.actions[i][1];
              }
          } else {
              if (aMove.actions[i][1] === null) {
                  r = r + "x ";
                  r = r + Model.Game.posToString(aMove.actions[i][0]);
                  l = aMove.actions[i][0];
              } else {
                  if (l !== aMove.actions[i][1]) {
                      r = r + Model.Game.posToString(aMove.actions[i][1]) + " ";
                  }
                  r = r + "= ";
                  r = r + aMove.actions[i][2].toString();
                  l = aMove.actions[i][1];
              }
          }
      }
  }
  if (r === "") {
      r = "Pass";
  }
  return r;
}

ZrfMove.prototype.toString = function(aPart) {
  return Model.Move.moveToString(this, aPart);
}

ZrfMove.prototype.getStartPos = function(aPart) {
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp !== null)) {
              return Model.Game.posToString(fp);
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              return "";
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              return Model.Game.posToString(fp);
          }
      }
  }
  return "";
}

ZrfMove.prototype.getStopPos = function(aPart) {
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp !== null)) {
              return Model.Game.posToString(tp);
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              return Model.Game.posToString(tp);
          }
      }
  }
  return "";
}

ZrfMove.prototype.getCapturedPos = function(aPart) {
  // TODO:

  return [];
}

ZrfMove.prototype.changeView = function(aPart, aView) {
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp !== null)) {
              var p = this.actions[i][2];
              if (p === null) {
                  aView.move(fp, tp, null, null);
              } else {
                  aView.move(fp, tp, p.getType(), p.getOwner());
              }
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              var p = this.actions[i][2];
              aView.create(tp, p.getType(), p.getOwner());
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              aView.delete(fp);
          }
      }
  }
  aView.commit();
}

ZrfMove.prototype.movePiece = function(aFrom, aTo, aPiece, aPart) {
  this.actions.push([aFrom, aTo, aPiece, aPart]);
}

ZrfMove.prototype.dropPiece = function(aPos, aPiece, aPart) {
  this.actions.push([null, aPos, aPiece, aPart]);
}

ZrfMove.prototype.capturePiece = function(aPos, aPart) {
  this.actions.push([aPos, null, null, aPart]);
}

})();
