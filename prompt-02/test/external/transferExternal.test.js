// Bibliotecas
const request = require('supertest');
const {expect} = require('chai');

//Testes
describe('TransferExternal', () => {
    describe('POST /transfer', () => {
        it('Quando informo remetente e destinatário inexistentes recebo 400', async () => {
            const response = await request('http://localhost:3000')
                .post('/transfer')
                .send({
                    from: 'vini',
                    to: 'lopes',
                    amount: 100,
                });

            expect(response.status).to.equal(400);
            expect(response.body).to.have.property('error', 'Usuário não encontrado');
        });

        it('Quando tento transferir para o mesmo usuário do remetente recebo 400', async () => {
            const responseRegister = await request('http://localhost:3000')
                .post('/register')
                .send({
                    username: 'vini',
                    password: '123456',
                    favorecido: true,
                    saldo: 1000
                });

            const responseTransfer = await request('http://localhost:3000')
                .post('/transfer')
                .send({
                    from: responseRegister.body.username,
                    to: responseRegister.body.username,
                    amount: 100,
                });

            expect(responseTransfer.status).to.equal(400);
            expect(responseTransfer.body).to.have.property('error', 'Não é possível transferir para si mesmo');
        });

        it('Quando tento transferir um valor maior que o valor do saldo do remetente recebo 400', async () => {
            const responseRegister1 = await request('http://localhost:3000')
                .post('/register')
                .send({
                    username: 'juca',
                    password: '123456',
                    favorecido: true,
                    saldo: 100
                });

            const responseRegister2 = await request('http://localhost:3000')
                .post('/register')
                .send({
                    username: 'mario',
                    password: '123456',
                    favorecido: true,
                    saldo: 10
                });

            const responseTransfer = await request('http://localhost:3000')
                .post('/transfer')
                .send({
                    from: responseRegister1.body.username,
                    to: responseRegister2.body.username,
                    amount: 200,
                });

            expect(responseTransfer.status).to.equal(400);
            expect(responseTransfer.body).to.have.property('error', 'Saldo insuficiente');
        });

        it('Quando tento transferir um valor acimar de R$5.000,00 para um não favorecido recebo 400', async () => {
            const responseRegister1 = await request('http://localhost:3000')
                .post('/register')
                .send({
                    username: 'silva',
                    password: '123456',
                    favorecido: true,
                    saldo: 10000
                });

            const responseRegister2 = await request('http://localhost:3000')
                .post('/register')
                .send({
                    username: 'lopes',
                    password: '123456',
                    favorecido: false,
                    saldo: 10000
                });

            const responseTransfer = await request('http://localhost:3000')
                .post('/transfer')
                .send({
                    from: responseRegister1.body.username,
                    to: responseRegister2.body.username,
                    amount: 5001,
                });

            expect(responseTransfer.status).to.equal(400);
            expect(responseTransfer.body).to.have.property('error', 'Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos');
        });

        it('Quando tento transferir um valor que o remetente possui na conta para um destinatário válido recebo 201', async () => {
            const responseRegister1 = await request('http://localhost:3000')
                .post('/register')
                .send({
                    username: 'josé',
                    password: '123456',
                    favorecido: true,
                    saldo: 2000
                });

            const responseRegister2 = await request('http://localhost:3000')
                .post('/register')
                .send({
                    username: 'deia',
                    password: '123456',
                    favorecido: true,
                    saldo: 3000
                });

            const responseTransfer = await request('http://localhost:3000')
                .post('/transfer')
                .send({
                    from: responseRegister1.body.username,
                    to: responseRegister2.body.username,
                    amount: 1000,
                });

            expect(responseTransfer.status).to.equal(201);
            expect(responseTransfer.body).to.have.property('message', 'Transferência realizada com sucesso');
        });
    });
});