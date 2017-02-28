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

Model.Game.commands[Model.Move.ZRF_JUMP] = function(gen, param) {
   return param - 1;
}

Model.Game.commands[Model.Move.ZRF_IF] = function(gen, param) {
   if (gen.stack.length === 0) {
       return null;
   }
   var f = gen.stack.pop();
   if (f) {
      return param - 1;
   } else {
      return 0;
   }
}

Model.Game.commands[Model.Move.ZRF_FORK] = function(gen, param) {
   var g = gen.clone();
   g.cmd += param - 1;
   gen.board.addFork(g);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_FUNCTION] = function(gen, param) {
  var game = gen.board.game;
  if (typeof game.functions[param] !== "undefined") {
     return (game.functions[param])(gen);
  }
  return null;
}

Model.Game.commands[Model.Move.ZRF_IN_ZONE] = function(gen, param) {
   var design = Model.Game.getDesign();
   var player = gen.board.player;
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(design.inZone(param, player, gen.pos));
   return 0;
}

Model.Game.commands[Model.Move.ZRF_GET_FLAG] = function(gen, param) {
   gen.stack.push(gen.getValue(param, -1));
   return 0;
}

Model.Game.commands[Model.Move.ZRF_SET_FLAG] = function(gen, param) {
   if (gen.stack.length === 0) {
       return null;
   }
   value = gen.stack.pop();
   gen.setValue(param, -1, value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_GET_PFLAG] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(gen.getValue(param, gen.pos));
   return 0;
}

Model.Game.commands[Model.Move.ZRF_SET_PFLAG] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.stack.length === 0) {
       return null;
   }
   value = gen.stack.pop();
   gen.setValue(param, gen.pos, value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_GET_ATTR] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   var value = gen.getAttr(param, gen.pos);
   if (value === null) {
       return null;
   }
   gen.stack.push(value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_SET_ATTR] = function(gen, param) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.stack.length === 0) {
       return null;
   }
   var value = gen.stack.pop();
   gen.setAttr(param, gen.pos, value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_PROMOTE] = function(gen, param) {
   if (typeof gen.piece === "undefined") {
       return null;
   }
   gen.piece = gen.piece.promote(param);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_MODE] = function(gen, param) {
   gen.mode = param;
   return 0;
}

Model.Game.commands[Model.Move.ZRF_ON_BOARDD] = function(gen, param) {
   var design = Model.game.getDesign();
   var player = gen.board.player;
   var pos = gen.pos;
   if (pos === null) {
       return null;
   }
   pos = design.navigate(player, pos, param);
   if (pos !== null) {
       gen.stack.push(true);
   } else {
       gen.stack.push(false);
   }
   return 0;
}

Model.Game.commands[Model.Move.ZRF_ON_BOARDP] = function(gen, param) {
   var design = Model.Game.getDesign();
   if ((param >= 0) && (param < design.positions.length)) {
       gen.stack.push(true);
   } else {
       gen.stack.push(false);
   }
   return 0;
}

Model.Game.commands[Model.Move.ZRF_PARAM] = function(gen, param) {
   var value = gen.params[param];
   gen.stack.push(value);
   return 0;
}

Model.Game.commands[Model.Move.ZRF_LITERAL] = function(gen, param) {
   gen.stack.push(param);
   return 0;
}

Model.Game.functions = {};

Model.Game.functions[Model.Move.ZRF_VERIFY] = function(gen) {
   if (gen.stack.length === 0) {
       return null;
   }
   var f = gen.stack.pop();
   if (f) {
       return 0;
   } else {
       return null;
   }
}

Model.Game.functions[Model.Move.ZRF_SET_POS] = function(gen) {
   if (gen.stack.length === 0) {
       return null;
   }
   var pos = gen.stack.pop();
   var design = Model.Game.getDesign();
   if (pos < design.positions.length) {
      gen.pos = pos;
      return 0;
   } else {
      return null;
   }
}

