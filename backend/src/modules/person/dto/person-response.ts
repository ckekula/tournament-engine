import { OrganizationResponse } from "src/modules/organization/dto/organization-response";

export class PersonResponse {
  id: number;
  name: string;
  organization: OrganizationResponse;
  createdAt: Date;
  updatedAt: Date;
}