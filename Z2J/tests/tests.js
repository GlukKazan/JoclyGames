QUnit.test( "Common", function( assert ) {
  var x = [];
  assert.ok( x.y === undefined, "x.y === undefined" );
  assert.ok( typeof x.y === "undefined", "typeof x.y === \"undefined\"" );
  x.y = [ null ];
  assert.ok( x.y[0] === null, "x.y[0] === null" );
  assert.ok( Model.find([1, 2, 3, 2, 1], 2) === 1, "find (succeed)" );
  assert.ok( Model.find([1, 2, 3, 2, 1], 5) === -1, "find (failed)" );
  var array = Model.int32Array([1, 2, 3]);
  assert.ok( array.length === 3, "array.length" );
  assert.ok( array[1] === 2, "array[]" );
});

QUnit.test( "ZrfDesign", function( assert ) {
  assert.ok( Model.Game !== undefined, "Model.Game" );
  var design = Model.Game.getDesign();
  assert.ok( design !== undefined, "ZrfDesign" );
  var name = 1;
  var type = 2;
  var val  = 3;
  design.addAttribute(type, name, val);
  assert.ok( design.attrs[name][type] === val, "addAttribute" );
  assert.ok( design.getAttribute(type, name) === val, "getAttribute" );
  assert.ok( design.getAttribute(type, 0) === false, "getAttribute" );
  var template = 4;
  var params = [1, 2, 3];
  var mode = 0;
  design.addMove(type, template, params, mode);
  assert.ok( design.pieces[type][0].type === 0, "addMove" );
  design.addDrop(type, template, params);
  assert.ok( design.pieces[type][1].type === 1, "addDrop" );
  var player_a = 1;
  var player_b = -1;
  var syms = [1, 0];
  design.addPlayer(player_b, syms);
  assert.ok( design.players[player_b][1] === 0, "addPlayer" );
  design.addPosition("p0", [0, 1]);
  design.addPosition("p1", [-1, 0]);
  assert.ok( design.positions[0][0] === 0, "addPosition" );
  assert.ok( design.navigate(player_a, 0, 1) === 1, "navigate (succeed)" );
  assert.ok( design.navigate(player_b, 1, 1) === 0, "navigate (succeed)" );
  assert.ok( design.navigate(player_a, 0, 0) === null, "navigate (failed)" );
  var zone = 0;
  design.addZone(zone, player_a, [0]);
  design.addZone(zone, player_b, [1]);
  assert.ok( design.zones[zone][player_a][0] === 0, "addZone" );
  assert.ok( design.inZone(zone, player_a, 0) === true, "inZone (succeed)" );
  assert.ok( design.inZone(zone, player_b, 0) === false, "inZone (failed)" );
});

