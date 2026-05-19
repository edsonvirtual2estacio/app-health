import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, from, of } from 'rxjs';
import { map, take, switchMap, first } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      // Wait for Firebase Auth to initialize
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe(); // Unsubscribe after first emission
        if (user) {
          observer.next(true);
        } else {
          this.router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}
