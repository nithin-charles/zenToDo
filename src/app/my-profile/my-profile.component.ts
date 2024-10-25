import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'zen-to-do-my-profile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  user$: Observable<firebase.User | null>;
  name?: string | null;
  profileImg?: string | null;
  isPotrait: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private route: Router,
    private responsive: BreakpointObserver
  ) {
    this.user$ = this.auth.user;
  }

  ngOnInit(): void {
    this.responsive
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.TabletPortrait,
        Breakpoints.WebPortrait,
      ])
      .subscribe((result) => {
        if (result.matches) {
          this.isPotrait = true;
          console.log('This is phone in Landscape Mode');
        } else {
          this.isPotrait = false;
        }
      });

    this.user$.subscribe((user) => {
      this.name = user?.displayName;
      this.profileImg = user?.photoURL;
      if (user?.displayName == undefined) {
        this.name = 'Guest';
      }
    });
  }

  goToDashBoard() {
    this.route.navigate(['/dashboard']);
  }

  public logout() {
    this.auth.signOut().then((result) => {
      this.route.navigate(['/login']);
    });
  }
}
