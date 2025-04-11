import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Tournament } from 'src/entities/tournament.entity';
import { ValidationPipe } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentResponse } from './dto/tournament-response';
import { UpdateTournamentInput } from './dto/updateTournament.input';
import { CreateTournamentInput } from './dto/createTournament.input';

@Resolver(() => Tournament)
export class TournamentResolver {
  constructor(private readonly tournamentService: TournamentService) {}

  @Query(() => [Tournament], { name: 'tournaments' })
  async findAll(): Promise<Tournament[]> {
    return this.tournamentService.findAll();
  }

  @Query(() => Tournament, { name: 'tournament' })
  async findOne(@Args('id', { type: () => ID }) id: number): Promise<Tournament> {
    return this.tournamentService.findOne(id);
  }

  @Query(() => Tournament, { name: 'tournamentBySlug' })
  async findBySlug(@Args('slug') slug: string): Promise<Tournament> {
    return this.tournamentService.findBySlug(slug);
  }

  @Query(() => [Tournament], { name: 'tournamentsByUser' })
  async findByUser(@Args('userId', { type: () => ID }) userId: number): Promise<Tournament[]> {
    return this.tournamentService.findByUser(userId);
  }

  @Mutation(() => TournamentResponse)
  async createTournament(
    @Args('createTournamentInput', new ValidationPipe()) createTournamentInput: CreateTournamentInput,
  ): Promise<TournamentResponse> {
    try {
      const tournament = await this.tournamentService.create(createTournamentInput);
      return {
        success: true,
        message: 'Tournament created successfully',
        tournament,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create tournament',
      };
    }
  }

  @Mutation(() => TournamentResponse)
  async updateTournament(
    @Args('id', { type: () => ID }) id: number,
    @Args('updateTournamentInput', new ValidationPipe()) updateTournamentInput: UpdateTournamentInput,
  ): Promise<TournamentResponse> {
    try {
      const tournament = await this.tournamentService.update(id, updateTournamentInput);
      return {
        success: true,
        message: 'Tournament updated successfully',
        tournament,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update tournament',
      };
    }
  }

  @Mutation(() => TournamentResponse)
  async removeTournament(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<TournamentResponse> {
    try {
      const result = await this.tournamentService.remove(id);
      return {
        success: result,
        message: result ? 'Tournament deleted successfully' : 'Failed to delete tournament',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete tournament',
      };
    }
  }
}