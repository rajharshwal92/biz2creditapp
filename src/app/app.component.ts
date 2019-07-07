import { Component, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { sortBy as _sortBy } from 'lodash';

import distance from './shared/utility';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('table', null) table: MatTable<Element>;
  title = 'biz2creditApp';
  fileContent: any = '';
  showInvite: boolean = false;
  displayedColumns: string[] = ['user_id', 'name', 'latitude', 'longitude', 'dist'];
  dataSource: any = [];
  dublinGPSCord = {
    latitude: 53.339428,
    longitude: -6.257664
  };

  onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    const dablinLat = this.dublinGPSCord.latitude;
    const dablinLong = this.dublinGPSCord.longitude;
    fileReader.onloadend = function (x) {
      self.fileContent = fileReader.result;
      let fileData = self.fileContent.split('\r\n');
      for (let item of fileData) {
        const customer = JSON.parse(item);
        customer.dist = distance(dablinLat, dablinLong, customer.latitude, customer.longitude, 'K');
        self.dataSource.push(customer);
      }
      self.dataSource = _sortBy(self.dataSource, 'user_id');
      self.table.renderRows();
      self.showInvite = true;
    }
    fileReader.readAsText(file);
  }
  getNearestCustomer() {
    const filteredData: any = [];
    this.dataSource.forEach(element => {
      if (element.dist >= 100) {
        filteredData.push(element);
      }
    });
    this.dataSource = _sortBy(filteredData, 'user_id');
    this.table.renderRows();
  }
}
