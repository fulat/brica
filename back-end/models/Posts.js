const Sequelize = require("sequelize")
const { db } = require("../config/db")

module.exports = db.define("posts", {
    body: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    }
})

