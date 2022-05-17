const Sequelize = require("sequelize")
const { db } = require("../config/db")

module.exports = db.define("comments", {
    body: {
        type: Sequelize.STRING,
        allowNull: true
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

