import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAdd, shareSocial, trash } from 'ionicons/icons';
import { Friend, SocialService } from '../services/social.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonInput, IonButton, IonList, IonIcon]
})
export class FriendsPage implements OnInit {
  friendName = '';
  friendEmail = '';
  friends$!: Observable<Friend[]>;
  message = '';

  constructor(private socialService: SocialService) {
    addIcons({ personAdd, shareSocial, trash });
  }

  ngOnInit() {
    this.friends$ = this.socialService.getFriends();
  }

  async addFriend() {
    if (!this.friendName.trim() || !this.friendEmail.trim()) {
      this.message = 'Preencha nome e e-mail do amigo.';
      return;
    }

    try {
      await this.socialService.addFriend(this.friendName, this.friendEmail);
      this.friendName = '';
      this.friendEmail = '';
      this.message = 'Amigo adicionado com sucesso!';
    } catch (error) {
      console.error(error);
      this.message = 'Não foi possível adicionar o amigo.';
    }
  }

  async removeFriend(id: string) {
    try {
      await this.socialService.removeFriend(id);
      this.message = 'Amigo removido.';
    } catch (error) {
      console.error(error);
      this.message = 'Não foi possível remover o amigo.';
    }
  }

  async shareInvite() {
    const text = 'Junte-se ao meu App Health para compartilhar desafios e corridas!';
    const url = 'https://meu-app-health.com/convite';

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Convite App Health', text, url });
        this.message = 'Convite compartilhado com sucesso!';
      } catch (err) {
        this.message = 'Não foi possível compartilhar agora.';
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`);
      this.message = 'Link copiado para a área de transferência!';
    }
  }
}
