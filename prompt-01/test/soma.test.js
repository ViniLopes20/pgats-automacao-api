const assert = require('assert');
const soma = require('../src/soma');

describe('Função soma', function() {
  it('deve retornar a soma de dois números', function() {
    assert.strictEqual(soma(2, 3), 5);
  });
});
