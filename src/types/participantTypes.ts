import { ActivityCardType } from "./activityTypes";

export interface ParticipantProfileType {
    username: string;
    personality: number;
    age: number;
    joined_activities: ActivityCardType[];
    created_activities: ActivityCardType[];
}