import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteMusicPage } from './favorite-music.page';

describe('FavoriteMusicPage', () => {
  let component: FavoriteMusicPage;
  let fixture: ComponentFixture<FavoriteMusicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteMusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
