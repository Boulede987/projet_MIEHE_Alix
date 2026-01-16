import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutionNavbar } from './pollution-navbar';

describe('Navbar', () => {
  let component: PollutionNavbar;
  let fixture: ComponentFixture<PollutionNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollutionNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollutionNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
