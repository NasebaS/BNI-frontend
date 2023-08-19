import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl ,Validators } from "@angular/forms";

import { AppService } from 'src/service/app.service';
import { UtilService } from 'src/utils/util.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppDataService } from 'src/service/app-data.service';
import { APIResponse } from 'src/utils/app-enum';
import { Bulk } from "src/model/common/bulk.model";

declare const $: any;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  // bread crumb items
  searchForm: FormGroup;
  memberForm: FormGroup;
  breadCrumbItems: Array<{}>;
  membersList: Bulk[] = [];
  // Select2 Dropdown
  selectRole: string[];
  submitted = false;
  selectTitle: string[];
  selectNationality: string[];
  selectCode: string[];
  selectBG: string[];
  selectDegree: string[];
  selectLanguage: string[];
  selectArabicLanguage: string[];
  hidden: boolean;
  selected: any;

  constructor(
   public formBuilder: FormBuilder,
   private modalService: NgbModal,
   private _appService: AppService,
   private _appUtil: UtilService,
   private router: Router,
   private _appDataService: AppDataService,
  ) {
    //this.getUnattendedMemberList();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Users' }, { label: 'New User', active: true }];
    
    // Select dropdown value
    // tslint:disable-next-line: max-line-length
    this.selectRole = ['Absent', 'Medical'];
    this.selectTitle = ['Ms', 'Prof_Female', 'Prof_Male', 'Mr', 'Dr'];
    this.selectNationality =['Saudi Arabia'];
    this.selectCode =['+966'];
    this.selectBG =['A+','B+','AB+','A-','B-','AB-','O+','O-'];
    this.selectDegree =['Bachelor Degree','PhD','Master Degree','Diploma','High School'];
    this.selectLanguage =['Arabic','English'];
    this.selectArabicLanguage =['عربي','إنجليزي'];

    this.selected = '';
    this.hidden = true;

    this.formValidation();

    $( "#datepicker-3" ).datepicker({
      dateFormat:"dd-mm-yy",
      changeMonth: true,
      changeYear: true,
      beforeShowDay: function(date) {
        var day = date.getDay();
        return [(day == 4)];
      }
   });
  }

  get m() {
    return this.searchForm.controls;
  }

  formValidation() {
    this.searchForm = this.formBuilder.group({
      meetingdate: ["", [Validators.required]],         
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

  postsearch() {      
      var params = {
        weekDay: $("#datepicker-3").val()
      };

      this._appService.getUnattendedMemberList(params).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status == APIResponse.Success) {
             this.membersList = Bulk.getUnattendedMemberList(response);
             //console.log("Test:",this.membersList);
          } 
        },
        (err) => {
         // console.log("server error");
        }
      );

      //getUnattendedMemberList(params);
      console.log("MEETING DATE =>",params);
    
  }

  // getUnattendedMemberList() {
  //   let reqParams ={
  //     "weekDay":"09-02-2023"
  // }
  //   this._appService.getUnattendedMemberList(reqParams).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       if (response.status == APIResponse.Success) {
  //          this.membersList = Bulk.getUnattendedMemberList(response);
  //          console.log("Test:",this.membersList);
  //       } 
  //     },
  //     (err) => {
  //      // console.log("server error");
  //     }
  //   );
  // }


}
