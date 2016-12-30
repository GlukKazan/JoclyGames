Model.Game.getNoAttrInternal = function () {
  return false;
}

Model.Game.getAttrInternal = function (aName, aPos) {
  if (typeof this.attrs[aPos] === "undefined") {
      return null;
  }
  if (typeof this.attrs[aPos][aName] === "undefined") {
      return null;
  }
  return this.attrs[aPos][aName];
}

Model.Game.getValueInternal = function (aGen, aName, aPos) {
  if (aGen.parent !== null) {
      return aGen.parent.getValue(aName, aPos);
  }
  return aGen.board.getValue(aName, aPos);
}

Model.Game.getPiece = function(aGen, aPos) {
  return Model.Game.getPieceInternal(aGen, aPos);
}