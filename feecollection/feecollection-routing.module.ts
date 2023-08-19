import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { DocumentsComponent } from './documents/documents.component';

const routes: Routes = [
    {
        path: 'add',
        component: AddComponent
    },
    {
        path: 'list',
        component: ListComponent
    },
	{
        path: 'documents',
        component: DocumentsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeesCollectionRoutingModule { }
