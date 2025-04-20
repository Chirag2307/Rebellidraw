import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config'; 
import { CreateUserSchema , SigninSchema , CreateRoomSchema } from '@repo/common/types'; 
import { middleware } from './middleware';
import { prismaClient } from '@repo/database/client';
const app = express();
app.use(express.json());
app.post('/signup', async (req, res) => {
    const userId = 123;
    // const token = jwt.sign({ userId }, JWT_SECRET);
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ error: parsedData.error });
        return;
    }
    try{
      const user =   await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                password: parsedData.data.password,
                name :parsedData.data.name
                // email: data.data.email,
            }
        })    
        res.json({ userId:user.id });
    }catch(err){
        res.status(411).json({ error: 'User already exists' });
        return;
    }
    
    // res.json({ userId });
});
app.post('/signin', async (req, res) => {
    
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error });
        return;
    }
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.username,
            password: parsedData.data.password
        }
    });
    if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }
    const userId = user.id;
    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({ token });
});
app.post('/room' ,middleware, async (req, res) => {
    const parsedData = CreateRoomSchema.safeParse(req.body);
    
    if (!parsedData.success) {
        res.status(400).json({ error: parsedData.error });
        return;
    }
    const userId = req.userId;
    if(!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try{

        const roomId =  await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId:userId,
            }
        });
        res.json({ roomId: roomId.id });
    }catch(err){
        res.status(411).json({ error: 'Room already exists' });
        return;
    }
});

app.get('/chats/:roomId' , async (req, res) => {
    const roomId = Number(req.params.roomId)
    const messages = await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy : {
            id:"desc"
        },
        take : 50
    });
    res.json({
        messages
    })
})
app.listen(3001);