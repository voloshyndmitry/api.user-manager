import { Client } from "../Interfaces/ClientsInterface";
import { User } from "../Interfaces/UsersInterface";
import isEmail from 'validator/lib/isEmail';
import isPhone from 'validator/lib/isMobilePhone';


enum ErrorType {
    REQUIRED = 'required',
    VALIDATION = 'validation'
}

enum EMessage {
    NAME = 'name',
    SUR_NAME = 'surName',
    EMAIL = 'email',
    SEX = 'sex',
    BIRTHDAY = 'birthday',
    PHONE = 'phone',
    PASS = 'pass',
}

const errorMessage: any = {
    required: {
        name: 'Name is required',
        surName: 'Surname is required',
        email: 'Email is required',
        sex: 'Sex is required',
        birthday: 'birthday is required',
        phone: 'Phone is required',
        pass: 'Pass is required',
    },
    validation: {
        phone: 'Phone number is not valid',
        email: 'Email is not valid',
    }
}

export interface IErrorMessage {
    error: string
}

const getError = (type: ErrorType, message: EMessage): IErrorMessage => {
    return { error: errorMessage?.[type]?.[message] || `Validation error: ${message}` }
}

export const clientValidation = (client: any): Client | IErrorMessage => {
    const {
        id,
        doctorID,
        name,
        surname,
        sex,
        birthday,
        pregnancy = '',
        phone,
        email,
        photo = '',
        tags = []
    } = client;

    if (!name) { return getError(ErrorType.REQUIRED, EMessage.NAME) }
    if (!surname) { return getError(ErrorType.REQUIRED, EMessage.SUR_NAME) }
    if (!sex) { return getError(ErrorType.REQUIRED, EMessage.SEX) }
    if (!birthday) { return getError(ErrorType.REQUIRED, EMessage.BIRTHDAY) }
    if (!phone) { return getError(ErrorType.REQUIRED, EMessage.PHONE) }
    if (!email) { return getError(ErrorType.REQUIRED, EMessage.EMAIL) }
    if (!isPhone(phone)) { return getError(ErrorType.VALIDATION, EMessage.PHONE) }
    if (!isEmail(email)) { return getError(ErrorType.VALIDATION, EMessage.EMAIL) }

    return {
        id,
        doctorID,
        name,
        surname,
        sex,
        birthday,
        pregnancy,
        phone,
        email,
        photo,
        tags
    }
}

export const userValidation = (user: User) => {
    const {
        id,
        name,
        surname,
        phone = '',
        location = '',
        specialties = '',
        email,
        pass,
    } = user;

    if (!name) { return getError(ErrorType.REQUIRED, EMessage.NAME) }
    if (!surname) { return getError(ErrorType.REQUIRED, EMessage.SUR_NAME) }
    if (!email) { return getError(ErrorType.REQUIRED, EMessage.EMAIL) }
    if (!phone) { return getError(ErrorType.VALIDATION, EMessage.PHONE) }
    // if (phone && !isPhone(phone)) { return getError(ErrorType.VALIDATION, EMessage.PHONE) }
    if (!isEmail(email)) { return getError(ErrorType.VALIDATION, EMessage.EMAIL) }

    return {
        id,
        name,
        surname,
        phone,
        location,
        specialties,
        email,
        pass,
    }
}
