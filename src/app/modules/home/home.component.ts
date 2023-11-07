import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public loginCard = true;

  public loginForm = this.formBuilder.group({
    'email': ['', Validators.required],
    'password': ['', Validators.required]
  });

  public signUpForm = this.formBuilder.group({
    'name': ['', Validators.required],
    'email': ['', Validators.required],
    'password': ['', Validators.required]
  });

  constructor(private formBuilder: FormBuilder) { }

  public onSubmitLoginForm(): void {
    console.log('DADOS DO FORMULÁRIO DE LOGIN: ', this.loginForm.value);
  }

  public onSubmitSignUpForm(): void {
    console.log('DADOS DO FORMULÁRIO DE CADASTRO: ', this.signUpForm.value);
  }
}
