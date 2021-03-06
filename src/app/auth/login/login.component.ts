import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit ,OnDestroy{

  constructor(private authService:AuthService) { }

  isLoading=false;
  private authStatusSub:Subscription;

  ngOnInit() {

  this.authStatusSub=  this.authService.getAuthStatusLister().subscribe(
    authStatus =>
    {
      this.isLoading=false;
    }
  )
  }
  onLogin(form:NgForm)
  {
    if(form.invalid)
    {
      return;
    }

    console.log(form.value);

    this.isLoading=true;
    this.authService.loginUser(form.value.email,form.value.password);
  }
  ngOnDestroy()
  {
    this.authStatusSub.unsubscribe();
  }
}
