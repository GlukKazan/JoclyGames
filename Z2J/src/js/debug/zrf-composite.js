Model.Game.getValueInternal = function (aGen, aName, aPos) {
  if (aGen.parent !== null) {
      return aGen.parent.getValue(aName, aPos);
  }
  return aGen.board.getValue(aName, aPos);
}

Model.Game.getPiece = function(aGen, aPos) {
  return Model.Game.getPieceInternal(aGen, aPos);
}