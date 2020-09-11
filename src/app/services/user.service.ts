import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {auth} from 'firebase/app';
import * as _ from 'lodash';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable, of} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user;

  constructor(private auth: AngularFireAuth,
              private db: AngularFireDatabase) {
  }

  login() {
    localStorage.setItem('signInWithRedirect', '1');
    return fromPromise(
      this.auth.signInWithRedirect(new auth.GoogleAuthProvider())
    );
  }

  logout() {
    localStorage.setItem('user', null);
    localStorage.setItem('signInWithRedirect', null);
    this.user = null;
    return fromPromise(this.auth.signOut());
  }

  isLoggedIn() {
    return !!this.getStoredUser();
  }

  initializeSession() {
    let signInWithRedirect = JSON.parse(localStorage.getItem('signInWithRedirect'));
    if (!!signInWithRedirect) {
      console.log('initializeSession::full');
      localStorage.setItem('signInWithRedirect', null);
      return this.getAuthResult().pipe
      (
        map(this.extractUser),
        tap((mapped) => this.storeUserLocally(mapped)),
        switchMap((picked) => (picked) ? this.saveUserDB(picked) : of(false)),
      );
    } else {
      console.log('initializeSession::quick');
      return of(this.isLoggedIn());
    }
  }

  protected storeUserLocally(user) {
    this.user = user;

    localStorage.setItem('user', JSON.stringify(user))
  }

  protected getStoredUser() {
    if (!this.user) this.user = JSON.parse(localStorage.getItem('user'));
    console.log('this.user', this.user);
    return this.user;
  }

  protected extractUser(result) {
    let {user} = result;
    if (user)
      return {updatedAt: new Date().getTime(), ..._.pick(user, 'email', 'uid')};
    else
      return null;
  }

  private getAuthResult() {
    return fromPromise(this.auth.getRedirectResult());
  }

  private saveUserDB(user) {
    return new Observable((observer) => {
      this.db.object(`users/${user.uid}`).set(user).then((result) => {
        observer.next(true);
      }).catch((error) => {
        // todo: add handling for errors
        observer.error(error);
      })
    });
  }

}
