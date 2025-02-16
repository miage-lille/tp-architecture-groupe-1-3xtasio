import { User } from '../entities/user.entity';
import { UserNotFound } from '../exceptions/user-not-found';
import { IUserRepository } from '../ports/user-repository.interface';

export class InMemoryUserRepository implements IUserRepository {
  constructor(public database: User[] = []) {}
  async save(user: User): Promise<void> {
    this.database.push(user);
  }
  findById(userId: string): Promise<User | null> {
    const user = this.database.find((user) => user.props.id == userId);
    if (!user) {
      throw new UserNotFound(userId);
    }
    return Promise.resolve(user);
  }
}
