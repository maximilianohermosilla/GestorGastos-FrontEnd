import { Injectable } from '@angular/core';

const TOKEN_KEY = "AuthToken";
const USERNAME_KEY = "AuthUserName";
const USERNAME_ID = "AuthUserId";
const AUTHORITIES_KEY = "AuthAuthorities";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  perfil: string = "";

  constructor() { }

  public setToken(token: string): void{
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public setUserName(userName: string): void{
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, userName);
  }

  public setUserId(userId: string): void{
    window.localStorage.removeItem(USERNAME_ID);
    window.localStorage.setItem(USERNAME_ID, userId);
  }

  public setAuthorities(authorities: string): void{
    window.localStorage.removeItem(AUTHORITIES_KEY);
    window.localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getToken(): string | null{
    return localStorage.getItem(TOKEN_KEY);
  }

  public getUserName(): string{
    return localStorage.getItem(USERNAME_KEY)!;
  }

  public getUserId(): string{
    return localStorage.getItem(USERNAME_ID)!;
  }

  /*public getAuthoritiesMultiple(): string[]{
    this.perfiles = [];
    if (localStorage.getItem(AUTHORITIES_KEY)){
      JSON.parse(localStorage.getItem(AUTHORITIES_KEY)!).forEach( (authority: { authority: string; }) => {
        this.perfiles.push(authority.authority);
      });
    }
    return this.perfiles;    
  }  */
  
  public getAuthorities(): string{
    this.perfil = "";
    //console.log(localStorage.getItem(AUTHORITIES_KEY));
    if (localStorage.getItem(AUTHORITIES_KEY) != undefined)
    {      
      this.perfil = JSON.parse(localStorage.getItem(AUTHORITIES_KEY)!)
    }    
    return this.perfil;    
  }    

    public logOut(): void {
      window.localStorage.clear();
    }
}
