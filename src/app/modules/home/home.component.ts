import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SignUpUserRequest } from 'src/app/models/interfaces/user/SignUpUserRequest';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/AuthRequest';
import { UserService } from 'src/app/services/user/user.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  public loginCard = true;

  public loginForm = this.formBuilder.group({
    email:       new FormControl({value: '', disabled: false}, [Validators.required]),
    password:    new FormControl({value: '', disabled: false}, [Validators.required])
  });

  public signUpForm = this.formBuilder.group({
    name:        new FormControl({value: '', disabled: false}, [Validators.required]),
    email:       new FormControl({value: '', disabled: false}, [Validators.required]),
    password:    new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private cookieService: CookieService,
    private MessageService: MessageService,
    private router: Router
  ) { }

  public onSubmitLoginForm(): void {
    if (this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
        .subscribe({
          next: (response) => {
            if (response) {
              this.cookieService.set('USER_INFO', response?.token);
              this.loginForm.reset();
              this.router.navigate(['/dashboard']);

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
      .pipe(
        takeUntil(this.destroy$)
      )
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
