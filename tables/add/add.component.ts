import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  // Select2 Dropdown
  selectRole: string[];
  selectTitle: string[];
  selectNationality: string[];
  selectCode: string[];
  selectBG: string[];
  selectDegree: string[];
  selectLanguage: string[];
  selectArabicLanguage: string[];
  hidden: boolean;
  selected: any;
  constructor() { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Users' }, { label: 'New User', active: true }];
    
    // Select dropdown value
    // tslint:disable-next-line: max-line-length
    this.selectRole = ['Nurse', 'Lab Technician', 'Physiotherapist', 'General Physician'];
    this.selectTitle = ['Ms', 'Prof_Female', 'Prof_Male', 'Mr', 'Dr'];
    this.selectNationality =['Saudi Arabia'];
    this.selectCode =['+966'];
    this.selectBG =['A+','B+','AB+','A-','B-','AB-','O+','O-'];
    this.selectDegree =['Bachelor Degree','PhD','Master Degree','Diploma','High School'];
    this.selectLanguage =['Arabic','English'];
    this.selectArabicLanguage =['عربي','إنجليزي'];

    this.selected = '';
    this.hidden = true;
  }

}
