import { User } from "../store/ducks/user/types";

export const Users: User[] = [
    {
        id: 1,
        name: 'Administrador 1',
        password: '123456',
        cpf: '10987654321',
        role: 'admin'
    },
    {
        id: 2,
        name: 'Professor 1',
        password: '123456',
        cpf: '12345678910',
        role: 'teacher'
    }
]