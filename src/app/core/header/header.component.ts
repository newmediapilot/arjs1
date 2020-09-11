import {Component} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  user;

  constructor(
    private uService: UserService,
    private aRoute: ActivatedRoute,
    private router: Router) {
    //this.user = uService.userObject;
  }

  logout() {
    this.uService.logout().pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['login']);
      });
  }

}
