import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeExpenseEntryComponent } from './income-expense-entry.component';

describe('IncomeExpenseEntryComponent', () => {
  let component: IncomeExpenseEntryComponent;
  let fixture: ComponentFixture<IncomeExpenseEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeExpenseEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeExpenseEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
