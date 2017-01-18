(function() {

getRandomByte = function() {
  return Math.floor(Math.random() * 256);
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
  if (typeof this.hash[piece] === "undefined") {
      this.hash[piece] = [];
  }
  if (typeof this.hash[piece][player] === "undefined") {
      this.hash[piece][player] = [];
  }
  if (typeof this.hash[piece][player][pos] === "undefined") {
      this.hash[piece][player][pos] = this.getRandomValue();
  }
  return value ^ this.hash[piece][player][pos];
}
 
Model.Game.getZobristHash = function() {
  if (typeof Model.Game.zobrist === "undefined") {
      Model.Game.zobrist = new ZobristHash();
  }
  return Model.Game.zobrist;
}

Model.Game.zupdate = function(value, player, piece, pos) {
  var z = Model.Game.getZobristHash();
  return z.update(value, player, piece, pos);
}

})();
