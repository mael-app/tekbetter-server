export default class StudentData {
    login: string;
    name: string;
    id: string;

    constructor(data: any) {
        this.login = data.login;
        this.name = data.name;
        this.id = data.id;
    }
}