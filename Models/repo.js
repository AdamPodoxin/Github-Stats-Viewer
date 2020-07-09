function Repo(
  id,
  node_id,
  name,
  description,
  html_url,
  topics,
  languages,
  starred
) {
  this.id = id;
  this.node_id = node_id;
  this.name = name;
  this.description = description;
  this.html_url = html_url;
  this.topics = topics;
  this.languages = languages;
  this.starred = starred;
}

module.exports = Repo;
