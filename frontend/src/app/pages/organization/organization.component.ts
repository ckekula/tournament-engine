import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tournament } from '../../types/tournament';
import { HeaderComponent } from "../../components/shared/header/header.component";
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { AddTournaComponent } from '../../components/organization/add-tourna/add-tourna.component';
import { TournaCardComponent } from '../../components/organization/tourna-card/tourna-card.component';
import { TournaListComponent } from "../../components/organization/tourna-list/tourna-list.component";

@Component({
  selector: 'app-organization',
  imports: [
    CommonModule,
    ButtonModule,
    HeaderComponent,
    FooterComponent,
    AddTournaComponent,
    TournaCardComponent,
    TournaListComponent
],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent {
  
  constructor(
    private router: Router,
  ) {}

  newTournaVisible = false;

  toggleNewTourna(): void {
    this.newTournaVisible = true;
  }
}
