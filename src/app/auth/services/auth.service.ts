import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  authState,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  email: string | null = '';
  constructor(private auth: Auth) {}

  login() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  authState() {
    return authState(this.auth);
  }

  logout() {
    return signOut(this.auth);
  }
}
