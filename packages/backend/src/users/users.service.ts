import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema.js';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    async create(email: string, password: string): Promise<UserDocument> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'admin',
        });
        return user.save();
    }

    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
