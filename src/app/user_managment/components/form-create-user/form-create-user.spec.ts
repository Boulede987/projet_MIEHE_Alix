import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreateUser } from './form-create-user';

describe('FormCreateUser', () => {
  let component: FormCreateUser;
  let fixture: ComponentFixture<FormCreateUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCreateUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCreateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
