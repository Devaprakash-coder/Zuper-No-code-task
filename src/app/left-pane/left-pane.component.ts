import { Component, EventEmitter, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CommonService } from '../common.service';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.css'],
  imports: [CommonModule, DragDropModule, MatIconModule, ReactiveFormsModule],
})
export class LeftPaneComponent {
  fieldGroups: any[] = [];
  selectedGroup: any;
  formGroup!: FormGroup<any>;
  isButtonClicked: boolean = false;
  @Output() groupDeleted = new EventEmitter();

  constructor(private commonService: CommonService, private dialog: MatDialog, private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit() {
    this.formGroup.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value) => {
      this.fieldGroups = value.fieldGroups;
      this.setValueInLocal(value)
      this.isButtonClicked = false;
    })

    this.commonService.copiedGroup.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((group) => {
      if (group) {
        this.fieldGroupsArray.push(group)
      }
    })
    // this.fieldGroups = this.commonService.fieldGroups;
    // this.commonService.copiedGroup.subscribe((res: any) => {
    //   let copiedGroup = { ...res }
    //   copiedGroup.selected = false;
    //   copiedGroup.groupName = copiedGroup.groupName + " " + 'Copy'
    //   this.fieldGroups.push(copiedGroup)
    // });
  }

  initializeForm() {
    let localFormGroup = JSON.parse(localStorage.getItem('formValue') as string);
    if (localFormGroup && localFormGroup.fieldGroups) {
      this.formGroup = this.fb.group({
        fieldGroups: this.fb.array(
          localFormGroup.fieldGroups.map((group: any) => this.createFieldGroup(group))
        )
      });
    } else {
      this.formGroup = this.fb.group({
        fieldGroups: this.fb.array([
          this.fb.group({
            id: [Date.now()],
            groupName: ['Default Group'],
            groupDesc: [''],
            selected: [false],
            formElementsList: this.fb.array([
              this.fb.group({
                name:['Text Field'],
                type: ["text"],
                icon: ["../../assets/text.png"],
                placeholder: ["Type Here..."],
                mandatory: [false],
                readOnly: [false]
              })
            ])
          })
        ])
      });
    }
    this.fieldGroups = this.formGroup.value.fieldGroups;
  }

  createFieldGroup(data: any): FormGroup {
    return this.fb.group({
      id: [data.id],
      groupName: [data.groupName],
      groupDesc: [data.groupDesc],
      selected: [false],
      formElementsList: this.fb.array(
        data.formElementsList?.map((el: any) => this.fb.group(el)) || []
      )
    });
  }

  setValueInLocal(value: any) {
    localStorage.setItem('formValue', JSON.stringify(value));
  }

  get fieldGroupsArray(): FormArray {
    return this.formGroup.get('fieldGroups') as FormArray
  }

  addNewFieldGroup() {
    if (this.isButtonClicked) return;
    this.isButtonClicked = true;
    const newFieldGroup = this.fb.group({
      id: [Date.now()],
      groupName: [`New Group ${this.fieldGroups.length}`],
      groupDesc: [''],
      selected: [false],
      formElementsList: this.fb.array([])
    });
    this.fieldGroupsArray.push(newFieldGroup)
  }

  openDeleteDialog(element: any, id: number) {
    const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
      width: 'auto',
      data: { name: element.groupName }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let index = this.fieldGroups.findIndex(group => group.id === id);
        if (index !== -1) {
          this.fieldGroups.splice(index, 1);
          this.fieldGroupsArray.removeAt(index);
          this.groupDeleted.emit(true)
        }
      }
    });
  }

  selectedFieldGroup(groupData: any) {
    this.setAllSelectedFalse();
    let selectedGroup = this.fieldGroupsArray.controls.find(group => group.value.id === groupData.id);
    if (selectedGroup) {
      selectedGroup.patchValue({ selected: true });
      this.commonService.selectedGroup.next(selectedGroup as FormGroup)
    }
  }

  setAllSelectedFalse() {
    this.fieldGroupsArray.controls.forEach(group => group.patchValue({ selected: false }));
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.fieldGroups, event.previousIndex, event.currentIndex);
    moveItemInArray(this.fieldGroupsArray.controls, event.previousIndex, event.currentIndex);
  }

}
