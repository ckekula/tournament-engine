import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-top-three',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './top-three.component.html',
  styleUrl: './top-three.component.scss'
})
export class TopThreeComponent implements OnInit {
  faTrophy = faTrophy;

  podium!: {
    champion: string;
    firstRunnerUp: string;
    secondRunnerUp: string;
  };

  universities = [
    'University of Colombo',
    'University of Ruhuna',
    'University of Peradeniya',
    'University of Moratuwa',
    'University of Sri Jayewardenepura',
    'University of Kelaniya',
    'University of Jaffna'
  ];

  ngOnInit() {
    this.assignRandomPodium();
  }

  private assignRandomPodium() {
    const shuffled = [...this.universities]
      .sort(() => 0.5 - Math.random());

    this.podium = {
      champion: shuffled[0],
      firstRunnerUp: shuffled[1],
      secondRunnerUp: shuffled[2],
    };
  }
}
