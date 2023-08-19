import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject, Observable } from 'rxjs';
import { takeUntil} from 'rxjs/operators';
import { AppointmentDetails } from "src/model/appointments/appointment-details.model";
import { AppointmentStatusLog } from "src/model/appointments/appointment-status-log.model";
import { Appointment } from "src/model/appointments/appointment.model";
import { Employee } from "src/model/employee/employee.model";
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { AppDataService } from "src/service/app-data.service";
import { Table } from './documents.model';
import {
  AlertType,
  APIResponse,
  AppointmentLogStatus,
  AppointmentStages,
  FileUploadType,
  MaxFileSize,
  PractiseUserRoles,
  ServiceSectors,
} from "src/utils/app-constants";
import { tableData, editableTable } from './data';

import { DocumentsService } from './documents.service';
import { DocumentsSortableDirective, SortEvent } from './documents-sortable.directive';
import Swal from "sweetalert2";

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  providers: [DocumentsService, DecimalPipe]
})

/**
 * Advanced table component
 */
export class DocumentsComponent implements OnInit {
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Table data
  tableData: Table[];
  public selected: any;
  hideme: boolean[] = [];
  tables$: Observable<Table[]>;
  total$: Observable<number>;
  editableTable: any;
  selectEmployee: Employee[];
  selectedEmployee:Employee = new Employee();
  imgPreview;

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

  private _unsubscribeAll: Subject<any>;
  selectedAppointment: Appointment;
  appointmentDetails: AppointmentDetails = new AppointmentDetails();

  appointmentStatusHistory: AppointmentStatusLog[] = [];

  appointmentStatusOpen: AppointmentStatusLog[] = [];
  appointmentStatusCompleted: AppointmentStatusLog[] = [];
  appointmentStatusInProgress: AppointmentStatusLog;



  @ViewChildren(DocumentsSortableDirective) headers: QueryList<DocumentsSortableDirective>;
  public isCollapsed = true;

  
  constructor(private _appService: AppService, private _appUtil: UtilService, private _appDataService: AppDataService,public service: DocumentsService) {
    this._unsubscribeAll = new Subject();
    this.tables$ = service.tables$;
    this.total$ = service.total$;
    this._appDataService.selectedAppointment.pipe(takeUntil(this._unsubscribeAll)).subscribe((appointment) => {
    
      if (appointment != null) {
        this.selectedAppointment = appointment;
       
        this.populateAppoitmentStatusHistoryData();

      }
    });
  }

  
  ngOnInit() {  
    this.imgPreview='assets/images/users/no-pic.png';  
    this.getEmployee();
    this.getAppointmentDetails(this.selectedAppointment.appointmentId);
  }

  
  populateAppoitmentStatusHistoryData() {
    if (this.selectedAppointment.serviceSectorId == 1) {
      for (let index = 0; index < 8; index++) {
        let log = new AppointmentStatusLog();
        log.logStatus = AppointmentLogStatus.Open;
        switch (index) {
          case AppointmentStages.Scheduled:
            log.currentStatus = 0;
            log.statusText = "Scheduled";
            break;
          case AppointmentStages.Accpeted:
            log.currentStatus = 1;
            log.statusText = "Accepted";
            break;
          case AppointmentStages.OnTheWay:
            log.currentStatus = 2;
            log.statusText = "On the way";
            break;
          case AppointmentStages.ArrivedDesination:
            log.currentStatus = 3;
            log.statusText = "Arrived destination";
            break;
          case AppointmentStages.ServiceInProgress:
            log.currentStatus = 4;
            log.statusText = "Sample collection";
            break;
          case AppointmentStages.ServiceCompleted:
            log.currentStatus = 5;
            log.statusText = "Sample collection completed";
            break;
          case AppointmentStages.SampleSubmittedToLab:
            log.currentStatus = 6;
            log.statusText = "Sample submitted";
            break;
          case AppointmentStages.ResultPublished:
            log.currentStatus = 7;
            log.statusText = "Result published";
            break;
          default:
            break;
        }
        this.appointmentStatusHistory.push(log);
      }
    } else {
      for (let index = 0; index < 6; index++) {
        let log = new AppointmentStatusLog();
        log.logStatus = AppointmentLogStatus.Open;
        switch (index) {
          case AppointmentStages.Scheduled:
            log.currentStatus = 0;
            log.statusText = "Scheduled";
            break;
          case AppointmentStages.Accpeted:
            log.currentStatus = 1;
            log.statusText = "Accepted";
            break;
          case AppointmentStages.OnTheWay:
            log.currentStatus = 2;
            log.statusText = "On the way";
            break;
          case AppointmentStages.ArrivedDesination:
            log.currentStatus = 3;
            log.statusText = "Arrived destination";
            break;
          case AppointmentStages.ServiceInProgress:
            log.currentStatus = 4;
            log.statusText = "Service in progress";
            break;
          case AppointmentStages.ServiceCompleted:
            log.currentStatus = 5;
            log.statusText = "Service completed";
            break;
          default:
            break;
        }
        this.appointmentStatusHistory.push(log);
      }
    }
  }

