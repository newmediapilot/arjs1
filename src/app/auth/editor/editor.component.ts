import {Component, OnDestroy} from '@angular/core';
import {Observable, Subscribable, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {UserService} from '../../services/user.service';
import firebase from 'firebase/app';
import {storage} from 'firebase/app';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnDestroy {

  uploadSubscription: Subscription;

  constructor(
    private userService: UserService
  ) {
  }

  ngOnDestroy(): void {
    this.uploadSubscription.unsubscribe();
  }

  convertBlob(fileObject): Observable<any> {
    console.log('convertBlob', fileObject);
    return new Observable(
      (observer) => {
        let fr = new FileReader();
        fr.readAsDataURL(fileObject);
        fr.onload = (e) => {
          console.log('fr.onload');
          observer.next(e.target['result']);
        };
        fr.onerror = (e) => {
          console.log('fr.onerror');
          observer.error(e);
        }
      }
    );
  }

  pushToFirebase(blob: Blob) {
    let store = storage();
    let ref = store.ref();
    let file = blob;
    let metadata = {contentType: 'image/png'};
    let uid = this.userService.uid;
    let date = new Date().getTime();
    let uploadTask = ref.child(`slides/${uid}/${date}`).put(file, metadata);

    uploadTask.on('state_changed', function (snapshot) {
      console.log('progress...');
    }, (error) => {
      // error
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log('File available at', downloadURL);
      });
    });

  }

  uploadImage(data: HTMLInputElement) {
    this.uploadSubscription = this.convertBlob(data.files[0]).pipe(
      take(1)
    ).subscribe((blob) => {
      this.pushToFirebase(blob);
    });
  }

}
