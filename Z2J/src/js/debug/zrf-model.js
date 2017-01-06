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
   return -(aGen.cmd + 2);
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
  this.failed    = false;
  this.modec     = 0;
}

Model.Game.getDesign = function() {
  if (typeof Model.Game.design === "undefined") {
      Model.Game.design = new ZrfDesign();
  }
  return Model.Game.design;
}

Model.Game.turkishStrike = false;

Model.Game.checkVersion = function(aDesign, aName, aValue) {  
  if (aName == "z2j") {
     if (aValue > Z2J_VERSION) {
         aDesign.failed = true;
     }
  } else {
     if ((aName != "zrf")                && 
         (aName != "turkish-strike")     &&
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
     if ((aName  === "turkish-strike")   &&
         (aValue === "true")) {
         Model.Game.turkishStrike = true;
     }
  }
}

Model.Game.checkOption = function(aDesign, aName, aValue) {
  if (aDesign.options[aName] == aValue) {
      return true;
  }
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
  if (aMode > this.modec) {
      this.modec = aMode;
  }
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
  this.players[aPlayer] = Model.int32Array(aSymmetries);
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
  this.template = null;
  this.params   = null;
  this.mode     = null;
  this.board    = null;
  this.pos      = null;
  this.mark     = null;
  this.parent   = null;
  this.pieces   = [];
  this.values   = [];
  this.attrs    = [];
  this.stack    = [];
  this.backs	= [];
  this.cmd      = 0;
  this.level    = 1;
}

ZrfMoveGenerator.prototype.getPos = function() {
  return this.pos;
}

Model.Game.createGen = function(aTemplate, aParams) {
  var r = new ZrfMoveGenerator();
  r.template = aTemplate;
  r.params   = Model.int32Array(aParams);
  return r;
}

Model.Game.cloneMove = function(aGen, aMove) {
  for (var i in aMove.actions) {
      if (aMove.actions[3] !== -aGen.level) {
          aGen.move.movePiece(aMove.actions[0], aMove.actions[1], aMove.actions[2], aMove.actions[3]);
      }
  }
}

Model.Game.copyMove = function(aGen, aMove) {
  for (var i in aMove.actions) {
      var l = aMove.actions[3];
      if (Model.Game.turkishStrike) {
          if (l < 0) {
              l = -aGen.level;
          }
      }
      aGen.move.movePiece(aMove.actions[0], aMove.actions[1], aMove.actions[2], l);
  }
}

ZrfMoveGenerator.prototype.copyValues = function(aGen) {
  this.mode     = aGen.mode;
  this.board    = aGen.board;
  this.pos      = aGen.pos;
  this.cmd      = aGen.cmd;
  this.mark     = aGen.mark;
  this.pieces   = [];
  for (var pos in aGen.pieces) {
      this.pieces[pos] = aGen.pieces[pos];
  }
  this.values = [];
  for (var name in aGen.values) {
      this.values[name] = [];
      for (var pos in aGen.values[name]) {
           this.values[name][pos] = aGen.values[name][pos];
      }
  }
  this.attrs = [];
  for (var pos in aGen.attrs) {
      this.attrs[pos] = [];
      for (var name in aGen.attrs[pos]) {
           this.attrs[pos][name] = aGen.attrs[pos][name];
      }
  }
  this.stack = [];
  for (var i in aGen.stack) {
      this.stack[i] = aGen.stack[i];
  }
  this.backs = [];
  for (var i in aGen.backs) {
      this.backs[i] = aGen.backs[i];
  }
}

ZrfMoveGenerator.prototype.clone = function() {
  var r = new ZrfMoveGenerator();
  r.template = this.template;
  r.params   = this.params;  
  r.level    = this.level;
  r.copyValues(this);
  Model.Game.cloneMove(r, this.move);
  return r;
}

ZrfMoveGenerator.prototype.copy = function() {
  var r = new ZrfMoveGenerator();
  r.template = this.template;
  r.params   = this.params;
  r.level    = this.level + 1;
  r.parent   = this;
  r.copyValues(this);
  Model.Game.copyMove(r, this.move);
  return r;
}

ZrfMoveGenerator.prototype.movePiece = function(aFrom, aTo, aPiece) {
  this.move.movePiece(aFrom, aTo, aPiece, this.level);
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
  this.setPiece(aPos, null);
}

Model.Game.getMark = function(aGen) {
  return aGen.mark;
}

ZrfMoveGenerator.prototype.getMark = function() {
  return Model.Game.getMark(this);
}

Model.Game.setMark = function(aGen) {
  aGen.mark = aGen.pos;
}

ZrfMoveGenerator.prototype.setMark = function() {
  Model.Game.setMark(this);
}

ZrfMoveGenerator.prototype.init = function(aBoard, aPos, aMove) {
  this.board    = aBoard;
  this.pos      = aPos;
  this.move     = aMove;
  this.parent   = null;
}

Model.Game.getPieceInternal = function(aGen, aPos) {
  if (typeof aGen.pieces[aPos] !== "undefined") {
      return aGen.pieces[aPos];
  }
  if (this.parent !== null) {
      return aGen.getPieceInternal(aPos);
  }
  return aGen.board.getPiece(aPos);
}

Model.Game.getPiece = function(aGen, aPos) {
  if (aGen.parent !== null) {
      return Model.Game.getPieceInternal(aGen.parent, aPos);
  }
  return aGen.board.getPiece(aPos);
}

ZrfMoveGenerator.prototype.isLastFrom = function(aPos) {
  if (this.board.lastf === aPos) {
      return true;
  }
  return false;
}

ZrfMoveGenerator.prototype.isLastTo = function(aPos) {
  if (this.board.lastt === aPos) {
      return true;
  }
  return false;
}

ZrfMoveGenerator.prototype.getPiece = function(aPos) {
  return Model.Game.getPiece(this, aPos);
}

ZrfMoveGenerator.prototype.setPiece = function(aPos, aPiece) {
  this.pieces[aPos] = aPiece;
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

Model.Game.getAttrInternal = function (aName, aPos) {
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
  return Model.Game.getAttrInternal(aName, aPos);
}

ZrfMoveGenerator.prototype.setAttr = function(aName, aPos, aValue) {
  if (typeof this.attrs[aPos] === "undefined") {
      this.attrs[aPos] = [];
  }
  this.attrs[aPos][aName] = aValue;
}

ZrfMoveGenerator.prototype.setAttrsInternal = function() {
  for (var pos in this.attrs) {
     var piece = Model.Game.getPieceInternal(this, pos);
     if (piece !== null) {
        for (var name in this.attrs[pos]) {
            piece = piece.setValue(name, this.attrs[pos][name]);
        }
        this.movePiece(pos, pos, piece);
     }
  }
}

ZrfMoveGenerator.prototype.generate = function() {
  this.cmd = 0;
  while (this.cmd < this.template.commands.length) {
     var r = (this.template.commands[this.cmd++])(this);
     if (r === null) return false;
     this.cmd += r;
     if (this.cmd < 0) break;
  }
  this.setAttrsInternal();
  return true;
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
  return Model.Game.pieceToString(this);
}

ZrfPiece.prototype.getType = function() {
  var design = Model.Game.getDesign();
  return design.pnames[this.type];
}

ZrfPiece.prototype.getOwner = function() {
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

ZrfPiece.prototype.flip = function() {
  return new ZrfPiece(this.type, -this.player);
}

Model.Game.BuildDesign = function(design) {}

Model.Game.InitGame = function() {
  var  design = Model.Game.getDesign();
  this.BuildDesign(design);
  this.zobrist = new JocGame.Zobrist({
     board: {
        type:  "array",
        size:   design.positions.length,
        values: design.pall
     }
  });
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
  if (typeof this.forks === "undefined") {
      this.forks = [];
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
  this.lastf    = null;
  this.lastt    = null;
  this.getValue = Model.Board.getValue;
  this.setValue = Model.Board.setValue;
  this.addFork  = Model.Board.addFork;
  this.getPiece = Model.Board.getPiece;
  this.setPiece = Model.Board.setPiece;
}

Model.Board.GetSignature = function() {
  return this.zSign;
}

Model.Board.InitialPosition = function(aGame) {
  this.Init(aGame);
  var design = aGame.getDesign();
  var inits  = aGame.mOptions.initial;
  var player = JocGame.PLAYER_A;
  for(var p in inits) {
      for(var t in inits[p]) {
          if (typeof design.types[t] !== "undefined") {
              var piece = Model.Game.createPiece(design.types[t], player);
              for(var i in inits[p][t]) {
                  var pos = Model.Game.stringToPos(inits[p][t][i]);
                  if (pos >= 0) {
                      this.pieces[pos] = piece;
                      this.zSign = aGame.zobrist.update(this.zSign, "board", piece.toString(), pos);
                  }
              }
          }
      }
      player = JocGame.PLAYER_B;
  }
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

var CompleteMove = function(aGame, aGen, aMove) {
  var pos = aGen.board.lastt;
  if (pos !== null) {
      var piece = aGen.pieces[pos];
      for (var move in aGame.design.pieces[piece.type]) {
           if ((move.type === 0) && ((move.mode === null) || (move.mode === aGen.mode))) {
                var g = aGen.copy();
                g.piece = piece;
                g.from  = pos;
                if (g.generate()) {
                    moves.push(m);
                    CompleteMove(aGame, g, m);
                }
           }
      }
  }
}

Model.Board.GenerateMoves = function(aGame) {
  var moves = [];
  if (typeof this.forks === "undefined") {
      this.forks = [];
  }
  for (var pos in this.pieces) {
       var piece = this.pieces[pos];
       if (piece.player === this.mWho) {
           for (var move in aGame.design.pieces[piece.type]) {
               if (move.type === 0) {
                   var m = { 
                       moves: {}, 
                   };
                   var g = Model.Game.createGen(move.template, move.params);
                   g.init(this, pos, m);
                   g.piece = piece;
                   g.from  = pos;
                   this.forks.push(g);
                   while (this.forks.length > 0) {
                       var f = this.forks.shift();
                       if (f.generate()) {
                           moves.push(f.move);
                           CompleteMove(aGame, f, f.move);
                       }
                   }
               }
           }
       }
  }
  for (var pos in aGame.design.positions) {
       if (typeof this.pieces[pos] === "undefined") {
           for (var tp in aGame.design.pieces) {
                for (var move in aGame.design.pieces[tp]) {
                     if (move.type === 1) {
                         var m = { 
                             moves: {}, 
                         };
                         var g = Model.Game.createGen(move.template, move.params);
                         g.init(this, pos, m);
                         g.piece = new ZrfPiece(tp, this.mWho);
                         g.from  = null;
                         if (g.generate()) {
                             moves.push(m);
                         }
                     }
                }
           }
       }
  }
  Model.Board.PostActions(aGame, moves);
  if (this.mMoves.length == 0) {
      this.mFinished = true;
      this.mWinner = -this.mWho;
  }
}

Model.Board.ApplyPart = function(aGame, aBoard, aMove, aPart) {
  var r = false;
  aBoard.lastf = null;
  aBoard.lastt = null;
  for (var i in aMove.actions) {
      var part = aMove.actions[i][3];
      if (part === aPart) {
          var fp = aMove.actions[i][0];
          var tp = aMove.actions[i][1];
          var np = aMove.actions[i][2];
          if ((fp !== null) && (tp !== null)) {
              if (aBoard.lastf === null) {
                  aBoard.lastf = fp;
              }
              aBoard.lastt = tp;
              if (np === null) {
                  np = aBoard.pieces[fp];
              }
              var piece = aBoard.pieces[fp];
              if (typeof piece !== "undefined") {
                  aBoard.zSign = aGame.zobrist.update(aBoard.zSign, "board", piece.toString(), fp);
                  delete aBoard.pieces[fp];
              }
              var op = aBoard.pieces[tp];
              if (typeof op !== "undefined") {
                  aBoard.zSign = aGame.zobrist.update(aBoard.zSign, "board", op.toString(), tp);
              }
              aBoard.zSign = aGame.zobrist.update(aBoard.zSign, "board", np.toString(), tp);
              aBoard.pieces[tp] = np;
         }
      }
  }
  for (var i in aMove.actions) {
      var part = aMove.actions[i][3];
      if (part === -aPart) {
          var fp = aMove.actions[i][0];
          var tp = aMove.actions[i][1];
          var np = aMove.actions[i][2];
          if ((fp === null) && (tp !== null) && (np !== null)) {
              var op = aBoard.pieces[tp];
              if (typeof op !== "undefined") {
                  aBoard.zSign = aGame.zobrist.update(aBoard.zSign, "board", op.toString(), tp);
              }
              aBoard.zSign = aGame.zobrist.update(aBoard.zSign, "board", np.toString(), tp);
              aBoard.pieces[tp] = np;
          }
      }
  }
  for (var i in aMove.actions) {
      var part = aMove.actions[i][3];
      if (part === -aPart) {
          var fp = aMove.actions[i][0];
          var tp = aMove.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              var piece = aBoard.pieces[fp];
              if (typeof piece !== "undefined") {
                  aBoard.zSign = aGame.zobrist.update(aBoard.zSign, "board", piece.toString(), fp);
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

Model.Board.Evaluate = function(aGame) {
  var score = 0;
  var board = this;
  for (var pos in board.pieces) {
       var piece  = board.pieces[pos];
       var weight = 10 + (piece.type * 100);
       if (piece.player === JocGame.PLAYER_A) {
           score += weight;
       } else {
           score -= weight;
       }
  }
  this.mEvaluation = score;
}

Model.Board.IsValidMove = function(aGame, aMove) {
  return true;
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
              if (l !== aMove.actions[i][0]) {
                  r = r + Model.Game.posToString(aMove.actions[i][0]);
              }
              r = r + " - ";
              r = r + Model.Game.posToString(aMove.actions[i][1]);
              l = aMove.actions[i][1];
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
      if (this.actions[i][3] === -aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              return "";
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === -aPart) {
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
      if (this.actions[i][3] === -aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              return Model.Game.posToString(tp);
          }
      }
  }
  return "";
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
      if (this.actions[i][3] === -aPart) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              var p = this.actions[i][2];
              aView.create(tp, p.getType(), p.getOwner());
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === -aPart) {
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
  this.actions.push([null, aPos, aPiece, -aPart]);
}

ZrfMove.prototype.capturePiece = function(aPos, aPart) {
  this.actions.push([aPos, null, null, -aPart]);
}

})();
