import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPlanos } from './lista-planos';

describe('ListaPlanos', () => {
  let component: ListaPlanos;
  let fixture: ComponentFixture<ListaPlanos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaPlanos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaPlanos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
