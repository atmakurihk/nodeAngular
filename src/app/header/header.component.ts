import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  constructor(private authService:AuthService){}
  userIsAuthenticated = false;
  private authListnerSub :Subscription;
  ngOnInit()
  {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListnerSub = this.authService.getAuthStatusLister().subscribe((status) =>
    {
      this.userIsAuthenticated = status;
    })

  }
  onLogout()
  {
    this.authService.logout();
  }
  ngOnDestroy()
  {
    this.authListnerSub.unsubscribe();
  }
}
