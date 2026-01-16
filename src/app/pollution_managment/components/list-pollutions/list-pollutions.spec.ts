import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPollutions } from './list-pollutions';

describe('ListPollutions', () => {
  let component: ListPollutions;
  let fixture: ComponentFixture<ListPollutions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPollutions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPollutions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
