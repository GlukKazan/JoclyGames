QUnit.test( "Piece", function( assert ) {
  var man  = Model.Game.createPiece(0, Model.Board.mWho);
  var king = man.promote(1);
  var flip = king.flip();
  assert.equal( man.ToString(), "1/0", "Man Piece");
  assert.equal( king.ToString(), "1/1", "King Piece");
  assert.equal( flip.ToString(), "-1/1", "Flip");
  assert.ok( man.getValue(0) === false, "Non existent value");
  var piece = man.setValue(0, true);
  assert.ok( piece !== man, "Non mutable pieces");
  assert.ok( piece.getValue(0) === true, "Existent value");
  piece = piece.setValue(0, false);
  assert.ok( piece.getValue(0) === false, "Reset value");
  piece = man.setValue(0, false);
  assert.equal( piece, man, "Value not changed");
});

QUnit.test( "Design", function( assert ) {
  var design = Model.Game.getDesign();
  design.addDirection("w");
  design.addDirection("e");
  design.addDirection("s");
  design.addDirection("n");
  assert.equal( design.dirs.length, 4, "Directions");
  design.addPlayer(0, [1, 0, 3, 2]);
  design.addPlayer(JocGame.PLAYER_B, [0, 1, 3, 2]);
  assert.equal( design.players[0].length, 4, "Opposite");
  assert.equal( design.players[JocGame.PLAYER_B].length, 4, "Symmetry");
  design.addPosition("a2", [ 0, 1, 2,  0]);
  design.addPosition("b2", [-1, 0, 2,  0]);
  design.addPosition("a1", [ 0, 1, 0, -2]);
  design.addPosition("b1", [-1, 0, 0, -2]);
  var pos = 2;
  assert.equal( design.names.length,4, "Positions");
  assert.equal( Model.Game.posToString(pos), "a1", "Start position");
  pos = design.navigate(JocGame.PLAYER_A, pos, 3);
  assert.equal( Model.Game.posToString(pos), "a2", "Player A moving");
  pos = design.navigate(JocGame.PLAYER_B, pos, 3);
  assert.equal( Model.Game.posToString(pos), "a1", "Player B moving");
  pos = design.navigate(0, pos, 0);
  assert.equal( Model.Game.posToString(pos), "b1", "Opposite moving");
  pos = design.navigate(JocGame.PLAYER_A, pos, 1);
  assert.equal( pos, null, "No moving");
  design.addZone("promotion", JocGame.PLAYER_A, [0, 1]);
  design.addZone("promotion", JocGame.PLAYER_B, [2, 3]);
  assert.equal( design.zones.length, 1, "Zones");
  assert.ok( design.inZone(0, JocGame.PLAYER_A, 0) === true, "Player A promotion zone" );
  assert.ok( design.inZone(0, JocGame.PLAYER_B, 3) === true, "Player B promotion zone" );
  assert.ok( design.inZone(0, JocGame.PLAYER_A, 2) === false, "No promotion zone" );
  assert.equal( design.getAttribute(0, 0), false, "Non existent attribute");
  design.addAttribute(0, 0, true);
  assert.equal( design.getAttribute(0, 0), true, "Default value for attribute");
  Model.Game.design = undefined;
});

QUnit.test( "Move", function( assert ) {
  var design = Model.Game.getDesign();
  var move = new Model.Move.Init([]);
  assert.equal( move.ToString(), "", "Initial move");
  var man  = Model.Game.createPiece(0, Model.Board.mWho);
  design.addPosition("a", [ 0, 1]);
  design.addPosition("b", [-1, 0]);
  move.movePiece(0, 1, man);
  assert.equal( move.ToString(), "a - b", "Move piece");
  move = new Model.Move.Init(move);
  move.capturePiece(1);
  assert.equal( move.ToString(), "a - b x b", "Capture piece");
  var king = man.promote(1);
  move.createPiece(1, king);
  assert.equal( move.ToString(), "a - b x b b = 1/1", "Create piece");
  move.SetAttr(1, [true]);
  assert.ok( move.moves[0][2] !== man , "Man changed" );
  assert.ok( move.moves[2][2] !== king , "King changed" );
  assert.equal( move.moves[2][2].ToString(), "1/1", "King piece");
  assert.equal( move.moves[2][2].getValue(0), true, "... with values");
  Model.Game.design = undefined;
});
