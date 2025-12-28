import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Organization } from "src/entities/organization.entity";
import { User } from "src/entities/user.entity";
import { Event } from "src/entities/event.entity";
import { Person } from "src/entities/person.entity";
import { CreatePersonInput } from "./dto/createPerson.input";
import { PersonResponse } from "./dto/person-response";

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async create(userId: number, createPersonInput: CreatePersonInput): Promise<PersonResponse> {
    const { name, organizationId } = createPersonInput;

    const user = await this.userRepository.findOne({
      where: { id: userId },
        relations: ["adminOrganizations"],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isUserAdmin = user.adminOrganizations.find(
      (org) => org.id === organizationId,
    );
    if (!isUserAdmin) {
      throw new ConflictException(
        `User does not have permission to create a person for organization with ID ${organizationId}`,
      );
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }
    try {    
        const person = this.personRepository.create({name, organization});
        return await this.personRepository.save(person);
    } catch (error) {
        throw new InternalServerErrorException("Failed to create person");
    }
  }

  async findByOrganization(organizationId: number): Promise<PersonResponse[]> {
    try {
        return await this.personRepository.find({
            where: { organization: { id: organizationId } },
        });
    } catch (error) {
        throw new InternalServerErrorException(`Failed to fetch persons for organization: ${organizationId}`);
    }
  }
}