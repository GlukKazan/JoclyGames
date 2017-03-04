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
  assert.equal( design.positionNames.length,4, "Positions");
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

QUnit.test( "Move Determinate", function( assert ) {
  var design = Model.Game.getDesign();
  design.addDirection("w");
  design.addDirection("e");
  design.addPlayer("White", [1, 0]);
  design.addPlayer("Black", [0, 1]);
  design.addPosition("A", [ 0, 1]);
  design.addPosition("B", [-1, 1]);
  design.addPosition("C", [-1, 1]);
  design.addPosition("D", [-1, 0]);
  design.addPiece("Man", 0);
  design.setup("White", "Man", 0);
  design.setup("White", "Man", 1);
  design.setup("Black", "Man", 2);
  design.setup("Black", "Man", 3);

  var m = Model.Game.createMove();
  m.actions.push([ [0, 1], [2, 3], null, 1]);
  m.actions.push([ [3, 2], null, null, 1]);
  assert.equal( m.toString(0), "A - C x D", "'A - C x D' Move");

  var ix = m.getControlList();
  assert.equal( ix.length, 8, "ix.length == 8");
  var ml = m.determinate();
  assert.equal( ml.length, 8, "ml.length == 8");
  assert.equal( ml[0].toString(0), "A - C x D", "A - C x D");
  assert.equal( ml[1].toString(0), "A - C x C", "A - C x C");
  assert.equal( ml[2].toString(0), "A - D x D", "A - D x D");
  assert.equal( ml[3].toString(0), "A - D x C", "A - D x C");
  assert.equal( ml[4].toString(0), "B - C x D", "B - C x D");
  assert.equal( ml[5].toString(0), "B - C x C", "B - C x C");
  assert.equal( ml[6].toString(0), "B - D x D", "B - D x D");
  assert.equal( ml[7].toString(0), "B - D x C", "B - D x C");

  Model.Game.design = undefined;
});

QUnit.test( "Null and Bad Moves filtering", function( assert ) {
  var design = Model.Game.getDesign();
  design.addDirection("w");
  design.addDirection("e");
  design.addPlayer("White", [1, 0]);
  design.addPlayer("Black", [0, 1]);
  design.addPosition("A", [ 0, 1]);
  design.addPosition("B", [-1, 1]);
  design.addPosition("C", [-1, 1]);
  design.addPosition("D", [-1, 0]);
  design.addPiece("Man", 0);
  design.setup("White", "Man", 0);
  design.setup("Black", "Man", 2);
  design.setup("Black", "Man", 3);

  var m = Model.Game.createMove();
  m.actions.push([ [0], [1], null, 1]);
  m.actions.push([ [2, 3, null], null, null, 1]);
  m.actions.push([ [3, 2, null], null, null, 1]);
  assert.equal( m.toString(0), "A - B x C x D", "'A - B x C x D' Move");

  var ml = m.determinate();
  assert.equal( ml.length, 7, "ml.length == 7");
  assert.equal( ml[0].toString(0), "A - B x C x D", "A - B x C x D");
  assert.equal( ml[1].toString(0), "A - B x C", "A - B x C");
  assert.equal( ml[2].toString(0), "A - B x D x C", "A - B x D x C");
  assert.equal( ml[3].toString(0), "A - B x D", "A - B x D");
  assert.equal( ml[4].toString(0), "A - B x D", "A - B x D");
  assert.equal( ml[5].toString(0), "A - B x C", "A - B x C");
  assert.equal( ml[6].toString(0), "A - B", "A - B");

  Model.Game.design = undefined;
});
