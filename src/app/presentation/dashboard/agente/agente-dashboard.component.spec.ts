import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenteDashboardComponent } from './agente-dashboard.component';

describe('AsesorDashboardComponent', () => {
  let component: AgenteDashboardComponent;
  let fixture: ComponentFixture<AgenteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenteDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgenteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
