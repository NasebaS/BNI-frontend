import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/service/app.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  addMemberForm: FormGroup;
  submitted = false;
  selectRole = ['Nurse', 'Lab Technician', 'Physiotherapist', 'General Physician'];
  

  constructor(private formBuilder: FormBuilder,
    private appService:AppService) {}

  ngOnInit(): void {
   
    this.formValidation();
  }

  get m() {
    return this.addMemberForm.controls;
  }
  formValidation() {
    this.addMemberForm = this.formBuilder.group({
      name: ["", [Validators.required]],      
      email: ["", [Validators.required]],
      mobile: ["", [Validators.required]],  
      alternatemobile: ["", [Validators.required]],    
      address: ["", [Validators.required]],
      company: ["", [Validators.required]],  
      industry: ["", [Validators.required]], 
      status: [this.selectRole[0], Validators.required]
    });
  }
  dateFilter: (date: Date | null) => boolean =
  (date: Date | null) => {
    if (!date) {
      return false;
    }
    const day = date.getDay();
    return day == 1; // 1 means monday, 0 means sunday, etc.
  };

  postmember(): void {
    this.submitted = true;

    if (this.addMemberForm.invalid) {
      return;
    }
    const formData = {
      member_name: this.addMemberForm.value.name,
      email_id: this.addMemberForm.value.email,
      mobile_no: this.addMemberForm.value.mobile,
      alternate_number: this.addMemberForm.value.alternatemobile,
      address: this.addMemberForm.value.address,
      company_name: this.addMemberForm.value.company,
      industry_type: this.addMemberForm.value.industry,
      status: this.addMemberForm.value.status
    };

  
    this.appService.createMember(formData).subscribe(
      (response) => {
      
        console.log('Member added successfully', response);
        const jsonResponse = JSON.stringify(response, null, 2);
        
        Swal.fire(      'Success!',
        'Member has been added successfully.');
        this.addMemberForm.reset();
        this.submitted = false;
      },
      (error) => {
        
        console.error('Error adding/updating employee', error);
      }
    );
  }
}
