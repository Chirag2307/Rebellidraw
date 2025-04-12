import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config'; 
import { CreateUserSchema , SigninSchema , CreateRoomSchema } from '@repo/common/types'; 
import { middleware } from './middleware';
import { prismaClient } from '@repo/database/client';
const app = express();

app.post('/signup', (req, res) => {
    const userId = 123;
    // const token = jwt.sign({ userId }, JWT_SECRET);
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        res.json({ error: data.error });
        return;
    }
    prismaClient.user.create({
        data: {
            username: data.data.username,
            password: data.data.password,
            // email: data.data.email,
        }
    })
    // res.json({ userId });
});
app.post('/signin', (req, res) => {
    
    const data = SigninSchema.safeParse(req.body);
    const userId = 1;
    const token = jwt.sign({ userId }, JWT_SECRET);
    if (!data.success) {
        res.json({ error: data.error });
    }
    return;
    // res.json({ token });
});
app.post('/room' ,middleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    
    if (!data.success) {
        res.json({ error: data.error });
    }
    return;
    // res.json({ roomId: 123 });
});


app.listen(3001);