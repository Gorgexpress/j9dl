export default class Main {
  constructor($http) {
    this.$http = $http;
  }
  getSelf(){
    return this.$http.get('api/user/self');
  }
}
