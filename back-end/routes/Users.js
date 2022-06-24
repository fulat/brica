const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, User, GetOneWithFilter, GetOneWithParam } = require("../auth/routesMaker")
const { Users, Posts, UsersFollowers } = require("../models")
const joi = require("joi")
const { verifyTokenAuth } = require("../auth")
const { Op } = require('sequelize')


// User Schema
const UsersSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    uuid: joi.string().required(),
    username: joi.string().required(),
    image: joi.string().required(),
})

// Get all users
router.get("/", async (req, res) => {
    // GetAll(req, res, Users)
    await Users.findAll({
        include: Posts
    }).then((users) => {
        res.json(users)
    })
})

// Get one user by id
router.get("/search", (req, res) => {
    GetOneWithFilter(req, res, Users)
})

// Get one user by id
router.get("/:id", verifyTokenAuth, (req, res) => {
    GetOne(req, res, Users)
})

// Get one user by uuid
router.get("/f/:id", (req, res) => {
    GetOneWithParam(req, res, Users, "uuid")
})

// Get one user by id
router.get("/q/:id", verifyTokenAuth, (req, res) => {
    GetOneWithParam(req, res, Users, "username")
})

// Create single user
router.post("/", (req, res, next) => { User.Post(req, res, next, Users, UsersSchema) }, async (req, res) => {
    if (!req.user.error) await UsersFollowers.create({ fallower: req.user.user.id, userId: req.user.user.id })

    res.json({
        user: req.user
    })
})


// Update single user
router.patch("/:id", verifyTokenAuth, (req, res) => {
    User.Patch(req, res, Users)
})

// Update single user
router.patch("/:id", verifyTokenAuth, (req, res) => {
    User.Patch(req, res, Users)
})


// Delete single user
router.delete("/:id", verifyTokenAuth, (req, res) => {
    DeleteOne(req, res, Users)
})


// Unfollow single user
router.delete("/:userId/following/:followingId", async (req, res) => {
    await UsersFollowers.findOne({
        where: {
            [Op.and]: [
                { fallower: req.params.userId },
                { userId: req.params.followingId },
            ]
        }
    }).then((fallower) => {
        fallower.destroy().then(() => {
            res.json({
                status: 400,
                error: false,
                message: "This row does not exist in this table"
            })
        }).catch((err) => {
            res.json({
                error: true,
                message: err.toString()
            })
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: "This row does not exist in this table"
        })
    })
})

module.exports = router