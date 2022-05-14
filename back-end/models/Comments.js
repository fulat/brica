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
    parentId: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

