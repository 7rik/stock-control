import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public loginCard = true;

  public loginForm = this.formBuilder.group({
    'email':    ['',  Validators.required],
    'password': ['',  Validators.required]
  });

  public signUpForm = this.formBuilder.group({
    'name':     ['',  Validators.required],
    'email':    ['',  Validators.required],
    'password': ['',  Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private CookieService: CookieService
  ) { }

  public onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              this.CookieService.set('USER_INFO', response?.token);
              alert('Usuário logado com sucesso!');
              this.loginForm.reset();
            }
          },
          error: (error) => console.log(error),
        })
    }
  }

  public onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signUpUser(this.signUpForm.value as SignUpUserRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              alert('Usuário teste criado com sucesso!');
              this.signUpForm.reset();
              this.loginCard = true;
            }
          },
          error: (error) => console.log(error),
        });
    }

  }
}
