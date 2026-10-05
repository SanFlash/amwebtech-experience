/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, ArrowUpRight, Building2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  DoorOpen, MapPin, Maximize2, MousePointer2, Users, X, Zap
} from "lucide-react";
import styles from "./office-tour.module.css";

type Vec = { x: number; y: number };
type Room = {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  w: number;
  h: number;
  floor: string;
  accent: string;
};
type NPC = {
  name: string;
  title: string;
  room: string;
  x: number;
  y: number;
  color: string;
  speed: number;
  target?: Vec;
  home: Vec;
};

const rooms: Room[] = [
  { id:"automation", name:"Automation Team", subtitle:"8 seats", x:470, y:70, w:260, h:180, floor:"#f0d3a3", accent:"#0057b8" },
  { id:"hr", name:"HR", subtitle:"2 seats", x:750, y:70, w:120, h:180, floor:"#ead0a2", accent:"#ff7a00" },
  { id:"srhr", name:"Sr HR", subtitle:"2 seats", x:890, y:70, w:120, h:180, floor:"#ead0a2", accent:"#ff7a00" },
  { id:"manager", name:"Manager", subtitle:"2 seats", x:1030, y:70, w:125, h:180, floor:"#ead0a2", accent:"#ff7a00" },
  { id:"sales", name:"Sales Team", subtitle:"4 seats", x:1175, y:70, w:205, h:180, floor:"#ead0a2", accent:"#0057b8" },
  { id:"director", name:"Director", subtitle:"3 seats", x:1400, y:70, w:145, h:180, floor:"#ead0a2", accent:"#ff7a00" },
  { id:"male", name:"Male Washroom", subtitle:"Facilities", x:85, y:285, w:210, h:115, floor:"#dce5e9", accent:"#6b7b86" },
  { id:"female", name:"Female Washroom", subtitle:"Facilities", x:85, y:415, w:210, h:115, floor:"#dce5e9", accent:"#6b7b86" },
  { id:"kitchen", name:"Kitchen", subtitle:"2 seats", x:85, y:545, w:210, h:145, floor:"#e8d6b5", accent:"#ff7a00" },
  { id:"meeting", name:"Meeting Room", subtitle:"6 seats", x:85, y:705, w:310, h:190, floor:"#d9cfbe", accent:"#0057b8" },
  { id:"qa", name:"QA Team — Open Floor", subtitle:"24 seats", x:650, y:340, w:760, h:500, floor:"#dfc89f", accent:"#0057b8" },
];

const npcs: NPC[] = [
  { name:"Pavan Parihar", title:"Director of QA & Client Relationship", room:"qa", x:790, y:455, color:"#0057b8", speed:.7, home:{x:790,y:455} },
  { name:"Uday Singh Chouhan", title:"Director of Quality Engineering & Excellence", room:"qa", x:1000, y:560, color:"#ff7a00", speed:.62, home:{x:1000,y:560} },
  { name:"Rashika Subramanian", title:"Project Manager QA", room:"manager", x:1085, y:160, color:"#7b61ff", speed:.5, home:{x:1085,y:160} },
  { name:"Mustakim Shaikh", title:"Business Development Manager", room:"sales", x:1250, y:155, color:"#00a37a", speed:.55, home:{x:1250,y:155} },
  { name:"Gulrez Khan", title:"Co-Founder", room:"director", x:1445, y:150, color:"#d14b7d", speed:.42, home:{x:1445,y:150} },
  { name:"Shadab Shaikh", title:"Co-Founder", room:"director", x:1490, y:205, color:"#1b8fbd", speed:.38, home:{x:1490,y:205} },
  { name:"Hitesh Solanki", title:"Co-Founder", room:"automation", x:570, y:150, color:"#9b6b24", speed:.48, home:{x:570,y:150} },
  { name:"QA Engineer", title:"Automation Specialist", room:"automation", x:650, y:180, color:"#2f7d5a", speed:.72, home:{x:650,y:180} },
  { name:"QA Engineer", title:"Manual Testing", room:"qa", x:1170, y:690, color:"#3d6db5", speed:.66, home:{x:1170,y:690} },
  { name:"QA Engineer", title:"API & Integration Testing", room:"qa", x:920, y:740, color:"#8c5a31", speed:.58, home:{x:920,y:740} },
];

