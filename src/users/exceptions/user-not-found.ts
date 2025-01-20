export class UserNotFound extends Error {
  constructor(userId: string) {
    super(`User ID : ${userId} not found`);
    this.name = 'UserNotFound';
  }
}
