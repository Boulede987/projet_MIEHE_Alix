import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFavoritePollutions } from './list-favorite-pollutions';

describe('ListFavoritePollutions', () => {
  let component: ListFavoritePollutions;
  let fixture: ComponentFixture<ListFavoritePollutions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFavoritePollutions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFavoritePollutions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
