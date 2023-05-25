import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagineAlertController } from 'src/app/library/components/imagine-alert/services/imagine-alert-controller.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'imagine-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private alertController: ImagineAlertController,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Login
   */
  login() {
    this.router.navigateByUrl('/docs/forms');
    // this.authService
    //   .login()
    //   .then(async (resp) => {
    //     if (!resp.user.email?.includes('@imagineapps.co')) {
    //       this.alertController.handleError({
    //         msg: 'Email address is not from imagine apps.',
    //       });
    //       await this.authService.logout();
    //     } else {
    //     }
    //   })
    //   .catch(() => {
    //     this.alertController.handleError({
    //       msg: 'Invalid credentials, please try again.',
    //     });
    //   });
  }
}
