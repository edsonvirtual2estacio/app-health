import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
    { title: 'Descanso', url: '/descanso', icon: 'heart' },
    { title: 'Clientes', url: '/clientes', icon: 'people' },
    { title: 'Vendas', url: '/vendas', icon: 'cart' },
    { title: 'Configurações', url: '/config', icon: 'settings' },
  ];

  public showAppMenu = true;
  private hiddenRoutes = ['/login', '/signup'];

  constructor(private router: Router) {
    addIcons({ home, people, cart, settings, calendar, heart, fitness, musicalNotes });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      const url = event.urlAfterRedirects.split('?')[0].split('#')[0];
      this.showAppMenu = !this.hiddenRoutes.includes(url);
    });
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }
}
