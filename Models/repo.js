function Repo(id, node_id, name, description, html_url, languages, topics) {
  this.id = id;
  this.node_id = node_id;
  this.name = name;
  this.description = description;
  this.html_url = html_url;
  this.languages = languages;
  this.topics = topics;
}

module.exports = Repo;
