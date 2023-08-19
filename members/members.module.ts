import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '../../shared/ui/ui.module';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MembersRoutingModule } from './members-routing.module';
import { ListSortableDirective } from './list/list-sortable.directive';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { DocumentsComponent } from './documents/documents.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [AddComponent, ListComponent, DocumentsComponent, ListSortableDirective],
  imports: [
    CommonModule,
    MembersRoutingModule,
    UIModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
	NgSelectModule
  ]
})
export class MembersModule { }
