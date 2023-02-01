import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from 'src/app/library/components/alert/services/alert-controller.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'imagine-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Login
   */
  login() {
    this.authService
      .login()
      .then(async (resp) => {
        if (!resp.user.email?.includes('@imagineapps.co')) {
          this.alertController.handleError({
            msg: 'Email address is not from imagine apps.',
          });
          await this.authService.logout();
        } else {
          this.router.navigateByUrl('/docs/forms');
        }
      })
      .catch(() => {
        this.alertController.handleError({
          msg: 'Invalid credentials, please try again.',
        });
      });
  }
}