Model.Game.functions[Model.Move.ZRF_NAVIGATE] = function(gen) {
   if (gen.stack.length === 0) {
       return null;
   }
   var dir = gen.stack.pop();
   var design = Model.Game.getDesign();
   var player = gen.board.player;
   var pos = gen.pos;
   if (pos === null) {
       return null;
   }
   pos = design.navigate(player, pos, dir);
   if (pos === null) {
       return null;
   }
   if (pos < design.positions.length) {
      gen.pos = pos;
      return 0;
   } else {
      return null;
   }
}

Model.Game.functions[Model.Move.ZRF_OPPOSITE] = function(gen) {
   if (gen.stack.length === 0) {
       return null;
   }
   var dir = gen.stack.pop();
   var design = Model.Game.getDesign();
   if (typeof design.players[0] === "undefined") {
       return null;
   }
   if (typeof design.players[0][dir] === "undefined") {
       return null;
   }
   dir = design.players[0][dir];
   gen.stack.push(dir);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_FROM] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.getPiece(gen.pos) === null) {
       return null;
   }
   gen.from  = gen.pos;
   gen.piece = gen.getPiece(gen.pos);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_TO] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (typeof gen.piece === "undefined") {
       return null;
   }
   gen.movePiece(gen.from, gen.pos, gen.piece);
   delete gen.from;
   delete gen.piece;
   gen.generated = true;
   return 0;
}

Model.Game.functions[Model.Move.ZRF_CAPTURE] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.getPiece(gen.pos) === null) {
       return 0;
   }
   gen.capturePiece(gen.pos);
   gen.generated = true;
   return 0;
}

Model.Game.functions[Model.Move.ZRF_FLIP] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   if (gen.getPiece(gen.pos) === null) {
       return null;
   }
   var piece = gen.getPiece(gen.pos).flip();
   gen.movePiece(gen.pos, gen.pos, piece);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_END] = function(gen) {
   var board = gen.board;
   if (gen.generated === true) {
       if (gen.moveType === 2) {
           board.changeMove(gen.move);
       }
       if (gen.moveType === 1) {
           board.addMove(gen.move);
       }
   }
   gen.moveType = 0;
   return null;
}

Model.Game.functions[Model.Move.ZRF_NOT] = function(gen) {
   if (gen.stack.length === 0) {
       return null;
   }
   var f = gen.stack.pop();
   gen.stack.push(!f);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_EMPTY] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   var piece = gen.getPiece(gen.pos);
   gen.stack.push(piece === null);
   return 0;
}

Model.Game.isFriend = function(piece, player) {
   return (piece.player === player);
}

Model.Game.functions[Model.Move.ZRF_IS_ENEMY] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   var piece  = gen.getPiece(gen.pos);
   if (piece === null) {
       gen.stack.push(false);
       return 0;
   }
   var player = gen.board.player;
   gen.stack.push(!Model.Game.isFriend(piece, player));
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_FRIEND] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   var piece  = gen.getPiece(gen.pos);
   if (piece === null) {
       gen.stack.push(false);
       return 0;
   }
   var player = gen.board.player;
   gen.stack.push(Model.Game.isFriend(piece, player));
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_LASTF] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(gen.isLastFrom(gen.pos));
   return 0;
}

Model.Game.functions[Model.Move.ZRF_IS_LASTT] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   gen.stack.push(gen.isLastTo(gen.pos));
   return 0;
}

Model.Game.functions[Model.Move.ZRF_MARK] = function(gen) {
   if (gen.pos === null) {
       return null;
   }
   gen.setMark();
   return 0;
}

Model.Game.functions[Model.Move.ZRF_BACK] = function(gen) {
   var pos = gen.getMark();
   if (pos !== null) {
      gen.pos = pos;
   } else {
      return null;
   }
   return 0;
}

Model.Game.functions[Model.Move.ZRF_PUSH] = function(gen) {
   gen.marks.push(gen.pos);
   return 0;
}

Model.Game.functions[Model.Move.ZRF_POP] = function(gen) {
   if (gen.marks.length === 0) {
       return null;
   }
   gen.pos = gen.marks.pop();
   return 0;
}

