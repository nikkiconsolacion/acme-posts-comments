const pg = require('pg');
const { Client } = pg;
const uuid = require('uuid');

const client = new Client('postgres://localhost/acme_posts_comments_db');

client.connect();

//posts
const nodeId = uuid.v4();
const expressId = uuid.v4();
const reactId = uuid.v4();
//tags
const nodeTagId = uuid.v4();
const expressTagId = uuid.v4();
const reactTagId = uuid.v4();

const SQL = `
  DROP TABLE IF EXISTS tags;
  DROP TABLE IF EXISTS posts;

  CREATE TABLE posts(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
  );
  CREATE TABLE tags(
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    post_id UUID REFERENCES posts(id)
  );
  INSERT INTO posts(id, name) VALUES('${nodeId}', 'Node');
  INSERT INTO posts(id, name) VALUES('${expressId}', 'Express');
  INSERT INTO posts(id, name) VALUES('${reactId}', 'React');

  INSERT INTO tags(id, name, post_id) VALUES('${nodeTagId}', 'Interesting', '${nodeId}');
  INSERT INTO tags(id, name, post_id) VALUES('${expressTagId}', 'Challenging', '${expressId}');
  INSERT INTO tags(id, name, post_id) VALUES('${reactTagId}', 'Loved It', '${reactId}');
`;

const syncAndSeed = async()=> {
  await client.query(SQL);
};

const findAllPosts = async()=> {
  const response = await client.query('SELECT * FROM posts;');
  return response.rows;
};

const findAllTags = async()=> {
  const response = await client.query('SELECT * FROM tags;');
  return response.rows;
};

module.exports = {
  syncAndSeed,
  findAllPosts,
  findAllTags
}
