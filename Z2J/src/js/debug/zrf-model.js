(function() {

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

Model.Board.ZrfAddPosition = function(aPos, aLinks) {
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
