import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'zen-to-do-login-page',
  standalone: true,
  imports: [MatCardModule, MatDividerModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  /**
   *
   */
  constructor(private auth: AngularFireAuth, private router: Router) {}

  public login() {
    this.auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        this.router.navigate(['/dashboard']);
      });
  }

  public navigateToDshboard() {
    this.router.navigate(['/dashboard']);
  }

  public anonymousLogin() {
    this.auth.signInAnonymously().then((res) => {
      this.router.navigate(['/dashboard']);
    });
  }
}
