
describe('Controller: LobbyInfoCtrl', function() {
  var scope, ctrl;
  beforeEach(angular.mock.module('myApp'));
  beforeEach(inject(function($rootScope, $controller) {
    scope = $rootScope.new();
    scope.$parent = {
      lobby: 'test'
    };
    ctrl = $controller('LobbyhInfoCtrl', {
      $scope: scope
    });
  }));
  it('should ...', function () {
    expect(1).toEqual(1);
  });
  it('should ...', function () {
    expect(scope.ready).toEqual(false);
  });
});
