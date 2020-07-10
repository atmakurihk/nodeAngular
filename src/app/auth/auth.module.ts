import { NgModule } from "@angular/core";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { MaterialModule } from "src/app.material.module";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations:[
    SignupComponent,
    LoginComponent
  ],
  imports:[
    MaterialModule,
    CommonModule,
    FormsModule,

  ]
})
export class AuthModule{

}
