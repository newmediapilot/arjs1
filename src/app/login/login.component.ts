import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase/app';
import _ from "lodash";

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
    private aRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.auth.getRedirectResult().then(result => {
      const user: firebase.User = result.user;
      if (null === user) {
        this.userFetching = false;
      } else {
        this.db.object(`users/${user.uid}`).set(
          _.pick(user, 'uid', 'email')
        ).then(() => {
          this.router.navigate(['auth', 'editor']);
        }).catch(error => {
          this.error = error;
          this.userFetching = false;
        });
      }
    });
  }

  login() {
    this.authProvider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithRedirect(this.authProvider)
      .catch(error => {
        this.error = error;
        this.userFetching = false;
      });
  }

}
