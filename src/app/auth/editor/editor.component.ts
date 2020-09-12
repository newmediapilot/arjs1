import {Component, OnDestroy} from '@angular/core';
import {UserService} from '../../services/user.service';
import {storage} from 'firebase/app';
import {Observable} from 'rxjs';
import {switchMap, take} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnDestroy {

  constructor(
    private userService: UserService,
    private db: AngularFireDatabase) {
  }

  ngOnDestroy(): void {
    //
  }

  saveToDb(data) {
    return fromPromise(this.db.list(`images/${data.uid}`).push(data));
  }

  saveToFirebase(file: File) {
    return new Observable((observer) => {

      let ref = storage().ref();
      let uid = this.userService.uid;
      let timestamp = new Date().getTime();
      let metadata = {contentType: 'image/png'};
      let path = `slides/${uid}/${timestamp}`;

      let uploadTask = ref.child(path).put(file, metadata);

      uploadTask.on('state_changed',
        (progress) => null,
        (error) => observer.error,
        () => uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          observer.next(
            {
              uid: uid,
              createdAt: timestamp,
              path: path,
              url: url
            }
          )
        })
      );

    });
  }

  uploadImage(data: HTMLInputElement) {
    let file = data.files[0];
    return this.saveToFirebase(file).pipe(
      switchMap((data) => this.saveToDb(data)),
      take(1),
    ).subscribe();
  }

}
