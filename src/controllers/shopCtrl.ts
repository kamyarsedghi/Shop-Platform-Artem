import { Request, Response, NextFunction } from "express";

import User from '../models/userModel';
import Product from "../models/productModel";

import { validationResult, Result, ValidationError } from 'express-validator';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

interface Err2 extends Error{
    statusCode?: Number;
    data?: Array<string>;
}

interface code extends Result<ValidationError> {
    statusCode?: Number;
}

//! *******************************************************/
//SECTION - Signup
const postSignup = async (req: Request, res: Response, next: NextFunction) => {
    const errors:code = validationResult(req);
    const { username, password, firstname, lastname } = req.body;

    try {
        if (!errors.isEmpty()) {
            errors.statusCode = 422;
            throw errors;
        }

        const hashedPw = await bcrypt.hash(password, 12);
        const user = await User.create({
            username,
            password: hashedPw,
            firstname,
            lastname
        });
        res.status(201).json({ message: 'User created', userId: user });
    } catch (err: unknown) {
        next(err);
    }
}

//! *******************************************************/
//SECTION - Login
const postLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        const errors:code = validationResult(req);
        if (!errors.isEmpty()) {
            errors.statusCode = 422;
            throw errors;
        }
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            const error:Err2 = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        
        const isEqual = await bcrypt.compare(password, user.dataValues.password);
        
        if (!isEqual) {
            const error:Err2 = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                username: user.dataValues.username,
                userId: user.dataValues.id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '30m' }
        );

        res.status(200).json({ token, userId: user.dataValues.id });
    } catch (err: unknown) {
        next(err);
    }
}

//! *******************************************************/
//SECTION - Change password
const patchChangePassword = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, newPassword, confirmNewPassword } = req.body;
    const authHeader = req.get('Authorization');
    const errors:code = validationResult(req);

    try {
        if (!authHeader) {
            const error:Err2 = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];
    
        if (!errors.isEmpty()) {
            errors.statusCode = 422;
            throw errors;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            const error:Err2 = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const userId = decodedToken.userId;

        const user  = await User.findByPk(userId);
        if (!user) {
            const error:Err2 = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }

        if(username !== user.dataValues.username){
            const error:Err2 = new Error('Wrong username');
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.dataValues.password);

        if (!isEqual) {
            const error:Err2 = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }

        const hashedPw = await bcrypt.hash(newPassword, 12);
        
        await user.update({ password: hashedPw });

        res.status(200).json({ message: 'Password changed' });
    } catch (err: unknown) {
        next(err);
    }
}

//! *******************************************************/
//SECTION - View a product
const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params;
    console.log(productId);
    
    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            const error:Err2 = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ product });
    } catch (err: unknown) {
        next(err);
    }
}


//! *******************************************************/
//SECTION - Adding a product
const postAddProduct = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    const { title, price, description, imageUrl }: {title: string, price: number, description: string, imageUrl: string} = req.body;
    const errors:code = validationResult(req);

    try {
        if (!authHeader) {
            const error:Err2 = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];

        if (!errors.isEmpty()) {
            errors.statusCode = 422;
            throw errors;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            const error:Err2 = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const userId = decodedToken.userId;

        const user  = await User.findByPk(userId);
        if (!user) {
            const error:Err2 = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }

        const product = await Product.create({
            title,
            price,
            description,
            imageUrl: imageUrl || 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
            userId
        });

        res.status(201).json({ message: 'Product created', product });
    } catch (err: unknown) {
        next(err);
    }
}

//! *******************************************************/
//SECTION - Editing a product
const patchEditProduct = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get('Authorization');
    const { title, price, description, imageUrl }: {title: string, price: number, description: string, imageUrl: string} = req.body;
    const errors:code = validationResult(req);
    
    try {
        if (!authHeader) {
            const error:Err2 = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }
        const token = authHeader.split(' ')[1];

        if (!errors.isEmpty()) {
            errors.statusCode = 422;
            throw errors;
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            const error:Err2 = new Error('Not authenticated');
            error.statusCode = 401;
            throw error;
        }

        const userId = decodedToken.userId;
        console.log("userId", userId);
        

        const user  = await User.findByPk(userId);
        if (!user) {
            const error:Err2 = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }

        const product = await Product.findByPk(req.query.product as string);
        if (!product) {
            const error:Err2 = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        if (product.dataValues.userId.toString() !== userId.toString()) {
            const error:Err2 = new Error('Not authorized to edit this product');
            error.statusCode = 403;
            throw error;
        }

        //NOTE - If the user doesn't provide a new value for a field, the old value will be used
        await product.update({
            title: title || product.dataValues.title,
            price: price || product.dataValues.price,
            description: description || product.dataValues.description,
            imageUrl: imageUrl || product.dataValues.imageUrl
        });

        res.status(200).json({ message: 'Product updated', product });
    } catch (err: unknown) {
        next(err);
    }
}


export { 
    postSignup,
    postLogin,
    patchChangePassword,
    getProduct,
    postAddProduct,
    patchEditProduct
};