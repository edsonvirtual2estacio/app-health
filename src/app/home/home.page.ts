import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';
import { addIcons } from 'ionicons';
import { logOut, heart, fitness, walk, medical, pulse, musicalNotes, personAdd, alertCircle, water, cloud, sunny, rainy, partlySunny, personCircle, speedometer, grid, list, chevronForward, logoGoogle, mail, share, home, people, cart, settings, calendar, ellipsisVertical } from 'ionicons/icons';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, 
  IonIcon, IonItem, IonCard, IonImg, 
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent
} from '@ionic/angular/standalone';




interface Weather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, // Certifique-se de que o standalone está como true
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonIcon, IonItem, IonCard, IonImg,
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent
],
})
export class HomePage implements OnInit {
  user$!: Observable<User | null>;
  weather$!: Observable<Weather>;
  viewMode: 'cards' | 'list' = 'cards';
  viewOptionsOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({personCircle,logoGoogle,logOut,ellipsisVertical,heart,fitness,calendar,medical,pulse,musicalNotes,personAdd,alertCircle,chevronForward,walk,share,water,speedometer,grid,list,cloud,sunny,rainy,partlySunny,mail,home,people,cart,settings});
  }

  ngOnInit() {
    this.user$ = this.authService.getUser();
    this.loadWeather();

    // Debug: log user data
    this.user$.subscribe(user => {
      console.log('User data:', user);
      if (user) {
        console.log('displayName:', user.displayName);
        console.log('providerData:', user.providerData);
        if (user.providerData && user.providerData.length > 0) {
          console.log('providerData[0]:', user.providerData[0]);
          console.log('providerData[0].displayName:', user.providerData[0].displayName);
          console.log('providerData[0].photoURL:', user.providerData[0].photoURL);
        }
      }
    });
  }

  loadWeather() {
    // Simular dados de previsão do tempo
    // Em uma aplicação real, você chamaria um serviço de API de clima
    const mockWeather: Weather = {
      temp: 24,
      condition: 'Parcialmente Nublado',
      humidity: 65,
      windSpeed: 12
    };
    this.weather$ = of(mockWeather);
  }

  getWeatherIcon(condition: string): string {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('nublado')) return 'cloud';
    if (conditionLower.includes('ensolarado') || conditionLower.includes('claro')) return 'sunny';
    if (conditionLower.includes('chuva')) return 'rainy';
    if (conditionLower.includes('parcialmente')) return 'partly-sunny';
    return 'sunny';
  }

  navigateTo(route: string) {
    switch(route) {
      case 'heart-rate':
      case 'heart-rate-2':
        console.log('Navegando para batimentos cardíacos');
        this.router.navigate(['/heart-rate']);
        break;
      case 'my-health':
      case 'health-2':
        console.log('Navegando para minha saúde');
        this.router.navigate(['/health']);
        break;
      case 'schedule-runs':
        console.log('Navegando para agendar corridas');
        this.router.navigate(['/agenda-corridas']);
        break;
      case 'favorite-music':
        console.log('Navegando para músicas favoritas');
        this.router.navigate(['/favorite-music']);
        break;
      case 'add-friends':
        console.log('Navegando para adicionar amigos');
        this.router.navigate(['/friends']);
        break;
      case 'social-feed':
        console.log('Navegando para feed social');
        this.router.navigate(['/social-feed']);
        break;
      case 'emergency':
        console.log('Ativando botão de emergência');
        this.showEmergencyAlert();
        break;
      default:
        console.log(`Navegando para ${route}`);
    }
  }

  showEmergencyAlert() {
    alert('🚨 BOTÃO DE EMERGÊNCIA ATIVADO!\n\nContate os serviços de emergência: 192');
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'cards' ? 'list' : 'cards';
  }

  toggleViewOptions() {
    this.viewOptionsOpen = !this.viewOptionsOpen;
  }

  setViewMode(mode: 'cards' | 'list') {
    this.viewMode = mode;
    this.viewOptionsOpen = false;
  }

  getDisplayName(user: User | null): string {
    if (!user) return 'Usuário Google';

    // Try different sources for display name
    let displayName = user.displayName;

    if (!displayName && user.providerData && user.providerData.length > 0) {
      displayName = user.providerData[0].displayName;
    }

    // If still no display name, try to extract from email
    if (!displayName && user.email) {
      displayName = user.email.split('@')[0];
    }

    return displayName || 'Usuário Google';
  }

  getProviderLabel(user: User | null): string {
    if (!user || !user.providerData || user.providerData.length === 0) {
      return 'Google';
    }

    const providerId = user.providerData[0].providerId || '';
    if (providerId.includes('google.com')) {
      return 'Google';
    }
    if (providerId.includes('facebook.com')) {
      return 'Facebook';
    }

    return providerId.replace('.com', '') || 'Google';
  }

  getPhotoURL(user: User | null): string | null {
    if (!user) return null;

    let photoURL = user.photoURL;

    if (!photoURL && user.providerData && user.providerData.length > 0) {
      photoURL = user.providerData[0].photoURL;
    }

    return photoURL;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}