QUnit.test( "ZrfMoveTemplate", function( assert ) {
  var template = Model.Game.createTemplate();
  assert.ok( template !== null, "ZrfMoveTemplate" );
  var game = Model.Game;
  var board = Model.Board;
  var m = Model.Move;
  template.addCommand(game, m.ZRF_JUMP, 10);                               // 0
  template.addCommand(game, m.ZRF_JUMP, -10);                              // 1
  template.addCommand(game, m.ZRF_JUMP, 10);                               // 2
  assert.ok( template.commands[0] !== template.commands[1], "Not equals" );
  assert.ok( template.commands[0] === template.commands[2], "Equals" );
  assert.ok( (template.commands[0])(null) === 9, "ZRF_JUMP" );
  template.addCommand(game, m.ZRF_IF, 5);                                  // 3
  var gen = Model.Game.createGen();
  gen.stack.push(true);
  assert.ok( (template.commands[3])(gen) === 4, "ZRF_IF (succeed)" );
  gen.stack.push(false);
  assert.ok( (template.commands[3])(gen) === 0, "ZRF_IF (failed)" );
  template.addCommand(game, m.ZRF_FORK, 2);                                // 4
  assert.ok( (template.commands[4])(gen) === 0, "ZRF_FORK" );
  gen = board.forks[0];
  assert.ok( gen.cc === 1, "ZRF_FORK" );
  template.addCommand(game, m.ZRF_FUNCTION, -1);                           // 5
  assert.ok( (template.commands[5])(gen) === null, "ZRF_FUNCTION" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_NOT);                    // 6
  gen.stack.push(true);
  assert.ok( (template.commands[6])(gen) === 0, "ZRF_NOT" );
  assert.ok( !gen.stack.pop(), "ZRF_NOT" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_IS_EMPTY);               // 7
  assert.ok( (template.commands[7])(gen) === null, "ZRF_IS_EMPTY" );
  gen.cp = 0;
  assert.ok( (template.commands[7])(gen) === 0, "ZRF_IS_EMPTY" );
  assert.ok( gen.stack.pop(), "ZRF_IS_EMPTY" );
  board.pieces[0] = { player: 1 };
  assert.ok( (template.commands[7])(gen) === 0, "ZRF_IS_EMPTY" );
  assert.ok( !gen.stack.pop(), "ZRF_IS_EMPTY" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_IS_ENEMY);               // 8
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_IS_FRIEND);              // 9
  assert.ok( (template.commands[8])(gen) === 0, "ZRF_IS_ENEMY" );
  assert.ok( !gen.stack.pop(), "ZRF_IS_ENEMY" );
  assert.ok( (template.commands[9])(gen) === 0, "ZRF_IS_FRIEND" );
  assert.ok( gen.stack.pop(), "ZRF_IS_FRIEND" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_IS_LASTF);               // 10
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_IS_LASTT);               // 11
  assert.ok( (template.commands[10])(gen) === 0, "ZRF_IS_LASTF" );
  assert.ok( !gen.stack.pop(), "ZRF_IS_LASTF" );
  assert.ok( (template.commands[11])(gen) === 0, "ZRF_IS_LASTT" );
  assert.ok( !gen.stack.pop(), "ZRF_IS_LASTT" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_MARK);                   // 12
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_BACK);                   // 13
  assert.ok( (template.commands[13])(gen) === null, "ZRF_BACK" );
  assert.ok( (template.commands[12])(gen) === 0, "ZRF_MARK" );
  gen.cp = 1;
  assert.ok( (template.commands[13])(gen) === 0, "ZRF_BACK" );
  assert.ok( gen.cp === 0, "ZRF_BACK" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_PUSH);                   // 14
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_POP);                    // 15
  assert.ok( (template.commands[15])(gen) === null, "ZRF_POP" );
  assert.ok( (template.commands[14])(gen) === 0, "ZRF_PUSH" );
  gen.cp = 1;
  assert.ok( (template.commands[14])(gen) === 0, "ZRF_PUSH" );
  assert.ok( (template.commands[15])(gen) === 0, "ZRF_POP" );
  assert.ok( gen.cp === 1, "ZRF_POP" );
  assert.ok( (template.commands[15])(gen) === 0, "ZRF_POP" );
  assert.ok( gen.cp === 0, "ZRF_POP" );
  assert.ok( (template.commands[15])(gen) === null, "ZRF_POP" );
  var design = Model.Game.getDesign();
  var zone = 0;
  design.addZone(zone, 1, [0]);
  template.addCommand(game, m.ZRF_IN_ZONE, zone);                          // 16
  gen.cp = null;
  assert.ok( (template.commands[16])(gen) === null, "ZRF_IN_ZONE" );
  gen.cp = 0;
  assert.ok( (template.commands[16])(gen) === 0, "ZRF_IN_ZONE" );
  assert.ok( gen.stack.pop(), "ZRF_IN_ZONE" );
  gen.cp = 1;
  assert.ok( (template.commands[16])(gen) === 0, "ZRF_IN_ZONE" );
  assert.ok( !gen.stack.pop(), "ZRF_IN_ZONE" );
  var flag = 0;
  template.addCommand(game, m.ZRF_GET_FLAG, flag);                         // 17
  assert.ok( (template.commands[17])(gen) === 0, "ZRF_GET_FLAG" );
  assert.ok( !gen.stack.pop(), "ZRF_GET_FLAG" );
  template.addCommand(game, m.ZRF_SET_FLAG, flag);                         // 18
  gen.stack.push(1);
  assert.ok( (template.commands[18])(gen) === 0, "ZRF_SET_FLAG" );
  assert.ok( gen.stack.length === 0, "ZRF_SET_FLAG" );
  assert.ok( (template.commands[17])(gen) === 0, "ZRF_GET_FLAG" );
  assert.ok( gen.stack.pop() === 1, "ZRF_GET_FLAG" );
  assert.ok( gen.stack.length === 0, "ZRF_GET_FLAG" );
  gen.cp = null;
  template.addCommand(game, m.ZRF_GET_PFLAG, flag);                        // 19
  template.addCommand(game, m.ZRF_SET_PFLAG, flag);                        // 20
  assert.ok( (template.commands[19])(gen) === null, "ZRF_GET_PFLAG" );
  assert.ok( (template.commands[20])(gen) === null, "ZRF_SET_PFLAG" );
  gen.cp = 0;
  gen.stack.push(1);
  assert.ok( (template.commands[20])(gen) === 0, "ZRF_SET_PFLAG" );
  assert.ok( gen.stack.length === 0, "ZRF_SET_PFLAG" );
  gen.cp = 1;
  gen.stack.push(2);
  assert.ok( (template.commands[20])(gen) === 0, "ZRF_SET_PFLAG" );
  assert.ok( gen.stack.length === 0, "ZRF_SET_PFLAG" );
  assert.ok( (template.commands[19])(gen) === 0, "ZRF_GET_PFLAG" );
  assert.ok( gen.stack.pop() === 2, "ZRF_GET_PFLAG" );
  gen.cp = 0;
  assert.ok( (template.commands[19])(gen) === 0, "ZRF_GET_PFLAG" );
  assert.ok( gen.stack.pop() === 1, "ZRF_GET_PFLAG" );
  template.addCommand(game, m.ZRF_GET_ATTR, flag);                         // 21
  template.addCommand(game, m.ZRF_SET_ATTR, flag);                         // 22
  gen.cp = null;
  assert.ok( (template.commands[21])(gen) === null, "ZRF_GET_ATTR" );
  assert.ok( (template.commands[22])(gen) === null, "ZRF_SET_ATTR" );
  gen.cp = 0;
  board.pieces = [];
  assert.ok( (template.commands[21])(gen) === 0, "ZRF_GET_ATTR" );
  assert.ok( !gen.stack.pop(), "ZRF_GET_ATTR" );
  board.pieces[gen.cp] = Model.Game.createPiece(0, 1);
  assert.ok( (template.commands[21])(gen) === 0, "ZRF_GET_ATTR" );
  assert.ok( !gen.stack.pop(), "ZRF_GET_ATTR" );
  board.pieces[gen.cp] = board.pieces[gen.cp].setValue(0, true);
  assert.ok( (template.commands[21])(gen) === 0, "ZRF_GET_ATTR" );
  assert.ok( gen.stack.pop(), "ZRF_GET_ATTR" );
  gen.stack.push(true);
  assert.ok( (template.commands[22])(gen) === 0, "ZRF_SET_ATTR" );
  assert.ok( gen.attrs[gen.cp][flag], "ZRF_SET_ATTR" );
  template.addCommand(game, m.ZRF_PROMOTE, 2);                             // 23
  assert.ok( (template.commands[23])(gen) === null, "ZRF_PROMOTE" );
  gen.piece = Model.Game.createPiece(1, 1);
  assert.ok( (template.commands[23])(gen) === 0, "ZRF_PROMOTE" );
  assert.ok( gen.piece.type === 2, "ZRF_PROMOTE" );
  template.addCommand(game, m.ZRF_MODE, 1);                                // 24
  assert.ok( (template.commands[24])(gen) === 0, "ZRF_MODE" );
  assert.ok( gen.mode === 1, "ZRF_MODE" );
  design.names = [];
  design.positions = [];
  design.players = [];
  var syms = [1, 0];
  design.addPlayer(0, syms);
  design.addPosition("p0", [1, 0]);
  design.addPosition("p1", [0, -1]);
  template.addCommand(game, m.ZRF_ON_BOARDP, 2);                           // 25
  template.addCommand(game, m.ZRF_ON_BOARDD, 0);                           // 26
  assert.ok( (template.commands[25])(gen) === 0, "ZRF_ON_BOARDP" );
  assert.ok( !gen.stack.pop(), "ZRF_ON_BOARDP" );
  gen.cp = null;
  assert.ok( (template.commands[26])(gen) === null, "ZRF_ON_BOARDD" );
  gen.cp = 0;
  assert.ok( (template.commands[26])(gen) === 0, "ZRF_ON_BOARDD" );
  assert.ok( design.navigate(1, 0, 0) === 1, "ZRF_ON_BOARDD" );
  assert.ok( gen.stack.pop(), "ZRF_ON_BOARDD" );
  template.addCommand(game, m.ZRF_LITERAL, 1);                             // 27
  template.addCommand(game, m.ZRF_PARAM, 0);                               // 28
  assert.ok( (template.commands[27])(gen) === 0, "ZRF_LITERAL" );
  assert.ok( gen.stack.pop() === 1, "ZRF_LITERAL" );
  gen.params = [3, 2, 1];
  assert.ok( (template.commands[28])(gen) === 0, "ZRF_PARAM" );
  assert.ok( gen.stack.pop() === 3, "ZRF_LITERAL" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_VERIFY);                 // 29
  assert.ok( (template.commands[29])(gen) === null, "ZRF_VERIFY" );
  gen.stack.push(false);
  assert.ok( (template.commands[29])(gen) === null, "ZRF_VERIFY" );
  gen.stack.push(true);
  assert.ok( (template.commands[29])(gen) === 0, "ZRF_VERIFY" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_SET_POS);                // 30
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_NAVIGATE);               // 31
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_OPPOSITE);               // 32
  gen.cp = null;
  gen.stack.push(1);
  assert.ok( (template.commands[30])(gen) === 0, "ZRF_SET_POS" );
  assert.ok( gen.cp === 1, "ZRF_SET_POS" );
  gen.stack.push(1);
  assert.ok( (template.commands[31])(gen) === 0, "ZRF_NAVIGATE" );
  assert.ok( gen.cp === 0, "ZRF_NAVIGATE" );
  gen.stack.push(1);
  assert.ok( (template.commands[32])(gen) === 0, "ZRF_OPPOSITE" );
  assert.ok( gen.stack.pop() === 0, "ZRF_OPPOSITE" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_FROM);                   // 33
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_TO);                     // 34
  gen.cp = 0;
  gen.piece = null;
  board.pieces[0] = Model.Game.createPiece(0, 1);
  board.pieces[1] = null;
  assert.ok( (template.commands[33])(gen) === 0, "ZRF_FROM" );
  assert.ok( gen.starts[0] === gen.cp, "ZRF_FROM" );
  assert.ok( gen.from === gen.cp, "ZRF_FROM" );
  assert.ok( gen.piece === board.pieces[gen.cp], "ZRF_FROM" );
  gen.cp = 1;
  assert.ok( (template.commands[34])(gen) === 0, "ZRF_TO" );
