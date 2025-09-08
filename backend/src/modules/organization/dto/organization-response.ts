import { UserResponse } from "src/modules/user/dto/user-response";

export class OrganizationResponse {
  id: number;
  slug: string;
  name: string;
  description?: string;
  owner: UserResponse;
  admins: UserResponse[];
  createdAt: Date;
  updatedAt: Date;
}