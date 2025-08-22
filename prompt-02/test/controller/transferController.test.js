// Bibliotecas
const request = require('supertest');
const sinon = require('sinon');
const {expect} = require('chai');

//Aplicação
const app = require('../../app');
const { describe } = require('mocha');

//Mock
const transferService = require('../../service/transferService');

//Testes
describe('TransferController', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatário inexistentes recebo 400', async () => {
            const response = await request(app)
                .post('/transfer')
                .send({
                    from: 'vini',
                    to: 'lopes',
                    amount: 100,
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Usuário não encontrado');
        });

        it('Usando Mocks: Quando informo remetente e destinatário inexistentes recebo 400', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.throws(new Error('Usuário não encontrado'));

            const response = await request(app)
                .post('/transfer')
                .send({
                    from: 'vini',
                    to: 'lopes',
                    amount: 100,
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Usuário não encontrado');

            //Reset Mock
            sinon.restore();
        });

        it('Usando Mocks: Quando informo um usário valido e a transação retorna 201', async () => {
            const transferServiceMock = sinon.stub(transferService, 'transfer');
            transferServiceMock.returns({
                from: 'vini',
                to: 'lopes',
                amount: 200,
            });

            const response = await request(app)
                .post('/transfer')
                .send({
                    from: 'vini',
                    to: 'lopes',
                    amount: 100,
                });

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('from', 'vini');
            expect(response.body).to.have.property('to', 'lopes');
            expect(response.body).to.have.property('amount', 200);

            //Reset Mock
            sinon.restore();
        });
    });
});