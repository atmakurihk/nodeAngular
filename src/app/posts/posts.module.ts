import { NgModule } from "@angular/core";
import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app.material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
declarations:[
  PostCreateComponent,
  PostListComponent,
],
imports:[
  CommonModule,
  ReactiveFormsModule,
  MaterialModule,
RouterModule
]
})
export class PostModule{

}
