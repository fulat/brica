const Users = require("./Users")
const Coins = require("./Coins")
const Posts = require("./Posts")
const Likes = require("./Likes")
const Comments = require("./Comments")
const CommentLikes = require("./CommentLikes")
const UsersFollowers = require("./UsersFollowers")
const Reply = require("./Reply")
const ReplyOfReply = require("./ReplyOfReply")
const ReplyLikes = require("./ReplyLikes")

Posts.belongsTo(Users)
Users.hasMany(Posts)
Users.hasMany(Comments)
Posts.hasMany(Comments)

Users.belongsToMany(Users, {
    through: UsersFollowers,
    as: "fallower",
    foreignKey: "fallower",
})

Users.belongsToMany(Users, {
    through: UsersFollowers,
    as: "fallowing",
    foreignKey: "userId",
})

UsersFollowers.belongsTo(Users)

Comments.belongsTo(Posts)
Comments.belongsTo(Users)

Comments.hasMany(Comments, { as: 'children', foreignKey: 'parentId' });
Comments.belongsTo(Comments, { as: 'parent', foreignKey: 'parentId' });

CommentLikes.belongsTo(Comments)
Comments.hasMany(CommentLikes)
CommentLikes.belongsTo(Users)

Likes.belongsTo(Users)
Users.hasMany(Likes)

Likes.belongsTo(Posts)
Posts.hasMany(Likes)
Posts.hasMany(Likes)

Reply.belongsTo(Comments)
Reply.belongsTo(Users)
Comments.hasMany(Reply)

ReplyLikes.belongsTo(Reply)
Reply.hasMany(ReplyLikes)

ReplyLikes.belongsTo(Users)
Users.hasMany(ReplyLikes)

ReplyOfReply.belongsTo(Reply)
Reply.hasMany(ReplyOfReply)

ReplyOfReply.belongsTo(Users)
Users.hasMany(ReplyOfReply)


module.exports = {
    Users,
    Coins,
    Posts,
    Likes,
    Comments,
    CommentLikes,
    Reply,
    UsersFollowers,
    ReplyLikes
}