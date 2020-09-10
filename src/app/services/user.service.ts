import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {auth} from 'firebase/app';
import * as _ from 'lodash';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AngularFireAuth,
              private db: AngularFireDatabase) {
  }

  login() {
    return fromPromise(
      this.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    );
  }

  logout() {
    this.clearLocalUser();
    return fromPromise(this.auth.signOut());
  }

  isLoggedIn() {
    var localUser = this.getLocalUser();
    if (localUser) {
      return of(true);
    } else {
      return this.getAuthResult().pipe
      (
        map((result) => (result.user) ? this.mapUser(result.user) : null),
        tap((mapped) => (mapped) ? this.setLocalUser(mapped) : null),
        switchMap((save) => (save) ? this.setUserDB(save) : of(false))
      );
    }
  }

  private getAuthResult() {
    return fromPromise(this.auth.getRedirectResult());
  }

  protected mapUser(user: firebase.User) {
    return _.pick(user, 'uid', 'email');
  }

  protected clearLocalUser() {
    localStorage.setItem('user', null);
  }

  protected setLocalUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  protected getLocalUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  private setUserDB(user) {
    return new Observable((observer) => {
      this.db.object(`users/${user.uid}`).set(user).then((result) => {
        observer.next(true);
      }).catch((error) => {
        observer.error(error);
      })
    })
  }

}
