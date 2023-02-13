import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Request, Response, NextFunction } from 'express';

interface Err2 extends Error{
    statusCode?: Number;
    data?: Array<string>;
}

const postUpload = async (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!req.file){            
            const error:Err2 = new Error('No file provided');
            error.statusCode = 422;
            throw error;
        }
        const filePath = req.file?.path;
        const outputFilePath = path.join(__dirname, '../../uploads', `${Date.now()}-output.csv`);

        const readableStream = fs.createReadStream(filePath as string);
        const writableStream = fs.createWriteStream(outputFilePath, { flags: 'a' });
    
        readableStream.pipe(csv())
        .on('data', (row) => {
            row.email.split('@')[1] !== 'yahoo.com' ?  writableStream.write(`${row.email}\n`) : null;
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
        res.send('File uploaded and processed');
    }
    catch(err: unknown){
        next(err);
    }
}

export { 
    postUpload 
};