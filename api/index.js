import express from 'express';
const app = express();
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

//Middlewares
app.use((req,res,next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
})
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(cookieParser())

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);

app.listen(8000, () => {
    console.log("API WORKING")
});
