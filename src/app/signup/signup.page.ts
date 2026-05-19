import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonCard, IonSpinner, IonText, IonBackButton, IonButtons, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCard,
    IonSpinner,
    IonText,
    IonBackButton,
    IonButtons,
  ],
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, { validators: this.passwordMatchValidator });

    this.authService.getLoading().subscribe(loading => {
      this.isLoading = loading;
    });
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async signup() {
    if (this.signupForm.invalid) {
      await this.showAlert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { email, password } = this.signupForm.value;

    try {
      await this.authService.signUp(email, password);
      await this.showAlert('Sucesso', 'Conta criada com sucesso!');
      this.router.navigate(['/home']);
    } catch (error: any) {
      await this.showAlert('Erro de Cadastro', error.message || 'Falha ao criar a conta.');
    }
  }

  async signupWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/home']);
    } catch (error: any) {
      await this.showAlert('Erro de Cadastro', error.message || 'Falha ao fazer cadastro com Google.');
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