const walls = [
  [60,40,1470,40],[60,40,60,920],[60,920,1470,920],[1470,40,1470,920],
  [450,40,450,260],[730,40,730,260],[870,40,870,260],[1010,40,1010,260],[1155,40,1155,260],[1390,40,1390,260],
  [60,265,420,265],[420,265,420,920],[60,540,420,540],[60,700,420,700],
  [630,300,1470,300],[630,300,630,920],[1470,300,1470,920],
];

const clamp = (v:number,min:number,max:number) => Math.max(min,Math.min(max,v));
const distance = (a:Vec,b:Vec) => Math.hypot(a.x-b.x,a.y-b.y);

function isWalkable(p:Vec){
  // The reference floor plan is open-office oriented, so the player can cross
  // doorways and interior partitions while the outer shell remains solid.
  return p.x>=92 && p.x<=1438 && p.y>=78 && p.y<=882;
}

function roomAt(p:Vec){
  return rooms.find(r=>p.x>=r.x && p.x<=r.x+r.w && p.y>=r.y && p.y<=r.y+r.h);
}

export default function OfficeTourPage(){
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const keysRef = useRef<Record<string,boolean>>({});
  const playerRef = useRef<Vec>({x:560,y:850});
  const cameraRef = useRef<Vec>({x:760,y:480});
  const npcRef = useRef(npcs.map(n=>({...n})));
  const [activeRoom,setActiveRoom] = useState("entry");
  const [activeNpc,setActiveNpc] = useState<NPC|null>(null);
  const [started,setStarted] = useState(false);
  const [mapOpen,setMapOpen] = useState(false);

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    if(!ctx) return;

    const resize=()=>{
      const dpr=Math.min(window.devicePixelRatio||1,2);
      const rect=canvas.getBoundingClientRect();
      canvas.width=Math.max(1,Math.floor(rect.width*dpr));
      canvas.height=Math.max(1,Math.floor(rect.height*dpr));
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize();
    window.addEventListener("resize",resize);

    const onKey=(e:KeyboardEvent)=>{
      if(["INPUT","TEXTAREA","BUTTON"].includes((e.target as HTMLElement)?.tagName)) return;
      const k=e.key.toLowerCase();
      if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","e"].includes(k)){
        e.preventDefault();
        keysRef.current[k]=true;
        setStarted(true);
      }
      if(k==="m") setMapOpen(v=>!v);
    };
    const onUp=(e:KeyboardEvent)=>{ keysRef.current[e.key.toLowerCase()]=false; };
    window.addEventListener("keydown",onKey);
    window.addEventListener("keyup",onUp);

    let last=performance.now();
    const draw=(now:number)=>{
      const dt=Math.min(32,now-last)/16.67;
      last=now;
      const keys=keysRef.current;
      let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);
      let dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
      if(dx||dy){
        const len=Math.hypot(dx,dy); dx/=len; dy/=len;
        const speed=4.2;
        const next={x:playerRef.current.x+dx*speed*dt,y:playerRef.current.y+dy*speed*dt};
        const tryX={x:next.x,y:playerRef.current.y};
        const tryY={x:playerRef.current.x,y:next.y};
        if(isWalkable(tryX)) playerRef.current.x=clamp(tryX.x,90,1440);
        if(isWalkable(tryY)) playerRef.current.y=clamp(tryY.y,75,885);
      }

      const p=playerRef.current;
      const r=roomAt(p);
      const nextRoom=r?.id||"corridor";
      setActiveRoom(prev=>prev===nextRoom?prev:nextRoom);

      npcRef.current.forEach(n=>{
        const wanderTarget=n.target||{
          x:n.home.x+(Math.sin(now/1800+n.x)*45),
          y:n.home.y+(Math.cos(now/2200+n.y)*35)
        };
        n.target=wanderTarget;
        const d=distance(n,wanderTarget);
        if(d<3) n.target=undefined;
        else {
          n.x += ((wanderTarget.x-n.x)/Math.max(d,1))*n.speed*dt;
          n.y += ((wanderTarget.y-n.y)/Math.max(d,1))*n.speed*dt;
        }
      });

      const camTarget={x:p.x,y:p.y};
      cameraRef.current.x += (camTarget.x-cameraRef.current.x)*.07;
      cameraRef.current.y += (camTarget.y-cameraRef.current.y)*.07;

      const rect=canvas.getBoundingClientRect();
      ctx.clearRect(0,0,rect.width,rect.height);
      drawWorld(ctx,rect.width,rect.height,cameraRef.current,p,npcRef.current,now);
      frameRef.current=requestAnimationFrame(draw);
    };
    frameRef.current=requestAnimationFrame(draw);
    return ()=>{
      cancelAnimationFrame(frameRef.current!);
      window.removeEventListener("resize",resize);
      window.removeEventListener("keydown",onKey);
      window.removeEventListener("keyup",onUp);
    };
  },[]);

  const teleport=(room:Room)=>{
    playerRef.current={x:room.x+room.w/2,y:room.y+room.h/2};
    setActiveRoom(room.id);
    setMapOpen(false);
    setStarted(true);
  };

  const interact=()=>{
    const p=playerRef.current;
    let nearest:NPC|null=null;
    let min=Infinity;
    npcRef.current.forEach(n=>{
      const d=distance(p,n);
      if(d<90 && d<min){nearest=n;min=d;}
    });
    if(nearest) setActiveNpc(nearest);
  };

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <a href="/" className={styles.back}><ArrowLeft size={16}/> AM WEBTECH</a>
        <div className={styles.title}><Building2 size={17}/><span>3D OFFICE WALKTHROUGH</span></div>
        <div className={styles.actions}>
          <button type="button" onClick={()=>setMapOpen(v=>!v)}><MapPin size={15}/> Floor Map</button>
          <a href="/" className={styles.exit}><X size={15}/> Exit</a>
        </div>
      </div>

      <section className={styles.game}>
        <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive 3D AM Webtech office walkthrough"/>
        {!started && <div className={styles.intro}>
          <div className={styles.introIcon}><Building2 size={28}/></div>
          <p className={styles.kicker}>AM WEBTECH / QUALITY ENGINEERING</p>
          <h1>Walk through the <span>QA office.</span></h1>
          <p>Explore the office layout, meet employee NPCs, visit the QA floor, automation team, meeting room and leadership cabins.</p>
          <button type="button" className={styles.start} onClick={()=>setStarted(true)}><Zap size={17}/> Start walkthrough</button>
          <div className={styles.controls}><b>WASD / ARROWS</b><span>Move</span><b>E</b><span>Meet nearby employee</span><b>M</b><span>Open floor map</span></div>
        </div>}

        <div className={styles.hud}>
          <div><span>LOCATION</span><strong>{rooms.find(r=>r.id===activeRoom)?.name||"Main Corridor"}</strong></div>
          <div><span>CONTROLS</span><strong>W A S D / ARROWS</strong></div>
          <button type="button" onClick={interact}><Users size={15}/> Talk / E</button>
        </div>

        <div className={styles.roomRail}>
          {rooms.filter(r=>!["male","female"].includes(r.id)).map(r=>(
            <button key={r.id} type="button" onClick={()=>teleport(r)} title={r.name}>
              <span>{r.name}</span><small>{r.subtitle}</small>
            </button>
          ))}
        </div>

        <div className={styles.mobilePad} aria-label="Mobile movement controls">
          <button type="button" onPointerDown={()=>keysRef.current.w=true} onPointerUp={()=>keysRef.current.w=false} onPointerLeave={()=>keysRef.current.w=false}><ChevronUp/></button>
          <button type="button" onPointerDown={()=>keysRef.current.a=true} onPointerUp={()=>keysRef.current.a=false} onPointerLeave={()=>keysRef.current.a=false}><ChevronLeft/></button>
          <button type="button" onPointerDown={()=>keysRef.current.s=true} onPointerUp={()=>keysRef.current.s=false} onPointerLeave={()=>keysRef.current.s=false}><ChevronDown/></button>
          <button type="button" onPointerDown={()=>keysRef.current.d=true} onPointerUp={()=>keysRef.current.d=false} onPointerLeave={()=>keysRef.current.d=false}><ChevronRight/></button>
        </div>

        {mapOpen && <div className={styles.mapPanel}>
          <div className={styles.mapHead}><div><b>OFFICE DIRECTORY</b><span>Click a destination to walk there.</span></div><button type="button" onClick={()=>setMapOpen(false)}><X/></button></div>
          <div className={styles.mapGrid}>
            {rooms.map(r=><button key={r.id} type="button" onClick={()=>teleport(r)}><MapPin size={15}/><span>{r.name}</span><small>{r.subtitle}</small></button>)}
          </div>
        </div>}

        {activeNpc && <div className={styles.npcCard}>
          <button type="button" onClick={()=>setActiveNpc(null)}><X size={15}/></button>
          <div className={styles.npcAvatar}>{initials(activeNpc.name)}</div>
          <p>AM WEBTECH / EMPLOYEE</p>
          <h2>{activeNpc.name}</h2>
          <span>{activeNpc.title}</span>
          <small>Currently in {rooms.find(r=>r.id===activeNpc.room)?.name||"the office"}</small>
        </div>}

        <div className={styles.tip}><MousePointer2 size={14}/> Walk near an NPC and press <b>E</b> to meet them.</div>
      </section>
    </main>
  );
}

