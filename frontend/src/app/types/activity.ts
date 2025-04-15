export interface Activity {
    id: number;
    name: string;
}

export interface CreateActivityResponse {
  createActivity: {
    success: boolean;
    message: string;
    activity: Activity;
  };
}