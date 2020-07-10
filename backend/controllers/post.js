const Post = require('../models/post');
exports.createPost =(req, res, next) => {
  const url = req.protocol + '://'+ req.get('host');
  const post =  new Post({
    title:req.body.title,
    content:req.body.content,
    imagePath:url+"/images/"+req.file.filename,
    creator:req.userData.userId
  })
  console.log(post);
  post.save().then(
    (createdPost) =>
    {
      console.log("result of saving post"+createdPost);
      res.status(201).json({
        message: 'Post added successfully',
        post:{
          ...createdPost,
          id:createdPost._id,
        }
      });
 }
  ).catch(
    error =>{
      res.status(500).json({
        message:"creating post failed"
      })
    }
  );
}

exports.updatePost = (req,res,next) =>
{
  let imagePath;
 if(req.file)
 {
  const url = req.protocol + '://'+ req.get('host');
  imagePath =url+"/images/"+req.file.filename
 }else{
   imagePath=req.body.imagePath;
 }

  const post = new Post({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath:imagePath,
    creator:req.userData.userId
  })
  Post.updateOne({_id:req.params.id,creator:req.userData.userId},post).then(
    (result) =>
    {
     if(result.n >0)
     {
      res.status(200).json({
        message:'post updated successfully'
      })
     }else{
      res.status(401).json({
        message:'Not Authorized!!'
      })
     }

    }
  ).catch(error=>
    {
      res.status(500).json({
        message:"could'nt updated post"
      })
    });
}

exports.getAllPosts =(req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage=+req.query.page;
  let fetchedPosts ;
  const postQuery=Post.find();
  if(pageSize && currentPage)
  {
    postQuery.skip( pageSize * (currentPage-1))
    .limit(pageSize);

  }
  postQuery
  .then(documents =>
    {
      fetchedPosts =documents;
      return Post.count();

    })
  .then(count =>{
    console.log(count);
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts:count
    });
  }).catch(error =>
    res.status(500).json({
      message:"fetching posts failed"
    }));

}

exports.getOnePost = (req,res,next)=>
{
  Post.findById(req.params.id).then(
    (post)=>
    {
      if(post)
      {
        res.status(200).json(post);

      }else{
        res.status(404).json({
          message:"post not found"
        })
      }
    }
  ).catch(error =>
    res.status(500).json({
      message:"fetching post failed"
    }));
}

exports.deletePost =(req,res,next)=>
{
  console.log(req.params.id);
  Post.deleteOne({_id:req.params.id,creator:req.userData.userId}).then((result)=>
  {
  if(result.n >0)
  {
    res.status(200).json({
      message: "Posts Deleted",

    });
  }else{
    res.status(401).json({
      message: "Not Authorized",

    });
  }

  }).catch(error =>
    res.status(500).json({
      message:"Post not found"
    }));

}
