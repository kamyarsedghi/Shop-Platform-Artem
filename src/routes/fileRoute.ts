import { Router } from 'express';
const router = Router();

//SECTION - Importing controllers
import * as fileController from '../controllers/fileCtrl';


//SECTION - Importing middleware


router.post('/upload', fileController.postUpload);

export default router;