import {Injectable} from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {UserService} from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class FireStorageService {

  constructor(
    private userService: UserService
  ) {
  }

  save(file: File) {
    return fromPromise(
      firebase.storage().ref().child(this.uploadTo).put(file, {contentType: 'image/png'})
    );
  }

  delete(path) {
    console.log('fire-storage', path);
    return fromPromise(
      firebase.storage().ref().child(path).delete()
    );
  }

  private get uploadTo() {
    let uid = this.userService.uid;
    let time = new Date().getTime();
    return `slides/${uid}/${time}`;
  }

}