function initials(name:string){
  return name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
}

function drawWorld(
  ctx:CanvasRenderingContext2D,
  width:number,
  height:number,
  camera:Vec,
  player:Vec,
  npcList:NPC[],
  now:number
){
  const scale=Math.min(width/1100,height/720);
  const origin={x:width/2,y:height/2+40};
  const iso=(p:Vec,z=0)=>({
    x:origin.x+(p.x-camera.x)*scale*.78-(p.y-camera.y)*scale*.38,
    y:origin.y+(p.x-camera.x)*scale*.32+(p.y-camera.y)*scale*.20-z*scale
  });

  ctx.fillStyle="#071a3d";
  ctx.fillRect(0,0,width,height);

  // Soft floor glow / depth plane.
  const floor=iso({x:60,y:40});
  ctx.save();
  const grad=ctx.createRadialGradient(origin.x,origin.y,10,origin.x,origin.y,width*.55);
  grad.addColorStop(0,"rgba(0,87,184,.22)");
  grad.addColorStop(1,"rgba(6,26,61,0)");
  ctx.fillStyle=grad;
  ctx.fillRect(0,0,width,height);
  ctx.restore();

  rooms.forEach(r=>{
    drawIsoRoom(ctx,iso,r,scale);
  });

  // Central QA desks.
  const qa=rooms.find(r=>r.id==="qa")!;
  for(let row=0;row<4;row++){
    for(let col=0;col<3;col++){
      const x=qa.x+115+col*205, y=qa.y+95+row*92;
      drawDesk(ctx,iso({x,y}),scale);
    }
  }

  // Automation desks.
  for(let i=0;i<4;i++) drawDesk(ctx,iso({x:515+i*55,y:150}),scale);

  npcList.forEach(n=>drawNPC(ctx,iso({x:n.x,y:n.y}),scale,n,now));
  drawPlayer(ctx,iso(player),scale,now);

  // Entry marker.
  const e=iso({x:560,y:870});
  ctx.save();
  ctx.translate(e.x,e.y);
  ctx.fillStyle="rgba(0,190,110,.22)";
  ctx.beginPath();ctx.ellipse(0,6,42*scale,18*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#25c77a";
  ctx.font=`700 ${Math.max(10,12*scale)}px Manrope`;
  ctx.textAlign="center";
  ctx.fillText("ENTRY",0,-12*scale);
  ctx.restore();
}

function drawIsoRoom(ctx:CanvasRenderingContext2D,iso:(p:Vec,z?:number)=>{x:number,y:number},r:Room,scale:number){
  const a=iso({x:r.x,y:r.y}), b=iso({x:r.x+r.w,y:r.y}), c=iso({x:r.x+r.w,y:r.y+r.h}), d=iso({x:r.x,y:r.y+r.h});
  ctx.save();
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();
  ctx.fillStyle=r.floor;ctx.globalAlpha=.94;ctx.fill();
  ctx.globalAlpha=1;ctx.strokeStyle="rgba(7,26,61,.55)";ctx.lineWidth=Math.max(1,2*scale);ctx.stroke();

  const wallH=32*scale;
  [[a,b],[b,c],[c,d],[d,a]].forEach(([p1,p2])=>{
    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.lineTo(p2.x,p2.y-wallH);ctx.lineTo(p1.x,p1.y-wallH);ctx.closePath();
    ctx.fillStyle="rgba(19,34,52,.88)";ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,.12)";ctx.stroke();
  });

  const label=iso({x:r.x+r.w*.5,y:r.y+r.h*.5},38);
  ctx.fillStyle="rgba(6,26,61,.92)";
  const labelW=Math.min(210,Math.max(100,r.name.length*6.2))*scale;
  const labelH=34*scale;
  roundRect(ctx,label.x-labelW/2,label.y-labelH/2,labelW,labelH,8*scale);
  ctx.fill();
  ctx.strokeStyle=r.accent;ctx.lineWidth=Math.max(1,1.4*scale);ctx.stroke();
  ctx.fillStyle="#fff";ctx.textAlign="center";
  ctx.font=`700 ${Math.max(9,11*scale)}px Manrope`;
  ctx.fillText(r.name.toUpperCase(),label.x,label.y-2*scale);
  ctx.fillStyle="#b9c9da";
  ctx.font=`500 ${Math.max(7,8*scale)}px Manrope`;
  ctx.fillText(r.subtitle,label.x,label.y+10*scale);
  ctx.restore();
}

