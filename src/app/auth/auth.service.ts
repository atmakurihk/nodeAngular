import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import{environment} from "../../environments/environment";

const BACKEND_URL =environment.apiUrl +"user/";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  private token: string;
  isAutheticated = false;
  private tokenTimer: any;
  private authStatusListner = new Subject<boolean>();
  private userId: string;
  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post(BACKEND_URL+"signUp", authData)
      .subscribe((response) => {
        console.log("service response", response);
        this.router.navigate(['/']);
      }, error =>
      {
        console.log("signup error",error);
        this.authStatusListner.next(false);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL+"login",
        authData
      )
      .subscribe((response) => {
        console.log("login response", response);
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          console.log("expires in ", expiresInDuration * 1000);
          this.setAuthTimer(expiresInDuration);
          this.isAutheticated = true;
          this.authStatusListner.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          console.log("expiration date", expirationDate);
          this.saveAuthData(token, expirationDate,this.userId);

          this.router.navigate(["/"]);
        }
      },error =>
      {
        this.authStatusListner.next(false);
      });
  }

  getToken() {
    return this.token;
  }

  getAuthStatusLister() {
    return this.authStatusListner.asObservable();
  }

  getIsAuth() {
    return this.isAutheticated;
  }

  logout() {
    this.token = null;
    this.isAutheticated = false;
    this.authStatusListner.next(false);
    this.userId =null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expirationDate: Date,userId:string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expirationDate.toISOString());
    localStorage.setItem("userId",userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userId")
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAutheticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }
  getUserId()
  {
    return this.userId;
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expirationDate");

    if (!token && !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
  private setAuthTimer(duration: number) {
    console.log("setting timer", duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
