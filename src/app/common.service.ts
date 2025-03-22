import { Injectable } from '@angular/core';
import {Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CommonService {
selectedGroup = new Subject()
copiedGroup = new Subject()
fieldGroups = [{ groupName: 'Default Group',groupDesc:"", selected: false,formElementsList:[] }];

  constructor() { 
    let storedGroup = localStorage.getItem("formFields");
    if(storedGroup){
      this.fieldGroups = JSON.parse(storedGroup as string);
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('formFields', JSON.stringify(this.fieldGroups));
  }
}
