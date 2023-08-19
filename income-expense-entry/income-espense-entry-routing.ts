import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomeExpenseEntryComponent } from '../income-expense-entry/income-expense-entry.component';


const routes: Routes = [
    {
        path: 'incomeexpense',
        component: IncomeExpenseEntryComponent
    },
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MembersRoutingModule { }
