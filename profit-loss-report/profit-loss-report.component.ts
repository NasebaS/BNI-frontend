import { Component, OnInit, ViewChild,Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { AppService } from "src/service/app.service";
import { Expense } from "src/model/income-expense/income-expense.model";
import { APIResponse, FileUploadType } from "src/utils/app-constants";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Ledger } from "src/model/ledger/ledger.model";
import * as moment from 'moment';
import {LedgerReport} from "src/model/ledger-reports/ledger-reports.model";
import { WeeklyfeeModel } from "src/model/weeklyfee/weeklyfee.model";
import * as XLSX from 'xlsx'; 
@Component({
  selector: 'app-profit-loss-report',
  templateUrl: './profit-loss-report.component.html',
  styleUrls: ['./profit-loss-report.component.scss']
})
export class ProfitLossReportComponent implements OnInit {
  fromDate: string;
  toDate: string;
  Income:string[]=[];
  Expense:string[]=[];
  totalIncome: number = 0;
  totalIncomeFinal:number=0;
  totalExpense: number = 0;
  Profit:number=0;
  Loss:number=0;
  Weeklyfee:number=0;
  LedgerName:string[]=[];
  Amount:string[]=[];
  filteredExpenses: Expense[] = [];
  incomeExpenseRows: any[] = [];
  WeeklyFeeAmountList:WeeklyfeeModel[]=[];
  WeeklyFeeValue:number;
  ledgerReportList:LedgerReport[]=[];
  constructor(
    private _appService: AppService,
    public formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }
 
  params = {
    fromDate: moment().startOf('month').format('YYYY-MM-DD'),
    toDate: moment().format('YYYY-MM-DD'),
   
  };
  ngOnInit(): void {
    this.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    this.toDate = moment().format('YYYY-MM-DD');
    
  }
  applyFilters() {
    const params = {
      fromDate: this.fromDate,
      toDate: this.toDate,
     
    };
    this.getFilteredProfitLoss(params);
    this.weeklyfee(params);
    this.calculateTotalIncomeFinal();
  
  }
  calculateTotalIncomeFinal() {  
    this.totalIncomeFinal = this.totalIncome + this.Weeklyfee;   
  }
  // Preprocess your data to align Income and Expense items
prepareData() {
  const incomeList = this.ledgerReportList.filter(item => item.Type === 'Income');
  const expenseList = this.ledgerReportList.filter(item => item.Type === 'Expense');
  
  const maxItems = Math.max(incomeList.length, expenseList.length);
  
  for (let i = 0; i < maxItems; i++) {
    this.incomeExpenseRows.push({
      incomeLedger: incomeList[i]?.ledgerName || '',
      incomeAmount: incomeList[i]?.Amount || '',
      expenseLedger: expenseList[i]?.ledgerName || '',
      expenseAmount: expenseList[i]?.Amount || ''
    });
  }
  
}
  getFilteredProfitLoss(params) {
    this.incomeExpenseRows.splice(0, this.incomeExpenseRows.length);
    this._appService.getProfitLossReports(params).subscribe(
      (response: any) => {

        if (response.status == 0) {       
          this.ledgerReportList = LedgerReport.getLedgerreport(response.ledgerReportList);   
          console.log("this is ledgerreportlist array:",this.ledgerReportList)      
          this.totalIncome = this.ledgerReportList
          .filter(item => item.Type === 'Income')
          .reduce((sum, item) => sum + item.Amount, 0);
        

        this.totalExpense = this.ledgerReportList
          .filter(item => item.Type === 'Expense')
          .reduce((sum, item) => sum + item.Amount, 0);

          if(this.totalIncome>this.totalExpense){
            this.Profit=this.totalIncome-this.totalExpense;
          
          }else{
            this.Loss=this.totalExpense-this.totalIncome;
          }
        
          this.prepareData()
        }
     
      return this.ledgerReportList;
     
      },
      (err) => {
        console.error('API Error:', err);
      }
    );
  }
  weeklyfee(params) {
    this._appService.getWeeklyFeeTotal(params).subscribe(
      (response: any) => {
        if (response.status == 0) {
          this.WeeklyFeeValue = response.WeeklyFeeAmountList;
          this.Weeklyfee = this.WeeklyFeeValue[0]?.WeeklyFee ?? 0;
          this.calculateTotalIncomeFinal();
        }
      },
      (error) => {
        console.error('Error fetching Weekly Fee:', error);
        this.Weeklyfee = 0; 
        this.calculateTotalIncomeFinal();
      }
    );
  }
  
}
