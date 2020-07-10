import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub:Subscription;
  isAuthenticated=false;
  constructor(public postsService: PostsService,private authservice:AuthService) {}

  userId:string;
  isLoading=false;
  totalPosts=0;
  postsPerPgae=2;
  currentPage =1;
  pageSizeOptions=[1,2,5,10];
  ngOnInit() {
    this.userId = this.authservice.getUserId();
    this.isLoading=true;
    this.postsService.getPosts(this.postsPerPgae,this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData:{posts:Post[],postCount:number}) => {
        this.isLoading=false;
        this.posts = postData.posts;
        this.totalPosts= postData.postCount;
      });
      this.isAuthenticated = this.authservice.getIsAuth();

      this.authStatusSub = this.authservice.getAuthStatusLister().subscribe(
        (status) =>
        {
          this.isAuthenticated= status;
          this.userId = this.authservice.getUserId();
        }
      )
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();

  }

  onDelete(id:string)
  {
    this.postsService.deletePost(id).subscribe(
      () =>
      {
        this.isLoading=true;
        this.postsService.getPosts(this.postsPerPgae,this.currentPage)
      }
    ,() =>{
      this.isLoading=false
    });
  }
  onChangedPage(event:PageEvent)
  {
    this.isLoading=true;
    this.currentPage = event.pageIndex+1;
    this.postsPerPgae = event.pageSize;
    console.log("pageEvent",event);
    this.postsService.getPosts(this.postsPerPgae,this.currentPage);
  }
}
