(function() {

if ([].indexOf) {
   Model.Utils.Find = function(array, value) {
     return array.indexOf(value);
   }
} else {
   Model.Utils.Find = function(array, value) {
      for (var i = 0; i < array.length; i++) {
          if (array[i] === value) return i;
      }
       return -1;
   }
}

function PosToString(pos) {
  // TODO:
}

Model.Game.checkersPosToString = PosToString;

Model.Game.InitGame = function() {
  // TODO:
}

Model.Game.DestroyGame = function() {}

Model.Game.CreateZrfMoveTemplate = function(aParams) {
  // TODO:
}

Model.Board.Init = function(aGame) {
  this.zSign = 0;
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

Model.Board.ZrfGetPiece = function(aPos) {
  // TODO:
}

Model.Board.ZrfGetValue = function(aName, aPos) {
  // TODO:
}

Model.ZrfBoardDesign.Init = function() {
  this.g.players = [];
  this.g.positions = [];
  this.g.zones = [];
}

Model.ZrfBoardDesign.AddPlayer = function(aPlayer, aSymmetries) {
  this.g.players[aPlayer] = aSymmetries;
}

Model.ZrfBoardDesign.AddPosition = function(aLinks) {
  this.g.positions.push(aLinks);
}

Model.ZrfBoardDesign.Navigate = function(aPlayer, aPos, aDir) {
  var dir = aDir;
  if (this.g.players[aPlayer] !== undefined) {
      if (this.g.players[aPlayer][aDir] !== null) {
          dir = this.g.players[aPlayer][aDir];
      }
  }
  if (this.g.positions[aPos][dir] !== null) {
      return aPos + this.g.positions[aPos][dir];
  } else {
      return null;
  }
}

Model.ZrfBoardDesign.AddZone = function(aZone, aPlayer, aPositions) {
  this.g.zones[aZone] = [];
  this.g.zones[aZone][aPlayer] = aPositions;
}

Model.ZrfBoardDesign.InZone = function(aZone, aPlayer, aPos) {
  if ((this.g.zones[aZone] !== undefined) && (this.g.zones[aZone][aPlayer] !== undefined)) {
      return Model.Utils.Find(this.g.zones[aZone][aPlayer], aPos) >= 0;
  }
  return false;
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

Model.ZrfMoveTemplate.AddCommand = function(aCommand) {
  // TODO:
}

Model.ZrfMoveTemplate.CreateZrfMoveGenerator = function(aBoard, aParent) {
  // TODO:
}

Model.ZrfMoveGenerator.ZrfGetCurrentPosition = function() {
  // TODO:
}

Model.ZrfMoveGenerator.ZrfGetPiece = function(aPos) {
  // TODO:
}

Model.ZrfMoveGenerator.ZrfGetValue = function(aName, aPos) {
  // TODO:
}

Model.ZrfMoveGenerator.ZrfGenerate = function(aPos) {
  // TODO:
}

Model.ZrfPiece.ZrfGetOwner = function() {
  // TODO:
}

Model.ZrfPiece.ZrfGetType = function() {
  // TODO:
}

Model.ZrfPiece.ZrfGetValue = function(aName) {
  // TODO:
}

})();
