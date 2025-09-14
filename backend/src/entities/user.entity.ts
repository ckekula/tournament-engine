import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Organization } from './organization.entity';
import { Matches } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @Matches(/^[A-Za-z]+$/, {
    message: 'First name can only contain letters',
  })
  firstname: string;

  @Column({ length: 50 })
  @Matches(/^[A-Za-z]+$/, {
    message: 'Last name can only contain letters',
  })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('simple-array', { default: ['user'] })
  roles: string[];

  @OneToMany(() => Organization, organization => organization.owner)
  ownedOrganizations: Organization[];

  @ManyToMany(() => Organization, organization => organization.admins)
  @JoinTable()
  adminOrganizations: Organization[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}