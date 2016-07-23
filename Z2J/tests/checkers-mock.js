JocGame     = {
  PLAYER_A: 1,
  PLAYER_B: -1
};
var Model   = {};
Model.Game  = {
  mOptions: {
     initial: {
        "White": {
            "Man": ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"]
        },
        "Black": {
            "Man": ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"]
        }
      }
  },
  zobrist: {
      update: function(zSign, aType, aName, aPos) {
         return zSign;
      }
  }
};
Model.Board = {
  game:   Model.Game,
  mWho:   1,
  pieces: [],
  names:  []
};
Model.Move = {};
