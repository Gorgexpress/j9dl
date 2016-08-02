export default class LobbyInfo {
  constructor($http) {
    this.$http = $http;
  }
  get(lobby) {
    return this.$http.get('api/lobbies/get/' + lobby);
  }

  ready() {
    return this.$http.get('api/lobbies/ready');
  }

  unready() {
    return this.$http.get('api/lobbies/unready');
  }

  voteWinner(winner) {
    return this.$http.get('api/lobbies/voteWinner/' + winner);
  }
}

