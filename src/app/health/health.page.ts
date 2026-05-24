import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonInput, IonButton, IonLabel, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonList } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calculator, fitness, heart, menuOutline } from 'ionicons/icons';


@Component({
  selector: 'app-health',
  templateUrl: './health.page.html',
  styleUrls: ['./health.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, CommonModule, FormsModule, IonInput, IonButton, IonLabel, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon, IonList]
})
export class HealthPage implements OnInit {
  peso: number = 0;
  altura: number = 0;
  imc: number = 0;
  classificacao: string = '';
  dicas: string[] = [];
  // contato do médico
  doctorName: string = '';
  doctorPhone: string = '';

  // registros de saúde (anotações, consultas, etc.)
  healthRecords: Array<{ id: string; title: string; notes: string; date: number }> = [];
  // edição de registro
  editingId: string | null = null;
  recordFormTitle = '';
  recordFormNotes = '';
menu: any;

  constructor() {
    addIcons({menuOutline,calculator,fitness,heart});
    this.loadDoctor();
    this.loadRecords();
  }

  ngOnInit() {
  }

  calcularIMC() {
    if (this.altura > 0 && this.peso > 0) {
      this.imc = this.peso / (this.altura * this.altura);
      this.classificarIMC();
      this.gerarDicas();
    } else {
      this.imc = 0;
      this.classificacao = 'Dados inválidos';
      this.dicas = [];
    }
  }

  classificarIMC() {
    if (this.imc < 18.5) {
      this.classificacao = 'Abaixo do peso';
    } else if (this.imc >= 18.5 && this.imc < 25) {
      this.classificacao = 'Peso normal';
    } else if (this.imc >= 25 && this.imc < 30) {
      this.classificacao = 'Sobrepeso';
    } else if (this.imc >= 30 && this.imc < 35) {
      this.classificacao = 'Obesidade grau 1';
    } else if (this.imc >= 35 && this.imc < 40) {
      this.classificacao = 'Obesidade grau 2';
    } else {
      this.classificacao = 'Obesidade grau 3';
    }
  }

  gerarDicas() {
    this.dicas = [];
    if (this.imc < 18.5) {
      this.dicas = [
        'Aumente a ingestão calórica com alimentos ricos em nutrientes.',
        'Inclua proteínas, carboidratos complexos e gorduras saudáveis na dieta.',
        'Consulte um nutricionista para um plano alimentar personalizado.',
        'Pratique exercícios de fortalecimento muscular.'
      ];
    } else if (this.imc >= 18.5 && this.imc < 25) {
      this.dicas = [
        'Mantenha uma dieta equilibrada com frutas, verduras e proteínas.',
        'Continue praticando atividades físicas regularmente.',
        'Beba bastante água e evite alimentos processados.',
        'Monitore seu peso periodicamente.'
      ];
    } else if (this.imc >= 25 && this.imc < 30) {
      this.dicas = [
        'Reduza o consumo de açúcares e gorduras saturadas.',
        'Aumente a ingestão de fibras e verduras.',
        'Pratique exercícios aeróbicos e de força.',
        'Consulte um profissional de saúde para orientação.'
      ];
    } else {
      this.dicas = [
        'Busque acompanhamento médico e nutricional urgente.',
        'Adote uma dieta hipocalórica supervisionada.',
        'Inclua atividades físicas de baixo impacto inicialmente.',
        'Monitore o progresso com profissionais de saúde.',
        'Evite dietas milagrosas e foque em mudanças sustentáveis.'
      ];
    }
  }

  // doctor contact
  saveDoctor() {
    const obj = { name: this.doctorName, phone: this.doctorPhone };
    localStorage.setItem('doctorContact', JSON.stringify(obj));
  }

  loadDoctor() {
    try {
      const raw = localStorage.getItem('doctorContact');
      if (raw) {
        const obj = JSON.parse(raw);
        this.doctorName = obj.name || '';
        this.doctorPhone = obj.phone || '';
      }
    } catch (e) {
      // ignore
    }
  }

  deleteDoctor() {
    this.doctorName = '';
    this.doctorPhone = '';
    localStorage.removeItem('doctorContact');
  }

  // health records CRUD
  loadRecords() {
    try {
      const raw = localStorage.getItem('healthRecords');
      this.healthRecords = raw ? JSON.parse(raw) : [];
    } catch (e) {
      this.healthRecords = [];
    }
  }

  addRecord(title: string, notes: string) {
    const entry = { id: Date.now().toString(), title, notes, date: Date.now() };
    this.healthRecords.unshift(entry);
    localStorage.setItem('healthRecords', JSON.stringify(this.healthRecords));
  }

  updateRecord(id: string, title: string, notes: string) {
    const idx = this.healthRecords.findIndex(r => r.id === id);
    if (idx > -1) {
      this.healthRecords[idx].title = title;
      this.healthRecords[idx].notes = notes;
      localStorage.setItem('healthRecords', JSON.stringify(this.healthRecords));
    }
  }

  deleteRecord(id: string) {
    this.healthRecords = this.healthRecords.filter(r => r.id !== id);
    localStorage.setItem('healthRecords', JSON.stringify(this.healthRecords));
  }

  startEditRecord(id: string) {
    const rec = this.healthRecords.find(r => r.id === id);
    if (!rec) return;
    this.editingId = id;
    this.recordFormTitle = rec.title;
    this.recordFormNotes = rec.notes;
  }

  submitRecordForm() {
    if (this.editingId) {
      this.updateRecord(this.editingId, this.recordFormTitle, this.recordFormNotes);
      this.editingId = null;
    } else if (this.recordFormTitle || this.recordFormNotes) {
      this.addRecord(this.recordFormTitle, this.recordFormNotes);
    }
    this.recordFormTitle = '';
    this.recordFormNotes = '';
  }
}
