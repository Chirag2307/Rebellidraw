"use client";

import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
// type Props = Omit<ImageProps, "src"> & {
//   srcLight: string;
//   srcDark: string;
// };

// const ThemeImage = (props: Props) => {
//   const { srcLight, srcDark, ...rest } = props;

//   return (
//     <>
//       <Image {...rest} src={srcLight} className="imgLight" />
//       <Image {...rest} src={srcDark} className="imgDark" />
//     </>
//   );
// };
export default function Home() {
const [roomId,setRoomId]= useState("");
const router = useRouter();
  return (
    <div 
    // className={"flex w-screen h-screen justify-center items-center"}
    style ={{display:"flex",justifyContent:"center",alignItems:"center",height: "100vh",width: "100vh"}}
    >
     <div><input  value = {roomId} onChange = {(e)=>{
        setRoomId(e.target.value);
      }} type="text" placeholder="Room id"></input>
    <button onClick={()=>{
      router.push(`/room/${roomId}`)
    }}>Join Room</button>
    </div>
    </div>
  );
}
