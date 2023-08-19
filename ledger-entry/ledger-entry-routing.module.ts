import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LedgerEntryComponent } from './ledger-entry.component';


const routes: Routes = [
    {
        path: 'ledger',
        component: LedgerEntryComponent
    },
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MembersRoutingModule { }
