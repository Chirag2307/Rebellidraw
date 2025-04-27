import { WebSocket, WebSocketServer } from 'ws';
import { JWT_SECRET } from '@repo/backend-common/config';
import jwt, { JwtPayload } from 'jsonwebtoken';
const wss = new WebSocketServer({ port: 8080 });
import { prismaClient } from '@repo/database/client';

interface User {
    ws: WebSocket;
    userId: string;
    rooms: string[];
}
const users: User[] = [];
function checkUser(token: string): string | null {
    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded == 'string' || decoded === null) {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    }
    catch (e) {
        return null;
    }
}


wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (userId == null) {
        ws.close();
        return null
    }
    // if(userId == "null"){
    users.push({
        userId: userId,
        rooms: [],
        ws
    })

    ws.on('message', async function message(data) {
        const parsedData = JSON.parse(data as unknown as string);

        if (parsedData.type === "join_room") {
            try {
                const user = users.find(x => x.ws === ws);
                user?.rooms.push(parsedData.roomId);

            } catch (e) {
                return false;
            }
        }
        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }

            user.rooms = user?.rooms.filter(x => x == parsedData.room);

        }
        if (parsedData.type === "chat") {
            const roomId = parsedData.roomid;
            const message = parsedData.message;
            if (!roomId) {
                console.error("Room ID is missing");
                return;
            }
            try {
                await prismaClient.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message,
                        userId
                    }
                });
                users.forEach(user => {
                    if (user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId
                        }))
                    }
                })
            } catch (error) {
                console.error("Failed to create chat:", error);
            }
        };
        ws.send(JSON.stringify({ type: "pong" }));
    });
});