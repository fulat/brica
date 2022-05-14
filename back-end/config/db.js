const { Sequelize } = require("sequelize")

const db = new Sequelize({
    dialect: "postgres",
    database: "social-media",
    username: "brayhandeaza",
    password: "Alicia01"
})

const checkDatabaseConnection = async () => {
    try {
        await db.authenticate()
        db.sync()
        console.log('Connection has been established successfully.')
    } catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = {
    db,
    checkDatabaseConnection
}