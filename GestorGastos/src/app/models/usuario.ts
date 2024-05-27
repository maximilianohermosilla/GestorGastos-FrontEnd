export class Usuario {
    Login: string;
    Password: string;
    PasswordNew?: string;
    IdSistema: number;

    constructor(user: string, password: string, idSistema: number, passwordNew?: string) {
        this.Login = user;
        this.Password = password;
        this.PasswordNew = passwordNew;
        this.IdSistema = idSistema;
    }

}