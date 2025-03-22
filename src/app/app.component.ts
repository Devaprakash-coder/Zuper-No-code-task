import { Component } from '@angular/core';
import { MainFrameComponent } from './main-frame/main-frame.component';

@Component({
  selector: 'app-root',
  imports: [MainFrameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'no-code-task-app';
}
