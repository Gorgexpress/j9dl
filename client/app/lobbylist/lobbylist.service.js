export default class LobbyListService { 
  constructor($http) {
    this.$http = $http;
  }
  listAll() {
    return this.$http.get('api/lobbies/list');
  }
  createLobby(name) {
    return this.$http.post('api/lobbies/create/' + name);
  }
  joinLobby(lobby) {
    return this.$http.get('api/lobbies/join/' + lobby);
  }
  leaveLobby() {
    return this.$http.get('api/lobbies/leave');
  }

}
