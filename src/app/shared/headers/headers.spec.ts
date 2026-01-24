import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Headers } from './headers';

describe('Headers', () => {
  let component: Headers;
  let fixture: ComponentFixture<Headers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Headers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Headers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
