import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private authProvider: any;
  private userFetching: boolean = true;
  public error: any;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.auth.getRedirectResult().then(result => {
      const user: firebase.User = result.user;
      if (null === user) {
        this.userFetching = false;
      } else {
        this.db.object('users/' + user.uid).set(user).then(
          () => {
            this.router.navigate(['auth', 'editor']);
          }
        ).catch(error => {
          this.error = error;
        });
      }
    });
  }

  login() {
    this.authProvider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithRedirect(this.authProvider)
      .catch(error => {
        this.error = error;
      });
  }

}
