import { Component } from '@angular/core';
import { HeaderComponent } from '../../../components/shared/header/header.component';
import { FooterComponent } from '../../../components/shared/footer/footer.component';
import { TabsComponent } from '../../../components/shared/tabs/tabs.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-tourna-org',
  imports: [
    HeaderComponent,
    FooterComponent,
    TabsComponent,
    ButtonModule
  ],
  templateUrl: './tourna-org.component.html',
  styleUrl: './tourna-org.component.scss'
})
export class TournaOrgComponent {
  tabs = [
    { title: 'Teams', value: 0, component: null },
  ];
}
