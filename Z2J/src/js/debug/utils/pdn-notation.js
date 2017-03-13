(function() {

var rowSize = function(design) {
  return _.chain(design.positionNames)
   .filter(function(name) {
       return name.startsWith("a");
    })
   .size()
   .value();
}

var numToPos = function(design, num, sz) {
  var pos = (+num * 2) - 1;
  if (((pos / sz | 0) % 2) === 1) {
      pos--;
  }
  return Model.Game.posToString(pos, design);
}

var compareMove = Model.Game.compareMove;

Model.Game.compareMove = function(move, notation, design, board) {
  var m = /(\d+)[-x:](\d+)/.exec(notation);
  if (m) {
      var sz = rowSize(design);
      var fp = numToPos(m[1], sz);
      var tp = numToPos(m[2], sz);
      notation = Model.Game.posToString(fp) +
                 Model.Game.posToString(tp);
      return compareMove(move, notation, design, board);
  }
  m = /((\w\d?):)?(\w\d)/.exec(notation);
  if (m) {
      var action = _.chain(move.actions)
       .filter(function(action) {
          return (action[0] !== null) && (action[1] !== null);
        })
       .first()
       .value();
      if (Model.Game.stringToPos(m[3]) == action[1][0]) {
          if (!m[2]) return true;
          var s = Model.Game.posToString(action[0][0]);
          if (s.startsWith(m[2])) return true;
      }
  }
  return compareMove(move, notation, design, board);
}

})();
