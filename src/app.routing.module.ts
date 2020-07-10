import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import { PostListComponent } from './app/posts/post-list/post-list.component'
import { PostCreateComponent } from './app/posts/post-create/post-create.component'
import { AuthGuard } from './app/auth/auth.guard'
import { LoginComponent } from './app/auth/login/login.component'
import { SignupComponent } from './app/auth/signup/signup.component'

const routes:Routes =[
{path:'',component:PostListComponent},
{path:'create',component:PostCreateComponent,canActivate:[AuthGuard]},
{path:'edit/:postId',component:PostCreateComponent,canActivate:[AuthGuard]},
{path:'login',component:LoginComponent},
{path:'signUp',component:SignupComponent}
/* {path:'auth',loadChildren:() => import('./app/auth/auth.module').then( m => m.AuthModule)} */

]
@NgModule({
imports:[
  RouterModule.forRoot(routes)
],
exports:[RouterModule],
providers:[AuthGuard]
})
export class AppRoutingModule
{

}
