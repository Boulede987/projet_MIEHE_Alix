import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDelcarationPollution } from './form-delcaration-pollution';

describe('FormDelcarationPollution', () => {
  let component: FormDelcarationPollution;
  let fixture: ComponentFixture<FormDelcarationPollution>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDelcarationPollution]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDelcarationPollution);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
