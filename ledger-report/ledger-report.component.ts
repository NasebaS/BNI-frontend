import { Component, OnInit, ViewChild,Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { AppService } from "src/service/app.service";
import { Expense } from "src/model/income-expense/income-expense.model";
import { APIResponse, FileUploadType } from "src/utils/app-constants";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Ledger } from "src/model/ledger/ledger.model";
import * as moment from 'moment';
import {LedgerReport} from "src/model/ledger-reports/ledger-reports.model"
import * as XLSX from 'xlsx'; 
declare var $: any;
@Component({
  selector: 'app-ledger-report',
  templateUrl: './ledger-report.component.html',
  styleUrls: ['./ledger-report.component.scss']
})
export class LedgerReportComponent implements OnInit {
  

  fromDate: string;
  toDate: string;
  selectedLedger: string;
  selectedType: string;
  filteredExpenses: Expense[] = [];
  filteredLedgerName: Expense[]=[];
  ledgerNames: string[] = [];
  expenseList: Expense[] = [];
  ledgerNameToIdMap: { [name: string]: number } = {};
  submitted = false;
  newUsersForm: FormGroup;
  modalHeaderText;
  ExpenseId: number;
  selectedUsers: Expense;
  ledgerList: Ledger[] = [];
  ledgerReportList:LedgerReport[]=[];
  totalIncome: number = 0;
  totalExpense: number = 0;
  fileName: string = 'filename.xlsx';

  @ViewChild("newUsers") empModal: any;

  isEditEnabled = false;
  

  constructor(
     private _appService: AppService,
    public formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {}
  filterCriteria = {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
    selectedLedger: 'All',
    selectedType: 'All'
  };
  
  ngOnInit() {
    this.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    this.toDate = moment().format('YYYY-MM-DD');
  
    this.getExpenseList();
    this.formValidation();
    this.getLedgerList();
    this.selectedLedger = 'All';
    this.selectedType = 'All';
  }
  ngAfterViewInit() {

  }
  applyFilters() {
    const filterCriteria = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      selectedLedger: this.selectedLedger,
      selectedType: this.selectedType
    };
    this.getFilteredExpenses(filterCriteria);
  
  }
  getFilteredExpenses(filterCriteria) {
    this._appService.getLedgerReports(filterCriteria).subscribe(
      (response: any) => {

        if (response.status == 0) {       
          this.ledgerReportList = LedgerReport.getLedgerreport(response.ledgerReportList);         
          this.totalIncome = this.ledgerReportList
          .filter(item => item.Type === 'Income')
          .reduce((sum, item) => sum + item.Amount, 0);

        this.totalExpense = this.ledgerReportList
          .filter(item => item.Type === 'Expense')
          .reduce((sum, item) => sum + item.Amount, 0);
         
        }
      return this.filteredExpenses;
      },
      (err) => {
        console.error('API Error:', err);
      }
    );
  }
  getExpenseList() {
    
    let reqParams = {
      "query": { "isdeleted": { "eq": 0 } },
      "options": { "page": 1, "paginate": 9999  },
      "isCountOnly": false
    };
    this._appService.getExpenseList(reqParams).subscribe(
      (response: any) => {
      
        if (response.status == 0) {     
          this.expenseList = Expense.getExpenseList(response.expenseList);
          this.expenseList.forEach((entry, index) => {
            entry.serialNumber = index + 1;
          }); 
      
        }
     
      },
      (err) => {
        console.error('API Error:', err);
      }
    );
       
  }
  
  
  getLedgerList() {
    let reqParams={ 
      "query": {"isdeleted":{"eq":0}},
    "options": {  "page": 1, "paginate": 9999 },
     "isCountOnly": false 
    }
    this._appService.getLedgerList(reqParams).subscribe(
      (response: any) => {
        
        if (response.status == 0) {
         
           this.ledgerList = Ledger.getLedgeList(response.ledgerList );
    const finalLedgerList=this.ledgerList.filter(item=>item.status==='Active')
           this.ledgerNames = finalLedgerList.map(ledger => {
            this.ledgerNameToIdMap[ledger.name] = ledger.ledgerId; 
            return ledger.name;
            
          });
        
      }
    },
    (err) => {
      console.error('API Error:', err);
    }
  );
}
exportexcel() {
  let element = document.getElementById('example'); 
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, this.fileName);
  // const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, {header:['dataprop1', 'dataprop2']});
  // const workBook: XLSX.WorkBook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
  // XLSX.writeFile(workBook, 'filename.xlsx');
 
  // table.buttons.exportData(); 
 
}

  formValidation() {
    this.newUsersForm = this.formBuilder.group({
     
      entry_date: ["", [Validators.required]],
      refnum:["", [Validators.required]],
      ledgername:["", [Validators.required]],
      type:["", [Validators.required]],   
      amount: ["", [Validators.required]],
      notes: ["", [Validators.required]],
    });
  }

  extraLarge(exlargeModal: any) {
    this.submitted = false;
    this.modalService.open(exlargeModal, { size: "lg", centered: true, scrollable: true });
    this.isEditEnabled = false;
    this.ExpenseId=0;
    
    this.newUsersForm.reset();
    this.modalHeaderText = "Ledger Report Entry";
    this.newUsersForm = this.formBuilder.group({
      
      entry_date: ["", [Validators.required]],
      refnum:["", [Validators.required]],
      ledgername:["", [Validators.required]],
      type:["", [Validators.required]],   
      amount: ["", [Validators.required]],
      notes: ["", [Validators.required]],
     
    });
    // this.newUsersForm.get('ledgername').valueChanges.subscribe(selectedLedger => {
    //   this.selectedLedger = selectedLedger;
    //   this.filterLedgerName();
    // });
  }

  openModal(modal) {
    this.modalHeaderText = "Ledger Report Table";
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
 }
   
}
  