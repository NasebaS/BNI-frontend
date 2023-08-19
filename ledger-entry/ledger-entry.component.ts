import { Component, OnInit, ViewChild,Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators,AbstractControl  } from "@angular/forms";
import Swal from "sweetalert2";
import { HttpClient } from '@angular/common/http';
import { AppService } from "src/service/app.service";
import { Ledger } from "src/model/ledger/ledger.model";
import { APIResponse, FileUploadType } from "src/utils/app-constants";
// import {HorizontaltopbarComponent} from "../layouts/horizontaltopbar/horizontaltopbar.component"
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

declare var $: any;

@Component({
  selector: "app-ledger-entry",
  templateUrl: "./ledger-entry.component.html",
  styleUrls: ["./ledger-entry.component.scss"],
 
})
export class LedgerEntryComponent implements OnInit {
  ledgerNames: string[] = [];
  
  ledgerList: Ledger[] = [];
 
  submitted = false;
  newUsersForm: FormGroup;
  modalHeaderText;
  ledgerId: number;
  selectedUsers: Ledger;
 

  @ViewChild("newUsers") empModal: any;

  isEditEnabled = false;
  

  constructor(
     private _appService: AppService,
     
    // private listService: ListService,
    public formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.getLedgerList();
    this.formValidation();

   
  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      $("#example").DataTable();
    }, 1500);
  }
  getLedgerList() {
    let reqParams = {
      "query": { "isdeleted": { "eq": 0 } },
      "options": { "page": 1, "paginate": 9999 },
      "isCountOnly": false
    };
  
    this._appService.getLedgerList(reqParams).subscribe(
      (response: any) => {
        if (response.status == 0) {
          this.ledgerList = Ledger.getLedgeList(response.ledgerList);
  
          this.ledgerNames = [];
          this.ledgerList.forEach(ledger => {
            if (!this.ledgerNames.includes(ledger.name)) {
              this.ledgerNames.push(ledger.name);
            }
          });
  
          // Calculate and assign serial numbers to active entries
          let serialNumber = 1;
          this.ledgerList.filter(entry => entry.status === 'Active').forEach(entry => {
            entry.serialNumber = serialNumber++;
          });
        }
      },
      (err) => {
        console.error('API Error:', err);
      }
    );
  }
  
  formValidation() {
    this.newUsersForm = this.formBuilder.group({
      ledger_name: ["", [Validators.required]], 
      ledger_type: ["", [Validators.required]],
      status: ["Active", [Validators.required]],
    });
  }

  
  extraLarge(exlargeModal: any) {
    this.submitted = false;
    this.modalService.open(exlargeModal, { size: "lg", centered: true, scrollable: true });
    this.isEditEnabled = false;
    this.ledgerId=0;
    
    this.newUsersForm.reset();
    this.modalHeaderText = "Create New Ledger";
    this.newUsersForm = this.formBuilder.group({
      ledger_name: ["", [Validators.required]],
      ledger_type: ["", [Validators.required]],
      status: ["Active", [Validators.required]],
     
    });
  
  }

  openModal(modal) {
    this.modalHeaderText = "Create New Ledger";
    this.submitted = false;
    this.newUsersForm.reset();
    this.newUsersForm.markAsUntouched();
    this.newUsersForm.markAsPristine();
    this.empModal.open(modal, { size: "lg", centered: true, scrollable: true });
  }
  get f() {
    return this.newUsersForm.controls;
  }
  closeModal() {
    this.empModal.dismiss("Cross click");
  }

  userClicked(user) {
    this.newUsersForm = this.formBuilder.group({
      ledger_name: ["", [Validators.required]],
      ledger_type: ["", [Validators.required]],
      status: ["Active", [Validators.required]],
    });
    
    this.selectedUsers = user;
    this.isEditEnabled = true;
    if (this.selectedUsers != null) {
      this.ledgerId = this.selectedUsers.ledgerId; 
      this.newUsersForm.patchValue({
        ledgerId: this.selectedUsers.ledgerId,
        ledger_name: this.selectedUsers.name,
        ledger_type: this.selectedUsers.type,
        status: this.selectedUsers.status,
      });
  
      this.modalService.open(this.empModal, { size: "lg", centered: true, scrollable: true });
      this.modalHeaderText = "Edit Ledger";
    }
  }
  

  async postuser() {

    this.submitted = true;
    
  
    if (this.newUsersForm.invalid) {
      return;
    } else {
     
      $("#example").DataTable().destroy();
      const params = this.newUsersForm.value;
      params["ledger_name"] = params["ledger_name"].toString();
      params["ledger_type"] = params["ledger_type"].toString();
      params["status"] = params["status"].toString();

      if(this.isEditEnabled==false){
       
        console.log("Sending data to backend:", params);
       await this._appService.addLedger(params).subscribe(    
          
        (response: any) => {
          console.log("Backend response:", response);
          
          if (response.status == APIResponse.Success) {            
          
            this.modalService.dismissAll();
            this.getLedgerList();
            setTimeout(() => {
              $("#example").DataTable();
            }, 2500);           
              Swal.fire("Congratulations.", "Ledger has been created successfully..!", "success");
        
          } else {
            Swal.fire("Error.", "Unable to create Ledger. Please try again..!", "error");
          }
        },
        (err) => {
          console.log("Error from backend:", err);
          Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
        }
      );
    

    }
else{
 
      await  this._appService.updateLedger(params,this.ledgerId ).subscribe(
        
          (response: any) => {
          console.log(response)
            console.log("backend ledger reponse:",response)
            console.log(params)
            if (response.status == APIResponse.Success) {           
              this.modalService.dismissAll();
              this.submitted = false;
              this.getLedgerList();
              setTimeout(() => {
                $("#example").DataTable();
              }, 2500);
                Swal.fire("Congratulations.", "Ledger has been updated successfully..!", "success");
              
            } else {
              Swal.fire("Error.", "Unable to update Ledger. Please try again..!", "error");
            }
          },
          (err) => {
            Swal.fire("Error.", "Something went wrong. Please try again later..!", "error");
          }
        );
      }
    }
  }


  deleteLedger(ledgerId: number) {
    Swal.fire({
      title: 'Do you want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this._appService.deleteLedger(ledgerId).subscribe(
          (response: any) => {
            console.log("Response from Backend:", response);
            if (response.message === 'Ledger deleted successfully') {
              // Find the deleted ledger and update its status
              const deletedLedger = this.ledgerList.find(ledger => ledger.ledgerId === ledgerId);
              if (deletedLedger) {
                deletedLedger.status = 'Inactive';
  
                // Recalculate serial numbers for active entries
                let serialNumber = 1;
                this.ledgerList.filter(entry => entry.status === 'Active').forEach(entry => {
                  entry.serialNumber = serialNumber++;
                });
              }
              Swal.fire({
                title: 'Ledger Entry deleted successfully',
                icon: 'success'
              });
            }
          },
          (error) => {
            console.error('Delete error:', error);
          }
        );
      }
    });
  }
  
}
  