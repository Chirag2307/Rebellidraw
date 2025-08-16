type Tool = 'pencil' | 'rectangle' | 'circle' | 'eraser';

type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "path";
    points: { x: number; y: number }[];
    color: string;
    lineWidth: number;
}

type DrawingEvent = {
    type: 'draw';
    shape: Shape;
    roomId: string;
}

type ClearEvent = {
    type: 'clear';
    roomId: string;
}

type SocketMessage = DrawingEvent | ClearEvent;

export function initDraw(canvas: HTMLCanvasElement, roomId: string, token?: string) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let existingShapes: Shape[] = [];
    let currentTool: Tool = 'pencil';
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentPath: { x: number; y: number }[] = [];
    let socket: WebSocket | null = null;

    // Connect to WebSocket
    const wsUrl = token 
    ? `${process.env.NEXT_PUBLIC_WS_URL || 'wss://rebellidraw-backend.onrender.com'}?token=${token}`
    : process.env.NEXT_PUBLIC_WS_URL || 'wss://rebellidraw-backend.onrender.com';
    
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log('Connected to WebSocket');
        // Join the room
        socket?.send(JSON.stringify({
            type: 'join_room',
            roomId: roomId
        }));
    };

    socket.onmessage = (event) => {
        try {
            const data: SocketMessage = JSON.parse(event.data);
            
            if (data.type === 'draw' && data.roomId === roomId) {
                existingShapes.push(data.shape);
                redrawCanvas();
            } else if (data.type === 'clear' && data.roomId === roomId) {
                existingShapes = [];
                redrawCanvas();
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    // Set initial canvas background
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create toolbar
    createToolbar(canvas, (tool: Tool) => {
        currentTool = tool;
        console.log('Tool changed to:', tool);
    });

    // Mouse event handlers
    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        if (currentTool === 'pencil') {
            currentPath = [{ x: startX, y: startY }];
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
        } else if (currentTool === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = "rgba(0,0,0,1)";
            ctx.lineWidth = 20;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        if (currentTool === 'pencil') {
            // Draw pencil line
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            currentPath.push({ x: currentX, y: currentY });
        } else if (currentTool === 'rectangle') {
            // Preview rectangle
            redrawCanvas();
            const width = currentX - startX;
            const height = currentY - startY;
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.lineWidth = 2;
            ctx.strokeRect(startX, startY, width, height);
        } else if (currentTool === 'circle') {
            // Preview circle
            redrawCanvas();
            const radius = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
            ctx.strokeStyle = "rgba(255,255,255)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (currentTool === 'eraser') {
            // Eraser functionality
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
            // Keep the composite operation for the entire eraser stroke
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        let newShape: Shape | null = null;

        if (currentTool === 'pencil') {
            // Save pencil path
            newShape = {
                type: "path",
                points: [...currentPath],
                color: "rgba(255,255,255)",
                lineWidth: 2
            };
        } else if (currentTool === 'rectangle') {
            // Save rectangle
            const width = endX - startX;
            const height = endY - startY;
            newShape = {
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            };
        } else if (currentTool === 'circle') {
            // Save circle
            const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
            newShape = {
                type: "circle",
                centerX: startX,
                centerY: startY,
                radius
            };
        }

        if (newShape) {
            existingShapes.push(newShape);
            // Send drawing event to other users
            socket?.send(JSON.stringify({
                type: 'draw',
                shape: newShape,
                roomId: roomId
            }));
        }

        // Reset composite operation for eraser
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'source-over';
        }

        isDrawing = false;
        currentPath = [];
    });

    function redrawCanvas() {
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Redraw all existing shapes
        existingShapes.forEach((shape) => {
            if (shape.type === "rect") {
                ctx.strokeStyle = "rgba(255,255,255)";
                ctx.lineWidth = 2;
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                ctx.strokeStyle = "rgba(255,255,255)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
                ctx.stroke();
            } else if (shape.type === "path") {
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = shape.lineWidth;
                ctx.beginPath();
                if (shape.points.length > 0) {
                    ctx.moveTo(shape.points[0].x, shape.points[0].y);
                    shape.points.forEach(point => {
                        ctx.lineTo(point.x, point.y);
                    });
                }
                ctx.stroke();
            }
        });
    }

    function createToolbar(canvas: HTMLCanvasElement, onToolChange: (tool: Tool) => void) {
        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            padding: 10px;
            border-radius: 8px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        `;

        const tools: { name: Tool; label: string; emoji: string }[] = [
            { name: 'pencil', label: 'Pencil', emoji: '✏️' },
            { name: 'rectangle', label: 'Rectangle', emoji: '⬜' },
            { name: 'circle', label: 'Circle', emoji: '⭕' }
        ];

        tools.forEach(tool => {
            const button = document.createElement('button');
            button.innerHTML = `${tool.emoji} ${tool.label}`;
            button.style.cssText = `
                padding: 8px 12px;
                border: none;
                border-radius: 4px;
                background: rgba(255,255,255,0.1);
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            `;
            
            button.addEventListener('click', () => {
                onToolChange(tool.name);
                // Update active button
                toolbar.querySelectorAll('button').forEach(btn => {
                    btn.style.background = 'rgba(255,255,255,0.1)';
                });
                button.style.background = 'rgba(255,255,255,0.3)';
            });

            toolbar.appendChild(button);
        });

        // Add clear canvas button
        const clearButton = document.createElement('button');
        clearButton.innerHTML = '🗑️ Clear';
        clearButton.style.cssText = `
            padding: 8px 12px;
            border: none;
            border-radius: 4px;
            background: rgba(255,0,0,0.3);
            color: white;
            cursor: pointer;
            font-size: 14px;
            margin-left: 10px;
        `;
        
        clearButton.addEventListener('click', () => {
            existingShapes = [];
            redrawCanvas();
            // Send clear event to other users
            socket?.send(JSON.stringify({
                type: 'clear',
                roomId: roomId
            }));
        });

        toolbar.appendChild(clearButton);
        document.body.appendChild(toolbar);
    }

    // Return cleanup function
    return () => {
        if (socket) {
            socket.close();
        }
    };
}