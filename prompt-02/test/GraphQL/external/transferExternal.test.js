const request = require('supertest');
require('dotenv').config();

describe('TransferExternal - GraphQL API', () => {
    describe('POST /transfer', () => {
        let token;

        beforeEach(async () => {
            const responseLogin = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationLogin
                });

            token = responseLogin.body.data.login.token;
        });

        it('Quando informo remetente e destinatário inexistentes recebo um erro', async () => {
            const mutationTransfer = `
                mutation {
                    transfer(from: "vini", to: "lopes", amount: 100) {
                        from
                        to
                        amount
                    }
                }
            `;
            const response = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .set({
                    Authorization: `Bearer ${token}`
                })
                .send({
                    query: mutationTransfer
                });

            expect(response.body.errors[0].message).to.equal('Usuário não encontrado');
            expect(response.body.errors[0].extensions.code).to.equal('INTERNAL_SERVER_ERROR');
        });

        it('Quando tento transferir para o mesmo usuário do remetente recebo um erro', async () => {
            const mutationRegister = `
                mutation {
                    register(username: "vini", password: "123456", favorecido: true, saldo: 1000) {
                        username
                    }
                }
            `;
            const responseRegister = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationRegister
                });

            const username = responseRegister.body.data.register.username;
            const mutationTransfer = `
                mutation {
                    transfer(from: "${username}", to: "${username}", amount: 100) {
                        from
                        to
                        amount
                    }
                }
            `;
            const responseTransfer = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .set({
                    Authorization: `Bearer ${token}`
                })
                .send({
                    query: mutationTransfer
                });

            expect(responseTransfer.body.errors[0].message).to.equal('Não é possível transferir para si mesmo');
            expect(responseTransfer.body.errors[0].extensions.code).to.equal('INTERNAL_SERVER_ERROR');
        });

        it('Quando tento transferir um valor maior que o valor do saldo do remetente recebo um erro', async () => {
            const mutationRegister1 = `
                mutation {
                    register(username: "juca", password: "123456", favorecido: true, saldo: 100) {
                        username
                    }
                }
            `;
            const responseRegister1 = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationRegister1
                });

            const mutationRegister2 = `
                mutation {
                    register(username: "mario", password: "123456", favorecido: true, saldo: 10) {
                        username
                    }
                }
            `;
            const responseRegister2 = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationRegister2
                });

            const fromUsername = responseRegister1.body.data.register.username;
            const toUsername = responseRegister2.body.data.register.username;

            const mutationTransfer = `
                mutation {
                    transfer(from: "${fromUsername}", to: "${toUsername}", amount: 200) {
                        from
                        to
                        amount
                    }
                }
            `;
            const responseTransfer = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .set({
                    Authorization: `Bearer ${token}`
                })
                .send({
                    query: mutationTransfer
                });

            expect(responseTransfer.body.errors[0].message).to.equal('Saldo insuficiente');
            expect(responseTransfer.body.errors[0].extensions.code).to.equal('INTERNAL_SERVER_ERROR');
        });

        it('Quando tento transferir um valor acimar de R$5.000,00 para um não favorecido recebo um erro', async () => {
            const mutationRegister1 = `
                mutation {
                    register(username: "silva", password: "123456", favorecido: true, saldo: 10000) {
                        username
                    }
                }
            `;
            const responseRegister1 = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationRegister1
                });

            const mutationRegister2 = `
                mutation {
                    register(username: "lopes", password: "123456", favorecido: false, saldo: 10000) {
                        username
                    }
                }
            `;
            const responseRegister2 = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationRegister2
                });

            const fromUsername = responseRegister1.body.data.register.username;
            const toUsername = responseRegister2.body.data.register.username;

            const mutationTransfer = `
                mutation {
                    transfer(from: "${fromUsername}", to: "${toUsername}", amount: 5001) {
                        from
                        to
                        amount
                    }
                }
            `;
            const responseTransfer = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .set({
                    Authorization: `Bearer ${token}`
                })
                .send({
                    query: mutationTransfer
                });

            expect(responseTransfer.body.errors[0].message).to.equal('Transferências acima de R$ 5.000,00 só podem ser feitas para favorecidos');
            expect(responseTransfer.body.errors[0].extensions.code).to.equal('INTERNAL_SERVER_ERROR');
        });

        it('Quando tento transferir um valor que o remetente possui na conta para um destinatário válido recebo um sucesso', async () => {
            const mutationRegister1 = `
                mutation {
                    register(username: "josé", password: "123456", favorecido: true, saldo: 2000) {
                        username
                    }
                }
            `;
            const responseRegister1 = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationRegister1
                });

            const mutationRegister2 = `
                mutation {
                    register(username: "deia", password: "123456", favorecido: true, saldo: 3000) {
                        username
                    }
                }
            `;
            const responseRegister2 = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .send({
                    query: mutationRegister2
                });

            const fromUsername = responseRegister1.body.data.register.username;
            const toUsername = responseRegister2.body.data.register.username;

            const responseTransfer = await request(process.env.BASE_URL_GRAPHQL)
                .post('/graphql')
                .set({
                    Authorization: `Bearer ${token}`
                })
                .send({
                    query: mutationTransfer
                });

            expect(responseTransfer.body.data.transfer).to.have.property('from', fromUsername);
            expect(responseTransfer.body.data.transfer).to.have.property('to', toUsername);
            expect(responseTransfer.body.data.transfer).to.have.property('amount', 1000);
        });
    });
});