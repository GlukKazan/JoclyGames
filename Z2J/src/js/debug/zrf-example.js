// Список всех возможных типов фигур
// в формате "player/type"
Model.Game.PieceList = [pieces];

Model.Game.BuildDesign = function() {
  // Для каждой позиции
  // Список целых смещений (возможно null)
  // По одному числу на каждое направление
  this.boardDesign.addPosition([offsets]);
  ...
}

// Оценочная функция
Model.Board.Evaluate = function(aGame) {
...
}
