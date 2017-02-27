QUnit.test( "Array", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  var man  = Model.Game.createPiece(0, 1);
  assert.equal( Object.prototype.toString.call(man), "[object Object]", "Object");
  var arr = [ man, man];
  assert.equal( Object.prototype.toString.call(arr), "[object Array]", "Array");
  var a = new Int32Array(arr.length);
  a.set(arr);
  assert.equal( Object.prototype.toString.call(a), "[object Int32Array]", "Int32Array");
  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Zobrist", function( assert ) {
  var zobrist = Model.Game.getZobristHash();
  var old = zobrist.update(0, 1, 1, 5);
  assert.ok( old !== 0, "One piece");
  var v = zobrist.update(old, -1, 5, 0);
  assert.ok( old !== v, "Two pieces");
  v = zobrist.update(v, 1, 1, 5);
  assert.equal( zobrist.update(0, -1, 5, 0), v, "One piece again");
  assert.equal( zobrist.update(v, -1, 5, 0), 0, "Zero pieces");
});

QUnit.test( "Piece", function( assert ) {
  var design = Model.Game.getDesign();
  design.addPlayer("White", []);
  design.addPlayer("Black", []);
  design.addPiece("Man", 0);
  design.addPiece("King", 1);
  var man  = Model.Game.createPiece(0, 1);
  assert.equal( man.toString(), "White Man", "White Man");
  var king = man.promote(1);
  assert.ok( king !== man, "Promoted Man");
  assert.equal( king.toString(), "White King", "White King");
  assert.equal( man.getValue(0), null, "Non existent value");
  var piece = man.setValue(0, true);
  assert.ok( piece !== man, "Non mutable pieces");
  assert.ok( piece.getValue(0) === true, "Existent value");
  piece = piece.setValue(0, false);
  assert.ok( piece.getValue(0) === false, "Reset value");
  var p = piece.setValue(0, false);
  assert.equal( piece, p, "Value not changed");
  Model.Game.design = undefined;
});

QUnit.test( "Design", function( assert ) {
  var design = Model.Game.getDesign();
  design.addDirection("w");
  design.addDirection("e");
  design.addDirection("s");
  design.addDirection("n");
  assert.equal( design.dirs.length, 4, "Directions");
  design.addPlayer("White", [1, 0, 3, 2]);
  design.addPlayer("Black", [0, 1, 3, 2]);
  assert.equal( design.players[0].length, 4, "Opposite");
  assert.equal( design.players[2].length, 4, "Symmetry");
  design.addPosition("a2", [ 0, 1, 2,  0]);
  design.addPosition("b2", [-1, 0, 2,  0]);
  design.addPosition("a1", [ 0, 1, 0, -2]);
  design.addPosition("b1", [-1, 0, 0, -2]);
  var pos = 2;
  assert.equal( design.names.length,4, "Positions");
  assert.equal( Model.Game.posToString(pos), "a1", "Start position");
  pos = design.navigate(1, pos, 3);
  assert.equal( Model.Game.posToString(pos), "a2", "Player A moving");
  pos = design.navigate(2, pos, 3);
  assert.equal( Model.Game.posToString(pos), "a1", "Player B moving");
  pos = design.navigate(0, pos, 0);
  assert.equal( Model.Game.posToString(pos), "b1", "Opposite moving");
  pos = design.navigate(1, pos, 1);
  assert.equal( pos, null, "No moving");
  design.addZone("promotion", 1, [0, 1]);
  design.addZone("promotion", 2, [2, 3]);
  assert.equal( design.zones.length, 1, "Zones");
  assert.ok( design.inZone(0, 1, 0) === true, "Player A promotion zone" );
  assert.ok( design.inZone(0, 2, 3) === true, "Player B promotion zone" );
  assert.ok( design.inZone(0, 1, 2) === false, "No promotion zone" );
  assert.equal( design.getAttribute(0, 0), null, "Non existent attribute");
  design.addAttribute(0, 0, false);
  assert.equal( design.getAttribute(0, 0), false, "Default value for attribute");
  Model.Game.design = undefined;
});

QUnit.test( "Move", function( assert ) {
  var design = Model.Game.getDesign();
  design.addPlayer("White", []);
  design.addPlayer("Black", []);
  design.addPiece("Man", 0);
  design.addPiece("King", 1);
  var move = Model.Game.createMove();
  assert.equal( move.toString(0), "Pass", "Initial move");
  var man  = Model.Game.createPiece(0, 1);
  design.addPosition("a", [ 0, 1]);
  design.addPosition("b", [-1, 0]);
  move.movePiece(0, 1, man);
  assert.equal( move.toString(0), "a - b", "Move piece");
  move = move.copy(move.template, move.params);
  move.capturePiece(1);
  assert.equal( move.toString(0), "a - b x b", "Capture piece");
  Model.Game.design = undefined;
});

