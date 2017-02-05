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
   var design = Model.Game.getDesign();
   var player = aGen.board.player;
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
   var design = Model.game.getDesign();
   var player = aGen.board.player;
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
   var design = Model.Game.getDesign();
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
   var design = Model.Game.getDesign();
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
   var design = Model.Game.getDesign();
   var player = aGen.board.player;
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
   var design = Model.Game.getDesign();
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
       board.changeMove(aGen.move);
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
   var player = aGen.board.player;
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
   var player = aGen.board.player;
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
Model.Game.forkMode        = false;
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

ZrfDesign.prototype.setup = function(player, piece, pos) {
  var o = Model.find(this.tnames, player);
  var t = Model.find(this.pnames, piece);
  if ((o < 0) || (t < 0)) {
      this.failed = true;
  } else {
      var board = Model.Game.getInitBoard();
      board.setPiece(pos, Model.Game.createPiece(t, o));
  }
}

ZrfDesign.prototype.getTemplate = function(aIx) {
  if (typeof this.templates[aIx] === "undefined") {
      this.templates[aIx] = Model.Game.createTemplate();
  }
  return this.templates[aIx];
}

ZrfDesign.prototype.addCommand = function(aIx, aName, aParam) {
  var aTemplate = this.getTemplate(aIx);
  aTemplate.addCommand(aName, aParam);
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

ZrfDesign.prototype.addPiece = function(name, type) {
  this.pnames[type] = name;
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

ZrfDesign.prototype.getPieceType = function(name) {
  var r = Model.find(this.pnames, name);
  if (r < 0) {
      return null;
  }
  return r;
}

ZrfDesign.prototype.getDirection = function(name) {
  var r = Model.find(this.dirs, name);
  if (r < 0) {
      return null;
  }
  return r;
}

ZrfDesign.prototype.addDirection = function(aName) {
  this.dirs.push(aName);
}

ZrfDesign.prototype.addPlayer = function(aPlayer, aSymmetries) {
  var ix = this.tnames.length;
  if (this.tnames.length === 0) {
      ix = 0;
      this.tnames.push("opposite");
  }
  this.players[ix] = Model.int32Array(aSymmetries);
  this.tnames.push(aPlayer);
}

ZrfDesign.prototype.nextPlayer = function(aPlayer) {
  if (aPlayer + 1 >= this.tnames.length) {
      return 1;
  } else {
      return aPlayer + 1;
  }
}

ZrfDesign.prototype.prevPlayer = function(aPlayer) {
  if (aPlayer === 1) {
      return this.tnames.length;
  } else {
      return aPlayer - 1;
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

ZrfMoveTemplate.prototype.addCommand = function(aName, aParam) {
  if (typeof Model.Game.commands[aName] !== "undefined") {
      if (typeof Model.Game.cache === "undefined") {
          Model.Game.cache = [];
      }
      if (typeof Model.Game.cache[aName] === "undefined") {
          Model.Game.cache[aName] = [];
      }
      var offset = aParam;
      if (typeof Model.Game.cache[aName][offset] === "undefined") {
          Model.Game.cache[aName][offset] = function(x) {
              return (Model.Game.commands[aName])(x, offset);
          }
      }
      this.commands.push(Model.Game.cache[aName][offset]);
  }
}

CHECK_TYPE = {
  DEFENDED:      1,
  NOT_DEFENDED:  2,
  ATTACKED:      3,
  NOT_ATTACKED:  4
};

function ZrfCheck(type, piece, pos) {
  this.type      = type;
  this.piece     = piece;
  this.pos       = [ pos ];
  this.to        = null;
  this.isCont    = true;
}

ZrfCheck.prototype.addPos = function(pos) {
  this.pos.push(pos);
}

ZrfCheck.prototype.addMove = function(move) {
  for (var i in this.pos) {
       if (move.isAttacked(this.pos[i]) === true) {
           this.isCont = false;
       }
  }
}

ZrfCheck.prototype.prepare = function(board) {
  var b = board.copy();
  if (this.type <= NOT_DEFENDED) {
      b.player = Model.Game.design.prevPlayer(b.player);
  }
  if (this.to !== null) {
      b.setPiece(this.to, null);
  }
  for (var i in this.pos) {
      b.setPiece(this.pos[i], this.piece);
  }
  var callback = this;
  b.addMove = function(x) {
      callback.addMove(x);
  }
  return b;
}

ZrfCheck.prototype.checkContinue = function() {
  return this.isCont;
}

ZrfCheck.prototype.isFailed = function() {
  if ((this.type === DEFENDED) || (this.type === ATTACKED)) {
      return !this.isCont;
  } else {
      return this.isCont;
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
  r.move = this.move.clone();
  return r;
}

ZrfMoveGenerator.prototype.copy = function(aTemplate, aParams) {
  var r = Model.Game.createGen(aTemplate, aParams);
  r.level    = this.level + 1;
  r.parent   = this;
  r.mode     = this.mode;
  r.board    = this.board;
  r.pos      = this.pos;
  r.move     = this.move.copy();
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

Model.Game.getAttrInternal = function(aGen, aName, aPos) {
  return null;
}

ZrfMoveGenerator.prototype.getAttr = function(aName, aPos) {
  var piece = this.getPiece(aPos);
  if (piece !== null) {
      var value = piece.getValue(aName);
      if (value === null) {
          var design = Model.Game.getDesign();
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

Model.Game.createPiece = function(type, player) {
  if (typeof Model.Game.cachePiece === "undefined") {
      Model.Game.cachePiece = [];
  }
  if (typeof Model.Game.cachePiece[player] === "undefined") {
      Model.Game.cachePiece[player] = [];
  }
  if (typeof Model.Game.cachePiece[player][type] === "undefined") {
      Model.Game.cachePiece[player][type] = new ZrfPiece(type, player);
  }
  return Model.Game.cachePiece[player][type];
}

ZrfPiece.prototype.equals = function(piece) {
  if ((piece.type === this.type) && (piece.player === this.player)) {
      return true;
  } else {
      return false;
  }
}

Model.Game.pieceToString = function(piece) {
  return piece.getOwner() + " " + piece.getType();
}

ZrfPiece.prototype.toString = function() {
  return Model.Game.pieceToString(this);
}

ZrfPiece.prototype.getType = function() {
  var design = Model.Game.getDesign();
  return design.pnames[this.type];
}

ZrfPiece.prototype.getOwner = function() {
  var design = Model.Game.getDesign();
  return design.tnames[this.player];
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

function ZrfBoard(game) {
  this.game     = game;
  this.zSign    = 0;
  this.pieces   = [];
  this.forks    = [];
  this.moves    = [];
  this.player   = 1;
}

ZrfBoard.prototype.copy = function() {
  var r = new ZrfBoard(this.game);
  r.parent = this;
  r.player = this.player;
  r.zSign  = this.zSign;
  for (var pos in this.pieces) {
      r.pieces[pos] = this.pieces[pos];
  }
  return r;
}

ZrfBoard.prototype.equals = function(board) {
  var r = false;
  if (board.zSign === r.zSign) {
      if (board.pieces.length === this.pieces.length) {
          r = true;
          for (var pos in this.pieces) {
               var p = board.getPiece(pos);
               if ((p === null) || (p.equals(this.pieces[pos]) === false)) {
                   r = false;
                   break;
               }
          }
      }
  }
  return r;
}

Model.Game.getInitBoard = function() {
  if (typeof Model.Game.board === "undefined") {
      Model.Game.board = new ZrfBoard(Model.Game);
  }
  return Model.Game.board;
}

ZrfBoard.prototype.clear = function() {
  this.zSign    = 0;
  this.pieces   = [];
}

ZrfBoard.prototype.addFork = function(gen) {
  if (typeof Model.Game.movesLimit !== "undefined") {
      if (this.forks.length >= Model.Game.movesLimit) {
          this.failed = true;
          return;
      }
  }
  this.forks.push(gen);
}

ZrfBoard.prototype.getPiece = function(pos) {
  if (typeof this.pieces[pos] === "undefined") {
      return null;
  } else {
      return this.pieces[pos];
  }
}

ZrfBoard.prototype.setPiece = function(pos, piece) {
  if (typeof this.pieces[pos] !== "undefined") {
      var op = this.pieces[pos];
      this.zSign = Model.Game.zupdate(this.zSign, op.player, op.type, pos);
  }
  if (piece === null) {
     delete this.pieces[pos];
  } else {
     this.pieces[pos] = piece;
     this.zSign = Model.Game.zupdate(this.zSign, piece.player, piece.type, pos);
  }
}

ZrfBoard.prototype.addMove = function(move) {
  this.moves.push(move);
}

ZrfBoard.prototype.changeMove = function(move) {
  if (this.moves.length > 0) {
      this.moves.pop();
  }
  this.moves.push(move);
}

ZrfBoard.prototype.getSignature = function() {
  return this.zSign;
}

Model.Game.PostActions = function(board) {
  var moves = [];
  for (var i in board.moves) {
       if (typeof board.moves[i].failed === "undefined") {
           moves.push(board.moves[i]);
       }
  }
  board.moves = moves;
}

Model.Game.CheckInvariants = function(board) {
  for (var i in board.moves) {
       var m = board.moves[i];
       var b = board.apply(m);
       for (var i in m.checks) {
            var c = m.checks[i];
            var p = c.prepare(b);
            p.generateInternal(c, false);
            if (c.isFailed() === true) {
                m.failed = true;
                break;
            }
       }
  }
}

var CompleteMove = function(board, gen) {
  var t = 1;
  if (Model.Game.passPartial === true) {
      t = 2;
  }
  for (var pos in board.pieces) {
       var piece = board.pieces[pos];
       if ((piece.player === board.player) || (Model.Game.sharedPieces === true)) {
           for (var move in Model.Game.design.pieces[piece.type]) {
                if ((move.type === 0) && (move.mode === gen.mode)) {
                    var g = f.copy(move.template, move.params);
                    if (t > 0) {
                        g.moveType = t;
                        g.generate();
                        if (g.moveType === 0) {
                            CompleteMove(board, g);
                        }
                    } else {
                        board.addFork(g);
                    }
                    t = 0;
                }
           }
       }
  }
}

ZrfBoard.prototype.generateInternal = function(callback, cont) {
  this.forks = [];
  if ((this.moves.length === 0) && (Model.Game.design.failed !== true)) {
      var mx = null;
      for (var pos in this.pieces) {
           var piece = this.pieces[pos];
           if ((piece.player === this.player) || (Model.Game.sharedPieces === true)) {
               for (var move in Model.Game.design.pieces[piece.type]) {
                   if (move.type === 0) {
                       var g = Model.Game.createGen(move.template, move.params);
                       g.init(this, pos);
                       this.addFork(g);
                       if (Model.Game.design.modes.length > 0) {
                           var ix = Model.find(Model.Game.design.modes, move.mode);
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
      for (var tp in Model.Game.design.pieces) {
           for (var pos in Model.Game.design.positions) {
               for (var move in Model.Game.design.pieces[tp]) {
                    if (move.type === 1) {
                        var g = Model.Game.createGen(move.template, move.params);
                        g.init(this, pos);
                        g.piece = new ZrfPiece(tp, this.player);
                        g.from  = null;
                        g.mode  = move.mode;
                        this.addFork(g);
                        if (Model.Game.design.modes.length > 0) {
                            var ix = Model.find(Model.Game.design.modes, move.mode);
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
      while ((this.forks.length > 0) && (callback.checkContinue() === true)) {
           var f = this.forks.shift();
           if ((mx === null) || (Model.Game.design.modes[mx] === f.mode)) {
               f.generate();
               if ((cont === true) && (f.moveType === 0)) {
                   CompleteMove(this, f);
               }
           }
      }
      if (cont === true) {
          Model.Game.CheckInvariants(this);
          Model.Game.PostActions(this);
          if (Model.Game.passTurn === 1) {
              this.moves.push(new ZrfMove());
          }
          if (Model.Game.passTurn === 2) {
              if (this.moves.length === 0) {
                  this.moves.push(new ZrfMove());
              }
          }
      }
  }
  if (this.moves.length === 0) {
      this.player = 0;
  }
  return this.moves;
}

ZrfBoard.prototype.generate = function() {
  this.generateInternal(this, true);
}

ZrfBoard.prototype.checkContinue = function() {
  return true;
}

ZrfBoard.prototype.applyPart = function(move, part) {  
  var r = false;
  for (var i in move.actions) {
      var p = move.actions[i][3];
      if ((p < 0) && (part < 0)) {
          p = part;
      }
      if (p === part) {
          var fp = move.actions[i][0];
          var tp = move.actions[i][1];
          var np = move.actions[i][2];
          if ((fp !== null) && (tp !== null)) {
              this.lastf = fp[0];
              this.lastt = tp[0];
              if (np === null) {
                  np = [ this.getPiece(fp[0]) ];
              }
              this.setPiece(fp[0], null);
              this.setPiece(tp[0], np[0]);
              r = true;
          }
      }
  }
  for (var i in move.actions) {
      var p = move.actions[i][3];
      if ((p < 0) && (part < 0)) {
          p = part;
      }
      if (p === part) {
          var fp = move.actions[i][0];
          var tp = move.actions[i][1];
          var np = move.actions[i][2];
          if ((fp === null) && (tp !== null) && (np !== null)) {
              this.setPiece(tp[0], np[0]);
              r = true;
          }
      }
  }
  for (var i in move.actions) {
      var p = move.actions[i][3];
      if ((p < 0) && (part < 0)) {
          p = part;
      }
      if (p === part) {
          var fp = move.actions[i][0];
          var tp = move.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              this.setPiece(fp[0], null);
              r = true;
          }
      }
  }
  return r;
}

ZrfBoard.prototype.apply = function(move) {
  var r = this.copy();
  delete r.lastf;
  delete r.lastt;
  var part = 1;
  while (r.applyPart(move, part)) {
      part++;
  }
  r.applyPart(move, -1);
  r.player = Model.Game.design.nextPlayer(this.player);
  r.move = move;
  return r;
}

ZrfBoard.prototype.applyAll = function(move) {
  var r = [];
  var m = move.determinate();
  for (var i in m) {
      r.push(this.apply(m[i]));
  }
  return r;
}

function ZrfMove() {
  this.actions = [];
  this.checks  = [];
}

Model.Game.createMove = function() {
  return new ZrfMove();
}

var getIx = function(x, ix, mx) {
  if (ix > x.length) {
      x = [];
      return null;
  }
  if (ix == x.length) {
      c.push(0);
      return 0;
  }
  var r = x[ix];
  if (r >= mx) {
      if (ix + 1 >= x.length) {
          x = [];
          return null;
      }
      for (var i = 0; i <= ix; i++) {
          x[ix] = 0;
      }
      x[ix + 1]++;
  }
  return r;
}

ZrfMove.prototype.determinate = function() {
  var r = [];
  for (var x = [0]; x.length > 0; x[0]++) {
      var m = Model.Game.createMove();
      var ix = 0;
      for (var i in this.actions) {
           var k = 0;
           var fp = this.actions[i][0];
           if (fp !== null) {
               k = getIx(x, ix++, fp.length);
               if (k === null) {
                   break;
               }
               fp = [ fp[k] ];
           }
           var tp = this.actions[i][1];
           if (tp !== null) {
               k = getIx(x, ix++, tp.length);
               if (k === null) {
                   break;
               }
               tp = [ tp[k] ];
           }
           var pc = this.actions[i][2];
           if (pc !== null) {
               k = getIx(x, ix++, pc.length);
               if (k === null) {
                   break;
               }
               pc = [ pc[k] ];
           }
           var pn = this.actions[i][3];
           m.actions.push([fp, tp, pc, pn]);
      }
      r.push(m);      
  }
  return r;
}

ZrfMove.prototype.copy = function() {
  var r = new ZrfMove();
  for (var i in this.actions) {
     r.actions.push(this.actions[i])
  }
  return r;
}

ZrfMove.prototype.clone = function() {
  var r = new ZrfMove();
  var o = true;
  for (var i in this.actions) {
      if ((this.actions[0] !== null) && (this.actions[1] !== null)) {
          if (o === true) {
              r.actions.push(this.actions[i])
              if (Model.Game.discardCascades === true) {
                  o = false;
              }
          }
      } else {
          if (Model.Game.forkMode === true) {
              r.actions.push(this.actions[i])
          }
      }
  }
  return r;
}

Model.Move.moveToString = function(move, part) {
  var r = "";
  var l = "";
  for (var i in move.actions) {
      var p = move.actions[i][3];
      if (p < 0) {
          p = -p;
      }
      if (part === 0) {
          p = 0;
      }
      if (p === part) {
          if ((move.actions[i][0] !== null) && (move.actions[i][1] !== null) && (move.actions[i][0] !== move.actions[i][1])) {
              if (move.actions[i][0][0] != move.actions[i][1][0]) {
                  if (r !== "") {
                      r = r + " ";
                  }
                  if (l !== move.actions[i][0][0]) {
                      r = r + Model.Game.posToString(move.actions[i][0][0]);
                  }
                  r = r + " - ";
                  r = r + Model.Game.posToString(move.actions[i][1][0]);
                  l = move.actions[i][1][0];
              }
          }
      }
  }
  for (var i in move.actions) {
      var p = move.actions[i][3];
      if (p < 0) {
          p = -p;
      }
      if (part === 0) {
          p = 0;
      }
      if (p === part) {
          if (move.actions[i][1] === null) {
              if (r !== "") {
                  r = r + " ";
              }
              r = r + "x ";
              r = r + Model.Game.posToString(move.actions[i][0][0]);
              l = move.actions[i][0][0];
          } 
      }
  }
  if (r === "") {
      r = "Pass";
  }
  return r;
}

ZrfMove.prototype.toString = function(part) {
  return Model.Move.moveToString(this, part);
}

ZrfMove.prototype.isAttacked = function(pos) {
  var r = false;
  for (var i in this.actions) {
      var fp = this.actions[i][0];
      var tp = this.actions[i][1];
      if ((fp !== null) && (fp[0] === pos) && (tp === null)) {
          r = true;
          break
      }
      if ((tp !== null) && (tp[0] === pos) && (fp !== null) && (fp[0] !== tp[0])) {
          r = true;
          break
      }
  }
  return r;
}

ZrfMove.prototype.getStartPos = function(part) {
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp !== null)) {
              return Model.Game.posToString(fp[0]);
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              return "";
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              return Model.Game.posToString(fp[0]);
          }
      }
  }
  return "";
}

ZrfMove.prototype.getStopPos = function(part) {
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp !== null)) {
              return Model.Game.posToString(tp[0]);
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              return Model.Game.posToString(tp[0]);
          }
      }
  }
  return "";
}

ZrfMove.prototype.getCapturedPos = function(part) {
  var r = [];
  for (var i in this.actions) {
      var p = this.actions[i][3];
      if (p < 0) {
          p = -p;
      }
      if (part === 0) {
          p = part;
      }
      if (p === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              r.push(Model.Game.posToString(fp[0]));
          }
      }
  }
  return r;
}

ZrfMove.prototype.changeView = function(part, view) {
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp !== null)) {
              var p = this.actions[i][2];
              if (p === null) {
                  view.move(fp[0], tp[0], null, null);
              } else {
                  view.move(fp[0], tp[0], p[0].getType(), p[0].getOwner());
              }
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp === null) && (tp !== null)) {
              var p = this.actions[i][2];
              if (p !== null) {
                  view.create(tp[0], p[0].getType(), p[0].getOwner());
              }
          }
      }
  }
  for (var i in this.actions) {
      if (this.actions[i][3] === part) {
          var fp = this.actions[i][0];
          var tp = this.actions[i][1];
          if ((fp !== null) && (tp === null)) {
              view.delete(fp[0]);
          }
      }
  }
  view.commit();
}

ZrfMove.prototype.movePiece = function(from, to, piece, part) {
  if (piece === null) {
      this.actions.push([ [from], [to], null, part]);
  } else {
      this.actions.push([ [from], [to], [piece], part]);
  }
}

ZrfMove.prototype.dropPiece = function(pos, piece, part) {
  this.actions.push([null, [pos], [piece], part]);
}

ZrfMove.prototype.capturePiece = function(pos, part) {
  if (Model.Game.delayedStrike === true) {
      part = -part;
  }
  this.actions.push([ [pos], null, null, part]);
}

})();
