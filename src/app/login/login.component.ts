import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase} from '@angular/fire/database';
import * as firebase from 'firebase/app';
import _ from "lodash";
import {UserService} from '../services/user.service';
import {catchError, take} from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private authProvider: any;
  private userFetching: boolean = true;
  public error: any;

  constructor(
    private uService: UserService,
    private aRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userFetching = true;

    this.uService.verifyLogin().pipe(
      take(1)
    ).subscribe((loggedIn) => {
      if (loggedIn)
        this.router.navigate(['auth', 'editor']);
      else
        this.userFetching = false;
    })
  }

  login() {
    this.uService.loginRedirect();
  }

}
