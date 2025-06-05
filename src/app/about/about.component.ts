import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  team = [
    { name: 'Sarah Chen', role: 'CEO', image: 'assets/sarah.png' },
    { name: 'David Lee', role: 'CTO', image: 'assets/david.png' },
    { name: 'Emily Wong', role: 'Head of Marketing', image: 'assets/emily.png' },
    { name: 'Michael Tan', role: 'Lead Developer', image: 'assets/michael.png' }
  ];
}
