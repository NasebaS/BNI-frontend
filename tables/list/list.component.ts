import { Component, OnInit, ViewChildren, QueryList } from "@angular/core";
import { DecimalPipe } from "@angular/common";

import { Observable } from "rxjs";

import { Table } from "./list.model";

import { tableData, editableTable } from "./data";

import { ListService } from "./list.service";
import { ListSortableDirective, SortEvent } from "./list-sortable.directive";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  providers: [ListService, DecimalPipe],
})

/**
 * Advanced table component
 */
export class ListComponent implements OnInit {
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Table data
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

  constructor(public service: ListService) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
  }

  settings = {
    columns: {
      id: {
        title: "ID",
      },
      name: {
        title: "Full Name",
        filter: {
          type: "list",
          config: {
            selectText: "Select...",
            list: [
              { value: "Glenna Reichert", title: "Glenna Reichert" },
              { value: "Kurtis Weissnat", title: "Kurtis Weissnat" },
              { value: "Chelsey Dietrich", title: "Chelsey Dietrich" },
            ],
          },
        },
      },
      email: {
        title: "Email",
        filter: {
          type: "completer",
          config: {
            completer: {
              data: editableTable,
              searchFields: "email",
              titleField: "email",
            },
          },
        },
      },
    },
  };

  ngOnInit() {
    this.selectServices = ["All", "Nurse", "Lab Technician", "Physiotherapist", "General Physician"];
    this.selectStatus = ["All", "Active", "Inactive"];
    /**
     * fetch data
     */
    this._fetchData();
  }

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
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
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
