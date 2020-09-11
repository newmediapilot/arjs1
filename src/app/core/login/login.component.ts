import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showForm: boolean;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initializeSession();
  }

  initializeSession() {
    this.userService.initializeSession()
      .pipe(take(1))
      .subscribe((inited) => {
        console.log('inited', inited);
        if (inited) {
          this.router.navigate(['auth', 'editor']);
        } else {
          this.showForm = true;
        }
      });
  }

  login() {
    this.userService.login();
  }

}
