import { Router } from 'express';
const router = Router();

//SECTION - Importing controllers
import * as shopController from '../controllers/shopCtrl';

//SECTION - Importing middleware
import * as validator from '../middleware/validatorMid';

router.post('/signup', validator.signup, shopController.postSignup);
router.post('/login', validator.login, shopController.postLogin);
router.patch('/changepassword', validator.changePassword, shopController.patchChangePassword);
router.post('/addproduct', validator.product, shopController.postAddProduct);
router.patch('/editproduct', shopController.patchEditProduct);
router.get('/product/:productId', shopController.getProduct);

export default router;

