import { Component, OnInit, ViewChildren, QueryList,ViewChild } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { Table } from './list.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { tableData, editableTable } from './data';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ListService } from './list.service';
import { Appointment } from "src/model/appointments/appointment.model";
import { Employee } from "src/model/employee/employee.model";
import { ServicePackage } from "src/model/servicePackage/service-package.model";
import { Sector } from "src/model/common/sector.model";
import { AppDataService } from "src/service/app-data.service";
import { AppService } from "src/service/app.service";
import { ListSortableDirective, SortEvent } from './list-sortable.directive';
import { AlertType, APIResponse, AppointmentTriggerSource } from "src/utils/app-constants";
import { FormGroup } from '@angular/forms';
import * as moment from "moment";
declare var $:any;

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

  searchCompletedResultForm: FormGroup;
  breadCrumbItems: Array<{}>;
  og_appointmentList: Array<Appointment> = [];
  com_appointmentList :Array<Appointment> = [];
  ongoingAppointmentList : Array<Appointment> = [];
  dummyAppointmentList : Array<Appointment> = [];
  completedAppointmentList :Array<Appointment> = [];
  // Table data
  tableData: Table[];
  public selected: any;
  hideme: boolean[] = [];
  tables$: Observable<Table[]>;
  total$: Observable<number>;
  editableTable: any;
  selectStatus: string[];
  selectClosedStatus:string[];
  selectEmployee: Employee[];
  selectedEmployee:Employee;
  selectServices:  Sector[];
  selectedServices: Sector;
  selectedCompletedEmployee:Employee;
  selectedCompletedServices: Sector;
  fromDatevalue:'';
  toDatevalue:'';
  selectedStatus:any;
  completedFromDatevalue:'';
  completedToDatevalue:'';
  completedSelectedStatus:any;


  timelineCarousel: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: true,
    navText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"],
    dots: false,
    responsive: {
      680: {
        items: 6
      },
    }
  }


  @ViewChildren(ListSortableDirective) headers: QueryList<ListSortableDirective>;
  // @ViewChild('txtService') txtService : any;
  // @ViewChild('newEmployee') empModal : any;
  // @ViewChild('newEmployee') empModal : any;
  public isCollapsed = true;

  constructor(private _appService: AppService,private router: Router, private _appDataService: AppDataService, public service: ListService, private modalService: NgbModal) {
    this.tables$ = service.tables$;
    this.total$ = service.total$;
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
    this.getAppointmentList();
    this.getEmployee();
    this.getServicelist();
   
    // this.selectServices = ['Home Laboratory Test', 'Home Physical Theraphy', 'Home Nursing Services', 'Home Visit Doctor', 'COVID-19 Test (PCR) at Home', 'Ambulance Transport'];
    this.selectStatus = ['Scheduled', 'In Progress', 'Sample Collected', 'Waiting for Result'];
   this.selectClosedStatus = ['Completed', 'Cancelled'];
  // this.selectEmployee = ['David Miller', 'John Willamson', 'Mike Hussey', 'Nicolas Pooran'];
    /**
     * fetch data
     */
    this._fetchData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('#example').DataTable();
    $('#example1').DataTable();
    }, 2500);
  }
  resetdatatable(){
    setTimeout(() => {
      $('#example').DataTable();
    $('#example1').DataTable();
    }, 2500);
  }

  getEmployee() {
    this._appService.getEmployeeList("").subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.selectEmployee = Employee.getEmployeeList(response);
        } else {
        //  console.log("Unable to get sectors");
        }
      },
      (err) => {
       // console.log("Unable to get sectors");
      }
    );
  }

  getServicelist() {
    this._appService.getSectorList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.selectServices = Sector.getSectorList(response);
        } else {
        //  console.log("Unable to get sectors");
        }
      },
      (err) => {
      //  console.log("Unable to get sectors");
      }
    );
  }

  getAppointmentList() {
    let params = {
      appointmentType: 1
    };
    this._appService.getAppointmentList(params).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.ongoingAppointmentList = Appointment.getAppointmentList(response.appointmentList);
          // this.ongoingAppointmentList = this.appointmentList.filter((promo) => promo.appointmentStage != "Completed");
          // this.completedAppointmentList = this.appointmentList.filter((promo) => promo.appointmentStage == "Completed");
          this.og_appointmentList = [...this.ongoingAppointmentList];
        } else {
        //  console.log("Unable to get appointments");
        }
      },
      (err) => {
      //  console.log("Unable to get appointments");
      }
    );
    let params2 = {
      appointmentType: 2
    };
    this._appService.getAppointmentList(params2).subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.completedAppointmentList = Appointment.getAppointmentList(response.appointmentList);
        
          // this.ongoingAppointmentList = this.appointmentList.filter((promo) => promo.appointmentStage != "Completed");
          // this.completedAppointmentList = this.appointmentList.filter((promo) => promo.appointmentStage == "Completed");
          this.com_appointmentList = [...this.completedAppointmentList];
        } else {
         // console.log("Unable to get appointments");
        }
      },
      (err) => {
        //console.log("Unable to get appointments");
      }
    );
  }

  ClearFilterClicked(){
    $("#txtEmployee").val(null);
    $("#txtFromDate").val(null);
    $("#txtToDate").val(null);
    $("#txtStatus").val(null);
    $("#txtService").val(null);
    // this.txtService.select(null);
    this.selectedServices=null;
    this.fromDatevalue=null;
    this.toDatevalue=null;
    this.selectedStatus=null;
    this.selectedEmployee=null;
    this.filterongoingRecords();
  }

  filterongoingRecords(){
    this.dummyAppointmentList = this.og_appointmentList;
   
    if(this.fromDatevalue)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => moment(promo.sAppointmentBookingDate) >=  moment(this.fromDatevalue));
    if(this.toDatevalue)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => moment(promo.sAppointmentBookingDate)  <= moment(this.toDatevalue));

    if(this.selectedStatus)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => this.selectedStatus.includes(promo.appointmentStage));
    if(this.selectedServices)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => promo.serviceId == this.selectedServices.sectorId);
    if(this.selectedEmployee)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => promo.corpEmpId == this.selectedEmployee.corpEmpId);

      this.ongoingAppointmentList = this.dummyAppointmentList;
  }

  ClearCompletedFilterClicked(){
    $("#txtCompletedEmployee").val(null);
    $("#txtCompletedFromDate").val(null);
    $("#txtCompletedToDate").val(null);
    $("#txtCompletedStatus").val(null);
    $("#txtCompletedService").val(null);
    this.selectedCompletedServices=null;
    this.completedFromDatevalue=null;
    this.completedToDatevalue=null;
    this.dummyAppointmentList=null;
    this.selectedCompletedEmployee=null;
    this.filterCompletedRecords();
  }
  filterCompletedRecords(){
    this.dummyAppointmentList = this.com_appointmentList;
    if(this.completedFromDatevalue)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => moment(promo.sAppointmentBookingDate) >= moment(this.completedFromDatevalue));
    if(this.completedToDatevalue)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => moment(promo.sAppointmentBookingDate) <= moment(this.completedToDatevalue));
    if(this.selectedCompletedServices)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => promo.serviceId == this.selectedCompletedServices.sectorId);
    if(this.selectedCompletedEmployee)
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => promo.corpEmpId == this.selectedCompletedEmployee.corpEmpId);
    if(this.completedSelectedStatus!='')
      this.dummyAppointmentList = this.dummyAppointmentList.filter((promo) => this.completedSelectedStatus.includes(promo.appointmentStage));

      this.completedAppointmentList = this.dummyAppointmentList;
  }

  viewAppointmentDetails(appointment) {
    var selectedAppointment = appointment;
    this._appDataService.currentAppointmentSubject.next(selectedAppointment);
    this.router.navigate(["/appointments/view"]);
  }

  changeValue(i) {
    this.hideme[i] = !this.hideme[i];
  }

  employeeSelctionChanged(employee) {
    this.selectedEmployee = employee;
  }

  serviceSelctionChanged(employee) {
    this.selectedServices = employee;
  }

  completedEmployeeSelctionChanged(employee) {
    this.selectedCompletedEmployee = employee;
  }

  completedServiceSelctionChanged(employee) {
    this.selectedCompletedServices = employee;
  }

  fromDateChanged(value) {
    this.fromDatevalue = value.target.value;
  }

  toDateChanged(value) {
    this.toDatevalue = value.target.value;
  }

  statusChanged(value){
    this.selectedStatus = value;
  }
  
  completedFromDateChanged(value) {
    this.completedFromDatevalue = value.target.value;
  }

  completedToDateChanged(value) {
    this.completedToDatevalue = value.target.value;
  }

  completedStatusChanged(value){
    this.completedSelectedStatus = value;
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
  
  largeModal(largeDataModal: any) {
    this.modalService.open(largeDataModal, { size: 'xl', centered: true, scrollable: true  });
  }

}
