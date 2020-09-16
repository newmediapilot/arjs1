import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {ImageService} from '../services/image.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  loading: boolean = false;
  list = this.imageService.list();

  constructor(
    private userService: UserService,
    private imageService: ImageService) {
  }

  ngOnInit(): void {

  }

  delete(item) {
    if (!confirm('delete?')) return;
    this.imageService.delete(item);
  }

  upload(file: HTMLInputElement) {
    this.loading = true;
    this.imageService.upload(file.files[0]).subscribe(() => {
      this.loading = false;
    })
  }


}
