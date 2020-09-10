import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import { auth } from 'firebase/app';
import * as _ from 'lodash';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  static isLoggedIn: boolean;

  constructor(private auth: AngularFireAuth,
              private db: AngularFireDatabase) {
  }

  loginRedirect() {
    return fromPromise(
      this.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    );
  }

  logout() {
    UserService.isLoggedIn = false;
    return of(true);
  }

  verifyLogin() {
    return new Observable((observer) => {
      this.auth.getRedirectResult().then((result) => {
        if (result) {
          let user = _.pick(result.user, 'uid', 'email');
          this.db.object(`users/${user.uid}`).set(user);
          UserService.isLoggedIn = true;
          observer.next(true);
        } else {
          observer.next(false);
        }
      });
    });
  }

}
