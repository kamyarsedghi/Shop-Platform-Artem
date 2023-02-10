import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { Request, Response, NextFunction } from 'express';


const postUpload = async (req: Request, res: Response, next: NextFunction) => {
    const filePath = req.file?.path;
    const outputFilePath = path.join(__dirname, '../../uploads', `${Date.now()}-output.csv`);
    console.log(filePath);

    fs.createReadStream(filePath as string)
    .pipe(csv())
    .on('data', (row) => {
        row.email.split('@')[1] !== 'yahoo.com' ?  fs.createWriteStream(outputFilePath, { flags: 'a' })
        .write(`${row.email}\n`) : null;
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    }
    );
    res.send('File uploaded');
}

export { 
    postUpload 
};