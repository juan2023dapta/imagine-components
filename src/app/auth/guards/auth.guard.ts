import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private authService:AuthService, private router:Router) {

  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handleAuth();
  }
  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.handleAuth();
  }
  handleAuth(){
    //Observable, pasa por tuberia(pipe), map, mapear los datos 
    return this.authService.authState().pipe(map(resp => {
      if(!resp) {
        //Significa que no esta autenticado
        this.router.navigateByUrl('/auth/login');
        return false;
      }else {
        this.authService.email = resp.email;
        return true;
      }
    }));
    
  } 
}