//assert.ok( board.pieces[0] === undefined, "ZRF_TO" );
//assert.ok( board.pieces[1].toString() === "1/0", "ZRF_TO" );
  assert.ok( gen.stops[0] === gen.cp, "ZRF_TO" );
  assert.ok( gen.from === undefined, "ZRF_TO" );
  assert.ok( gen.piece === undefined, "ZRF_TO" );
  assert.ok( gen.move.toString() === "p0 - p1", "ZRF_TO" );
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_CAPTURE);                // 35
  assert.ok( (template.commands[35])(gen) === 0, "ZRF_CAPTURE" );
//assert.ok( board.pieces[1] === undefined, "ZRF_TO" );
  assert.ok( gen.move.toString() === "p0 - p1 x p1", "ZRF_TO" );
  gen.cp = 0;
  gen.move.moves = [];
  board.pieces[0] = Model.Game.createPiece(0, 1);
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_FLIP);                   // 36
  assert.ok( (template.commands[36])(gen) === 0, "ZRF_FLIP" );
//assert.ok( board.pieces[0].toString() === "-1/0", "ZRF_TO" );
  assert.equal(gen.move.toString(), "p0 = -1/0", "ZRF_TO");
  template.addCommand(game, m.ZRF_FUNCTION, m.ZRF_END);                    // 37
  gen.cc = 0;
  assert.ok( (template.commands[37])(gen) === -2, "ZRF_END" );
});

QUnit.test( "ZrfPiece", function( assert ) {
  var pieceType = 0;
  var player = 1;
  var piece = Model.Game.createPiece(pieceType, player);
  assert.ok( !piece.getValue(0), "ZrfPiece.getValue" );
  var newPiece = piece.setValue(0, true);
  assert.ok( piece !== newPiece , "ZrfPiece.setValue" );
  assert.ok( newPiece.getValue(0), "ZrfPiece.setValue" );
  newPiece = piece.promote(1);
  assert.ok( newPiece.toString() === "1/1", "ZrfPiece.promote" );
  newPiece = piece.flip();
  assert.ok( newPiece.toString() === "-1/0", "ZrfPiece.flip" );
});
