import { IDateGenerator } from "src/core/ports/date-generator.interface";
import { InMemoryWebinarRepository } from "../adapters/webinar-repository.in-memory";
import { IIdGenerator } from "src/core/ports/id-generator.interface";
import { OrganizeWebinars } from "./organize-webinar";


describe('Feature: Booking seat', () => {


    let repository: InMemoryWebinarRepository;
    let idGenerator: IIdGenerator;
    let useCase: OrganizeWebinars;
    let dateGenerator: IDateGenerator;

    const payload = {
        userId: 'user-alice-id',
        title: 'Webinar title',
        seats: 100,
        startDate: new Date('2024-01-10T10:00:00.000Z'),
        endDate: new Date('2024-01-10T11:00:00.000Z'),
    };





})