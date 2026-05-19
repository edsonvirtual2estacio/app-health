import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(
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
        if (!user) {
          observer.next(true);
        } else {
          this.router.navigate(['/home']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}
