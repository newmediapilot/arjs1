import {Injectable} from '@angular/core';
import {UserService} from './user.service';
import {FireStorageService} from './core/fire-storage.service';
import {map, switchMap} from 'rxjs/operators';
import {FireDbService} from './core/fire-db.service';
import {DatabaseImage} from '../interfaces/database-image';
import {fromPromise} from 'rxjs/internal-compatibility';

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

  pushDB(result) {
    return fromPromise(result.ref.getDownloadURL())
      .pipe(map((downloadURL: string) => {
          let data: DatabaseImage = {
            path: result.metadata.fullPath,
            createdAt: new Date().getTime(),
            url: downloadURL
          };
          return data;
        }),
        switchMap((data) => this.fireDatabase.push(`images/${this.uid}`, data))
      );
  }

  upload(payload) {
    return this.fireStorage
      .save(payload)
      .pipe(
        switchMap((result) => this.pushDB(result))
      );
  }

  delete(item) {
    let imagePath = item.path;
    let databasePath = `images/${this.uid}/${item.key}`;

    return this.fireStorage
      .delete(imagePath)
      .pipe(
        switchMap(() => this.fireDatabase.remove(databasePath))
      )
  }

}
