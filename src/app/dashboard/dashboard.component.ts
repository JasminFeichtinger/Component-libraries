import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BackendService } from '../shared/backend.service';
import { StoreService } from '../shared/store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  sizePerPage: number = 10;
  totalSize: number = 0;
  pageIndex: number = 0;


  constructor(private backendService: BackendService, private storeService: StoreService) { }

  async ngOnInit() {

    await this.backendService.getSensoren();
    await this.backendService.getSensorenDaten();
    this.totalSize = this.backendService.entryCount;
  }
  
  handlePageEvent(event: PageEvent) {
    console.log('event triggered! ' + event.length + " " + event.pageSize + " " + event.pageIndex);
    this.backendService.page = event.pageIndex+1;
    this.backendService.sensorsPerPage = event.pageSize;
    this.backendService.getSensorenDaten();
  }

}
