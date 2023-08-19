import { Component, OnInit } from '@angular/core';
import { AppService } from "src/service/app.service";
import { UtilService } from "src/service/util.service";
import { Employee } from "src/model/employee/employee.model";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertType, APIResponse, AppointmentTriggerSource } from "src/utils/app-constants";
import { Sector } from "src/model/common/sector.model";
import { Router } from "@angular/router";
import {empdata} from './data';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from "@angular/forms";
import Swal from "sweetalert2";
import { Service } from 'src/model/common/service.model';
import { Lab } from 'src/model/common/lab.model';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  submitted = false;
  newAppointmentForm: FormGroup;
  selectEmployee: Employee[];
  selectedEmployee:Employee=empdata;
  selectServices:  Sector[];
  selectedServices: Sector;
  selectTitle: string[];
  selectServiceType: string[];
  selectCode: string[];
  selectBG: string[];
  selectArabicLanguage: string[];
  currentServiceList: Service[] = [];
  currentLabList: Lab[] = [];
  hidden: boolean;
  appointmentId:0;
  promotionDiscount:number=0;
  totalPrice:number=0;
  selected: any;  
  serviceName: string="";
  serviceprice: number;
  isEditEnabled = false;  
  isCouponVerified = false;  
  imgPreview;

  constructor(private _appService: AppService, 
    public formBuilder: FormBuilder, private router: Router ) { }
 
  ngOnInit(): void {
    this.getEmployee();
    this.getServicelist();   
    this.getLablist();
    this.selectTitle = ['Ms', 'Prof_Female', 'Prof_Male', 'Mr', 'Dr'];  
    this.selectCode =['+966'];
    this.selectBG =['A+','B+','AB+','A-','B-','AB-','O+','O-'];
    this.selectArabicLanguage =['عربي','إنجليزي'];

    this.imgPreview='assets/images/users/no-pic.png';
    this.selected = '';
    this.hidden = true;
    
    this.formValidation();
  }

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    const nationalId = item.nationalId == null || item.nationalId == undefined || item.nationalId == "" ? "XXXXX" : item.nationalId.toLocaleLowerCase();
    const policyId = item.policyId == null || item.policyId == undefined || item.policyId == "" ? "XXXXX" : item.nationalId.toLocaleLowerCase();
    return item.firstName.toLocaleLowerCase().indexOf(term) > -1 || 
    item.lastName.toLocaleLowerCase().indexOf(term) > -1 || 
    nationalId.indexOf(term) > -1 ||     
    policyId.indexOf(term) > -1 ||     
    item.mobileNo.indexOf(term) > -1 || 
    (item.firstName + " " + item.lastName).toLocaleLowerCase().indexOf(term) > -1;
 }
  
  getEmployee() {
    this._appService.getEmployeeList("").subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.selectEmployee = Employee.getEmployeeList(response);
        } else {
        //  console.log("Unable to get employee");  
        }
      },
      (err) => {
      //  console.log("Unable to get employee"); 
      }
    );
  }

  getServicelist() {
    this._appService.getSectorList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.selectServices = Sector.getSectorList(response);
        } else {
       //   console.log("Unable to get service");
        }
      },
      (err) => {
      //  console.log("Unable to get service");
      }
    );
  }
  getLablist() {
    this._appService.getLabList().subscribe(
      (response: any) => {
        if (response.status == APIResponse.Success) {
          this.currentLabList = Lab.getLabList(response);
        } else {
       //   console.log("Unable to get service");
        }
      },
      (err) => {
      //  console.log("Unable to get service");
      }
    );
  }
  get f() { return this.newAppointmentForm.controls; }
  formValidation() {
    this.newAppointmentForm = this.formBuilder.group({
      corpEmpId: ["", [Validators.required]],
      requestedServiceId: ["", [Validators.required]],
      patientNotes:[""],
      serviceProviderId:["", [Validators.required]],
      corpPromoCode:["", [Validators.required]],
    });
  }

  
  postAppointment() {
    this.submitted = true;
    if (this.newAppointmentForm.invalid) {
      return;
    } else if(this.isCouponVerified==false){
      Swal.fire("Error.", "Invalid Coupon code..!", "error");
      return;
    }else {
      var params = this.newAppointmentForm.value;
      this._appService.addOrUpdateAppointment(params).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
                Swal.fire("Congratulations.", "New Appointment has been created successfully..!", "success");
                this.router.navigate(["/appointments/list"]);
          } else {
            Swal.fire("Error.", "Unable to create Appointment. Please try again..!", "error");
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    }
  }

  employeeSelctionChanged(employee) {
    this.selectedEmployee = employee;
    if(this.selectedEmployee != undefined && this.selectedEmployee.profileImagePath)
     this.imgPreview=this.selectedEmployee.profileImagePath;
  }
  
  getSectors() {
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
  
  serviceSelctionChanged(employee) {
    this.selectedServices = employee;
    
    if(this.selectedServices != undefined){
        this.currentServiceList =this.selectedServices.tests; 
       // console.log(this.currentServiceList);
        this.serviceName=this.selectedServices.sectorName; 
        this.serviceprice=this.selectedServices.servicePrice; 
        if(this.newAppointmentForm.controls.corpPromoCode.value){
          this.promotionDiscount=this.serviceprice;
        }
        this.totalPrice=this.serviceprice - this.promotionDiscount;
    }
    else{
      this.promotionDiscount=0;
      this.totalPrice=0;
      this.serviceName='';
      this.serviceprice=0;
      this.currentServiceList=[];
    } 
  }

  applycoupon(){
    if(this.newAppointmentForm.controls.corpPromoCode.value){
      var params_list={
        couponCode:this.newAppointmentForm.controls.corpPromoCode.value
      }
      this._appService.verifyCouponCode(params_list).subscribe(
        (response: any) => {
          if (response.status == APIResponse.Success) {
                Swal.fire("Congratulations.", "Coupon Code applied successfully..!", "success");
                this.promotionDiscount=this.serviceprice;
                this.isCouponVerified=true;
                this.totalPrice=this.serviceprice - this.promotionDiscount;
          } else {
            Swal.fire("Error.", "Invalid Coupon Code..!", "error");
            this.isCouponVerified=false;
          }
        },
        (err) => {
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
          this.isCouponVerified=false;
        }
      );
   
    }
  }
  clearcoupon(){
    this.isCouponVerified=false;
    this.promotionDiscount=0;
    this.totalPrice=this.serviceprice;
  }
}
