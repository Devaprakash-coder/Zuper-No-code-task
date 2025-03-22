import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-right-pane',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatIconModule], 
  templateUrl: './right-pane.component.html',
  styleUrls: ['./right-pane.component.css']
})
export class RightPaneComponent {
  @Output() elementDropped = new EventEmitter<any>();
  @ViewChild('rightPaneList', { static: true }) rightPaneDropList!: CdkDropList;

  formElements = [
    { name: 'Text Field', type: 'text' },
    { name: 'Textarea', type: 'textarea' },
    { name: 'Date', type: 'date' },
    { name: 'Time', type: 'time' },
    { name: 'Date & Time', type: 'datetime-local' },
    { name: 'Dropdown', type: 'select' },
    { name: 'Radio Button', type: 'radio' },
    { name: 'Checkbox', type: 'checkbox' },
    { name: 'File Upload', type: 'file' }
  ];

  drop(event: CdkDragDrop<any[]>) {
    // Ensure the drop happens in a different container (MainFrameComponent)
    if (event.previousContainer !== event.container) {
      const draggedElement = this.formElements[event.previousIndex];
      this.elementDropped.emit(draggedElement);
    }
  }
}
