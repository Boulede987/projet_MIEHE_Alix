import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecap } from './user-recap';

describe('UserRecap', () => {
  let component: UserRecap;
  let fixture: ComponentFixture<UserRecap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRecap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRecap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
