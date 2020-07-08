function User(avatar_url, login, name, html_url, repos) {
  this.avatar_url = avatar_url;
  this.login = login;
  this.name = name;
  this.html_url = html_url;
  this.repos = repos;
}

module.exports = User;
