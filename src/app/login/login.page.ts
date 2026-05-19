import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem, IonLabel, IonCard, IonSpinner, IonText, AlertController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent,

    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonCard,
    IonSpinner,
    IonText
],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.authService.getLoading().subscribe(loading => {
      this.isLoading = loading;
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      await this.showAlert('Erro', 'Por favor, preencha todos os campos corretamente.');
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.signIn(email, password);
      this.router.navigate(['/home']);
    } catch (error: any) {
      await this.showAlert('Erro de Login', error.message || 'Falha ao fazer login.');
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/home']);
    } catch (error: any) {
      await this.showAlert('Erro de Login', error.message || 'Falha ao fazer login com Google.');
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
