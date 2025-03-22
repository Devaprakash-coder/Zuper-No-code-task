import { Component, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray,DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../common.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.css'],
  imports: [CommonModule, DragDropModule,MatIconModule],
})
export class LeftPaneComponent {
  fieldGroups:any[]=[];
  selectedGroup:any;


  constructor(private commonService:CommonService,private dialog:MatDialog){}

  addNewFieldGroup() {
    const newFieldGroup = { groupName: `New Group ${this.fieldGroups.length}`,groupDesc:"", selected: false,formElementsList:[] };
    this.fieldGroups.push(newFieldGroup);
  }

  deleteFieldGroup(index: number) {
      this.fieldGroups.splice(index, 1);
  }

  openDeleteDialog(element: any, index: number) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: 'auto',
      data: { name: element.groupName }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result",result)
      if (result) {
        this.fieldGroups.splice(index, 1);
      }
    });
  }

  selectedFieldGroup(group:any){
    this.fieldGroups.map(group => group.selected = false)
    group.selected = true;
    this.commonService.selectedGroup.next(group)
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.fieldGroups, event.previousIndex, event.currentIndex);
    this.commonService.saveToLocalStorage()
  }

  copyGroup(){
    this.commonService.copiedGroup.subscribe()
  }

  ngOnInit() {
    this.fieldGroups = this.commonService.fieldGroups;
    this.commonService.copiedGroup.subscribe((res:any) => {
      this.fieldGroups.push({...res})
    });
  }

}
