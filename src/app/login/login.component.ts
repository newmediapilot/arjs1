import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../services/user.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private hideForm: boolean = true;
  public error: any;

  constructor(
    private uService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.hideForm = true;
    this.testLoginStatus();
  }

  testLoginStatus() {
    this.uService.isLoggedIn()
      .pipe(take(1))
      .subscribe((isLoggedIn) => {
        if (isLoggedIn)
          this.router.navigate(['auth', 'editor']);
        else
          this.showForm();
      });
  }

  showForm(){
    this.hideForm = false;
  }

  login() {
    this.uService.login();
  }

}
