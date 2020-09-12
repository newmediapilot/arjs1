import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {storage} from 'firebase/app';
import {Observable} from 'rxjs';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  loading: boolean = false;
  list;
  uid = this.userService.uid;

  constructor(
    private userService: UserService,
    private db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.fetchList();
  }

  fetchList() {
    this.list = this.db.list(`images/${this.uid}`)
      .snapshotChanges()
      .pipe(
        map((list) => {
          return list.map(item => ({key: item.key, ...item.payload.val()}))
        })
      );
  }

  saveToDb(data) {
    return fromPromise(this.db.list(`images/${this.uid}`).push(data));
  }

  deleteSlide(item) {
    if (!confirm('delete?')) return;

    this.db.object(`images/${this.uid}/${item.key}`).remove();

    storage().ref().child(`slides/${this.uid}/${item.createdAt}`).delete();
  }

  saveToFirebase(file: File) {
    return new Observable((observer) => {

      let ref = storage().ref();
      let timestamp = new Date().getTime();
      let metadata = {contentType: 'image/png'};
      let path = `slides/${this.uid}/${timestamp}`;

      let uploadTask = ref.child(path).put(file, metadata);

      uploadTask.on('state_changed',
        (progress) => null,
        (error) => observer.error,
        () => uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          observer.next(
            {
              uid: this.uid,
              createdAt: timestamp,
              path: path,
              url: url,
              marker: 0
            }
          )
        })
      );

    });
  }

  uploadImage(data: HTMLInputElement) {
    let file = data.files[0];
    this.loading = true;
    return this.saveToFirebase(file).pipe(
      switchMap((data) => this.saveToDb(data)),
      take(1),
    ).subscribe(() => {
      this.loading = false;
    });
  }


}
