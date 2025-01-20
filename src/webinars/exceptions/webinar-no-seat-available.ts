export class WebinarNoSeatAvailableException extends Error {
  constructor() {
    super('No seats available');
    this.name = 'WebinarNoSeatAvailableException';
  }
}
