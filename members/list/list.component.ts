import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from './list.model';

import { tableData, editableTable } from './data';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListService } from './list.service';
import { ListSortableDirective, SortEvent } from './list-sortable.directive';
import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/utils/util.service';
import { Router } from '@angular/router';
import { AppDataService } from 'src/service/app-data.service';
import { APIResponse } from 'src/utils/app-enum';
import { Members } from "src/model/common/members.model";
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ListService, DecimalPipe]
})

/**
 * Advanced table component
 */
export class ListComponent implements OnInit {
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Table data
  membersList: Members[] = [];
  tableData: Table[];
  public selected: any;
  hideme: boolean[] = [];
  tables$: Observable<Table[]>;
  total$: Observable<number>;
  editableTable: any;
  selectServices: string[];
  selectStatus: string[];

  @ViewChildren(ListSortableDirective) headers: QueryList<ListSortableDirective>;
  public isCollapsed = true;

  constructor(
    public service: ListService, 
   private modalService: NgbModal,
   private _appService: AppService,
   private _appUtil: UtilService,
   private router: Router,
   private _appDataService: AppDataService,
  ) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
    this.getMemberList();
  }

  settings = {
    columns: {
      id: {
        title: 'ID',
      },
      name: {
        title: 'Full Name',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              { value: 'Glenna Reichert', title: 'Glenna Reichert' },
              { value: 'Kurtis Weissnat', title: 'Kurtis Weissnat' },
              { value: 'Chelsey Dietrich', title: 'Chelsey Dietrich' },
            ],
          },
        },
      },
      email: {
        title: 'Email',
        filter: {
          type: 'completer',
          config: {
            completer: {
              data: editableTable,
              searchFields: 'email',
              titleField: 'email',
            },
          },
        },
      },
    },
  };

  ngOnInit() {
   this.selectServices = ['Home Laboratory Test', 'Home Physical Theraphy', 'Home Nursing Services', 'Home Visit Doctor', 'COVID-19 Test (PCR) at Home', 'Ambulance Transport'];
   this.selectStatus = ['New', 'In Progress', 'Completed', 'Cancelled'];
    /**
     * fetch data
     */
    this._fetchData();
  }

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  getMemberList() {
    let reqParams={ "query": {"isdeleted":{"eq":0}},"options": {  "page": 1, "paginate": 9999 }, "isCountOnly": false }
    this._appService.getMemberList(reqParams).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status == APIResponse.Success) {
           this.membersList = Members.getMemberList(response);
           console.log("Test:",this.membersList);
        } 
      },
      (err) => {
       // console.log("server error");
      }
    );
  }


  /**
   * fetches the table value
   */
  _fetchData() {
    this.tableData = tableData;
    this.editableTable = editableTable;
    for (let i = 0; i <= this.tableData.length; i++) {
      this.hideme.push(true);
    }
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
   /**
   * Open extra large modal
   * @param exlargeModal extra large modal data
   */
    extraLarge(exlargeModal: any) {
      this.modalService.open(exlargeModal, { size: 'md', centered: true, scrollable: true });
    }
}
