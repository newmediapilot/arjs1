import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {FireStorageService} from './core/fire-storage.service';
import {mergeMap, take} from 'rxjs/operators';
import {FireDbService} from './core/fire-db.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private uid = this.userService.uid;

  constructor(
    private fireDatabase: FireDbService,
    private fireStorage: FireStorageService,
    private userService: UserService
  ) {
  }

  list() {
    return this.fireDatabase.list(`images/${this.uid}`);
  }

  upload(payload) {
    return this.fireStorage
      .save(payload)
      .pipe(take(1));
  }

  delete(item) {
    console.log('delete', item);

    let imagePath = item.path;
    let databasePath = `images/${this.uid}/${item.key}`;

    return this.fireStorage
      .delete(imagePath)
      .pipe(
        take(1),
        mergeMap(() =>
          this.fireDatabase.remove(databasePath)
        )
      );
  }

}
