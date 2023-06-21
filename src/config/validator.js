// import { check } from "express-validator";
const { body, params, query } = require('express-validator');

const validateLoginUser = () => {
    return [
        body('user.email', `Username doesn't empty`).not().isEmpty(),
        body('user.email', `Username must be email`).isEmail(),
        body('user.password', `Password doesn't empty`).not().isEmpty()
    ]
}

const validateInsertUser = () => {
    return [
        body('user.email', `Username doesn't empty`).not().isEmpty(),
        body('user.email', `Username must be email`).isEmail(),
        body('user.password', `Password doesn't empty`).not().isEmpty(),
        body('user.firstName', `First Name doesn't empty`).not().isEmpty(),
        body('user.lastName', `Last Name doesn't empty`).not().isEmpty()
    ]
}

const validateGetAllUser = () => {
    return [
        params('user.id', `Missing user's id`).not().isEmpty()
    ]
}

let validate = {
    validateLoginUser: validateLoginUser,
    validateInsertUser: validateInsertUser,
    validateGetAllUser: validateGetAllUser
}

module.exports = {
    validate
}