(function() {

getRandomByte = function() {
  return _.random(0, 255);
}

function ZobristHash() {
  this.hash = [];
}

ZobristHash.prototype.getRandomValue = function() {
  var r = getRandomByte();
  for (i = 0; i < 3; i++) {
      r = r << 8;
      r = r | getRandomByte();
  }
  return r;
}

ZobristHash.prototype.update = function(value, player, piece, pos) {
  if (_.isUndefined(this.hash[piece])) {
      this.hash[piece] = [];
  }
  if (_.isUndefined(this.hash[piece][player])) {
      this.hash[piece][player] = [];
  }
  if (_.isUndefined(this.hash[piece][player][pos])) {
      this.hash[piece][player][pos] = this.getRandomValue();
  }
  return value ^ this.hash[piece][player][pos];
}
 
Model.Game.getZobristHash = function() {
  if (_.isUndefined(Model.Game.zobrist)) {
      Model.Game.zobrist = new ZobristHash();
  }
  return Model.Game.zobrist;
}

Model.Game.zupdate = function(value, piece, pos) {
  var z = Model.Game.getZobristHash();
  return z.update(value, piece.player, piece.type, pos);
}

})();
