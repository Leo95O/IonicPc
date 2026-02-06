import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsSidebar } from './tools-sidebar';

describe('ToolsSidebar', () => {
  let component: ToolsSidebar;
  let fixture: ComponentFixture<ToolsSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToolsSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolsSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
