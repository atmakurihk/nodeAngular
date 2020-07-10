import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {map} from "rxjs/operators"

import { Post } from "./post.model";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import{environment} from "../../environments/environment";

const BACKEND_URL =environment.apiUrl +"posts/";
@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

  constructor(private http: HttpClient,private router:Router,private authService:AuthService) {}

  getPosts(postsPerPage:number,currentPage:number) {
    const queryParams =`?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any ,maxPosts:number}>(
        BACKEND_URL
      )
      .pipe(map((postData) =>
      {
        return {posts:postData.posts.map(post =>{
          return{
            title:post.title,
            content:post.content,
            id:post._id,
            imagePath:post.imagePath,
            creator:post.creator
          }
        }),maxPosts:postData.maxPosts};
      }))
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string,image:File) {
   const postData  = new FormData();
   postData.append('title',title);
   postData.append('content',content);
   postData.append('image',image,title);
    this.http
      .post<{ message: string ,post:Post}>(BACKEND_URL, postData)
      .subscribe(responseData => {
       /*  const post:Post = {id:responseData.post.id,title:title,content:content,imagePath:responseData.post.imagePath}
        console.log(responseData.message);
        post.id=responseData.post.id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); */
        this.router.navigate(['/']);
      });
  }

  deletePost(postId:string)
  {
   return this.http.delete<{ message: string }>(BACKEND_URL+postId)/* .subscribe(
      responseData =>
      {
        const updatedPosts = this.posts.filter(post =>
          {
            post.id !== postId
          })
          console.log('updated posts after delete',updatedPosts);
          this.posts = updatedPosts;
          console.log(' posts after delete', this.posts);
          this.postsUpdated.next([...this.posts]);
          this.router.navigate(['/']);
      }
    ) */
  }
  getPost(id:string)
  {
    return this.http.get<{_id:string,title:string,content:string,imagePath:string,creator:string}>(BACKEND_URL+id);
   /*  return {
      ...this.posts.find(p => p.id === id)
    } */
  }

  updatePost(id:string,title:string,content:string,image:File|string)
  {
let postData: Post |FormData;
 /*
    } */
    if(typeof(image) === 'object')
    {
       postData = new FormData();
       postData.append("id",id);
      postData.append("title",title);
      postData.append("content",content);
      postData.append("image",image,title);
    }else{
       postData  ={
        id:id,
        title:title,
        content:content,
        imagePath:image,
        creator:null
    }
  }

    ///api/posts/:id
    this.http.put(BACKEND_URL+id,postData).subscribe(
      (response) =>
      {
        console.log("updated respnse",response);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id )
        const post:Post ={
          id:id,
          title:title,
          content:content,
          imagePath:"",
          creator:null

        }
       /*  updatedPosts[oldPostIndex]= post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); */
        this.router.navigate(['/']);
      }
    )

  }
}
