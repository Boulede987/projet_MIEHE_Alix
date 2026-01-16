import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUserLogin } from './form-user-login';

describe('FormUserLogin', () => {
  let component: FormUserLogin;
  let fixture: ComponentFixture<FormUserLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormUserLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUserLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
