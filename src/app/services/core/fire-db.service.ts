import {Injectable} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireDbService {

  constructor(private db: AngularFireDatabase) {
  }

  list(path) {
    return this.db.list(path)
      .snapshotChanges()
      .pipe(
        map((list) => {
          return list.map(item => ({key: item.key, ...item.payload.val()}))
        })
      );
  }

  set(path, data){
    return fromPromise(this.db.object(path).set(data));
  }

  push(path, data) {
    return fromPromise(this.db.list(path).push(data));
  }

  remove(path) {
    return fromPromise(this.db.object(path).remove());
  }

}



