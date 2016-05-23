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
  design.addPosition([0, 1]);
  design.addPosition([-1, 0]);
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

});
