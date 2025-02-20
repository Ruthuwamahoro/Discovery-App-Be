import { Router} from 'express';
import { getAllUsers, getUserByIdController, loginController, signUpController} from '../controllers/userController';

const router = Router();



router.post("/register", signUpController);
router.post("/login", loginController);
router.get("/users/:id", getUserByIdController)
router.get("/users/", getAllUsers)

export default router;