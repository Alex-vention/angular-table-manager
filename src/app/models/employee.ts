export interface Employee {
    id: number;
    name: string;
    position: string;
    salary: number;
    details: {
        email: string,
        phone: string,
        address: string
        photo: string
    }
}
