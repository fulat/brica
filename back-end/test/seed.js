const { faker } = require('@faker-js/faker');
const { Users, Coins } = require('../models')


for (let i = 0; i < 20; i++) {
    Users.create({
        "firstName": faker.name.firstName().toLowerCase(),
        "lastName": faker.name.lastName().toLowerCase(),
        "username": faker.internet.userName().toLowerCase(),
        "email": faker.internet.email().toLowerCase(),
        "password": faker.internet.password(),
        "image": faker.internet.avatar()
    })
}