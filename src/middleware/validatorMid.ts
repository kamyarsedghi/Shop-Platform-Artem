import { check, body } from 'express-validator';
import User from '../models/userModel';

const signup = [
    check('username')
        .trim()
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric')
        .bail()
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters long')
        .bail()
        .custom((value, { req }) => {
            return User.findOne({ where: { username: value } })
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('Username already exists');
                    }
                })
        }),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
        .bail()
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric'),
    body('firstname')
        .trim()
        .isAlpha()
        .withMessage('Firstname must be alphabetic')
        .bail()
        .isLength({ min: 2 })
        .withMessage('Firstname must be at least 2 characters long'),
    body('lastname')
        .trim()
        .isAlpha()
        .withMessage('Lastname must be alphabetic')
        .bail()
        .isLength({ min: 2 })
        .withMessage('Lastname must be at least 2 characters long')
];

const login = [
    body('username')
        .trim()
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric')
        .bail()
        .isLength({ min: 5 })
        .withMessage('Username must be at least 5 characters long'),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
        .bail()
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric')
];

const changePassword = [
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
        .bail()
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric'),
    body('newPassword')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
        .bail()
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric'),
    body('confirmNewPassword')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
        .bail()
        .isAlphanumeric()
        .withMessage('Password must be alphanumeric')
        .bail()
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

const product = [
    body('title')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Title must be at least 5 characters long')
        .bail()
        .isAlphanumeric()
        .withMessage('Title must be alphanumeric'),
    body('price')
        .trim()
        .isFloat({ min: 0.01 })
        .withMessage('Price must be a number greater than 0'),
    body('imageUrl')
        .trim()
        .notEmpty()
        .isURL()
        .withMessage('Image URL must be a valid URL'),
    body('description')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Description must be at least 5 characters long')
];

//FIXME - Validation for editproduct is not workingl epecially checking whether if inputs are empty
// const editproduct = [
//     body('title')
//         .notEmpty()
//         .bail()
//         .trim()
//         .isLength({ min: 2 })
//         .withMessage('Title must be at least 5 characters long')
//         .bail()
//         .isAlphanumeric()
//         .withMessage('Title must be alphanumeric'),
//     body('price')
//         .isEmpty()
//         .bail()
//         .trim()
//         .isFloat({ min: 0.01 })
//         .withMessage('Price must be a number greater than 0'),
//     body('imageUrl')
//         .notEmpty()
//         .trim()
//         .notEmpty()
//         .isURL()
//         .withMessage('Image URL must be a valid URL'),
//     body('description')
//         .notEmpty()
//         .trim()
//         .isLength({ min: 5 })
//         .withMessage('Description must be at least 5 characters long')
// ];


export { 
    signup,
    login,
    changePassword,
    product,
    // editproduct
};