  getEmployee() {
    this._appService.getEmployeeList("").subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
        
           this.selectEmployee = Employee.getEmployeeList(response);
          
           this.selectedEmployee = this.selectEmployee.filter((history) => history.corpEmpId == this.selectedAppointment.corpEmpId)[0];
           if(this.selectedEmployee.profileImagePath)
                this.imgPreview=this.selectedEmployee.profileImagePath;
        } else {
        //  console.log("Unable to get sectors");
        }
      },
      (err) => {
      //  console.log("Unable to get sectors");
      }
    );
  }

  getPractiseUserList(roleId: string) {
    // this._appService.getPractiseUserForSector(roleId).subscribe(
    //   (response: any) => {
    //     if (response.status == APIResponse.Success) {
    //       this.practiseUsers = PractiseUser.getPracticeUserList(response.userList);
    //     } else {
    //       console.log("server error");
    //     }
    //   },
    //   (err) => {
    //     console.log("server error");
    //   }
    // );
  }

  getAppointmentDetails(appointmentId: string) {
   
    this._appService.getAppoitmentDetails(appointmentId).subscribe(
      (response: any) => {
      
       
        if (response.status == APIResponse.Success) {
          this.appointmentDetails = AppointmentDetails.initalizeAppointmentDetails(response);
          this.updateAppointmentHistory();
        //   this.appointmentStatusHistory = this.appointmentDetails.statusHistory
        //   this.appointmentStatusCompleted = this.appointmentStatusHistory.filter((history) => history.logStatus == AppointmentLogStatus.Completed);
        //   this.appointmentStatusOpen = this.appointmentStatusHistory.filter((history) => history.logStatus == AppointmentLogStatus.Open);
        //   this.appointmentStatusInProgress = this.appointmentStatusHistory.find((history) => history.logStatus == AppointmentLogStatus.InProgress);
       
        } else {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      },
      (err) => {
        Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
      }
    );
  }
  updateAppointmentHistory() {
    this.appointmentDetails.statusHistory.sort((a, b) => a.currentStatus - b.currentStatus);
    this.appointmentDetails.statusHistory[this.appointmentDetails.statusHistory.length - 1].logStatus = AppointmentLogStatus.InProgress;

    this.appointmentDetails.statusHistory.forEach((statusLog) => {
      let log = this.appointmentStatusHistory.find((history) => history.currentStatus == statusLog.currentStatus);
      if (log) {
        log.updateDate = statusLog.updateDate;
        log.updateTime = statusLog.updateTime;
        log.latitude = statusLog.latitude;
        log.longitude = statusLog.longitude;
        log.address = statusLog.address;
        log.logStatus = statusLog.logStatus;
      }
    });
    this.appointmentStatusCompleted = this.appointmentStatusHistory.filter((history) => history.logStatus == AppointmentLogStatus.Completed);
    this.appointmentStatusOpen = this.appointmentStatusHistory.filter((history) => history.logStatus == AppointmentLogStatus.Open);
    this.appointmentStatusInProgress = this.appointmentStatusHistory.find((history) => history.logStatus == AppointmentLogStatus.InProgress);
  }

  openTestResult(fileUrl) {
    var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
    window.open(fileUrl, "_blank", "");
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
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
