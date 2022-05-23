const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, GetCommentsWithFilter, Post, Patch, GetAllWithFilterWithInclude } = require("../auth/routesMaker")
const { Users, CommentLikes, Comments, Reply, ReplyLikes } = require("../models")
const joi = require("joi")
const { db } = require("../config/db")
const ReplyOfReply = require("../models/ReplyOfReply")

// Comments Schema
const ReplySchema = joi.object({
    body: joi.string().required().allow(null),
    imageUrl: joi.string().required().allow(null),
    userId: joi.number().required(),
    commentId: joi.number().required(),
})

router.get("/", async (req, res) => {
    await Reply.findAll().then((replies) => {
        res.json(replies)
    })
})

router.get("/comment/:id", async (req, res) => {
    await Reply.findAll({
        where: {
            commentId: req.params.id
        },
        include: [
            {
                model: ReplyLikes,
                attributes: ["id", "replyId", "userId"]
            },
            {
                model: Users,
                attributes: ["id", "uuid", "username", "image"]
            }
        ]
    }).then((replies) => {
        res.json({
            data: replies,
            error: false
        })
    }).catch((err) => {
        res.json({
            error: true,
            message: err
        })
    })
})


router.post("/", async (req, res) => {
    ReplySchema.validateAsync(req.body).then(async (bag) => {
        if (bag) {
            await Reply.create(req.body).then((replies) => {
                res.json({
                    error: false,
                    replies,
                })
            }).catch((err) => {
                res.json({
                    error: true,
                    message: err
                })
            })
        }
    }).catch((err) => {
        res.send(err)
    })
})


router.post("/:id", async (req, res) => {
    ReplySchema.validateAsync(req.body).then(async () => {
        await ReplyLikes.findOne({
            where: {
                [Op.and]: [
                    { replyId: req.params.id },
                    { userId: req.body.userId }
                ]
            }
        }).then(async (table) => {
            if (table) {
                table.destroy().then(async () => {
                    await ReplyLikes.count({
                        where: {
                            replyId: req.params.id,
                        },
                        order: [['updatedAt', 'DESC']],
                    }).then((count) => {
                        res.json({
                            status: 200,
                            likesCount: count,
                            action: "delete"
                        })
                    })
                }).catch((err) => {
                    res.send("err")
                })
            } else {
                await ReplyLikes.create({
                    replyId: req.params.id,
                    userId: req.body.userId
                }).then(async () => {
                    await ReplyLikes.count({
                        where: {
                            replyId: req.params.id,
                        }
                    }).then((count) => {
                        res.json({
                            status: 200,
                            likesCount: count,
                            action: "create"
                        })
                    })
                })
            }
        }).catch((err) => {
            res.send(err)
        })
    }).catch((err) => {
        res.send(err)
    })
})


module.exports = router