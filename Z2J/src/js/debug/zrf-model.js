(function() {

var ZRF_NOT       = 0;
var ZRF_IS_EMPTY  = 1;
var ZRF_IS_ENEMY  = 2;
var ZRF_IS_FRIEND = 3;
var ZRF_MARK      = 4;
var ZRF_BACK      = 5;
var ZRF_PUSH      = 6;
var ZRF_POP       = 7;

var ZRF_JUMP      = 0;
var ZRF_IF        = 1;
var ZRF_FUNCTION  = 2;
var ZRF_IN_ZONE   = 3;
var ZRF_GET_FLAG  = 4;
var ZRF_SET_FLAG  = 5;
var ZRF_GET_PFLAG = 6;
var ZRF_SET_PFLAG = 7;
var ZRF_GET_ATTR  = 8;
var ZRF_SET_ATTR  = 9;
var ZRF_LITERAL   = 10;
var ZRF_VERIFY    = 11;
var ZRF_SET_POS   = 12;
var ZRF_NAVIGATE  = 13;

var zrfJump = function(aGen, aParam) {
   return aParam - 1;
}

var zrfIf = function(aGen, aParam) {
   var f = aGen.stack.pop();
   if (f) {
      return aParam - 1;
   } else {
      return 0;
   }
}

var zrfFunction = function(aGen, aParam) {
  var game = aGen.board.game;
  if (typeof game.functions[aParam] !== "undefined") {
     return (game.functions[aParam])(aGen);
  }
  return null;
}

var zrfInZone = function(aGen, aParam) {
   var design = aGen.board.game.boardDesign;
   var player = aGen.board.mWho;
   if (aGen.cp === null) {
       return null;
   }
   aGen.stack.push(design.inZone(aParam, player, aGen.cp));
   return 0;
}

var zrfGetFlag = function(aGen, aParam) {
   aGen.stack.push(aGen.getValue(aParam, -1));
   return 0;
}

var zrfSetFlag = function(aGen, aParam) {
   value = aGen.stack.pop();
   aGen.setValue(aParam, -1, value);
   return 0;
}

var zrfGetPosFlag = function(aGen, aParam) {
   if (aGen.cp === null) {
       return null;
   }
   aGen.stack.push(aGen.getValue(aParam, aGen.cp));
   return 0;
}

var zrfSetPosFlag = function(aGen, aParam) {
   if (aGen.cp === null) {
       return null;
   }
   value = aGen.stack.pop();
   aGen.setValue(aParam, aGen.cp, value);
   return 0;
}

var zrfLiteral = function(aGen, aParam) {
   aGen.stack.push(aParam);
   return 0;
}

var zrfVerify = function(aGen) {
   var f = aGen.stack.pop();
   if (f) {
       return 0;
   } else {
       return null;
   }
}

var zrfSetPos = function(aGen) {
   var pos = aGen.stack.pop();
   var design = aGen.board.game.boardDesign;
   if (pos < design.positions.length) {
      aGen.cp = pos;
      return 0;
   } else {
      return null;
   }
}

var zrfNavigate = function(aGen) {
   var dir = aGen.stack.pop();
   var design = aGen.board.game.boardDesign;
   var player = aGen.board.mWho;
   var pos = aGen.cp;
   if (pos === null) {
       return null;
   }
   pos = design.navigate(player, pos, dir);
   if (pos === null) {
       return null;
   }
   if (pos < design.positions.length) {
      aGen.cp = pos;
      return 0;
   } else {
      return null;
   }
}

Model.Game.commands = {
  ZRF_JUMP: 	 zrfJump,
  ZRF_IF:	 zrfIf,
  ZRF_FUNCTION:  zrFunction,
  ZRF_IN_ZONE:	 zrfInZone,
  ZRF_GET_FLAG:	 zrfGetFlag,
  ZRF_SET_FLAG:	 zrfSetFlag,
  ZRF_GET_PFLAG: zrfGetPosFlag,
  ZRF_SET_PFLAG: zrfSetPosFlag,
  ZRF_GET_ATTR:	 zrfGetAttr,
  ZRF_SET_ATTR:	 zrfSetAttr,
  ZRF_LITERAL:	 zrfLiteral,
  ZRF_VERIFY:	 zrfVerify,
  ZRF_SET_POS:	 zrfSetPos,
  ZRF_NAVIGATE:	 zrfNavigate
}

var zrfNot = function(aGen) {
   var f = aGen.stack.pop();
   aGen.stack.push(!f);
   return 0;
}

var zrfEmpty = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   var piece = aGen.board.getPiece(aGen.cp);
   aGen.stack.push(piece === null);
   return 0;
}

var zrfEnemy = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   var piece  = aGen.board.getPiece(aGen.cp);
   var player = aGen.board.mWho;
   aGen.stack.push(piece.player !== player);
   return 0;
}

