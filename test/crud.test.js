const mysql = require('mysql');
const request = require('supertest');
const createApp = require('../server/index.js');

let app;
let connection;

beforeAll(async () => {
  connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  connection.connect();
  await connection.query('CREATE DATABASE test;');
  await connection.query('USE test;');
  await connection.query(
    `CREATE TABLE reviews_graph (
    id int auto_increment primary key,
    gameid int not null,
    date date,
    positive int,
    negative int
    );`
  );

  app = createApp(connection);
});

afterAll(async () => {
  await connection.query('DROP DATABASE test;');
  await connection.destroy();;
});

test('it successfully inserts a new record', async () => {
  await request(app)
    .post('/api/reviewcount/1/2020-08-22')
    .send({negative: 14, positive: 3})
    .set('Accept', 'application/json')
    .expect(201)
})

test('it successfully updates existing record',  async () => {
  await request(app)
    .post('/api/reviewcount/1/2020-08-22')
    .send({negative: 14, positive: 3})
    .set('Accept', 'application/json')

  await request(app)
    .put("/api/reviewcount/1/2020-08-22")
    .send({negative: 10, positive: 10})
    .set('Accept', 'application/json')
    .expect(204)
})

test('it successfully deletes existing record',  async () => {
  await request(app)
    .post('/api/reviewcount/1/2020-08-23')
    .send({negative: 1, positive: 3})
    .set('Accept', 'application/json')

  await request(app)
    .delete("/api/reviewcount/1/2020-08-23")
    .expect(204)
})

test('it returns 404 if item to delete does not exist',  async () => {
  await request(app)
    .delete("/api/reviewcount/1/2010-08-01")
    .expect(404)
})

test('it returns 404 if item to update does not exist',  async () => {
  await request(app)
    .delete("/api/reviewcount/1000/2010-08-01")
    .expect(404)
})

test('it successfully retrieves existing record',  async () => {
  await request(app)
    .post('/api/reviewcount/3/2020-08-25')
    .send({negative: 1, positive: 3})
    .set('Accept', 'application/json')

  await request(app)
    .get("/api/reviewcount/3/2020-08-25")
    .expect(200)
})
