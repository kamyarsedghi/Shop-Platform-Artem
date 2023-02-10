import express, { Express, Request, Response, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import sequelize from './utils/dbConfig';
import bodyParser from 'body-parser';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

interface Err2 extends Error{
    statusCode?: number;
    data?:string
}

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT) || 3000;

//SECTION - Importing routes
import shopRoute from './routes/shopRoute';
import fileRoute from './routes/fileRoute';

//SECTION - Importing models
import Product from './models/productModel';
import User from './models/userModel';

//SECTION - Multer config
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-unprocessed-' + file.originalname);
    }
});

const fileFilter = (req: Request, file: any, cb: any) => {
    file.mimetype === 'text/csv' ? cb(null, true) : cb(null, false)
}


//SECTION - Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single('file'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



//SECTION - Routes
app.use(fileRoute);
app.use('/shop', shopRoute);


app.get('/', (req: Request, res: Response) => {
    res.send('Server functional');
    }
);

app.use((err: Err2, req: Request, res: Response, next: Function) => {
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({ message, err });
});

//SECTION - Models associations
Product.belongsTo(User, { 
    constraints: true, 
    onDelete: 'CASCADE' 
});
User.hasMany(Product);


//SECTION - Database connection and server start
sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        console.log('Database connected');
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err: Error) => {
        console.log(err);
    });