import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, orderBy, query, serverTimestamp } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadString } from '@angular/fire/storage';
import { firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

export interface Friend {
  id: string;
  name: string;
  email: string;
  addedAt: string;
}

export interface FeedPost {
  id: string;
  caption: string;
  image: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private authService: AuthService,
    private auth: Auth
  ) {}

  getFriends(): Observable<Friend[]> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }

        const friendsCollection = collection(this.firestore, `users/${user.uid}/friends`);
        return collectionData(friendsCollection, { idField: 'id' }) as Observable<Friend[]>;
      })
    );
  }

  getPosts(): Observable<FeedPost[]> {
    return this.authService.getUser().pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }

        const postsCollection = collection(this.firestore, `users/${user.uid}/posts`);
        const ordered = query(postsCollection, orderBy('date', 'desc'));
        return collectionData(ordered, { idField: 'id' }) as Observable<FeedPost[]>;
      })
    );
  }

  async addFriend(name: string, email: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim() || !normalizedEmail) {
      throw new Error('Nome e e-mail são obrigatórios.');
    }

    const friendsCollection = collection(this.firestore, `users/${user.uid}/friends`);
    await addDoc(friendsCollection, {
      name: name.trim(),
      email: normalizedEmail,
      addedAt: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
  }

  async removeFriend(id: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const friendDoc = doc(this.firestore, `users/${user.uid}/friends/${id}`);
    await deleteDoc(friendDoc);
  }

  async addPost(caption: string, image: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    if (!image) {
      throw new Error('Imagem é obrigatória.');
    }

    const postId = this.generateId();
    const storageRef = ref(this.storage, `users/${user.uid}/posts/${postId}.jpg`);
    await uploadString(storageRef, image, 'data_url');
    const imageUrl = await getDownloadURL(storageRef);

    const postsCollection = collection(this.firestore, `users/${user.uid}/posts`);
    await addDoc(postsCollection, {
      caption: caption.trim() || 'Compartilhando minha corrida! 🏃‍♂️',
      image: imageUrl,
      date: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  }
}
