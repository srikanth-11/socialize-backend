const express = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const  authenticate  = require('../services/authentication');
const mongoose = require('mongoose')

const router = express.Router()

router.post('/createpost',authenticate, async (req, res) => {
 try {
  const newPost = new Post({
   content: req.body.content,
   email: req.body.email,
   createdAt: new Date().toISOString()
  });
  const post = await newPost.save();
  res.status(200).json({
   message: "post created successfully"
  })
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
});

router.get('/getposts',authenticate, async(req,res) => {
 try {
  const posts = await Post.find().sort({ createdAt: -1 });
if(posts){
  res.status(200).json({
   posts
  })
 }
 else{
  res.status(400).json({
   message:"there are no posts"
  })
 }
 } catch (error) {
  res.status(400).json({
   message:"Error occured"
  })
 }
})

router.post('/getpost',authenticate, async(req,res) => {
 try {
  const posts = await Post.findOne({_id:req.body.id})
  if(posts){
   res.status(200).json({
    posts
   })
  }
  else{
   res.status(400).json({
    message:"post is not there"
   })
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message:"Error occured"
  })
 }
})

router.delete('/deletepost', authenticate, async (req, res) => {
 try {
  const post = await Post.findOne({ _id: req.body.id })
  const user = await User.findOne({ email: post.email })
  if (post.email === user.email) {
   await post.delete();
  }

  res.status(200).json({
   message: "post deleted successfully"
  })
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "error occured"
  })
 }
});

router.put('/likepost', authenticate,async (req, res) => {
 try {
  console.log("enter")
  const post = await Post.findOne({ _id: req.body.id })
  console.log(post)
  if (post) {
   if (post.likes.find((like) => like.email === req.body.email)) {
    post.likes = post.likes.filter((like) => like.email !== req.body.email)
    res.status(200).json({
      message: "unlike"
     })
   } else {
    post.likes.push({
     email: req.body.email,
     createdAt: new Date().toISOString()
    });
    res.status(200).json({
      message: "like"
     })
}
   await post.save();
   
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message: "Error occured"
  })
 }
})

router.put('/createcomment' ,authenticate, async(req,res) => {
 try {
  const post = await Post.findOne({ _id: req.body.id })

  if (post) {
   post.comments.unshift({
     email:req.body.email,
     content:req.body.content,
     createdAt: new Date().toISOString()
   });
   await post.save();
   res.status(200).json({
    message: "comment created"
   })
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message:"Error occured"
  })
 }
});

router.delete('/deletecomment',authenticate, async(req,res) => {
 try {
  const post = await Post.findOne({ _id:  req.body.id })
  if(post) {
   const commentIndex = post.comments.findIndex((c) => c.id === req.body.commentid);
   if (post.comments[commentIndex].email === req.body.email) {
    post.comments.splice(commentIndex, 1);
    console.log(post)
    await post.save();
    
  }
  res.status(200).json({
   message: "comment deleted"
  })
  }
 } catch (error) {
  console.log(error)
  res.status(400).json({
   message:"error occured"
  })
 }
})

module.exports = router