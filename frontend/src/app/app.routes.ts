import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/auth/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { TournamentComponent } from './pages/tournament/tournament.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { EventComponent } from './pages/event/event.component';
import { AuthGuard } from './services/auth/auth.guard';

const organizationPath = 'org/:organizationId/:organizationSlug';
const tournamentPath = ':tournamentId/:tournamentSlug';
const activityPath = ':activityId/:activitySlug';
const eventPath = ':eventId/:eventSlug';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
  { path: organizationPath, component: OrganizationComponent },

  // Tournament hierarchy
  { path: tournamentPath, component: TournamentComponent },
  { path: `${tournamentPath}/${activityPath}`, component: ActivityComponent },
  { path: `${tournamentPath}/${activityPath}/${eventPath}`, component: EventComponent },
  // { path: `${tournamentPath}/${activityPath}/${eventPath}/${matchPath}`, component: MatchComponent },
];
