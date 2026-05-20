import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonApp, IonRouterOutlet, IonToolbar, IonSplitPane, IonHeader, IonTitle, IonList, IonContent, IonItem, IonIcon, IonLabel, IonMenuToggle, IonMenu, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, people, cart, settings, calendar, heart, fitness, musicalNotes } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [CommonModule, RouterModule, IonContent, IonList, IonRouterOutlet, IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, IonTitle, IonMenuToggle, IonItem, IonIcon, IonLabel, IonButton],
})
export class AppComponent {
  public appPages = [
    { title: 'Início', url: '/home', icon: 'home' },
    { title: 'Agendar Corridas', url: '/agenda-corridas', icon: 'calendar' },
    { title: 'Clientes', url: '/clientes', icon: 'people' },
    { title: 'Vendas', url: '/vendas', icon: 'cart' },
    { title: 'Configurações', url: '/config', icon: 'settings' },
  ];

  constructor(private router: Router) {
    addIcons({ home, people, cart, settings, calendar, heart, fitness, musicalNotes });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
