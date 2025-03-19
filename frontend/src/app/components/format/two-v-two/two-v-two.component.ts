import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-two-v-two',
  imports: [],
  templateUrl: './two-v-two.component.html',
  styleUrl: './two-v-two.component.scss'
})
export class TwoVTwoComponent {
  @Input() data!: { id: number; name: string };
}
