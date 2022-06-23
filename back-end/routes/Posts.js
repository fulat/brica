const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, GetPostsWithFilter, Post, Patch } = require("../auth/routesMaker")
const { Posts, Users, Likes, Comments, CommentLikes, UsersFollowers, Reply, ReplyLikes } = require("../models")
const joi = require("joi")
const Sequelize = require("sequelize")
const jwt = require('jsonwebtoken')

router.get('/show', async (req, res) => {
    await Posts.findAll({
        limit: 5,
        include: {
            raw: true,
            model: Comments,
        }
    }).then(async (comments) => {
        res.json(comments)
    })
})

router.get("/followers/:id", async (req, res) => {
    await UsersFollowers.findAll({
        where: {
            fallower: req.params.id
        },
        attributes: ["fallower", "userId"],
        limit: 25,
        include: {
            model: Users,
            attributes: ["uuid", "id", "image"],
            include: {
                model: Posts,
                where: { hidden: false },
                include: [
                    {
                        model: Likes,
                        attributes: ['id', "userId"],
                    },
                    {
                        model: Users,
                        order: [['createdAt', 'DESC']],
                        attributes: ["id", "image", "firstName", "lastName"],
                    }
                ]
            }
        }
    }).then(async (data) => {
        res.json({
            data,
            error: false,
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err
        })
    })
})

// Posts Schema
const PostSchema = joi.object({
    body: joi.string().required().allow(null),
    imageUrl: joi.string().required().allow(null),
})

router.get("/", (req, res) => {
    GetAll(req, res, Posts)
})

router.get("/user/:id", async (req, res) => {
    await Posts.findAll({
        where: {
            userId: req.params.id
        },
        order: [['updatedAt', 'DESC']],
        limit: 25,
        include: [
            {
                model: Users,
                attributes: ['id', "image"]
            },
            {
                model: Comments,
                // order: [['id', 'DESC']],
                // attributes: {
                //     include: [[Sequelize.fn("COUNT", Sequelize.col("comments.id")), "commentCount"]]
                // },

                include: [
                    {
                        model: Users,
                        order: [['updatedAt', 'DESC']],
                        attributes: ["id", "image"],
                    },
                    {
                        model: CommentLikes,
                        attributes: ["id"],
                        order: [['updatedAt', 'DESC']],
                        include: {
                            model: Users,
                            attributes: ["id", "image"],
                        }
                    }
                ]

            },
            {
                model: Likes,
                attributes: ['id', "userId"],
                order: [['updatedAt', 'DESC']],
            },
        ]
    }).then((data) => {
        res.json({
            data,
            error: false,
            search: req.headers["type"]
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err
        })
    })
})

router.get("/:id", (req, res) => {
    GetOne(req, res, Posts)
})

router.post("/:uuid", async (req, res) => {
    await Users.findOne({
        where: { uuid: req.params.uuid }
    }).then(async (user) => {
        if (user) {
            await Posts.create({
                body: req.body.body,
                userId: user.id,
                imageUrl: req.body.imageUrl,
                privacy: req.body.privacy
            }).then((data) => {
                res.json({
                    status: 200,
                    error: false,
                    data
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err
                })
            })
        } else {
            res.send("bad")
        }
    })
})

router.patch("/:id", (req, res) => {
    Patch(req, res, Posts)
})

router.delete("/:id", async (req, res) => {
    await Posts.findOne({
        where: { id: req.params.id }
    }).then(async (data) => {
        if (data) {

            const comments = await Comments.destroy({
                where: { postId: req.params.id }
            })
            const likes = await Likes.destroy({
                where: { postId: req.params.id }
            })
            Promise.all([comments, likes]).then(() => {
                data.destroy().then(async () => {
                    res.json({
                        auth: true,
                        message: "row deleted succefully"
                    })
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err
                })
            })

        } else {
            res.json({
                auth: false,
                message: "row does not exist"
            })
        }
    }).catch((err) => {
        res.json({
            error: true,
            message: err
        })
    })
})


router.patch("/delete/:id", async (req, res) => {
    await Posts.findByPk(req.params.id).then(async post => {
        post.update({

        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
})

module.exports = router