import { OrganizationResponse } from "src/modules/organization/dto/organization-response";

export class TournamentResponse {
  id: number;
  slug: string;
  name: string;
  season: string;
  organizer: OrganizationResponse;
  createdAt: Date;
  updatedAt: Date;
}