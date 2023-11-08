import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';

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
    private CookieService: CookieService,
    private MessageService: MessageService
  ) { }

  public onSubmitLoginForm(): void {
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              this.CookieService.set('USER_INFO', response?.token);
              this.loginForm.reset();

              this.MessageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem vindo de volta ${response?.name}!`,
                life: 2000
              });
            }
          },
          error: (error) => {
            this.MessageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao fazer login!`,
              life: 2000
            });
            console.log(error);
          },
        });
    }
  }

  public onSubmitSignUpForm(): void {
    if (this.signUpForm.value && this.signUpForm.valid) {
      this.userService.signUpUser(this.signUpForm.value as SignUpUserRequest)
        .subscribe({
          next: (response) => {
            if (response) {
              this.signUpForm.reset();
              this.loginCard = true;
              this.MessageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário criado com sucesso!',
                life: 2000
              });
            }
          },
          error: (error) => {
            this.MessageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar usuário!',
              life: 2000
            });
            console.log(error);
          }
        });
    }

  }
}
