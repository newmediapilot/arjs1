import {Injectable} from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {UserService} from '../user.service';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(
    private userService: UserService
  ) {
  }

  save(file: File) {
    console.log('FireStorageService.save', file);
    return fromPromise(
      firebase.storage().ref().child(this.uploadTo).put(file, {contentType: 'image/png'})
    ).pipe(
      catchError((e) => {
        throw new Error(e)
      })
    );
  }

  delete(path) {
    console.log('FireStorageService.delete', path);
    return fromPromise(
      firebase.storage().ref().child(path).delete()
    ).pipe(
      catchError((e) => {
        throw new Error(e)
      })
    );
  }

  private get uploadTo() {
    let uid = this.userService.uid;
    let time = new Date().getTime();
    return `slides/${uid}/${time}`;
  }

}
