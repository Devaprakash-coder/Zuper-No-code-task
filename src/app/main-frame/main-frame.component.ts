import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LeftPaneComponent } from '../left-pane/left-pane.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-main-frame',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    DragDropModule,
    MatSidenavModule,
    LeftPaneComponent
  ],
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent {
  selectedGroup: any;
  editEnabled: boolean = false;

  formElementsList = [
    { name: 'Text Field', type: 'text', icon: '../../assets/text.png', placeholder: 'Type Here...', mandatory: false, readOnly: false },
    { name: 'Textarea', type: 'textarea', icon: '../../assets/text desc.png', placeholder: 'Type Here...', mandatory: false, readOnly: false },
    { name: 'Date', type: 'date', icon: '../../assets/calendar.png', placeholder: 'Type Here...', mandatory: false, readOnly: false },
    { name: 'Time', type: 'time', icon: '../../assets/clock.png', placeholder: 'Type Here...', mandatory: false, readOnly: false },
    { name: 'Date & Time', type: 'datetime-local', icon: '../../assets/date-time.png', mandatory: false, readOnly: false },
    { name: 'Dropdown', type: 'select', icon: '../../assets/drop-down.png', placeholder: 'Select an option', mandatory: false, readOnly: false },
    { name: 'Radio Button', type: 'radio', icon: '../../assets/radio.png', mandatory: false, readOnly: false },
    { name: 'Checkbox', type: 'checkbox', icon: '../../assets/checkbox.png', mandatory: false, readOnly: false },
    { name: 'File Upload', type: 'file', icon: '../../assets/calendar.png', mandatory: false, readOnly: false }
  ];

  @ViewChild('rightDrawer') rightDrawer!: MatDrawer;
  @ViewChild('elementEditorDrawer') elementEditorDrawer!: MatDrawer;
  selectedElement: any;

  constructor(private commonService: CommonService, private dialog: MatDialog) { }

  ngOnInit() {
    this.commonService.selectedGroup.subscribe(res => {
      this.selectedGroup = res;
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log("dropped")
    moveItemInArray(this.selectedGroup.formElementsList, event.previousIndex, event.currentIndex);
    if (event.previousContainer !== event.container) {
      const draggedElement = this.formElementsList[event.previousIndex];
      this.selectedGroup.formElementsList.push({ ...draggedElement, id: Date.now() });
    }
  }

  openElementEditor(element: any) {
    this.elementEditorDrawer.open()
    this.selectedElement = element;
  }

  closeEditor() {
    this.elementEditorDrawer.close()
  }

  copyElement(element: any) {
    this.selectedGroup.formElementsList.push(element)
  }

  openDeleteDialog(element: any, type: string, index?: number) {
    let title = element.name || element.groupName;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: 'auto',
      data: { name: title }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && type == 'deleteElement') {
        this.selectedGroup.formElementsList.splice(index, 1);
      }
      else if (result && type == 'deleteGroup') {
        console.log("this", this.selectedGroup)
        this.selectedGroup = null
      }
    });
  }

  copyGroup(group: any) {
    console.log("group", group)
    this.commonService.copiedGroup.next(group)
  }

  saveForm() {
    this.commonService.saveToLocalStorage();
  }

  ngOnDestroy() {
    this.commonService.selectedGroup.unsubscribe();
  }
}
