// category.enum.ts
import { registerEnumType } from '@nestjs/graphql';

export enum ActivityCategory {
  GENDER = 'GENDER',
  AGE_GROUP = 'AGE_GROUP',
  WEIGHT_CLASS = 'WEIGHT_CLASS',
}

registerEnumType(ActivityCategory, {
  name: 'ActivityCategory',
  description: 'Possible categories for an activity',
});
