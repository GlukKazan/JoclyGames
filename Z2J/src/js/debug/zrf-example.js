// Список всех возможных типов фигур
// в формате "player/type"
Model.Game.PieceList = [pieces];

Model.Game.BuildDesign = function() {
  // Для каждой позиции
  // Список целых смещений (возможно null)
  // По одному числу на каждое направление
  this.design.addPosition([offsets]);
  // Для каждого хода фигуры
  this.design.addMove(..., ...);
  // Симметрии
  this.design.addPlayer(player, [...]);
}

// Оценочная функция
Model.Board.Evaluate = function(aGame) {
...
}
