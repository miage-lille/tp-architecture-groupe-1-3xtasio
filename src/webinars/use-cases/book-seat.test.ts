import { FixedIdGenerator } from 'src/core/adapters/fixed-id-generator';
import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';
import { InMemoryParticipationRepository } from 'src/webinars/adapters/participation-repository.in-memory';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/webinar-repository.in-memory';
import { User } from 'src/users/entities/user.entity';
import { Participation } from 'src/webinars/entities/participation.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { BookSeat } from 'src/webinars/use-cases/book-seat';
import { InMemoryUserRepository } from 'src/users/adapters/user-repository.in-memory';

describe('Feature: Book a seat in a webinar', () => {
  let participationRepository: InMemoryParticipationRepository;
  let userRepository: InMemoryUserRepository;
  let webinarRepository: InMemoryWebinarRepository;
  let mailer: InMemoryMailer;
  let useCase: BookSeat;

  const userPayload = { id: '1', email: 'alice@gmail.com', password: '123' };
  const payload = {
    webinarId: '1',
    user: new User(userPayload),
  };

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository();
    participationRepository = new InMemoryParticipationRepository();
    userRepository = new InMemoryUserRepository();
    mailer = new InMemoryMailer();
    useCase = new BookSeat(
      participationRepository,
      userRepository,
      webinarRepository,
      mailer,
    );
  });

  describe('Scenario: Booking a seat successfully', () => {
    it('should book a seat if there are available seats and the user is not already participating', async () => {
      webinarRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar-1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 10,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );
      await useCase.execute(payload);

      const participations = await participationRepository.findByWebinarId('1');
      expect(participations).toHaveLength(1);
      expect(participations[0].props.userId).toBe('1');
    });

    it('should send an email to the organizer', async () => {
      webinarRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar-1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 10,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );
      await useCase.execute(payload);
      const sentEmails = mailer.sentEmails;
      expect(sentEmails).toHaveLength(1);
      expect(sentEmails[0].to).toBe('webinar-organizer@gmail.com');
      expect(sentEmails[0].subject).toContain(
        'Confirmation de réservation du webinar -',
      );
      expect(sentEmails[0].body).toContain(
        'Bonjour, un nouveau participant à votre webinar :',
      );
    });
  });

  describe('Scenario: No seat available', () => {
    it('should throw an error when no seat is available', async () => {
      webinarRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar-1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 0,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );

      await expect(useCase.execute(payload)).rejects.toThrow(
        'No seats available',
      );
    });
  });

  describe('Scenario: User is already participating', () => {
    it('should throw an error if user is already participating', async () => {
      webinarRepository.create(
        new Webinar({
          id: '1',
          organizerId: '1',
          title: 'Webinar-1',
          startDate: new Date(),
          endDate: new Date(),
          seats: 10,
        }),
      );
      userRepository.save(
        new User({ id: '1', email: 'user-alice-id', password: '123' }),
      );

      participationRepository.save(
        new Participation({ userId: '1', webinarId: '1' }),
      );

      await expect(useCase.execute(payload)).rejects.toThrow(
        'User is already participating in this webinar',
      );
    });
  });
});
