import { Email, IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { Participation } from '../entities/participation.entity';
import { ParticipationAlreadyExistsException } from '../exceptions/participation-already-participating';
import { WebinarNoSeatAvailableException } from '../exceptions/webinar-no-seat-available';

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
  ) {}
  async execute({ webinarId, user }: Request): Promise<Response> {
    let webinar = await this.webinarRepository.findById(webinarId);
    let participations: Participation[] =
      await this.participationRepository.findByWebinarId(webinarId);
    if (webinar.hasAvailableSeat(participations)) {
      throw new WebinarNoSeatAvailableException();
    }

    let userExists = await this.userRepository.findById(user.props.id);
    if (!userExists) {
      throw new Error('User not found');
    }
    if (this.isAlreadyParticipating(participations, userExists)) {
      throw new ParticipationAlreadyExistsException();
    } else {
      const participation = new Participation({
        userId: userExists.props.id,
        webinarId: webinar.props.id,
      });
      await this.participationRepository.save(participation);
      const email: Email = {
        to: 'webinar-organizer@gmail.com',
        subject: `Confirmation de réservation du webinar - ${webinar.props.title}`,
        body: `Bonjour, un nouveau participant à votre webinar : ${user.props.email}.`,
      };
      await this.mailer.send(email);
    }
  }

  private isAlreadyParticipating(
    participations: Participation[],
    userExists: User,
  ) {
    return participations.some(
      (participant) => participant.props.userId === userExists.props.id,
    );
  }
}
