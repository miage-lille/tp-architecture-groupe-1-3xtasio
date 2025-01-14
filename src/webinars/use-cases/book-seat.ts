import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { Participation } from '../entities/participation.entity';
import { ParticipationAlreadyExistsException } from '../exceptions/participation-already-participating';
import { WebinarNoSeatAvailableException } from '../exceptions/webinar-no-seat-available copy';

type Request = {
  webinarId: string;
  user: User;
};
type Response = void;

export class BookSeat implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly webinarRepository: IWebinarRepository,
    private readonly mailer: IMailer,
  ) { }
  async execute({ webinarId, user }: Request): Promise<Response> {

    let webinar = await this.webinarRepository.findById(webinarId);
    let participations: Participation[] = await this.participationRepository.findByWebinarId(webinarId);
    if (!webinar.hasAvailableSeat(participations)) {
      throw new WebinarNoSeatAvailableException();
    }

    let userExists = await this.userRepository.findById(user.props.id);
    if (!userExists) {
      throw new Error('User not found');
    }
    if (participations.isAlreadyParticipating(user)) {
      throw new ParticipationAlreadyExistsException();
    }
  }
}