var zrfFriend = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   var piece  = aGen.board.getPiece(aGen.cp);
   var player = aGen.board.mWho;
   aGen.stack.push(piece.player === player);
   return 0;
}

var zrfMark = function(aGen) {
   aGen.mp = aGen.stack.pop();
   return 0;
}

var zrfBack = function(aGen) {
   if (aGen.mp !== null) {
      aGen.cp = aGen.mp;
   } else {
      return null;
   }
   return 0;
}

var zrfPush = function(aGen) {
   aGen.backs.push(aGen.cp);
   return 0;
}

var zrfPop = function(aGen) {
   aGen.cp = aGen.backs.pop();
   return 0;
}

Model.Game.functions = {
  ZRF_NOT:	 zrfNot,
  ZRF_IS_EMPTY:	 zrfEmpty,
  ZRF_IS_ENEMY:	 zrfEnemy,
  ZRF_IS_FRIEND: zrfFriend,
  ZRF_MARK:	 zrfMark,
  ZRF_BACK:	 zrfBack,
  ZRF_PUSH:	 zrfPush,
  ZRF_POP:	 zrfPop
}

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

ZrfMoveTemplate.prototype.addCommand = function(aGame, aName, aParam) {
  if (typeof aGame.commands[aName] !== "undefined") {
      if (typeof aGame.cache[aName] === "undefined") {
          aGame.cache[aName] = [];
      }
      var offset = aParam;
      if (typeof aGame.cache[aName][offset] !== "undefined") {
          this.commands.push(aGame.cache[aName][offset]);
      } else {
          if (aName < ZRF_VERIFY) {
              aGame.cache[aName][offset] = function(x) {
                  (aGame.commands[aName])(x, offset);
              }
              this.commands.push(aGame.cache[aName][offset]);
          } else {
              this.commands.push(aGame.commands[aName]);
          }
      }
  }
}

function ZrfMoveGenerator(aTemplate) {
  this.template = aTemplate;
  this.board    = null;
  this.cp       = null;
  this.mp       = null;
  this.parent   = null;
  this.pieces   = [];
  this.values   = [];
  this.stack    = [];
  this.backs	= [];
}

ZrfMoveGenerator.prototype.init = function(aBoard, aPos, aMove) {
  this.board = aBoard;
  this.cp = aPos;
  this.move = aMove;
}

ZrfMoveGenerator.prototype.setParent = function(aParent) {
  this.board = aParent.getBoard();
  this.cp = aParent.cp;
  this.move = aParent.move.CopyFrom();
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

ZrfMoveGenerator.prototype.setValue = function(aName, aPos, aValue) {
  if (typeof this.values[aName] === "undefined") {
      this.values[aName] = [];
  }
  this.values[aName][aPos] = aValue;
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
  if (this.getValue() === aValue) {
      return this;
  }
  var piece = new ZrfPiece(this.type, this.player);
  if (typeof piece.values === "undefined") {
     piece.values = [];
  }
  piece.values[aName] = aValue;
  return piece;
}

Model.Game.BuildDesign = function() {}

Model.Game.InitGame = function() {
  this.boardDesign = new ZrfBoardDesign();
  this.BuildDesign();
  this.cache = [];
  // TODO:

}

Model.Game.DestroyGame = function() {}

Model.Board.Init = function(aGame) {
  this.zSign = 0;
  this.pieces = [];
}

Model.Board.GetSignature = function() {
  return this.zSign;
}

Model.Board.InitialPosition = function(aGame) {
  this.game = aGame;
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