function drawDesk(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number){
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.fillStyle="rgba(0,0,0,.20)";ctx.beginPath();ctx.ellipse(0,10*scale,27*scale,11*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#b9772f";roundRect(ctx,-23*scale,-10*scale,46*scale,20*scale,3*scale);ctx.fill();
  ctx.fillStyle="#0057b8";ctx.fillRect(-14*scale,-6*scale,28*scale,7*scale);
  ctx.fillStyle="#202a35";ctx.fillRect(-3*scale,5*scale,6*scale,9*scale);
  ctx.restore();
}

function drawNPC(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number,n:NPC,now:number){
  const bob=Math.sin(now/330+n.x)*1.4*scale;
  ctx.save();ctx.translate(p.x,p.y+bob);
  ctx.fillStyle="rgba(0,0,0,.22)";ctx.beginPath();ctx.ellipse(0,11*scale,12*scale,6*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=n.color;roundRect(ctx,-8*scale,-2*scale,16*scale,20*scale,6*scale);ctx.fill();
  ctx.fillStyle="#f1c7a8";ctx.beginPath();ctx.arc(0,-10*scale,7*scale,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#202631";ctx.beginPath();ctx.arc(0,-13*scale,7*scale,Math.PI,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#101828";ctx.lineWidth=2*scale;ctx.beginPath();ctx.moveTo(-5*scale,18*scale);ctx.lineTo(-7*scale,27*scale);ctx.moveTo(5*scale,18*scale);ctx.lineTo(7*scale,27*scale);ctx.stroke();

  const labelY=-34*scale;
  const labelW=Math.max(86,n.name.length*5.2)*scale;
  ctx.fillStyle="rgba(6,26,61,.94)";roundRect(ctx,-labelW/2,labelY-22*scale,labelW,25*scale,6*scale);ctx.fill();
  ctx.strokeStyle=n.color;ctx.lineWidth=Math.max(1,scale);ctx.stroke();
  ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font=`700 ${Math.max(7,8.5*scale)}px Manrope`;
  ctx.fillText(n.name,-0,labelY-10*scale);
  ctx.fillStyle="#b8c9dc";ctx.font=`500 ${Math.max(6,6.5*scale)}px Manrope`;
  ctx.fillText(n.title.slice(0,28),0,labelY+1*scale);
  ctx.restore();
}

function drawPlayer(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number,now:number){
  const bob=Math.sin(now/180)*1.8*scale;
  ctx.save();ctx.translate(p.x,p.y+bob);
  ctx.fillStyle="rgba(0,0,0,.3)";ctx.beginPath();ctx.ellipse(0,12*scale,14*scale,7*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#ff7a00";roundRect(ctx,-9*scale,-2*scale,18*scale,22*scale,7*scale);ctx.fill();
  ctx.fillStyle="#f2c7a8";ctx.beginPath();ctx.arc(0,-11*scale,8*scale,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#071a3d";ctx.beginPath();ctx.arc(0,-14*scale,8*scale,Math.PI,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#061a3d";ctx.lineWidth=3*scale;ctx.beginPath();ctx.moveTo(-5*scale,19*scale);ctx.lineTo(-7*scale,28*scale);ctx.moveTo(5*scale,19*scale);ctx.lineTo(7*scale,28*scale);ctx.stroke();
  ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font=`700 ${Math.max(7,8*scale)}px Manrope`;ctx.fillText("YOU",0,-28*scale);
  ctx.restore();
}

function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  const rr=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
}
