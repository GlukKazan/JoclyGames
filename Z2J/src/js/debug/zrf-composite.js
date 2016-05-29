Model.Game.getValue = function (aThis, aName, aPos) {
  if (aThis.parent !== null) {
      return aThis.parent.getValue(aName, aPos);
  }
  return aThis.board.getValue(aName, aPos);
}

Model.Game.GetPiece = function(aThis, aPos) {
  return Model.Game.getPieceInternal(aThis, aPos);
}