import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket(){
  const [loading , setLoading] = useState(true);
  const [socket , setSocket] = useState<WebSocket | null>(null);

  useEffect(()=>{
    const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5NzExNWE3Mi1kZTJmLTQ0NDktODZkNC1jMTQxODRlNmIzNTQiLCJpYXQiOjE3NDUwMTMzNTZ9.lAo3uvicw7X-2FfWhcjSHnC4Zq6411IxBpeN4iqLThc`);
    ws.onopen = () =>{
        setLoading(false);
        setSocket(ws);
    }
  },[]);

  return{
    socket,
    loading
  }

}