import { differenceInDays } from 'date-fns';
import { Entity } from 'src/shared/entity';
import { Participation } from './participation.entity';

type WebinarProps = {
  id: string;
  organizerId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};
export class Webinar extends Entity<WebinarProps> {
  isTooSoon(now: Date): boolean {
    const diff = differenceInDays(this.props.startDate, now);
    return diff < 3;
  }

  hasTooManySeats(): boolean {
    return this.props.seats > 1000;
  }

  hasNotEnoughSeats(): boolean {
    return this.props.seats < 1;
  }

  isOrganizer(userId: string) {
    return this.props.organizerId === userId;
  }
  hasAvailableSeat(participations: Participation[]): boolean {
    return participations.length >= this.props.seats;
  }
}
