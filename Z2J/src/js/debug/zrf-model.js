(function() {

if ([].indexOf) {
   Model.find = function(array, value) {
     return array.indexOf(value);
   }
} else {
   Model.find = function(array, value) {
      for (var i = 0; i < array.length; i++) {
          if (array[i] === value) return i;
      }
      return -1;
   }
}

function PosToString(pos) {
  // TODO:
}

Model.Game.posToString = PosToString;

function ZrfBoardDesign() {
  this.players = [];
  this.positions = [];
  this.zones = [];
}

ZrfBoardDesign.prototype.addPlayer = function(aSymmetries) {
  this.players[aPlayer] = aSymmetries;
}

ZrfBoardDesign.prototype.addPosition = function(aLinks) {
  this.positions.push(aLinks);
}

ZrfBoardDesign.prototype.navigate = function(aPlayer, aPos, aDir) {
  var dir = aDir;
  if (typeof this.players[aPlayer] !== "undefined") {
      if (this.players[aPlayer][aDir] !== null) {
          dir = this.players[aPlayer][aDir];
      }
  }
  if (this.positions[aPos][dir] !== null) {
      return aPos + this.positions[aPos][dir];
  } else {
      return null;
  }
}

ZrfBoardDesign.prototype.addZone = function(aZone, aPlayer, aPositions) {
  this.zones[aZone] = [];
  this.zones[aZone][aPlayer] = aPositions;
}

ZrfBoardDesign.prototype.inZone = function(aZone, aPlayer, aPos) {
  if (typeof this.zones[aZone] !== "undefined") {
      if (typeof this.zones[aZone][aPlayer] !== "undefined") {
          return Model.find(this.zones[aZone][aPlayer], aPos) >= 0;
      }
  }
  return false;
}

function ZrfMoveTemplate(aParams) {
  this.params = aParams;
  this.commands = [];
}

ZrfMoveTemplate.prototype.addCommand = function(aCommand) {
  this.commands.push(aCommand);
}

function ZrfMoveGenerator(aTemplate) {
  this.template = aTemplate;
  this.board    = null;
  this.cp       = null;
  this.parent   = null;
  this.pieces   = [];
  this.values   = [];
  this.stack    = [];
}

ZrfMoveGenerator.prototype.init = function(aBoard, aPos) {
  this.board = aBoard;
  this.cp = aPos;
}

ZrfMoveGenerator.prototype.getBoard = function() {
  return this.board;
}

ZrfMoveGenerator.prototype.getCurrentPosition = function() {
  return this.cp;
}

ZrfMoveGenerator.prototype.setParent = function(aParent) {
  this.board = aParent.getBoard();
  this.cp = aParent.getCurrentPosition();
  this.parent = aParent;
}

ZrfMoveGenerator.prototype.getPiece = function(aPos) {
  if (typeof this.pieces[aPos] !== "undefined") {
      return this.pieces[aPos];
  }
  if (this.parent !== null) {
      return this.parent.getPiece(aPos);
  }
  return this.board.getPiece(aPos);
}

ZrfMoveGenerator.prototype.getValue = function(aName, aPos) {
  if (typeof this.values[aName] !== "undefined") {
      if (typeof this.values[aName][aPos] !== "undefined") {
          return this.values[aName][aPos];
      }
  }
  if (this.parent !== null) {
      return this.parent.getValue(aName, aPos);
  }
  return this.board.getValue(aName, aPos);
}

ZrfMoveGenerator.prototype.generate = function(aMove) {
  this.cc = 0;
  while (this.cc < this.template.commands.length) {
     var r = (this.template.commands[this.cc++])(this, aMove);
     if (r === null) return false;
     this.cc += r;
  }
  return true;
}

function ZrfPiece(aType, aPlayer) {
  this.type = aType;
  this.player = aPlayer;
}

ZrfPiece.prototype.getType = function() {
  return this.type;
}

ZrfPiece.prototype.getPlayer = function() {
  return this.player;
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
  if (typeof this.values === "undefined") {
     this.values = [];
  }
  this.values[aName] = aValue;
}

Model.Game.BuildDesign = function() {}

var ZRF_JUMP     = 0;
var ZRF_IF       = 1;
var ZRF_LITERAL  = 2,
var ZRF_VERIFY   = 3;
var ZRF_SET_POS  = 4;
var ZRF_NAVIGATE = 5;

Model.Game.cmdConstants = {
  ZRF_JUMP: ZRF_JUMP,
  ZRF_IF: ZRF_IF,
  ZRF_LITERAL: ZRF_LITERAL,
  ZRF_VERIFY: ZRF_VERIFY,
  ZRF_SET_POS: ZRF_SET_POS,
  ZRF_NAVIGATE: ZRF_NAVIGATE
}

var zrfJump = function(aGen, aMove, aParam) {
   return aParam;
}

var zrfIf = function(aGen, aMove, aParam) {
   // TODO:

   return 0;
}

var zrfLiteral = function(aGen, aMove, aParam) {
   aGen.stack.push(aParam);
   return 0;
}

var zrfVerify = function(aGen, aMove) {
   // TODO:

   return 0;
}

var zrfSetPos = function(aGen, aMove) {
   // TODO:

   return 0;
}

var zrfNavigate = function(aGen, aMove) {
   // TODO:

   return 0;
}

Model.Game.DefineCommands = function() {
  this.commands[ZRF_JUMP]	= zrfJump;
  this.commands[ZRF_IF]		= zrfIf;
  this.commands[ZRF_LITERAL]	= zrfLiteral;
  this.commands[ZRF_VERIFY]	= zrfVerify;
  this.commands[ZRF_SET_POS]	= zrfSetPos;
  this.commands[ZRF_NAVIGATE]	= zrfNavigate;
}

Model.Game.InitGame = function() {
  this.boardDesign = new ZrfBoardDesign();
  this.BuildDesign();
  this.commands = [];
  this.cache = [];
  this.DefineCommands();
  // TODO:

}

Model.Game.DestroyGame = function() {}

Model.Game.getCommand = function(aName, aOffset) {
  var offset = aOffset;
  if (typeof this.commands[aName] === "undefined") {
      return null;
  }
  if (typeof this.cache[aName] === "undefined") {
      this.cache[aName] = [];
  }
  if (typeof this.cache[aName][aOffset] !== "undefined") {
      return this.cache[aName][aOffset];
  }
  if (aName < ZRF_VERIFY) {
      this.cache[aName][offset] = function(x,y) {
         (this.commands[aName])(x, y, offset);
      }
      return this.cache[aName][aOffset];
  }
  return this.commands[aName];
}

Model.Game.getCommand = function(aName) {
  return this.commands[aName];
}

Model.Board.Init = function(aGame) {
  this.zSign = 0;
  this.pieces = [];
}

Model.Board.GetSignature = function() {
  return this.zSign;
}

Model.Board.InitialPosition = function(aGame) {
  // TODO:
}

Model.Board.CopyFrom = function(aBoard) {
  // TODO:
}

Model.Board.GenerateMoves = function(aGame) {
  // TODO:
}

Model.Board.ApplyMove = function(aGame, move) {
  // TODO:
}

Model.Board.Evaluate = function(aGame) {
  // TODO:
}

Model.Board.QuickEvaluate = function(aGame) {
  // TODO:
}

Model.Board.IsValidMove = function(aGame,move) {
  return true;
}

Model.Board.getPiece = function(aPos) {
  // TODO:
}

Model.Board.getValue = function(aName, aPos) {
  // TODO:
}

Model.Move.Init = function(args) {
  // TODO:
}

Model.Move.CopyFrom = function(aMove) {
  // TODO:
}

Model.Move.Equals = function(move) {
  // TODO:
}

Model.Move.ToString = function() {
  // TODO:
}

})();
