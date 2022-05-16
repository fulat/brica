const router = require("express").Router()
const { GetAll, GetOne, DeleteOne, GetCommentsWithFilter, Post, Patch, GetAllWithFilterWithInclude } = require("../auth/routesMaker")
const { Users, CommentLikes, Comments, Reply, Likes, ReplyLikes } = require("../models")
const joi = require("joi")
const { db } = require("../config/db")
const ReplyOfReply = require("../models/ReplyOfReply")

// Comments Schema
const CommentsSchema = joi.object({
    body: joi.string().required().allow(null),
    imageUrl: joi.string().required().allow(null),
    userId: joi.number().required(),
    postId: joi.number().required(),
    parentId: joi.number().required().allow(null),
})

router.get("/get-all", async (req, res) => {
    await db.query(`
    WITH GetComment AS (
        SELECT * FROM posts 
        FULL OUTER JOIN comments ON posts.id = comments.post_id
    )
    SELECT * FROM GetComment;
    `).then((comment) => {
        res.json({
            comment
        })
    })
})

router.get("/", (req, res) => {
    GetAll(req, res, Comments)
})
router.get("/count/:id", async (req, res) => {
    await Comments.findAndCountAll({
        where: {
            postId: req.params.id
        }
    }).then((count) => {
        res.send(count)
    })
})

router.get("/post/:id", async (req, res) => {
    await Comments.findAndCountAll({
        where: {
            postId: req.params.id,
        },
        order: [['createdAt', 'DESC']],
        limit: req.query.limit,
        include: [
            {
                model: Users,
                attributes: ["id", "image", "firstName", "lastName"]
            },
            {
                model: CommentLikes,
                attributes: ["id"],
                include: {
                    model: Users,
                    attributes: ["id", "image"],
                }
            },
            {
                model: Reply,
                include: [
                    {
                        model: ReplyOfReply
                    },
                    {
                        model: ReplyLikes
                    },
                    {
                        model: Users
                    }
                ]
            }
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
    GetOne(req, res, Comments)
})



router.post("/", (req, res) => {
    CommentsSchema.validateAsync(req.body).then(async (bag) => {
        if (bag) {
            await Comments.create(req.body).then(async (data) => {
                // res.send(data)
                await Comments.findAll({
                    where: {
                        postId: req.body.postId,
                    },
                    include: [
                        {
                            model: Users,
                            attributes: ["id", "image"],
                        },
                        {
                            model: CommentLikes,
                            attributes: ["id"],
                            include: {
                                model: Users,
                                attributes: ["id", "image"],
                            }
                        }
                    ]
                }).then((comments) => {
                    res.json({
                        error: false,
                        comments,
                        action: "create"
                    })
                }).catch((err) => {
                    res.json({
                        error: true,
                        message: err
                    })
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

router.patch("/:id", (req, res) => {
    Patch(req, res, Comments)
})

router.delete("/:id", async (req, res) => {
    await Comments.destroy({
        where: { id: req.params.id },
        include: [
            { model: CommentLikes },
            {
                model: Reply,
                include: { model: ReplyLikes }
            }
        ]
    }).then(async (comment) => {
        
        // if (comment) {
        //     const likesDestoy = await CommentLikes.destroy({ where: { commentId: comment.id } })
        //     const commentDestroy = comment.destroy()

        //     const reply = await Reply.findAll({ where: { commentId: comment.id } })
        //     const replyDestroy = await Reply.destroy({ where: { commentId: comment.id } })
        //     const ReplyLikesDestroy = await ReplyLikes.destroy({ where: { replyId: reply.id } })

        //     Promise.all([ReplyLikesDestroy, likesDestoy, replyDestroy, commentDestroy]).then(() => {
        //         data.destroy().then(async () => {
        res.json({
            auth: true,
            message: "row deleted succefully"
        })
        //         })
        //     }).catch(err => {
        //         res.json({
        //             error: true,
        //             message: err.toString()
        //         })
        //     })
        // } else {
        //     res.json({
        //         auth: false,
        //         message: "row does not exist"
        //     })
        // }

    }).catch((err) => {
        res.json({
            error: true,
            message: err.toString()
        })
    })
})

module.exports = router