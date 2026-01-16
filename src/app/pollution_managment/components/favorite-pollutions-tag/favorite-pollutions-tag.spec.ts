import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritePollutionsTag } from './favorite-pollutions-tag';

describe('FavoritePollutionsTag', () => {
  let component: FavoritePollutionsTag;
  let fixture: ComponentFixture<FavoritePollutionsTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritePollutionsTag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritePollutionsTag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
