import express from "express";
import{ Request , Response } from "express";
const app = express();
import cors from "cors";
// import bodyParser from "body-parser";
import router from "./routes/userRoutes"
import bookRouter from "./routes/bookRoutes";
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api', router)
app.use('/api', bookRouter)
app.use((err: unknown, req: Request, res: Response, next: any) => {
    const Error = err as Error;
    res.status(500).json({status: 500, message: Error.message, data: null})
});

export default app;