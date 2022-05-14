const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, GetCommentsWithFilter, Post, Patch, GetAllWithFilterWithInclude } = require("../auth/routesMaker")
const { Users, CommentLikes, Comments, Reply } = require("../models")
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

module.exports = router