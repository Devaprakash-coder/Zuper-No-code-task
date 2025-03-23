import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  selectedGroup = new BehaviorSubject<FormGroup | null>(null);
  copiedGroup = new Subject<FormGroup | null>();

  constructor() {}
}
