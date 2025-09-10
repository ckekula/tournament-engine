import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tournament } from '../../types/models';
import { HeaderComponent } from "../../components/shared/header/header.component";
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { AddTournaComponent } from '../../components/organization/add-tourna/add-tourna.component';
import { TournaCardComponent } from '../../components/organization/tourna-card/tourna-card.component';
import { TournaSectionComponent } from '../../components/organization/tourna-section/tourna-section.component';

@Component({
  selector: 'app-organization',
  imports: [
    HeaderComponent,
    FooterComponent,
    TournaSectionComponent
  ],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent {
}
