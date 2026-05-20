import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithCredential, GoogleAuthProvider, User, getRedirectResult, signInWithRedirect, UserCredential, signInWithPopup } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private loading$ = new BehaviorSubject<boolean>(false);

  constructor(private auth: Auth) {
    // Initialize Google Auth for Capacitor
    if (Capacitor.isNativePlatform()) {
      GoogleAuth.initialize({
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    }

    // Initialize auth state listener through AngularFire authState observable
    authState(this.auth).subscribe((user) => {
      console.log('Auth state changed:', user);
      if (user) {
        console.log('User displayName:', user.displayName);
        console.log('User photoURL:', user.photoURL);
        console.log('User providerData:', user.providerData);
      }
      this.user$.next(user);
      this.loading$.next(false); // Ensure loading is false when auth state is determined
    });

    // Check for redirect result (for OAuth flows)
    getRedirectResult(this.auth)
      .then((result: UserCredential | null) => {
        if (result?.user) {
          console.log('Redirect result user:', result.user);
          // Force reload user data after redirect
          return result.user.reload().then(() => {
            console.log('After redirect reload - displayName:', result.user.displayName);
            console.log('After redirect reload - photoURL:', result.user.photoURL);
            this.user$.next(result.user);
          });
        }
        return Promise.resolve();
      })
      .catch((error: any) => {
        console.error('Firebase redirect result error:', error);
        this.loading$.next(false);
      });
  }

  signUp(email: string, password: string): Promise<any> {
    this.loading$.next(true);
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.user$.next(result.user);
        return result;
      })
      .catch((error) => {
        this.handleError(error);
        throw error;
      })
      .finally(() => {
        this.loading$.next(false);
      });
  }

  signIn(email: string, password: string): Promise<any> {
    this.loading$.next(true);
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((result) => {
        this.user$.next(result.user);
        return result;
      })
      .catch((error) => {
        this.handleError(error);
        throw error;
      })
      .finally(() => {
        this.loading$.next(false);
      });
  }

  signInWithGoogle(): Promise<any> {
    this.loading$.next(true);

    const finalize = () => {
      this.loading$.next(false);
    };

    if (Capacitor.isNativePlatform()) {
      const clientId = environment.googleClientId;

      if (!clientId) {
        const error = new Error('Google Native Client ID não configurado. Verifique environment.ts.');
        console.error(error.message);
        this.loading$.next(false);
        return Promise.reject(error);
      }

      GoogleAuth.initialize({
        clientId,
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });

      return GoogleAuth.signIn()
        .then((result: any) => {
          console.log('Capacitor Google sign in result:', result);
          const idToken = result?.authentication?.idToken || result?.idToken;
          if (!idToken) {
            throw new Error('Não foi possível obter o token do Google.');
          }
          const credential = GoogleAuthProvider.credential(idToken);
          return signInWithCredential(this.auth, credential);
        })
        .then((firebaseResult) => {
          console.log('Firebase sign in result:', firebaseResult);
          this.user$.next(firebaseResult.user);
          return firebaseResult;
        })
        .catch((error) => {
          console.error('Capacitor Google Auth error:', error);
          this.handleError(error);
          throw error;
        })
        .finally(finalize);
    }

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    return signInWithPopup(this.auth, provider)
      .then((result: UserCredential) => {
        console.log('Google sign in result:', result);
        this.user$.next(result.user);
        return result;
      })
      .catch((error: any) => {
        console.error('Firebase popup error:', error);
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/operation-not-supported-in-this-environment') {
          return signInWithRedirect(this.auth, provider);
        }
        this.handleError(error);
        throw error;
      })
      .finally(finalize);
  }

  logout(): Promise<void> {
    this.loading$.next(true);
    return signOut(this.auth)
      .then(() => {
        this.user$.next(null);
      })
      .finally(() => {
        this.loading$.next(false);
      });
  }

  getUser(): Observable<User | null> {
    return this.user$.asObservable();
  }

  getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      map(user => !!user)
    );
  }

  private handleError(error: any): void {
    let errorMessage = 'An error occurred';
    
    if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Use at least 6 characters.';
    } else if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email is already in use.';
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      errorMessage = 'Invalid email or password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Essa operação não está habilitada no Firebase Authentication. Ative o provedor na console do Firebase.';
    }
    
    console.error(errorMessage, error);
  }
}
