(function() {

var ZRF_NOT       = 0;
var ZRF_IS_EMPTY  = 1;
var ZRF_IS_ENEMY  = 2;
var ZRF_IS_FRIEND = 3;
var ZRF_IS_LASTF  = 4;
var ZRF_IS_LASTT  = 5;
var ZRF_MARK      = 6;
var ZRF_BACK      = 7;
var ZRF_PUSH      = 8;
var ZRF_POP       = 9;

var ZRF_JUMP      = 0;
var ZRF_IF        = 1;
var ZRF_FORK      = 2;
var ZRF_FUNCTION  = 3;
var ZRF_IN_ZONE   = 4;
var ZRF_GET_FLAG  = 5;
var ZRF_SET_FLAG  = 6;
var ZRF_GET_PFLAG = 7;
var ZRF_SET_PFLAG = 8;
var ZRF_GET_ATTR  = 9;
var ZRF_SET_ATTR  = 10;
var ZRF_PROMOTE   = 11;
var ZRF_MODE      = 12;
var ZRF_ON_BOARDD = 13;
var ZRF_ON_BOARDP = 14;
var ZRF_PARAM     = 15;
var ZRF_LITERAL   = 16;
var ZRF_VERIFY    = 20;
var ZRF_SET_POS   = 21;
var ZRF_NAVIGATE  = 22;
var ZRF_OPPOSITE  = 23;
var ZRF_FROM      = 24;
var ZRF_TO        = 25;
var ZRF_CAPTURE   = 26;
var ZRF_FLIP      = 27;
var ZRF_END       = 28;

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

var zrfFork = function(aGen, aParam) {
   var g = new ZrfMoveGenerator(aGen.template, aGen.params);
   g.CopyFrom(aGen);
   g.cc += aParam - 1;
   aGen.board.addFork(g);
   return 0;
}

var zrfFunction = function(aGen, aParam) {
  var game = aGen.board.game;
  if (typeof game.functions[aParam] !== "undefined") {
     return (game.functions[aParam])(aGen);
  }
  return null;
}

var zrfInZone = function(aGen, aParam) {
   var design = aGen.board.game.design;
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

var zrfGetAttr = function(aGen, aParam) {
   if (aGen.cp === null) {
       return null;
   }
   var piece = aGen.getPiece(aGen.cp);
   var value = false;
   if (piece !== null) {
       value = piece.getValue(aParam);
       if (value === null) {
           var design = aGen.board.game.design;
           value = design.getAttribute(piece.type, aParam);
       }
   }
   aGen.stack.push(!!value);
   return 0;
}

var zrfSetAttr = function(aGen, aParam) {
   if (aGen.cp === null) {
       return null;
   }
   var value = aGen.stack.pop();
   if (typeof aGen.attrs[aGen.cp] === "undefined") {
       aGen.attrs[aGen.cp] = {};
   }
   aGen.attrs[aGen.cp][aParam] = value;
   return 0;
}

var zrfPromote = function(aGen, aParam) {
   if (typeof aGen.piece === "undefined") {
       return null;
   }
   aGen.piece = aGen.piece.promote(aParam);
   return 0;
}

var zrfMode = function(aGen, aParam) {
   aGen.mode = aParam;
   return 0;
}

var zrfOnBoardDir = function(aGen, aParam) {
   var design = aGen.board.game.design;
   var player = aGen.board.mWho;
   var pos = aGen.cp;
   if (pos === null) {
       return null;
   }
   pos = design.navigate(player, pos, aParam);
   if (pos !== null) {
       aGen.stack.push(true);
   } else {
       aGen.stack.push(false);
   }
}

var zrfOnBoardPos = function(aGen, aParam) {
   var design = aGen.board.game.design;
   if ((aParam >= 0) && (aParam < this.positions.length)) {
       aGen.stack.push(true);
   } else {
       aGen.stack.push(false);
   }
}

var zrfParam = function(aGen, aParam) {
   var value = aGen.params[aParam];
   aGen.stack.push(value);
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
   var design = aGen.board.game.design;
   if (pos < design.positions.length) {
      aGen.cp = pos;
      return 0;
   } else {
      return null;
   }
}

var zrfOpposite = function(aGen) {
   var dir = aGen.stack.pop();
   var design = aGen.board.game.design;
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

var zrfNavigate = function(aGen) {
   var dir = aGen.stack.pop();
   var design = aGen.board.game.design;
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

var zrfFrom = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   if (aGen.getPiece(aGen.cp) === null) {
       return null;
   }
   aGen.starts.push[aGen.cp];
   aGen.from  = aGen.cp;
   aGen.piece = aGen.getPiece(aGen.cp);
   return 0;
}

var zrfTo = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   if (typeof aGen.piece === "undefined") {
       return null;
   }
   aGen.move.MovePiece(aGen.from, aGen.cp, aGen.piece);
   aGen.setPiece(aGen.from, null);
   aGen.setPiece(aGen.cp, aGen.piece);
   aGen.stops.push[aGen.cp];
   delete aGen.from;
   delete aGen.piece;
   return 0;
}

var zrfCapture = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   aGen.move.CapturePiece(aGen.cp);
   aGen.setPiece(aGen.cp, null);
   return 0;
}

var zrfFlip = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   if (aGen.getPiece(aGen.cp) === null) {
       return null;
   }
   var piece = aGen.getPiece(aGen.cp).flip();
   aGen.move.MovePiece(aGen.cp, aGen.cp, piece);
   aGen.setPiece(aGen.cp, piece);
   return 0;
}

var zrfEnd = function(aGen) {
   return -(aGen.cc + 2);
}

Model.Game.commands = {
  ZRF_JUMP: 	 zrfJump,
  ZRF_IF:	 zrfIf,
  ZRF_FORK:	 zrfFork,
  ZRF_FUNCTION:  zrFunction,
  ZRF_IN_ZONE:	 zrfInZone,
  ZRF_GET_FLAG:	 zrfGetFlag,
  ZRF_SET_FLAG:	 zrfSetFlag,
  ZRF_GET_PFLAG: zrfGetPosFlag,
  ZRF_SET_PFLAG: zrfSetPosFlag,
  ZRF_GET_ATTR:	 zrfGetAttr,
  ZRF_SET_ATTR:	 zrfSetAttr,
  ZRF_PROMOTE:   zrfPromote,
  ZRF_MODE:      zrfMode,
  ZRF_ON_BOARDD: zrfOnBoardDir,
  ZRF_ON_BOARDP: zrfOnBoardPos,
  ZRF_PARAM:     zrfParam,
  ZRF_LITERAL:	 zrfLiteral,
  ZRF_VERIFY:	 zrfVerify,
  ZRF_SET_POS:	 zrfSetPos,
  ZRF_OPPOSITE:	 zrfOpposite,
  ZRF_NAVIGATE:	 zrfNavigate,
  ZRF_FROM:	 zrfFrom,
  ZRF_TO:	 zrfTo,
  ZRF_CAPTURE:	 zrfCapture,
  ZRF_FLIP:	 zrfFlip,
  ZRF_END:	 zrfEnd
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

var zrfLastFrom = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   aGen.stack.push(aGen.isLastFrom(aGen.cp));
   return 0;
}

var zrfLastTo = function(aGen) {
   if (aGen.cp === null) {
       return null;
   }
   aGen.stack.push(aGen.isLastTo(aGen.cp));
   return 0;
}

var zrfMark = function(aGen) {
   aGen.mark = aGen.stack.pop();
   return 0;
}

var zrfBack = function(aGen) {
   if (aGen.mark !== null) {
      aGen.cp = aGen.mark;
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
  ZRF_IS_LASTF:  zrfLastFrom,
  ZRF_IS_LASTT:  zrfLastTo,
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

function ZrfDesign() {
  this.players   = [];
  this.positions = [];
  this.zones     = [];
  this.pieces    = {};
  this.attrs     = [];
}

Model.Game.newZrfDesign = function() {
  return new ZrfDesign();
}

ZrfDesign.prototype.addAttribute = function(aType, aName, aVal) {
  if (typeof this.attrs[aName] === "undefined") {
      this.attrs[aName] = {};
  }
  if (this.attrs[aName][aType] === undefined) {
      this.attrs[aName][aType] = aVal;
  }
}

ZrfDesign.prototype.getAttribute = function(aType, aName) {
  if (typeof this.attrs[aName] === "undefined") {
      return false;
  }
  if (typeof this.attrs[aName][aType] === "undefined") {
      return false;
  }
  return this.attrs[aName][aType];
}

ZrfDesign.prototype.addMove = function(aType, aTemplate, aParams, aMode) {
  if (typeof this.pieces[aType] === "undefined") {
      this.pieces[aType] = [];
  }
  this.pieces[aType].push({
     type: 0,
     template: aTemplate,
     params: aParams,
     mode: aMode,
  });
}

ZrfDesign.prototype.addDrop = function(aType, aTemplate, aParams) {
  if (typeof this.pieces[aType] === "undefined") {
      this.pieces[aType] = [];
  }
  this.pieces[aType].push({
     type: 1,
     template: aTemplate,
     params: aParams,
  });
}

ZrfDesign.prototype.addPlayer = function(aPlayer, aSymmetries) {
  this.players[aPlayer] = aSymmetries;
}

ZrfDesign.prototype.addPosition = function(aLinks) {
  this.positions.push(aLinks);
}

ZrfDesign.prototype.navigate = function(aPlayer, aPos, aDir) {
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

ZrfDesign.prototype.addZone = function(aZone, aPlayer, aPositions) {
  this.zones[aZone] = [];
  this.zones[aZone][aPlayer] = aPositions;
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

function ZrfMoveGenerator(aTemplate, aParams) {
  this.template = aTemplate;
  this.params   = aParams;
  this.mode     = null;
  this.board    = null;
  this.cp       = null;
  this.mark     = null;
  this.parent   = null;
  this.pieces   = {};
  this.values   = {};
  this.attrs    = {};
  this.starts   = [];
  this.stops    = [];
  this.stack    = [];
  this.backs	= [];
}

ZrfMoveGenerator.prototype.CopyFrom = function(aGen) {
  this.template = aGen.template;
  this.params   = aGen.params;
  this.mode     = aGen.mode;
  this.board    = aGen.board;
  this.cp       = aGen.cp;
  this.cc       = aGen.cc;
  this.mark     = aGen.mark;
  this.parent   = aGen.parent;
  this.pieces   = {};
  for (var pos in aGen.pieces) {
      this.pieces[pos] = aGen.pieces[pos];
  }
  this.values = {};
  for (var name in aGen.values) {
      this.values[name] = {};
      for (var pos in aGen.values[name]) {
           this.values[name][pos] = aGen.values[name][pos];
      }
  }
  this.attrs = {};
  for (var pos in aGen.attrs) {
      this.attrs[pos] = {};
      for (var name in aGen.attrs[pos]) {
           this.attrs[pos][name] = aGen.attrs[pos][name];
      }
  }
  this.stops = [];
  for (var i in aGen.stops) {
      this.stops[i] = aGen.stops[i];
  }
  this.starts = [];
  for (var i in aGen.starts) {
      this.stops[i] = aGen.starts[i];
  }
  this.stack = [];
  for (var i in aGen.stack) {
      this.stack[i] = aGen.stack[i];
  }
  this.backs = [];
  for (var i in aGen.backs) {
      this.stack[i] = aGen.stack[i];
  }
  this.move = new Model.Move.Init(aGen.move);
}

ZrfMoveGenerator.prototype.init = function(aBoard, aPos, aMove) {
  this.board    = aBoard;
  this.cp       = aPos;
  this.move     = aMove;
  this.parent   = null;
}

ZrfMoveGenerator.prototype.setParent = function(aParent) {
  this.board    = aParent.getBoard();
  this.cp       = aParent.cp;
  this.move     = new Model.Move.Init(aParent.move);
  this.parent   = aParent;
}

Model.Game.getPieceInternal = function(aThis, aPos) {
  if (typeof aThis.pieces[aPos] !== "undefined") {
      return aThis.pieces[aPos];
  }
  if (this.parent !== null) {
      return aThis.getPieceInternal(aPos);
  }
  return aThis.board.getPiece(aPos);
}

Model.Game.GetPiece = function(aThis, aPos) {
  if (aThis.parent !== null) {
      return Model.Game.getPieceInternal(aThis.parent, aPos);
  }
  return aThis.board.getPiece(aPos);
}

ZrfMoveGenerator.prototype.isLastFrom = function(aPos) {
  if (this.parent !== null) {
      if (Model.find(this.parent.starts, aPos) >= 0) {
          return true;
      }
  }
  return false;
}

ZrfMoveGenerator.prototype.isLastTo = function(aPos) {
  if (this.parent !== null) {
      if (Model.find(this.parent.stops, aPos) >= 0) {
          return true;
      }
  }
  return false;
}

ZrfMoveGenerator.prototype.getPiece = function(aPos) {
  return Model.Game.GetPiece(this, aPos)
}

ZrfMoveGenerator.prototype.setPiece = function(aPos, aPiece) {
  this.pieces[aPos] = aPiece;
}

Model.Game.GetValue = function (aThis, aName, aPos) {
  return null;
}

ZrfMoveGenerator.prototype.getValue = function(aName, aPos) {
  if (typeof this.values[aName] !== "undefined") {
      if (typeof this.values[aName][aPos] !== "undefined") {
          return this.values[aName][aPos];
      }
  }
  return Model.Game.GetValue(this, aName, aPos);
}

ZrfMoveGenerator.prototype.setValue = function(aName, aPos, aValue) {
  if (typeof this.values[aName] === "undefined") {
      this.values[aName] = {};
  }
  this.values[aName][aPos] = aValue;
}

ZrfMoveGenerator.prototype.generate = function() {
  this.cc = 0;
  while (this.cc < this.template.commands.length) {
     var r = (this.template.commands[this.cc++])(this);
     if (r === null) return false;
     this.cc += r;
     if (this.cc < 0) break;
  }
  for (var pos in this.attrs) {
     if (Model.find(this.stops, pos) < 0) {
        var piece = this.getPiece(pos);
        if (piece !== null) {
           for (var name in this.attrs[pos]) {
               piece = piece.setValue(name, this.attrs[pos][name]);
           }
           this.move.MovePiece(pos, pos, piece);
        }
     } else {
        this.move.SetAttr(pos, this.attrs[pos]);
     }
  }
  return true;
}

function ZrfPiece(aType, aPlayer) {
  this.type   = aType;
  this.player = aPlayer;
}

ZrfPiece.prototype.toString = function() {
  return this.player + "/" + this.type;
}

ZrfPiece.prototype.getValue = function(aName) {
  if (typeof this.values !== "undefined") {
     if (typeof this.values[aName] !== "undefined") {
         return this.values[aName];
     }
  }
  return null;
}

ZrfPiece.prototype.promote = function(aType) {
  return new ZrfPiece(aType, this.player);
}

ZrfPiece.prototype.flip = function() {
  return new ZrfPiece(this.type, -this.player);
}

ZrfPiece.prototype.setValue = function(aName, aValue) {
  if (this.getValue() === aValue) {
      return this;
  }
  var piece = new ZrfPiece(this.type, this.player);
  if (typeof piece.values === "undefined") {
     piece.values = {};
  }
  piece.values[aName] = aValue;
  return piece;
}

Model.Game.BuildDesign = function() {}
Model.Game.PieceList = [];

Model.Game.InitGame = function() {
  this.pieces = [];
  this.design = new ZrfDesign();
  this.BuildDesign();
  this.cache = [];
  this.zobrist = new JocGame.Zobrist({
     board: {
        type: "array",
        size: this.this.design.positions.length,
        values: Model.Game.PieceList,
     }
  });
}

Model.Game.DestroyGame = function() {}

Model.Board.Init = function(aGame) {
  this.zSign = 0;
  this.pieces = {};
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

Model.Board.PostActions = function(aGame, aMoves) {
  this.mMoves = aMoves;
}

Model.Board.addFork = function(aGen) {
  this.forks.push(aGen);
}

var CompleteMove = function(aGame, aGen, aMove) {
  if (aGen.mode !== null) {
      var pos = aGen.stops.pop();
      var piece = aGen.pieces[pos];
      for (var move in aGame.design.pieces[piece.type]) {
           if ((move.type === 0) && (move.mode === aGen.mode)) {
                var m = new Model.Move.Init(aMove);
                var g = new ZrfMoveGenerator(move.template, move.params);
                g.setParent(aGen);
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
  for (var pos in this.pieces) {
       var piece = this.pieces[pos];
       if (piece.player === this.mWho) {
           for (var move in aGame.design.pieces[piece.type]) {
               if (move.type === 0) {
                   this.forks = [];
                   var m = { 
                       moves: [], 
                   };
                   var g = new ZrfMoveGenerator(move.template, move.params);
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
                             moves: [], 
                         };
                         var g = new ZrfMoveGenerator(move.template, move.params);
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

Model.Board.ApplyMove = function(aGame, move) {
  for (var i in move.moves) {
      var fp = move.moves[i][0];
      if (fp !== null) {
          var piece = this.pieces[fp];
          if (typeof piece !== "undefined") {
              this.zSign = aGame.zobrist.update(this.zSign, "board", piece.toString(), fp);
              delete this.pieces[fp];
          }
      }
  }
  for (var i in move.moves) {
      var tp = move.moves[i][1];
      var np = move.moves[i][2];
      if (tp !== null) {
          var op = this.pieces[tp];
          if (typeof op !== "undefined") {
              this.zSign = aGame.zobrist.update(this.zSign, "board", op.toString(), tp);
          }
          this.zSign = aGame.zobrist.update(this.zSign, "board", np.toString(), tp);
          this.pieces[fp] = np;
      }
  }
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

Model.Move.Init = function(args) {
  this.moves = [];
  for (var i in args.moves) {
     this.moves.push(args.moves[i])
  }
}

Model.Move.ToString = function() {
  // TODO:
}

Model.Move.MovePiece = function(aFrom, aTo, aPiece) {
  this.moves.push([aFrom, aTo, aPiece]);
}

Model.Move.CreatePiece = function(aPos, aPiece) {
  this.moves.push([null, aTo, aPiece]);
}

Model.Move.CapturePiece = function(aPos) {
  this.moves.push([aFrom, null, null]);
}

Model.Move.SetAttr = function(aPos, aValues) {
  for (var i in this.moves) {
     if ((this.moves[i][0] !== null) && (this.moves[i][1] !== null) && (this.moves[i][0] !== this.moves[i][1])) {
         var piece = this.moves[i][2];
         for (var name in aValues) {
              piece = piece.setValue(name, aValues[name]);
         }
         this.moves[i][2] = piece;
     }
  }
}

})();
