import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeForm } from './scope-form';

describe('ScopeForm', () => {
  let component: ScopeForm;
  let fixture: ComponentFixture<ScopeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopeForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopeForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
