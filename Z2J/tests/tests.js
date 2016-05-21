QUnit.test( "Common", function( assert ) {
  var x = [];
  assert.ok( x.y == undefined, "x.y == undefined" );
  assert.ok( x.y === undefined, "x.y === undefined" );
  assert.ok( typeof x.y === "undefined", "typeof x.y === \"undefined\"" );
  x.y = [ null ];
  assert.ok( x.y[0] === null, "x.y[0] === null" );
});

QUnit.test( "ZrfDesign", function( assert ) {
  assert.ok( Model.Game !== undefined, "Model.Game" );
  var design = Model.Game.newZrfDesign();
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
  var player = -1;
  var syms = [1, 0];
  design.addPlayer(player, syms);
  assert.ok( design.players[player][1] === 0, "addPlayer" );
  var pos = 0;
  var links = [1, null, -1];
  design.addPosition(links);
  assert.ok( design.positions[pos][1] === null, "addPosition" );

});
