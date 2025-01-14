import { Entity } from 'src/shared/entity';
import { Webinar } from './webinar.entity';
import { User } from 'src/users/entities/user.entity';

type Props = {
  userId: string;
  webinarId: string;
};

export class Participation extends Entity<Props> {

  isAlreadyParticipating(webinar: Webinar, user: User): boolean {
    return webinar.props.id === this.props.webinarId && user.props.id === this.props.userId;
  }
}
