import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private showForm: boolean;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    (this.userService.isLoggedIn()) ? this.router.navigate(['auth', 'editor']) : this.showForm = true;
  }

  login() {
    this.userService.login();
  }

}
