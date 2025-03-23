import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonService } from '../common.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LeftPaneComponent } from '../left-pane/left-pane.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-main-frame',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    DragDropModule,
    MatSidenavModule,
    LeftPaneComponent,
    ReactiveFormsModule,
    MatSlideToggleModule
  ],
  templateUrl: './main-frame.component.html',
  styleUrls: ['./main-frame.component.css']
})
export class MainFrameComponent {
  editEnabled: boolean = false;
  selectedGroup!: FormGroup | null;
  formElements!: FormArray<FormGroup>;
  isPreviewMode: boolean = false;

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

  constructor(private commonService: CommonService, private dialog: MatDialog, private fb: FormBuilder) { }

  ngOnInit() {
    this.commonService.selectedGroup.subscribe(group => {
      if (group) {
        this.selectedGroup = group;
        this.editEnabled = false;
        this.formElements = group.get('formElementsList') as FormArray;
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log("dropped");
    moveItemInArray(this.formElements.controls, event.previousIndex, event.currentIndex);
    if (event.previousContainer !== event.container) {
        const draggedElement = this.formElementsList[event.previousIndex];
        this.formElements.push(this.createFormGroup(draggedElement));
    }
  }

  createFormGroup(element:any) {
    return this.fb.group({
      name: [element.name],
      type: [element.type],
      icon: [element.icon],
      placeholder: [element.placeholder],
      mandatory: [element.mandatory],
      readOnly: [element.readOnly]
    })
  }

  removeField(index: number) {
    this.formElements.removeAt(index);
  }

  openElementEditor(element: any) {
    this.elementEditorDrawer.open();
    this.selectedElement = element;
  }

  closeEditor() {
    this.elementEditorDrawer.close();
  }

  copyElement(element: any) {
    const copiedElement = this.createFormGroup(element)
    this.formElements.push(copiedElement);
  }

  openDeleteDialog(element: any, type: string, index?: number) {
    let title = element.name || element.groupName;
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: 'auto',
      data: { name: title }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if (type === 'deleteElement' && typeof index === 'number') {
          this.removeField(index)
          this.closeEditor()
        }
        else if (type === 'deleteGroup' && this.selectedGroup) {
          this.selectedGroup.patchValue({ selected: false });
          this.selectedGroup = null;
        }
      }
    });
  }

  copyGroup(group: any) {
    let formElements = group.formElementsList.map((element: any) => this.createFormGroup(element));
    const copiedGroup = this.fb.group({
      id: [Date.now()],
      groupName: [`${group.groupName} Copy`],
      groupDesc: [group.groupDesc],
      selected: [false],
      formElementsList: this.fb.array(formElements)
    });
    this.commonService.copiedGroup.next(copiedGroup);
  }

  ngOnDestroy() {
    this.commonService.selectedGroup.unsubscribe();
  }
}


