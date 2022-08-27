import { Column, Entity } from 'typeorm';
import { GenderEnum } from '../../common/enum/gender.enum';
import { DBBaseEntity } from '../../common/models/db-base.entity';

@Entity({ name: 'users' })
class DBUser extends DBBaseEntity {
    constructor() {
        super();
    }
    @Column({ name: 'username', type: String, default: null })
    public username: string;

    @Column({ name: 'fullname', type: String, default: null })
    public fullname: string;

    @Column({ name: 'email', type: String, default: null })
    public email: string;

    @Column({ name: 'date_of_birth', type: 'timestamptz', default: null })
    public dateOfBirth: string;

    @Column({ name: 'phone_number', type: String, default: null })
    public phoneNumber: string;

    @Column({ name: 'address', type: String, default: null })
    public address: string;

    @Column({ name: 'country', type: String, default: null })
    public country: string;

    @Column({ name: 'gender', type: String, default: GenderEnum.NONE })
    public gender: string;
}
export default DBUser;