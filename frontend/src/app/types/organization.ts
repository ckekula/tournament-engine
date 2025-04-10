export interface Organization {
    id: number;
    name: string;
    slug: string;
}

export interface CreateOrganizationResponse {
    createOrganization: {
      success: boolean;
      message: string;
      organization: Organization;
    };
}