QUnit.test( "Template", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  assert.equal( design.checkOption("z2j", 1), true, "Z2J Version");
  assert.equal( design.checkOption("zrf", "2.0"), true, "ZRF Version");
  assert.equal( design.checkOption("maximal-captures", "true"), true, "Max Captures option");
  assert.equal( design.failed, false, "All options is valid");
  var board  = Model.Game.getInitBoard();
  var move   = new Model.Game.createMove();
  assert.equal( design.templates.length , 4, "Templates");
  assert.equal( design.modes.length, 2, "Priorities");
  var t0 = design.getTemplate(0);
  var t1 = design.getTemplate(1);
  var t2 = design.getTemplate(2);
  var t3 = design.getTemplate(3);
  assert.ok( t0 !== t1, "Different templates" );
  assert.equal( t1.commands.length , 13, "Commands");
  assert.equal( t0.commands[1], t1.commands[1], "Equal commands");
  assert.ok( t0.commands[1] !== t0.commands[6], "Not equal commands");
  var g0 = Model.Game.createGen(t0, [1, 2]);
  g0.init(board, 0);
  g0.move = move;
  assert.equal( (t0.commands[0])(g0), null, "Piece not found");
  var man = Model.Game.createPiece(0, 1);
  board.setPiece(0, man);
  assert.equal( (t0.commands[0])(g0), 0, "FROM command executed");
  assert.equal( g0.piece, man, "... current piece is Man");
  assert.equal( g0.from, 0, "... from position a8");
  var g = g0.copy(g0.template, g0.params);
  assert.equal( (t0.commands[1])(g0), 0, "PARAM command executed");
  assert.equal( g0.stack.pop(), 1, "... PARAM value");
  assert.equal( (t0.commands[2])(g0), null, "Stack is empty");
  g0.stack.push(1);
  assert.equal( (t0.commands[2])(g0), 0, "NAVIGATE command executed");
  assert.equal( g0.getPos(), 1, "... current position changed");
  assert.equal( (t0.commands[3])(g0), 0, "IS_ENEMY? command executed");
  assert.equal( g0.stack.pop(), false, "... position is empty");
  assert.equal( (t0.commands[8])(g0), 0, "IS_EMPTY? command executed");
  assert.equal( g0.stack.pop(), true, "... position is empty");
  g0.stack.push(false);
  assert.equal( (t0.commands[4])(g0), null, "VERIFY failed");
  g0.stack.push(true);
  assert.equal( (t0.commands[4])(g0), 0, "VERIFY command executed");
  g0.pos = 0;
  assert.equal( (t0.commands[5])(g0), 0, "CAPTURE command executed");
  assert.equal( move.toString(0), "x a8", "... piece is captured");
  assert.equal( (t0.commands[10])(g0), 0, "IN_ZONE? command executed");
  assert.equal( g0.stack.pop(), true, "... promotion zone for A Player");
  assert.equal( (t0.commands[11])(g0), null, "Stack is empty");
  g0.stack.push(true);
  assert.equal( (t0.commands[11])(g0), 3, "IF then");
  g0.stack.push(false);
  assert.equal( (t0.commands[11])(g0), 0, "... and else");
  assert.equal( (t3.commands[6])(g0), 0, "FORK command executed");
  var fork = board.forks.pop();
  assert.equal( fork.cmd, 2, "... fork jump");
  assert.equal( (t0.commands[16])(g0), 0, "MODE command executed");
  assert.equal( g0.mode, 2, "... notype mode");
  assert.equal( (t0.commands[14])(g0), 3, "JUMP command executed");
  assert.equal( (t0.commands[15])(g0), 0, "PROMOTE command executed");
  assert.equal( g0.piece.toString(), "White King", "... piece promoted");
  g0.pos = 1;
  assert.equal( (t0.commands[17])(g0), 0, "TO command executed");
  assert.ok( g0.from === undefined, "... no from position");
  assert.ok( g0.piece === undefined, "... and no piece");
  assert.equal( g.getPiece(0), null, "... from position is empty");
  assert.equal( g.getPiece(1).toString(), "White King", "... and King piece on TO position");
  assert.equal( (t3.commands[12])(g0), null, "END command executed");
  assert.equal( board.moves.length, 1, "Move is generated");
  var g1 = Model.Game.createGen(t1, [3]);
  g1.init(board, 0);
  g1.move = move;
  assert.equal( (t1.commands[6])(g1), null, "Stack is empty");
  g1.stack.push(false);
  assert.equal( (t1.commands[6])(g1), 0, "NOT command executed");
  assert.equal( g1.stack.pop(), true, "... NOT command result");
  assert.equal( (t2.commands[24])(g), null, "Stack is empty");
  g.stack.push(2);
  assert.equal( (t2.commands[24])(g), 0, "OPPOSITE command executed");
  assert.equal( g.stack.pop(), 3, "... opposite direction on stack");
  assert.equal( (t2.commands[19])(g), 0, "MARK command executed");
  var oldPos = g.pos;
  g.pos = 1;
  assert.equal( (t2.commands[28])(g), 0, "BACK command executed");
  assert.equal( oldPos, g.getPos(), "... mark equal current position again");
  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Move Generator", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  var t = design.getTemplate(1);
  var from = Model.Game.stringToPos("b2");
  assert.ok( from !== null, "Correct position");
  assert.equal( Model.Game.posToString(from), "b2", "From position");
  var m = new Model.Game.createMove();
  var g = Model.Game.createGen(t, [3]);
  g.init(board, from);
  g.move = m;
  var man = Model.Game.createPiece(0, 1);
  var king = man.promote(1);
  assert.equal( man.getType(), "Man", "Man piece");
  assert.equal( king.getType(), "King", "King piece");
  board.setPiece(from, man);
  var to = design.navigate(1, from, 3);
  assert.equal( Model.Game.posToString(to), "b3", "To position");
  g.setPiece(from, null);
  g.setPiece(to, man);
  assert.equal( g.getPiece(from), man, "Man in [from] position (snapshot)");
  assert.equal( g.getPiece(to), null, "And [to] position is empty");
  var c = g.copy(g.template, g.params);
  assert.equal( c.getPiece(from), null, "[from] position is empty");
  assert.equal( c.getPiece(to), man, "[to] position contains Man");
  assert.equal( g.getValue(0, from), null, "No value");
  g.setValue(0, from, true);
  assert.equal( g.getValue(0, from), true, "Position flag");
  assert.equal( c.getValue(0, from), null, "No value again");
  assert.equal( g.getAttr(0, from), null, "No attribute value");
  design.addAttribute(man.type, 0, false);
  assert.equal( g.getAttr(0, from), false, "Attribute's initial value");
  g.setAttr(0, to, true);
  assert.equal( g.attrs[to][0], true, "Attribute's value changed");
  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Board", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  design.setup("Black", "Man", 3);
  design.setup("Black", "Man", 8);
  design.setup("Black", "Man", 13);
  design.setup("Black", "Man", 18);
  design.setup("Black", "Man", 29);
  design.setup("Black", "Man", 53);
  design.setup("Black", "Man", 56);
  design.setup("Black", "Man", 58);
  design.setup("White", "King", 45);
  assert.equal( board.player, 1, "White");
  assert.equal( board.getPiece(Model.Game.stringToPos("a1")).toString(), "Black Man", "a1 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("b1")), null, "b1 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c1")).toString(), "Black Man", "c1 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("d1")), null, "d1 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("e1")), null, "e1 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f1")), null, "f1 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("g1")), null, "g1 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h1")), null, "h1 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("a2")), null, "a2 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("b2")), null, "b2 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c2")), null, "c2 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("d2")), null, "d2 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("e2")), null, "e2 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f2")).toString(), "Black Man", "f2 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("g2")), null, "g2 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h2")), null, "h2 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("a3")), null, "a3 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("b3")), null, "b3 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c3")), null, "c3 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("d3")), null, "d3 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("e3")), null, "e3 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f3")).toString(), "White King", "f3 - White King");
  assert.equal( board.getPiece(Model.Game.stringToPos("g3")), null, "g3 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h3")), null, "h3 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("a4")), null, "a4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("b4")), null, "b4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c4")), null, "c4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("d4")), null, "d4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("e4")), null, "e4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f4")), null, "f4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("g4")), null, "g4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h4")), null, "h4 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("a5")), null, "a5 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("b5")), null, "b5 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c5")), null, "c5 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("d5")), null, "d5 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("e5")), null, "e5 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f5")).toString(), "Black Man", "f5 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("g5")), null, "g5 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h5")), null, "h5 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("a6")), null, "a6 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("b6")), null, "b6 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c6")).toString(), "Black Man", "c6 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("d6")), null, "d6 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("e6")), null, "e6 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f6")), null, "f6 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("g6")), null, "g6 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h6")), null, "h6 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("a7")).toString(), "Black Man", "a7 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("b7")), null, "b7 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c7")), null, "c7 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("d7")), null, "d7 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("e7")), null, "e7 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f7")).toString(), "Black Man", "f7 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("g7")), null, "g7 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h7")), null, "h7 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("a8")), null, "a8 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("b8")), null, "b8 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("c8")), null, "c8 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("d8")).toString(), "Black Man", "d8 - Black Man");
  assert.equal( board.getPiece(Model.Game.stringToPos("e8")), null, "e8 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("f8")), null, "f8 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("g8")), null, "g8 - Empty");
  assert.equal( board.getPiece(Model.Game.stringToPos("h8")), null, "h8 - Empty");

  var p = board.getPiece(Model.Game.stringToPos("f3"));
  var m = Model.Game.createMove();
  m.capturePiece(Model.Game.stringToPos("f5"), 1);
  m.movePiece(Model.Game.stringToPos("f3"), Model.Game.stringToPos("f6"), p, 1);
  assert.equal( m.toString(1), "f3 - f6 x f5", "f3 - f6 x f5");
  var mb = board.apply(m);
  assert.equal( mb.player, 2, "Black");
  assert.equal( mb.getPiece(Model.Game.stringToPos("f3")), null, "f3 - Empty");
  assert.equal( mb.getPiece(Model.Game.stringToPos("f5")), null, "f5 - Empty");
  assert.equal( mb.getPiece(Model.Game.stringToPos("f6")).toString(), "White King", "f6 - White King");
  assert.equal( mb.getPiece(Model.Game.stringToPos("f7")).toString(), "Black Man", "f7 - Black Man");

  var q = board.getPiece(Model.Game.stringToPos("f7"));
  var n = Model.Game.createMove();
  n.capturePiece(Model.Game.stringToPos("f6"), 1);
  n.movePiece(Model.Game.stringToPos("f7"), Model.Game.stringToPos("f5"), q, 1);
  assert.equal( n.toString(1), "f7 - f5 x f6", "f7 - f5 x f6");
  var nb = mb.apply(n);
  assert.equal( nb.player, 1, "White");
  assert.equal( nb.getPiece(Model.Game.stringToPos("f7")), null, "f7 - Empty");
  assert.equal( nb.getPiece(Model.Game.stringToPos("f6")), null, "f6 - Empty");
  assert.equal( nb.getPiece(Model.Game.stringToPos("f5")).toString(), "Black Man", "f5 - Black Man");

  var p = board.getPiece(Model.Game.stringToPos("f3"));
  var o = m.copy();
  o.capturePiece(Model.Game.stringToPos("c6"), 2);
  o.movePiece(Model.Game.stringToPos("f6"), Model.Game.stringToPos("a6"), p, 2);
  assert.equal( o.toString(1), "f3 - f6 x f5", "f3 - f6 x f5");
  assert.equal( o.toString(2), "f6 - a6 x c6", "f6 - a6 x c6");
  assert.equal( o.toString(0), "f3 - f6 - a6 x f5 x c6", "f3 - f6 - a6 x f5 x c6");
  var ob = board.apply(o);
  assert.equal( ob.player, 2, "Black");
  assert.equal( ob.getPiece(Model.Game.stringToPos("f3")), null, "f3 - Empty");
  assert.equal( ob.getPiece(Model.Game.stringToPos("f5")), null, "f5 - Empty");
  assert.equal( ob.getPiece(Model.Game.stringToPos("f6")), null, "f6 - Empty");
  assert.equal( ob.getPiece(Model.Game.stringToPos("c6")), null, "c6 - Empty");
  assert.equal( ob.getPiece(Model.Game.stringToPos("a6")).toString(), "White King", "a6 - White King");

  assert.equal( o.isAttacked(Model.Game.stringToPos("f3")), false, "f3 - Not attacked");
  assert.equal( o.isAttacked(Model.Game.stringToPos("f6")), true, "f6 - Is attacked");
  assert.equal( o.isAttacked(Model.Game.stringToPos("a6")), true, "a6 - Is attacked");
  assert.equal( o.isAttacked(Model.Game.stringToPos("f5")), true, "f5 - Is attacked");
  assert.equal( o.isAttacked(Model.Game.stringToPos("c6")), true, "c6 - Is attacked");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Man's moves", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");

  design.setup("White", "Man", Model.Game.stringToPos("c3"));
  design.setup("White", "Man", Model.Game.stringToPos("g7"));
  design.setup("Black", "Man", Model.Game.stringToPos("c5"));
  assert.equal( board.player, 1, "White player");
  var n  = design.getDirection("n");
  assert.equal( n, 3, "North direction");
  var t1 = design.getTemplate(1);
  var g1 = Model.Game.createGen(t1, [ n ]);
  assert.equal( g1.pieces.length , 0, "No Generator's positions");
  g1.init(board, Model.Game.stringToPos("c3"));
  assert.equal( g1.pieces.length , 0, "No Generator's positions again");
  assert.equal( g1.template.commands.length, 13, "Template length");
  assert.equal( g1.stack.length, 0, "Stack is empty");
  assert.equal( g1.pos, 42, "Initial position");
  assert.equal( g1.getPiece(g1.pos).toString(), "White Man", "Current piece");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_FROM executed");
  assert.equal( g1.cmd, 1, "cmd = 1");
  assert.equal( g1.from, 42, "Initial position");
  assert.equal( g1.piece.toString(), "White Man", "Current piece");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_PARAM executed");
  assert.equal( g1.cmd, 2, "cmd = 2");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], 3, "Direction");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_NAVIGATE executed");
  assert.equal( g1.cmd, 3, "cmd = 3");
  assert.equal( g1.stack.length, 0, "Stack is empty");
  assert.equal( g1.pos, 34, "Target position");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_IS_EMPTY executed");
  assert.equal( g1.cmd, 4, "cmd = 4");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], true, "Position is empty");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_VERIFY executed");
  assert.equal( g1.cmd, 5, "cmd = 5");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_IN_ZONE executed");
  assert.equal( g1.cmd, 6, "cmd = 6");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], false, "Not in promotion");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_NOT executed");
  assert.equal( g1.cmd, 7, "cmd = 7");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], true, "Not");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 3, "ZRF_IF executed");
  g1.cmd += 3;
  assert.equal( g1.cmd, 11, "cmd = 11");
  assert.equal( g1.stack.length, 0, "Stack is empty");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_TO executed");
  assert.equal( g1.cmd, 12, "cmd = 12");
  assert.equal( g1.from, null, "Empty position");
  assert.equal( g1.piece, null, "Empty piece");
  assert.equal( g1.move.actions.length, 1, "1 action");
  assert.equal( g1.move.actions[0][0][0], 42, "From position");
  assert.equal( g1.move.actions[0][1][0], 34, "To position");
  assert.equal( g1.move.actions[0][2][0].toString(), "White Man", "piece");
  assert.equal( g1.move.actions[0][3], 1, "level");
  assert.equal( g1.lastf, 42, "Last from");
  assert.equal( g1.lastt, 34, "Last to");
  assert.equal( g1.pieces[42], null, "c3 is empty");
  assert.equal( g1.pieces[34].toString(), "White Man", "White Man on c4");
  assert.equal( g1.pieces[0], undefined, "any positions undefined");
  assert.equal( g1.move.toString(1), "c3 - c4", "c3 - c4");
  assert.equal( g1.move.toString(0), "c3 - c4", "c3 - c4");

  assert.equal( g1.moveType, 1, "Default MoveType");
  assert.equal( (g1.template.commands[g1.cmd++])(g1), null, "ZRF_END executed");
  assert.equal( g1.cmd, 13, "cmd = 13");
  assert.equal( g1.moveType, 0, "MoveType cleaned");
  assert.equal( board.moves.length, 1, "Move generated");
  assert.equal( board.moves[0].toString(0), "c3 - c4", "c3 - c4");

  var g2 = Model.Game.createGen(t1, [ design.getDirection("w") ]);
  g2.init(board, Model.Game.stringToPos("c3"));
  g2.generate();
  assert.equal( board.moves.length, 2, "Move generated");
  assert.equal( board.moves[1].toString(0), "c3 - b3", "c3 - b3");

  var g4 = Model.Game.createGen(t1, [ design.getDirection("n") ]);
  g4.init(board, Model.Game.stringToPos("g7"));
  g4.generate();
  assert.equal( board.moves.length, 3, "Move generated");
  assert.equal( board.moves[2].toString(0), "g7 - g8", "g7 - g8");
  assert.equal( board.moves[2].actions[0][2][0].toString(), "White King", "promoted");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Man's capturing", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");

  design.setup("White", "Man", Model.Game.stringToPos("d6"));
  design.setup("Black", "Man", Model.Game.stringToPos("e6"));
  design.setup("Black", "Man", Model.Game.stringToPos("f7"));

  var e  = design.getDirection("e");
  var t0 = design.getTemplate(0);
  var g1 = Model.Game.createGen(t0, [ e, e ]);
  g1.init(board, Model.Game.stringToPos("d6"));
  assert.equal( g1.level, 1, "Level 1");
  assert.equal( g1.moveType, 1, "Default MoveType");
  assert.equal( g1.mode, null, "No Mode");
  g1.generate();
  assert.equal( g1.moveType, 0, "No MoveType");
  assert.equal( g1.mode, 0, "jumptype");
  assert.equal( board.moves.length, 1, "Move generated");
  assert.equal( board.moves[0].toString(0), "d6 - f6 x e6", "d6 - f6 x e6");
  assert.equal( g1.lastf, Model.Game.stringToPos("d6"), "Last from");
  assert.equal( g1.lastt, Model.Game.stringToPos("f6"), "Last to");

  var n  = design.getDirection("n");
  var g2 = g1.copy(t0, [ n, n ]);
  assert.equal( g2.level, 2, "Level 2");
  assert.equal( g2.parent, g1, "Parent assigned");
  assert.equal( g2.pos, Model.Game.stringToPos("f6"), "Pos assigned");
  assert.equal( g2.move.toString(0), "d6 - f6 x e6", "Move assigned");
  g2.generate();
  assert.equal( g2.moveType, 0, "No MoveType");
  assert.equal( g2.mode, 2, "notype");
  assert.equal( board.moves.length, 2, "Move generated");
  assert.equal( board.moves[1].toString(1), "d6 - f6 x e6", "d6 - f6 x e6");
  assert.equal( board.moves[1].toString(2), "f6 - f8 x f7", "f6 - f8 x f7");
  assert.equal( board.moves[1].toString(0), "d6 - f6 - f8 x e6 x f7", "d6 - f6 - f8 x e6 x f7");
  assert.equal( board.moves[1].actions.length, 4, "actions");
  assert.equal( board.moves[1].actions[3][2][0].toString(), "White King", "promoted");
  assert.equal( g2.lastf, Model.Game.stringToPos("f6"), "Last from");
  assert.equal( g2.lastt, Model.Game.stringToPos("f8"), "Last to");
  assert.equal( g2.isLastFrom(Model.Game.stringToPos("f6")), false, "Not is last");
  assert.equal( g2.isLastFrom(Model.Game.stringToPos("d6")), true, "Last from position");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "King's moves", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");
  assert.equal( board.player, 1, "White player");

  design.setup("White", "King", Model.Game.stringToPos("b1"));
  design.setup("Black", "Man", Model.Game.stringToPos("b5"));
  var t3 = design.getTemplate(3);
  var n  = design.getDirection("n");
  var g1 = Model.Game.createGen(t3, [ n, n ]);
  g1.init(board, Model.Game.stringToPos("b1"));
  assert.equal( g1.pieces.length , 0, "No Generator's positions");
  assert.equal( g1.template.commands.length, 13, "Template length");
  assert.equal( g1.stack.length, 0, "Stack is empty");
  assert.equal( g1.pos, Model.Game.stringToPos("b1"), "Initial position");
  assert.equal( g1.getPiece(g1.pos).toString(), "White King", "Current piece");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_FROM executed");
  assert.equal( g1.cmd, 1, "cmd = 1");
  assert.equal( g1.from, Model.Game.stringToPos("b1"), "Initial position");
  assert.equal( g1.piece.toString(), "White King", "Current piece");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_PARAM executed");
  assert.equal( g1.cmd, 2, "cmd = 2");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], 3, "Direction");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_NAVIGATE executed");
  assert.equal( g1.cmd, 3, "cmd = 3");
  assert.equal( g1.stack.length, 0, "Stack is empty");
  assert.equal( g1.pos, Model.Game.stringToPos("b2"), "Target position");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_IS_EMPTY executed");
  assert.equal( g1.cmd, 4, "cmd = 4");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], true, "Position is empty");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_NOT executed");
  assert.equal( g1.cmd, 5, "cmd = 5");
  assert.equal( g1.stack.length, 1, "Stack");
  assert.equal( g1.stack[0], false, "Not");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_IF executed");
  assert.equal( g1.cmd, 6, "cmd = 6");
  assert.equal( g1.stack.length, 0, "Stack is empty");

  assert.equal( board.forks.length, 0, "No forks");
  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_FORK executed");
  assert.equal( board.forks.length, 1, "Fork generated");
  assert.equal( g1.cmd, 7, "cmd = 7");

  assert.equal( (g1.template.commands[g1.cmd++])(g1), 0, "ZRF_TO executed");
  assert.equal( g1.cmd, 8, "cmd = 8");
  assert.equal( g1.from, null, "Empty position");
  assert.equal( g1.piece, null, "Empty piece");
  assert.equal( g1.move.actions.length, 1, "1 action");
  assert.equal( g1.move.actions[0][0][0], Model.Game.stringToPos("b1"), "From position");
  assert.equal( g1.move.actions[0][1][0], Model.Game.stringToPos("b2"), "To position");
  assert.equal( g1.move.actions[0][2][0].toString(), "White King", "piece");
  assert.equal( g1.move.actions[0][3], 1, "level");
  assert.equal( g1.lastf, Model.Game.stringToPos("b1"), "Last from");
  assert.equal( g1.lastt, Model.Game.stringToPos("b2"), "Last to");
  assert.equal( g1.pieces[Model.Game.stringToPos("b1")], null, "b1 is empty");
  assert.equal( g1.pieces[Model.Game.stringToPos("b2")].toString(), "White King", "White King on b2");
  assert.equal( g1.move.toString(1), "b1 - b2", "b1 - b2");
  assert.equal( g1.move.toString(0), "b1 - b2", "b1 - b2");

  assert.equal( g1.moveType, 1, "Default MoveType");
  assert.equal( (g1.template.commands[g1.cmd++])(g1), null, "ZRF_END executed");
  assert.equal( g1.cmd, 9, "cmd = 9");
  assert.equal( g1.moveType, 0, "MoveType cleaned");
  assert.equal( board.moves.length, 1, "Move generated");
  assert.equal( board.moves[0].toString(0), "b1 - b2", "b1 - b2");

  var g2 = board.forks.pop();
  assert.equal( g2.move.toString() , "Pass", "No move");
  assert.equal( g2.moveType , 1, "Default MoveType");
  assert.equal( g2.pieces.length , 0, "No Generator's positions");
  assert.equal( g2.template.commands.length, 13, "Template length");
  assert.equal( g2.params.length, 2, "Params length");
  assert.equal( g2.mode, null, "No mode");
  assert.equal( g2.parent, null, "No parent");
  assert.equal( g2.board, board, "Board initialized");
  assert.equal( g2.pos, Model.Game.stringToPos("b2"), "Current position");
  assert.equal( g2.stack.length, 0, "Stack is empty");
  assert.equal( g2.level, 1, "Level 1");
  assert.equal( g2.from, Model.Game.stringToPos("b1"), "Initial position");
  assert.equal( g2.piece.toString(), "White King", "Current piece");
  assert.equal( g2.cmd, 9, "cmd = 9");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), 0, "ZRF_PARAM executed");
  assert.equal( g2.cmd, 10, "cmd = 10");
  assert.equal( g2.stack.length, 1, "Stack");
  assert.equal( g2.stack[0], 3, "Direction");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), 0, "ZRF_NAVIGATE executed");
  assert.equal( g2.cmd, 11, "cmd = 11");
  assert.equal( g2.stack.length, 0, "Stack is empty");
  assert.equal( g2.pos, Model.Game.stringToPos("b3"), "Current position");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), -9, "ZRF_JUMP executed");
  g2.cmd += -9;
  assert.equal( g2.cmd, 3, "cmd = 3");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), 0, "ZRF_IS_EMPTY executed");
  assert.equal( g2.cmd, 4, "cmd = 4");
  assert.equal( g2.stack.length, 1, "Stack");
  assert.equal( g2.stack[0], true, "Position is empty");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), 0, "ZRF_NOT executed");
  assert.equal( g2.cmd, 5, "cmd = 5");
  assert.equal( g2.stack.length, 1, "Stack");
  assert.equal( g2.stack[0], false, "Not");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), 0, "ZRF_IF executed");
  assert.equal( g2.cmd, 6, "cmd = 6");
  assert.equal( g2.stack.length, 0, "Stack is empty");

  assert.equal( board.forks.length, 0, "No forks");
  assert.equal( (g2.template.commands[g2.cmd++])(g2), 0, "ZRF_FORK executed");
  assert.equal( board.forks.length, 1, "Fork generated");
  assert.equal( g2.cmd, 7, "cmd = 7");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), 0, "ZRF_TO executed");
  assert.equal( g2.cmd, 8, "cmd = 8");
  assert.equal( g2.from, null, "Empty position");
  assert.equal( g2.piece, null, "Empty piece");
  assert.equal( g2.move.toString(0), "b1 - b3", "b1 - b3");

  assert.equal( (g2.template.commands[g2.cmd++])(g2), null, "ZRF_END executed");
  assert.equal( g2.cmd, 9, "cmd = 9");
  assert.equal( board.moves.length, 2, "Move generated");
  assert.equal( board.moves[0].toString(0), "b1 - b2", "b1 - b2");
  assert.equal( board.moves[1].toString(0), "b1 - b3", "b1 - b3");

  var g3 = board.forks.pop();
  assert.equal( g3.move.toString() , "Pass", "No move");
  assert.equal( g3.moveType , 1, "Default MoveType");
  assert.equal( g3.pieces.length , 0, "No Generator's positions");
  assert.equal( g3.template.commands.length, 13, "Template length");
  assert.equal( g3.params.length, 2, "Params length");
  assert.equal( g3.mode, null, "No mode");
  assert.equal( g3.parent, null, "No parent");
  assert.equal( g3.board, board, "Board initialized");
  assert.equal( g3.pos, Model.Game.stringToPos("b3"), "Current position");
  assert.equal( g3.stack.length, 0, "Stack is empty");
  assert.equal( g3.level, 1, "Level 1");
  assert.equal( g3.from, Model.Game.stringToPos("b1"), "Initial position");
  assert.equal( g3.piece.toString(), "White King", "Current piece");
  assert.equal( g3.cmd, 9, "cmd = 9");
  g3.generate();
  assert.equal( board.forks.length, 1, "Fork generated");
  assert.equal( board.moves.length, 3, "Move generated");
  assert.equal( board.moves[0].toString(0), "b1 - b2", "b1 - b2");
  assert.equal( board.moves[1].toString(0), "b1 - b3", "b1 - b3");
  assert.equal( board.moves[2].toString(0), "b1 - b4", "b1 - b4");

  var g4 = board.forks.pop();
  g4.generate();
  assert.equal( board.forks.length, 0, "No Forks");
  assert.equal( board.moves.length, 3, "No Move generated");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "King's capturing", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");
  assert.equal( board.player, 1, "White player");

  design.setup("White", "King", Model.Game.stringToPos("c4"));
  design.setup("Black", "Man", Model.Game.stringToPos("b4"));
  design.setup("Black", "Man", Model.Game.stringToPos("e4"));
  design.setup("Black", "Man", Model.Game.stringToPos("g6"));
  var t2 = design.getTemplate(2);
  var e  = design.getDirection("e");
  var g1 = Model.Game.createGen(t2, [e, e, e, e, e]);
  g1.init(board, Model.Game.stringToPos("c4"));

  g1.generate();
  assert.equal( board.forks.length, 1, "Fork generated");
  assert.equal( board.moves.length, 1, "Move generated");
  assert.equal( board.moves[0].toString(0), "c4 - f4 x e4", "c4 - f4 x e4");

  var g2 = board.forks.pop();
  g2.generate();
  assert.equal( board.forks.length, 1, "Fork generated");
  assert.equal( board.moves.length, 2, "Move generated");
  assert.equal( board.moves[1].toString(0), "c4 - g4 x e4", "c4 - g4 x e4");
  board.forks.pop();

  var n  = design.getDirection("n");
  var g3 = g2.copy(t2, [n, n, n, n, n]);
  assert.equal( g3.level, 2, "Level 2");
  assert.equal( g3.parent, g2, "Parent assigned");
  assert.equal( g3.pos, Model.Game.stringToPos("g4"), "Pos assigned");
  assert.equal( g3.move.toString(0), "c4 - g4 x e4", "Move assigned");
  g3.generate();
  assert.equal( board.forks.length, 1, "Fork generated");
  assert.equal( board.moves.length, 3, "Move generated");
  assert.equal( board.moves[2].toString(0), "c4 - g4 - g7 x e4 x g6", "c4 - g4 - g7 x e4 x g6");
  board.forks.pop();

  var w  = design.getDirection("w");
  var g4 = g1.copy(t2, [w, w, w, w, w]);
  assert.equal( g4.level, 2, "Level 2");
  assert.equal( g4.parent, g1, "Parent assigned");
  assert.equal( g4.pos, Model.Game.stringToPos("f4"), "Pos assigned");
  assert.equal( g4.move.toString(0), "c4 - f4 x e4", "Move assigned");
  assert.equal( g4.cmd, 0, "cmd = 0");

  assert.equal( (g4.template.commands[g4.cmd++])(g4), 0, "ZRF_FROM executed");
  assert.equal( g4.cmd, 1, "cmd = 1");
  assert.equal( g4.from, Model.Game.stringToPos("f4"), "Initial position");
  assert.equal( g4.piece.toString(), "White King", "Current piece");

  assert.equal( (g4.template.commands[g4.cmd++])(g4), 0, "ZRF_PARAM executed");
  assert.equal( g4.cmd, 2, "cmd = 2");
  assert.equal( g4.stack.length, 1, "Stack");
  assert.equal( g4.stack[0], 0, "Direction");

  assert.equal( (g4.template.commands[g4.cmd++])(g4), 0, "ZRF_NAVIGATE executed");
  assert.equal( g4.cmd, 3, "cmd = 3");
  assert.equal( g4.stack.length, 0, "Stack is empty");
  assert.equal( g4.pos, Model.Game.stringToPos("e4"), "Current position");

  assert.equal( (g4.template.commands[g4.cmd++])(g4), 0, "ZRF_IS_EMPTY executed");
  assert.equal( g4.cmd, 4, "cmd = 4");
  assert.equal( g4.stack.length, 1, "Stack");
  assert.equal( g4.stack[0], true, "Piece is captured");
  assert.equal( g4.isLastFrom(Model.Game.stringToPos("c4")), true, "c4 - is last from position");

  var g5 = g1.copy(t2, [w, w, w, w, w]);
  g5.generate();
  assert.equal( board.forks.length, 0, "No Forks");
  assert.equal( board.moves.length, 3, "No Moves generated");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Simple Man's moves", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");

  design.setup("White", "Man", Model.Game.stringToPos("c3"));
  board.generate();
  assert.equal( board.moves.length, 3, "3 Moves generated");
  assert.equal( board.moves[0].toString(0), "c3 - d3", "c3 - d3");
  assert.equal( board.moves[1].toString(0), "c3 - b3", "c3 - b3");
  assert.equal( board.moves[2].toString(0), "c3 - c4", "c3 - c4");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Man's capturing priorited", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");

  design.setup("White", "Man", Model.Game.stringToPos("b2"));
  design.setup("White", "Man", Model.Game.stringToPos("e2"));
  design.setup("Black", "Man", Model.Game.stringToPos("b3"));
  design.setup("Black", "Man", Model.Game.stringToPos("f2"));

  board.generate();
  assert.equal( board.moves.length, 2, "2 Moves generated");
  assert.equal( board.moves[0].toString(0), "e2 - g2 x f2", "e2 - g2 x f2");
  assert.equal( board.moves[1].toString(0), "b2 - b4 x b3", "b2 - b4 x b3");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "Man's capturing chain", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");

  design.setup("White", "Man", Model.Game.stringToPos("d2"));
  design.setup("Black", "Man", Model.Game.stringToPos("d3"));
  design.setup("Black", "Man", Model.Game.stringToPos("d5"));
  design.setup("Black", "Man", Model.Game.stringToPos("e4"));
  design.setup("Black", "Man", Model.Game.stringToPos("f5"));

  board.generate();
  assert.equal( board.moves.length, 1, "1 move generated");
  assert.equal( board.moves[0].toString(0), "d2 - d4 - f4 - f6 x d3 x e4 x f5", "d2 - d4 - f4 - f6 x d3 x e4 x f5");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "King's slide", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");

  design.setup("White", "King", Model.Game.stringToPos("d4"));
  board.generate();
  assert.equal( board.moves.length, 14, "14 moves generated");
  assert.equal( board.moves[0].toString(0), "d4 - d3", "d4 - d3");
  assert.equal( board.moves[1].toString(0), "d4 - e4", "d4 - e4");
  assert.equal( board.moves[2].toString(0), "d4 - c4", "d4 - c4");
  assert.equal( board.moves[3].toString(0), "d4 - d5", "d4 - d5");
  assert.equal( board.moves[4].toString(0), "d4 - d6", "d4 - d6");
  assert.equal( board.moves[5].toString(0), "d4 - d7", "d4 - d7");
  assert.equal( board.moves[6].toString(0), "d4 - d8", "d4 - d8");
  assert.equal( board.moves[7].toString(0), "d4 - b4", "d4 - b4");
  assert.equal( board.moves[8].toString(0), "d4 - a4", "d4 - a4");
  assert.equal( board.moves[9].toString(0), "d4 - f4", "d4 - f4");
  assert.equal( board.moves[10].toString(0), "d4 - g4", "d4 - g4");
  assert.equal( board.moves[11].toString(0), "d4 - h4", "d4 - h4");
  assert.equal( board.moves[12].toString(0), "d4 - d2", "d4 - d2");
  assert.equal( board.moves[13].toString(0), "d4 - d1", "d4 - d1");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});

QUnit.test( "King's capturing chain", function( assert ) {
  Model.Game.InitGame();
  var design = Model.Game.getDesign();
  var board  = Model.Game.getInitBoard();
  board.clear();
  assert.equal( board.moves.length, 0, "No board moves");

  design.setup("White", "King", Model.Game.stringToPos("d4"));
  design.setup("Black", "Man", Model.Game.stringToPos("c4"));
  design.setup("Black", "Man", Model.Game.stringToPos("a6"));
  design.setup("Black", "Man", Model.Game.stringToPos("f8"));

  board.generate();
  assert.equal( board.moves.length, 2, "2 moves generated");
  assert.equal( board.moves[0].toString(0), "d4 - a4 - a8 - g8 x c4 x a6 x f8", "d4 - a4 - a8 - g8 x c4 x a6 x f8");
  assert.equal( board.moves[1].toString(0), "d4 - a4 - a8 - h8 x c4 x a6 x f8", "d4 - a4 - a8 - h8 x c4 x a6 x f8");

  Model.Game.design = undefined;
  Model.Game.board = undefined;
});
