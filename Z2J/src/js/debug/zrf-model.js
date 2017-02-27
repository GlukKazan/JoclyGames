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
   aGen.generated = true;
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
   aGen.generated = true;
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
   if (aGen.generated === true) {
       if (aGen.moveType === 2) {
           board.changeMove(aGen.move);
       }
       if (aGen.moveType === 1) {
           board.addMove(aGen.move);
       }
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
   var piece = aGen.getPiece(aGen.pos);
   aGen.stack.push(piece === null);
   return 0;
}

Model.Game.isFriend = function(piece, player) {
   return (piece.player === player);
}

Model.Game.functions[Model.Move.ZRF_IS_ENEMY] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   var piece  = aGen.getPiece(aGen.pos);
   if (piece === null) {
       aGen.stack.push(false);
       return 0;
   }
   var player = aGen.board.player;
   aGen.stack.push(!Model.Game.isFriend(piece, player));
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_FRIEND] = function(aGen) {
   if (aGen.pos === null) {
       return null;
   }
   var piece  = aGen.getPiece(aGen.pos);
   if (piece === null) {
       aGen.stack.push(false);
       return 0;
   }
   var player = aGen.board.player;
   aGen.stack.push(Model.Game.isFriend(piece, player));
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

Model.isIncluding = function(a, b) {
  if ((a === null) && (b === null)) return true;
  if ((a === null) || (b === null)) return false;
  if (b.length !== 1) return false;
  return Model.find(a, b[0]) >= 0;
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
Model.Game.recycleCaptures = false;
Model.Game.smartFrom       = false;
Model.Game.smartTo         = false;
Model.Game.smartShow       = false;

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
         (aName != "silent-?-moves")) {
         aDesign.failed = true;
     }
     if (aName == "smart-moves") {
         if ((aValue === "from") || (aValue === "true")) {
            Model.Game.smartFrom = true;
         }
         if ((aValue === "to") || (aValue === "true")) {
            Model.Game.smartTo = true;
         }
         if (aValue === "show") {
            Model.Game.smartShow = true;
         }
     }
     if ((aName == "recycle-captures") && (aValue === "true")) {
         Model.Game.recycleCaptures = true;
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

ZrfDesign.prototype.reserve = function(player, piece, cnt) {
  var o = Model.find(this.tnames, player);
  var t = Model.find(this.pnames, piece);
  if ((o < 0) || (t < 0)) {
      this.failed = true;
  } else {
      if (typeof this.reserve[t] === "undefined") {
          this.reserve[t] = [];
      }
      this.reserve[t][o] = cnt;
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
  if (typeof this.templates[aTemplate] !== "undefined") {
      this.pieces[aType].push({
         type: 0,
         template: this.templates[aTemplate],
         params: aParams,
         mode: aMode
      });
  }
}

ZrfDesign.prototype.addDrop = function(aType, aTemplate, aParams, aMode) {
  if (typeof this.pieces[aType] === "undefined") {
      this.pieces[aType] = [];
  }
  if (typeof this.templates[aTemplate] !== "undefined") {
      this.pieces[aType].push({
         type: 1,
         template: this.templates[aTemplate],
         params: aParams,
         mode: aMode
      });
  }
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
  this.cmd      = 0;
}

Model.Game.createGen = function(aTemplate, aParams) {
  var r = new ZrfMoveGenerator();
  r.template = aTemplate;
  r.params   = Model.int32Array(aParams);
  return r;
}

ZrfMoveGenerator.prototype.init = function(board, pos) {
  this.board    = board;
  this.pos      = +pos;
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
  if (typeof this.from !== "undefined") {
      r.from = this.from;
  }
  if (typeof this.piece !== "undefined") {
      r.piece = this.piece;
  }
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
  r.move = this.move.clone(r.level);
  return r;
}

ZrfMoveGenerator.prototype.copy = function(aTemplate, aParams) {
  var r = Model.Game.createGen(aTemplate, aParams);
  r.level    = this.level + 1;
  r.parent   = this;
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
  this.lastt = aTo;
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
  while (this.cmd < this.template.commands.length) {
     var r = (this.template.commands[this.cmd++])(this);
     if (r === null) break;
     this.cmd += r;
     if (this.cmd < 0) break;
  }
  this.cmd = 0;
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

ZrfPiece.prototype.isEquals = function(piece) {
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

ZrfBoard.prototype.getMoveList = function() {
  this.generate();
  return new ZrfMoveList(this);
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

ZrfBoard.prototype.isEquals = function(board) {
  var r = false;
  if (board.zSign === r.zSign) {
      if (board.pieces.length === this.pieces.length) {
          r = true;
          for (var pos in this.pieces) {
               var p = board.getPiece(pos);
               if ((p === null) || (p.isEquals(this.pieces[pos]) === false)) {
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
      var design = Model.Game.getDesign();
      Model.Game.board.reserve = design.reserve;
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
      this.zSign = Model.Game.zupdate(this.zSign, op, pos);
  }
  if (piece === null) {
     delete this.pieces[pos];
  } else {
     this.pieces[pos] = piece;
     this.zSign = Model.Game.zupdate(this.zSign, piece, pos);
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

Model.Game.getPartList = function(board, gen) {
  return [ gen.lastt ];
}

var CompleteMove = function(board, gen) {
  var t = 1;
  if (Model.Game.passPartial !== true) {
      t = 2;
  }
  var positions = Model.Game.getPartList(board, gen);
  while (positions.length > 0) {
       pos = positions.pop();
       var piece = gen.getPieceInternal(pos);
       if (Model.Game.isFriend(piece, board.player) || (Model.Game.sharedPieces === true)) {
           for (var m in Model.Game.design.pieces[piece.type]) {
                var move = Model.Game.design.pieces[piece.type][m];
                if ((move.type === 0) && (move.mode === gen.mode)) {
                    var g = gen.copy(move.template, move.params);
                    g.moveType = t;
                    g.generate();
                    if ((g.generated === true) && (g.moveType === 0)) {
                        CompleteMove(board, g);
                        t = 1;
                    }
                }
           }
       }
  }
}

var addPrior = function(priors, mode, gen) {
  var ix = 0;
  var design = Model.Game.design;
  if (design.modes.length > 0) {
      ix = Model.find(design.modes, mode);
  }
  if (ix >= 0) {
      if (typeof priors[ix] === "undefined") {
          priors[ix] = [];
      }
      priors[ix].push(gen);
  }
}

ZrfBoard.prototype.generateInternal = function(callback, cont) {
  var design = Model.Game.design;
  if ((this.moves.length === 0) && (design.failed !== true) && (this.player > 0)) {
      var priors = [];
      _.each(_.keys(this.pieces), function(pos) {
           var piece = this.pieces[pos];
           if (Model.Game.isFriend(piece, this.player) || (Model.Game.sharedPieces === true)) {
               _.each(design.pieces[piece.type], function(move) {
                   if (move.type === 0) {
                       var g = Model.Game.createGen(move.template, move.params);
                       g.init(this, pos);
                       addPrior(priors, move.mode, g);
                   }
               }, this);
           }
      }, this);
      for (var tp in design.pieces) {
           for (var pos in design.positions) {
               if (Model.Game.noReserve(this, tp) === true) continue;
               for (var m in design.pieces[tp]) {
                    var move = design.pieces[tp][m];
                    if (move.type === 1) {
                        var g = Model.Game.createGen(move.template, move.params);
                        g.init(this, pos);
                        g.piece = new ZrfPiece(tp, this.player);
                        addPrior(priors, move.mode, g);
                    }
               }
           }
      }
      this.forks = [];
      if (callback.checkContinue() === true) {
          for (var i = 0; i <= design.modes.length; i++) {
               var f = false;
               if (typeof priors[i] !== "undefined") {
                   while (priors[i].length > 0) {
                      var g = priors[i].pop();
                      g.generate();
                      if (g.generated === true) {
                          if ((cont === true) && (g.moveType === 0)) {
                              CompleteMove(this, g);
                          }
                          f = true;
                      }
                   }
               }
               if (f === true) break;
               if (i >= design.modes.length) break;
          }
          while (this.forks.length > 0) {
               var g = this.forks.pop();
               g.generate();
               if (g.generated === true) {
                   if ((cont === true) && (g.moveType === 0)) {
                        CompleteMove(this, g);
                   }
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
}

ZrfBoard.prototype.generate = function() {
  this.generateInternal(this, true);
}

ZrfBoard.prototype.checkContinue = function() {
  return true;
}

Model.Game.decReserve = function(board, piece) {
  if (typeof board.reserve[piece.type] !== "undefined") {
      if (typeof board.reserve[piece.type][piece.player] !== "undefined") {
          board.reserve[piece.type][piece.player]--;
      }
  }
}

Model.Game.incReserve = function(board, piece) {
  if (typeof board.reserve[piece.type] !== "undefined") {
      if (typeof board.reserve[piece.type][piece.player] !== "undefined") {
          board.reserve[piece.type][piece.player]++;
      }
  }
}

Model.Game.noReserve = function(board, piece) {
  if (typeof board.reserve[piece] !== "undefined") {
      if (typeof board.reserve[piece][board.player] !== "undefined") {
          return (board.reserve[piece][board.player] <= 0);
      }
  }
  return false;
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
              Model.Game.decReserve(board, np[0]);
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
              if (Model.Game.recycleCaptures === true) {
                  var piece = this.getPiece(fp[0]);
                  if (piece != null) {
                      Model.Game.incReserve(this, piece);
                  }
              }
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

ZrfMove.prototype.clone = function(level) {
  var r = new ZrfMove();
  var o = true;
  for (var i in this.actions) {
      if ((this.actions[i][0] !== null) && (this.actions[i][1] !== null)) {
          if (o === true) {
              r.actions.push(this.actions[i])
              if (Model.Game.discardCascades === true) {
                  o = false;
              }
          }
      } else {
              if ((Model.Game.forkMode === true) || (Math.abs(this.actions[i][3]) < level)) {
                  r.actions.push(this.actions[i])
              }
      }
  }
  return r;
}

ZrfMove.prototype.isIncluding = function(move) {
  var f = true;
  for (var i in this.actions) {
       f = false;
       for (var j in move.actions) {
            if (this.actions[i][3] === move.actions[j][3]) {
                if ((Model.isIncluding(this.actions[i][0], move.actions[j][0]) === true) &&
                    (Model.isIncluding(this.actions[i][1], move.actions[j][1]) === true)) {
                    if ((this.actions[i][2] == null) &&
                        (move.actions[j][2] == null)) {
                        f = true;
                        break;
                    }
                    if ((this.actions[i][2] == null) ||
                        (move.actions[j][2] == null) ||
                        (move.actions[j][2].length !== 1) ) {
                        break;
                    }
                    for (var k in this.actions[i][2]) {
                         var piece = this.actions[i][2][k];
                         if (piece.isEquals(move.actions[j][2][0])) {
                             f = true;
                             break;
                         }
                    }
                    if (f === true) break;
                }
            }
       }
       if (f === false) break;
  }
  return f;
}

Model.Move.moveToString = function(move, part) {
  if (move.actions.length === 0) {
      return "Pass";
  }
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
                  if (l !== move.actions[i][0][0]) {
                      if (r !== "") {
                          r = r + " ";
                      }
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

ZrfMove.prototype.back = function(level) {
  while (this.actions.length > 0) {
      var a = this.actions.peekBack();
      if (a[3] < level) break;
      this.actions.pop();
  }
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
