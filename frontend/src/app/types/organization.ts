export interface Organization {
    id: number;
    name: string;
    slug: string;
}

export interface CreateOrganizationInput {
    name: string;
    slug: string;
}