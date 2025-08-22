const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');
const { describe } = require('mocha');

const app = require('../app');
const userService = require('../service/userService');

describe('UserController Tests', () => {
  beforeEach(() => sinon.restore());

  it('Deve registrar usuário com sucesso', async () => {
    sinon.stub(userService, 'register').returns({ username: 'vinicius' });

    const response = await request(app)
      .post('/register')
      .send({ username: 'vinicius', password: '123' });

    expect(response.status).to.equal(201);
    expect(response.body).to.deep.equal(
      {
        "message": "Usuário registrado com sucesso",
        "user": {
          "username": "vinicius"
        }
      }
    );
  });

  it('Deve retornar erro ao tentar registrar usuário duplicado', async () => {
    sinon.stub(userService, 'register').throws(new Error('Usuário já cadastrado'));

    const response = await request(app)
      .post('/register')
      .send({ username: 'vinicius', password: '123' });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Usuário já cadastrado');
  });

  it('Deve retornar erro ao tentar registrar sem nome ou senha', async () => {
    sinon.stub(userService, 'register').throws(new Error('Nome de usuário e senha são obrigatórios'));

    const response = await request(app)
      .post('/register')
      .send({ username: '', password: '' });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Nome de usuário e senha são obrigatórios');
  });

  it('Deve logar usuário com sucesso', async () => {
    sinon.stub(userService, 'login').returns({ username: 'vinicius' });

    const response = await request(app)
      .post('/login')
      .send({ username: 'vinicius', password: '123' });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
        "message": "Login realizado com sucesso",
        "user": {
          "username": "vinicius"
        }
      });
  });

  it('Deve retornar erro ao logar com credenciais inválidas', async () => {
    sinon.stub(userService, 'login').throws(new Error('Credenciais inválidas'));

    const response = await request(app)
      .post('/login')
      .send({ username: 'vini', password: '987' });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property('error', 'Credenciais inválidas');
  });

  it('Deve retornar a listagem de todos os usuários registrados', async () => {
    sinon.stub(userService, 'getUsers')
      .returns([{ username: 'vinicius', password: '123' }, { username: 'vini lopes', password: '456' }]);

    const response = await request(app)
      .get('/users');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      "users": [
        { 
          "username": "vinicius",
          "password": "123"
        },
        { 
          "username": "vini lopes",
          "password": "456"
        }
      ]
    });
  });
});
