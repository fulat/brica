const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, User, GetOneWithFilter, GetOneWithParam } = require("../auth/routesMaker")
const { Users, Posts } = require("../models")
const joi = require("joi")
const { verifyTokenAuth } = require("../auth")


// User Schema
const UsersSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    uuid: joi.string().required(),
    username: joi.string().required(),
    image: joi.string().required(),
})

// Get all users
router.get("/", verifyTokenAuth, async (req, res) => {
    // GetAll(req, res, Users)
    await Users.findAll({
        include: Posts
    }).then((users) => {
        res.json(users)
    })
})

// Get one user by id
router.get("/search", verifyTokenAuth, (req, res) => {
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
router.post("/", (req, res) => {
    User.Post(req, res, Users, UsersSchema)
})


// Update single user
router.patch("/:id", verifyTokenAuth, (req, res) => {
    User.Patch(req, res, Users)
})

// Delete single user
router.delete("/:id", verifyTokenAuth, (req, res) => {
    DeleteOne(req, res, Users)
})

module.exports = router