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

SgfSession.prototype.getFavoriteMove = function() {
  if (_.isUndefined(node)) return null;
  if (_.isUndefined(node.child)) return null;
  if (_.isUndefined(node.child.length === 0)) return null;
  var child = node.child.peekBack();
  if (_.isUndefined(child.move)) return null;
  return child.move;
}

SgfSession.prototype.addMove = function(move) {
  var node = this.getNode();
  var s = move.toString();
  var ix = _.find(_.range(node.child.length), function(n) {
      if (_.isUndefined(node.child[n].move)) return false;
      return node.child[n].move == s;
  });
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
  if (_.isUndefined(n.board)) {
      n.board = node.board.apply(move);
      if (!_.isUndefined(n.setup)) {
          _.each(_.keys(n.setup), function(pos) {
              n.board.setPiece(pos, n.setup[pos]);
          });
      }
  }
  return n.board;
}

SgfSession.prototype.backMove = function() {
  var node = this.getNode();
  if (_.isUndefined(node.back)) {
      return null;
  }
  this.node = node.back;
  return this.node.board;
}

SgfSession.prototype.setup = function(pos, piece) {
  var node = this.getNode();
  if (_.isUndefined(node.back)) {
      var b = node.board.copy();
      b.clear();
      node.board = b;
  }
  node.board.setPiece(pos, piece);
  if (_.isUndefined(node.setup)) {
      node.setup = [];
  }
  node.setup[pos] = piece;
  delete node.move;
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

SgfSession.prototype.nodeToStr = function(node, board) {
  var design = Model.Game.design;
  if (!_.isUndefined(node.move)) {
      var player = design.playerNames[board.player].charAt(0);
      return ";" + player + "[" + node.move +"]";
  }
  var r = "";
  if (!_.isUndefined(node.setup)) {
      var setup = _.chain(_.keys(node.setup))
       .groupBy(function(pos) {
           return node.setup[pos].getOwner().charAt(0);
        })
       .value();
      _.each(_.keys(setup), function(player) { 
          r = r + ";A" + player;
          _.each(setup[player], function(pos) {
              r = r + "[" + Model.Game.posToString(pos) + "]";
          });
      });
  }
  return r;
}

SgfSession.prototype.getSgf = function(node, board) {
  var r = "";
  _.each(_.keys(node.props), function(name) {
      r = r + ";" + name + "[" + node.props[name] + "]";
  });
  r = r + this.nodeToStr(node, board);
  if (node.child.length === 1) {
      return r + this.getSgf(node.child[0], node.board);
  }
  _.chain(node.child)
   .filter(function(child) {
       return !_.isUndefined(child.move);
    })
   .each(function(child) {
      r = r + "(" + this.getSgf(child, node.board) + ")";
    }, this);
  return r;
}

SgfSession.prototype.toString = function() {
  return "(" + this.getSgf(this.tree[0], this.tree[0].board) +")";
}

var isMove = function(data) {
  return (data.name == "W") || (data.name == "B") && (data.arg.length === 1);
}

var isSetup = function(data) {
  return (data.name == "AW") || (data.name == "AB");
}

var isPass = function(data) {
  return isMove(data) && (data.arg.length === 1) &&
        ((data.arg[0] === "") || (data.arg[0] === "tt"));
}

var isProp = function(data) {
  return !isMove(data) && !isSetup(data) && (data.arg.length === 1);
}

var createPiece = function(prefix) {
  var design = Model.Game.getDesign();
  for (int i = 1; i < design.playerNames.length; i++) {
      if (design.playerNames.startsWith(prefix)) {
          return Model.Game.createPiece(0, i);
      }
  }
  return null;
}

var parse = function(node, data) {
  if (data.length === 0) return;
  var head = _.first(data);
  if (!_.isArray(head)) {
      if (isMove(head)) {
          var n = {
              child: [],
              move:  head.arg[0],
              back:  node
          };
          node.child.push(n);
          node = n;
      }
      if (isSetup(head)) {
          if (_.isUndefined(node.back) && _.isUndefined(node.setup)) {
              var b = node.board.copy();
              b.clear();
              node.board = b;
              node.setup = [];
          }
          _.each(head.arg, function(pos) {
              var piece = createPiece(head.name.charAt(1));
              if (piece !== null) {
                  node.setup[pos] = piece;
              }
          });
      }
      if (isProp(head)) {
         if (_.isUndefined(node.props)) {
             node.props = [];
         }
         node.props[head.name] = head.arg[0];
      }
  } else {
      parse(node, _.rest(head));
  }
  parse(node, _.rest(data));
}

SgfSession.prototype.load = function(sgf) {
  var data = Model.Game.parseSgf(sgf);
  if (!_.isUndefined(data)) {
      this.tree = [];
      parse(this.getNode(), data);
  }
}

})();