if (typeof Array.indexOf !== "undefined") {
   Model.find = function(array, value) {
      return Array.prototype.indexOf.call(array, value);
   }
} else {
   Model.find = function(array, value) {
      return _.indexOf(array, value);
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
   if (pos < design.positionNames.length) {
       return design.positionNames[pos];
   } else {
       return "?";
   }
}

Model.Game.stringToPos = function(name) {
   var design = Model.Game.getDesign();
   var pos = Model.find(design.positionNames, name);
   if (pos >= 0) {
       return pos;
   } else {
       return null;
   }
}

function ZrfDesign() {
  this.playerNames    = [];
  this.players        = [];
  this.positionNames  = [];
  this.positions      = [];
  this.zoneNames      = [];
  this.zones          = [];
  this.pieceNames     = [];
  this.pieces         = [];
  this.attrs          = [];
  this.dirs           = [];
  this.templates      = [];
  this.options        = [];
  this.modes          = [];
  this.failed         = false;
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

Model.Game.checkVersion = function(design, name, value) {  
  if (name == "z2j") {
     if (value > Z2J_VERSION) {
         design.failed = true;
     }
  } else {
     if ((name != "zrf")                && 
         (name != "pass-turn")          &&
         (name != "pass-partial")       &&
         (name != "moves-limit")        &&
         (name != "discard-cascades")   &&
         (name != "animate-captures")   &&
         (name != "animate-drops")      &&
         (name != "highlight-goals")    &&
         (name != "prevent-flipping")   &&
         (name != "progressive-levels") &&
         (name != "selection-screen")   &&
         (name != "show-moves-list")    &&
         (name != "silent-?-moves")) {
         aDesign.failed = true;
     }
     if (name == "smart-moves") {
         if ((value === "from") || (value === "true")) {
            Model.Game.smartFrom = true;
         }
         if ((value === "to") || (value === "true")) {
            Model.Game.smartTo = true;
         }
         if (value === "show") {
            Model.Game.smartShow = true;
         }
     }
     if ((name == "recycle-captures") && (value === "true")) {
         Model.Game.recycleCaptures = true;
     }
     if ((name == "discard-cascades") && (value === "true")) {
         Model.Game.discardCascades = true;
     }
     if ((name == "pass-partial") && (value === "true")) {
         Model.Game.passPartial = true;
     }
     if ((name == "pass-turn") && (value === "true")) {
         Model.Game.passTurn = 1;
     }
     if ((name == "pass-turn") && (value === "forced")) {
         Model.Game.passTurn = 2;
     }
     if (name == "moves-limit") {
         Model.Game.movesLimit = value;
     }
  }
}

Model.Game.checkOption = function(design, name, value) {
  if (design.options[name] == value) {
      return true;
  }
}

ZrfDesign.prototype.reserve = function(player, piece, cnt) {
  var o = Model.find(this.playerNames, player);
  var t = Model.find(this.pieceNames, piece);
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
  var o = Model.find(this.playerNames, player);
  var t = Model.find(this.pieceNames, piece);
  if ((o < 0) || (t < 0)) {
      this.failed = true;
  } else {
      var board = Model.Game.getInitBoard();
      board.setPiece(pos, Model.Game.createPiece(t, o));
  }
}

ZrfDesign.prototype.getTemplate = function(ix) {
  if (typeof this.templates[ix] === "undefined") {
      this.templates[ix] = Model.Game.createTemplate();
  }
  return this.templates[ix];
}

ZrfDesign.prototype.addCommand = function(ix, name, param) {
  var template = this.getTemplate(ix);
  template.addCommand(name, param);
}

ZrfDesign.prototype.addPriority = function(mode) {
  this.modes.push(mode);
}

ZrfDesign.prototype.addAttribute = function(type, name, val) {
  if (typeof this.attrs[name] === "undefined") {
      this.attrs[name] = [];
  }
  this.attrs[name][type] = val;
}

ZrfDesign.prototype.getAttribute = function(type, name) {
  if (typeof this.attrs[name] === "undefined") {
      return null;
  }
  if (typeof this.attrs[name][type] === "undefined") {
      return null;
  }
  return this.attrs[name][type];
}

ZrfDesign.prototype.addPiece = function(name, type) {
  this.pieceNames[type] = name;
}

ZrfDesign.prototype.addMove = function(type, template, params, mode) {
  if (typeof this.pieces[type] === "undefined") {
      this.pieces[type] = [];
  }
  if (typeof this.templates[template] !== "undefined") {
      this.pieces[type].push({
         type: 0,
         template: this.templates[template],
         params: params,
         mode: mode
      });
  }
}

ZrfDesign.prototype.addDrop = function(type, template, params, mode) {
  if (typeof this.pieces[type] === "undefined") {
      this.pieces[type] = [];
  }
  if (typeof this.templates[template] !== "undefined") {
      this.pieces[type].push({
         type: 1,
         template: this.templates[template],
         params: params,
         mode: mode
      });
  }
}

ZrfDesign.prototype.checkVersion = function(name, value) {
  this.options[name] = value;
  Model.Game.checkVersion(this, name, value);
}

ZrfDesign.prototype.checkOption = function(name, value) {
  return Model.Game.checkOption(this, name, value);
}

ZrfDesign.prototype.getPieceType = function(name) {
  var r = Model.find(this.pieceNames, name);
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

ZrfDesign.prototype.addDirection = function(name) {
  this.dirs.push(name);
}

ZrfDesign.prototype.addPlayer = function(player, symmetries) {
  var ix = this.playerNames.length;
  if (this.playerNames.length === 0) {
      ix = 0;
      this.playerNames.push("opposite");
  }
  this.players[ix] = Model.int32Array(symmetries);
  this.playerNames.push(player);
}

ZrfDesign.prototype.nextPlayer = function(player) {
  if (player + 1 >= this.playerNames.length) {
      return 1;
  } else {
      return player + 1;
  }
}

ZrfDesign.prototype.prevPlayer = function(player) {
  if (player === 1) {
      return this.playerNames.length;
  } else {
      return player - 1;
  }
}

ZrfDesign.prototype.addPosition = function(name, links) {
  this.positionNames.push(name);
  this.positions.push(Model.int32Array(links));
}

ZrfDesign.prototype.navigate = function(player, pos, dir) {
  if (typeof this.players[player] !== "undefined") {
      dir = this.players[player][dir];
  }
  if (this.positions[pos][dir] !== 0) {
      return + pos + this.positions[pos][dir];
  } else {
      return null;
  }
}

ZrfDesign.prototype.addZone = function(name, player, positions) {
  var zone = Model.find(this.zoneNames, name);
  if (zone < 0) {
      zone = this.zoneNames.length;
      this.zoneNames.push(name);
  }
  if (typeof this.zones[zone] === "undefined") {
      this.zones[zone] = [];
  }
  this.zones[zone][player] = Model.int32Array(positions);
}

ZrfDesign.prototype.inZone = function(zone, player, pos) {
  if (typeof this.zones[zone] !== "undefined") {
      if (typeof this.zones[zone][player] !== "undefined") {
          return Model.find(this.zones[zone][player], pos) >= 0;
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

ZrfMoveTemplate.prototype.addCommand = function(name, param) {
  if (typeof Model.Game.commands[name] !== "undefined") {
      if (typeof Model.Game.cache === "undefined") {
          Model.Game.cache = [];
      }
      if (typeof Model.Game.cache[name] === "undefined") {
          Model.Game.cache[name] = [];
      }
      var offset = param;
      if (typeof Model.Game.cache[name][offset] === "undefined") {
          Model.Game.cache[name][offset] = function(x) {
              return (Model.Game.commands[name])(x, offset);
          }
      }
      this.commands.push(Model.Game.cache[name][offset]);
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
  this.marks	= [];
  this.cmd      = 0;
  this.level    = 1;
}

Model.Game.createGen = function(template, params) {
  var r = new ZrfMoveGenerator();
  r.template = template;
  r.params   = Model.int32Array(params);
  return r;
}

ZrfMoveGenerator.prototype.init = function(board, pos) {
  this.board    = board;
  this.pos      = pos;
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
  _.each(this.marks, function(it) { r.marks.push(it); });
  _.each(this.stack, function(it) { r.stack.push(it); });
  _.each(_.keys(this.pieces), function(pos) {
      r.pieces[pos] = this.pieces[pos];
  }, this);
  _.each(_.keys(this.values), function(name) {
      r.values[name] = [];
      _.each(_.keys(this.values[name]), function(pos) {
           r.values[name][pos] = this.values[name][pos];
      }, this);
  }, this);
  _.each(_.keys(this.attrs), function(pos) {
      r.attrs[pos] = [];
      _.each(_.keys(this.attrs[pos]), function(name) {
           r.attrs[pos][name] = this.attrs[pos][name];
      }, this);
  }, this);
  if (typeof this.from !== "undefined") {
      r.from = this.from;
  }
  if (typeof this.piece !== "undefined") {
      r.piece = this.piece;
  }
  r.move = this.move.clone(r.level);
  return r;
}

ZrfMoveGenerator.prototype.copy = function(template, params) {
  var r = Model.Game.createGen(template, params);
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

ZrfMoveGenerator.prototype.movePiece = function(from, to, piece) {
  if (typeof this.attrs[to] === "undefined") {
      for (var name in this.attrs[to]) {
           piece = piece.setValue(name, this.attrs[to][name]);
      }
  }
  this.move.movePiece(from, to, piece, this.level);
  this.lastf = from;
  this.lastt = to;
  if (from !== to) {
      this.setPiece(from, null);
  }
  this.setPiece(to, piece);
}

ZrfMoveGenerator.prototype.dropPiece = function(pos, piece) {
  this.move.dropPiece(pos, piece, this.level);
  this.setPiece(pos, piece);
}

ZrfMoveGenerator.prototype.capturePiece = function(pos) {
  this.move.capturePiece(pos, this.level);
  if (Model.Game.delayedStrike !== true) {
      this.setPiece(pos, null);
  }
}

Model.Game.getMark = function(gen) {
  if (gen.marks.length === 0) {
      return null;
  } else {
      var pos = gen.marks.pop();
      gen.marks.push(pos);
      return pos;
  }
}

ZrfMoveGenerator.prototype.getMark = function() {
  return Model.Game.getMark(this);
}

Model.Game.setMark = function(gen) {
  if (gen.marks.length > 0) {
      gen.marks.pop();
  }
  if (gen.pos !== null) {
      gen.marks.push(gen.pos);
  }
}

ZrfMoveGenerator.prototype.setMark = function() {
  Model.Game.setMark(this);
}

ZrfMoveGenerator.prototype.getPieceInternal = function(pos) {
  if (typeof this.pieces[pos] !== "undefined") {
      return this.pieces[pos];
  }
  if (this.parent !== null) {
      return this.parent.getPieceInternal(pos);
  }
  return this.board.getPiece(pos);
}

Model.Game.getPiece = function(gen, pos) {
  if (gen.parent !== null) {
      return gen.parent.getPieceInternal(pos);
  }
  return gen.board.getPiece(pos);
}

ZrfMoveGenerator.prototype.getPiece = function(pos) {
  return Model.Game.getPiece(this, pos);
}

ZrfMoveGenerator.prototype.setPiece = function(pos, piece) {
  this.pieces[pos] = piece;
}

Model.Game.isLastFrom = function(pos, board) {
  if (typeof board.lastf !== "undefined") {
      return (board.lastf === pos)
  } else {
      return false;
  }
}

ZrfMoveGenerator.prototype.isLastFrom = function(pos) {
  if (this.parent !== null) {
      if (typeof this.parent.lastf !== "undefined") {
          return (this.parent.lastf === pos);
      } else {
          return false;
      }
  }
  return Model.Game.isLastFrom(pos, this.board);
}

Model.Game.isLastTo = function(pos, board) {
  if (typeof board.lastt !== "undefined") {
      return (board.lastt === pos)
  } else {
      return false;
  }
}

ZrfMoveGenerator.prototype.isLastTo = function(pos) {
  if (this.parent !== null) {
      if (typeof this.parent.lastt !== "undefined") {
          return (this.parent.lastt === pos);
      } else {
          return false;
      }
  }
  return Model.Game.isLastTo(pos, this.board);
}

Model.Game.getValueInternal = function(aThis, name, pos) {
  return null;
}

ZrfMoveGenerator.prototype.getValue = function(name, pos) {
  if (typeof this.values[name] !== "undefined") {
      if (typeof this.values[name][pos] !== "undefined") {
          return this.values[name][pos];
      }
  }
  return Model.Game.getValueInternal(this, name, pos);
}

ZrfMoveGenerator.prototype.setValue = function(name, pos, value) {
  if (typeof this.values[name] === "undefined") {
      this.values[name] = [];
  }
  this.values[name][pos] = value;
}

Model.Game.getAttrInternal = function(gen, name, pos) {
  return null;
}

ZrfMoveGenerator.prototype.getAttr = function(name, pos) {
  var piece = this.getPiece(pos);
  if (piece !== null) {
      var value = piece.getValue(name);
      if (value === null) {
          var design = Model.Game.getDesign();
          value = design.getAttribute(piece.type, name);
      }
      return value;
  }
  return Model.Game.getAttrInternal(this, name, pos);
}

ZrfMoveGenerator.prototype.setAttr = function(name, pos, value) {
  if (typeof this.attrs[pos] === "undefined") {
      this.attrs[pos] = [];
  }
  this.attrs[pos][name] = value;
  var piece = this.getPieceInternal(pos);
  if (piece !== null) {
      piece = piece.setValue(name, value);
      this.move.movePiece(pos, pos, piece, this.level);
      this.setPiece(pos, piece);
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

function ZrfPiece(type, player) {
  this.type   = type;
  this.player = player;
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
  if (piece === null) return false;
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
  return design.pieceNames[this.type];
}

ZrfPiece.prototype.getOwner = function() {
  var design = Model.Game.getDesign();
  return design.playerNames[this.player];
}

ZrfPiece.prototype.getValue = function(name) {
  if (typeof this.values !== "undefined") {
     if (typeof this.values[name] !== "undefined") {
         return this.values[name];
     }
  }
  return null;
}

ZrfPiece.prototype.setValue = function(name, value) {
  if (this.getValue(name) === value) {
      return this;
  }
  var piece = new ZrfPiece(this.type, this.player);
  if (typeof piece.values === "undefined") {
     piece.values = [];
  }
  piece.values[name] = value;
  return piece;
}

ZrfPiece.prototype.promote = function(type) {
  return Model.Game.createPiece(type, this.player);
}

ZrfPiece.prototype.changeOwner = function(player) {
  if (this.player === player) {
      return this;
  } else {
      return Model.Game.createPiece(this.type, player);
  }
}

ZrfPiece.prototype.flip = function() {
  var design = Model.Game.getDesign();
  return Model.Game.createPiece(this.type, design.nextPlayer(this.player));
}

Model.Game.BuildDesign = function(design) {}

Model.Game.InitGame = function() {
  var design = Model.Game.getDesign();
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
  _.each(_.keys(this.pieces), function(pos) {
      r.pieces[pos] = this.pieces[pos];
  }, this);
  return r;
}

ZrfBoard.prototype.isEquals = function(board) {
  if (board.zSign !== this.zSign) return false;
  var a = _.keys(this.pieces);
  var b = _.keys(board.pieces);
  if (a.length !== b.length) return false;
  if (_.difference(a, b).length !== 0) return false;
  if (_.difference(b, a).length !== 0) return false;
  var f = function(pos) { this.getPiece(pos); };
  a = _.map(a, f, this);
  b = _.map(b, f, board);
  while ((a.length > 0) && (b.length > 0)) {
     var x = a.pop();
     var y = b.pop();
     if (x === null) return false;
     if (x.isEquals(y) === false) return false;
  }
  return true;
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
  board.moves = _.filter(board.moves, function(m) { 
       return (typeof m.failed === "undefined");
  });
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
  var positions = Model.Game.getPartList(board, gen);
  if (Model.Game.passPartial !== true) { var t = 2; } 
      else { var t = 1; }
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
