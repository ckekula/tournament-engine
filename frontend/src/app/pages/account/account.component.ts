import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/shared/header/header.component';
import { FooterComponent } from '../../components/shared/footer/footer.component';
import { OrgSectionComponent } from '../../components/account/org-section/org-section.component';

@Component({
    selector: 'app-account',
    imports: [
      HeaderComponent,
      FooterComponent,
      OrgSectionComponent
],
    templateUrl: './account.component.html',
    styleUrl: './account.component.scss'
})
export class AccountComponent {

}
