(function() {

function SgfSession() {
  this.tree = [];
}

Model.Game.createSession = function() {
  return new SgfSession();
}

SgfSession.prototype.getNode = function() {
  if (_.isUndefined(this.node)) {
      this.node = {
          board: Model.Game.getInitBoard(),
          child: []
      };
      this.tree.push(this.node);
  }
  return this.node;
}

SgfSession.prototype.addMove = function(move) {
  var node = this.getNode();
  var s = move.toString();
  var ix = _.find(_.range(node.child.length), function(n) {
      if (_.isUndefined(node.child[n].move)) return false;
      return node.child[n].move == s;
  });
  if (!_.isUndefined(node.draft)) {
      delete node.draft;
  }
  if (_.isUndefined(ix)) {
      var b = node.board.apply(move);
      var n = {
          board: b,
          child: [],
          move:  s,
          back:  node
      };
      node.child.push(n);
      return b;
  }
  var n = node.child[ix];
  var l = node.child.length - 1;
  for (var i = n; i < l; i++) {
      node.child[i] = node.child[i + 1];
  }
  node.child[l] = n;
  return n.board;
}

SgfSession.prototype.backMove = function() {
  var node = this.getNode();
  if (_.isUndefined(node.back)) {
      return null;
  }
  this.node = node.back;
  if (!_.isUndefined(node.draft)) {
      this.node.child.pop();
  }
  return this.node.board;
}

SgfSession.prototype.setup = function(pos, piece) {
  var node = this.getNode();
  if (_.isUndefined(node.draft)) {
      var b = node.board.copy();
      if (_.isUndefined(node.back)) {
          b.clear();
      }
      var n = {
          board: b,
          child: [],
          draft: true,
          back:  node
      };
      node.child.push(n);
      node = n;
  }
  node.board.setPiece(pos, piece);
  if (_.isUndefined(node.setup)) {
      node.setup = [];
  }
  node.setup[pos] = piece;
  return node.board;
}

SgfSession.prototype.getProperty = function(name) {
  var node = this.getNode();
  if (_.isUndefined(node.props)) return null;
  if (_.isUndefined(node.props[name])) return null;
  return node.props[name];
}

SgfSession.prototype.setProperty = function(name, value) {
  var node = this.getNode();
  if (_.isUndefined(node.props)) {
      node.props = [];
  }
  node.props[name] = value;
}

})();
