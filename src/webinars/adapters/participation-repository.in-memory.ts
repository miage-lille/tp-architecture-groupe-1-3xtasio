import { Participation } from "../entities/participation.entity";
import { WebinarNotFoundException } from "../exceptions/webinar-not-found";
import { IParticipationRepository } from "../ports/participation-repository.interface";

export class InMemoryParticipationRepository implements IParticipationRepository {
    constructor(public database: Participation[] = []) { }
    async findByWebinarId(webinarId: string): Promise<Participation[]> {
        const webinar = this.database.find((webinar) => webinar.props.webinarId === webinarId);
        if (!webinar) {
            throw new WebinarNotFoundException();
        }
        const participating: Participation[] = this.database.filter((participation) => participation.props.webinarId === webinarId);
        return participating;
    }
    async save(participation: Participation): Promise<void> {
        this.database.push(participation);
    }

}
