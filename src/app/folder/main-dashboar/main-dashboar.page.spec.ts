import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDashboardPage } from './main-dashboar.page';

describe('MainDashboarPage', () => {
  let component: MainDashboardPage;
  let fixture: ComponentFixture<MainDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
