// ������ ���� ��������� ����� �����
// � ������� "player/type"
Model.Game.PieceList = [pieces];

Model.Game.BuildDesign = function() {
  // ��� ������ �������
  // ������ ����� �������� (�������� null)
  // �� ������ ����� �� ������ �����������
  this.design.addPosition([offsets]);
  // ��� ������� ���� ������
  this.design.addMove(..., ...);
  // ���������
  this.design.addPlayer(player, [...]);
}

// ��������� �������
Model.Board.Evaluate = function(aGame) {
...
}
