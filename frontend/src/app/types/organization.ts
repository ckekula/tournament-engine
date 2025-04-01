export interface Organization {
    id: number;
    name: string;
    abbreviation: string;
}

export interface CreateOrganizationResponse {
    createOrganization: {
      success: boolean;
      message: string;
      organization: Organization;
    };
}