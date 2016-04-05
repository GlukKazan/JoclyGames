(function() {

Model.Game.GetValue = function (aThis, aName, aPos) {
  if (aThis.parent !== null) {
      return aThis.parent.getValue(aName, aPos);
  }
  return aThis.board.getValue(aName, aPos);
}

})();
