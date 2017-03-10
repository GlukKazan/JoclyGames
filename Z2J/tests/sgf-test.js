QUnit.test( "Parser", function( assert ) {
  assert.deepEqual( Model.Game.parseSgf("(;AW[aa][ab][ac]AB[ba][bb][bc])"), [
    {
        "arg": [
          "aa",
          "ab",
          "ac"
        ],
        "name": "AW"
    },
    {
        "arg": [
          "ba",
          "bb",
          "bc"
        ],
        "name": "AB"
    }
  ], "Setup");
  assert.deepEqual( Model.Game.parseSgf("(;AW[aa];B[])"), [
     {
       "arg": [
         "aa"
       ],
       "name": "AW"
     },
     {
       "arg": [
         ""
       ],
       "name": "B"
     }
  ], "Pass");
  assert.deepEqual( Model.Game.parseSgf("(;W[aa];B[ab](;W[cd];B[de])(;W[de]))"), [
      {
        "arg": [
          "aa"
        ],
        "name": "W"
      },
      {
        "arg": [
          "ab"
        ],
        "name": "B"
      },
      [
        {
          "arg": [
            "cd"
          ],
          "name": "W"
        },
        {
          "arg": [
            "de"
          ],
          "name": "B"
        }
      ],
      [
        {
          "arg": [
            "de"
          ],
          "name": "W"
        }
      ]
  ], "Tree");
});
