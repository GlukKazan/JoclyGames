var Model   = {};
Model.Game  = {};
Model.Board = {
  game:   Model.Game,
  mWho:   1,
  pieces: [],
  names:  []
};
Model.Move = {};
Model.Game.zupdate = function(value, player, piece, pos) {
  return 0;
}
