export interface ActivityCreateType {
    title: string;
    description: string;
    location: string;
    start_time: string;
    max_participants: number;
    minimum_age: number;
    maximum_age: number;
    creator: {
        id: number;
        username: string;
    }
    participants: Array<{
        id: number;
        username: string;
        age: number;
    }>
}

export interface ActivityEditType {
    title: string,
    description: string,
    location: string,
    start_time: Date,
    max_participants: number,
    minimum_age: number,
    maximum_age: number
}