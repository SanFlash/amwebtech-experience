/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Building2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  MapPin, MousePointer2, Users, X, Zap
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
  { id:"automation", name:"Automation Team", subtitle:"8 seats", x:115, y:50, w:365, h:190, floor:"#d9b27b", accent:"#0057b8" },
  { id:"hr", name:"HR", subtitle:"2 seats", x:490, y:50, w:135, h:190, floor:"#dfbc89", accent:"#ff7a00" },
  { id:"srhr", name:"Sr HR", subtitle:"2 seats", x:635, y:50, w:135, h:190, floor:"#dfbc89", accent:"#ff7a00" },
  { id:"manager", name:"Manager", subtitle:"2 seats", x:780, y:50, w:145, h:190, floor:"#dfbc89", accent:"#ff7a00" },
  { id:"sales", name:"Sales Team", subtitle:"4 seats", x:935, y:50, w:230, h:190, floor:"#dfbc89", accent:"#0057b8" },
  { id:"director", name:"Director", subtitle:"3 seats", x:1175, y:50, w:245, h:190, floor:"#dfbc89", accent:"#ff7a00" },
  { id:"male", name:"Male Washroom", subtitle:"Facilities", x:75, y:260, w:325, h:120, floor:"#cbd7dc", accent:"#6d7f89" },
  { id:"female", name:"Female Washroom", subtitle:"Facilities", x:75, y:385, w:325, h:120, floor:"#cbd7dc", accent:"#6d7f89" },
  { id:"kitchen", name:"Kitchen", subtitle:"2 seats", x:75, y:510, w:325, h:155, floor:"#d9c19c", accent:"#ff7a00" },
  { id:"meeting", name:"Meeting Room", subtitle:"6 seats", x:75, y:670, w:390, h:210, floor:"#cfc4b1", accent:"#0057b8" },
  { id:"qa", name:"QA Team — Open Floor", subtitle:"24 seats", x:505, y:315, w:910, h:525, floor:"#d6bd91", accent:"#0057b8" },
];

const npcs: NPC[] = [
  { name:"", title:"Automation QA", room:"automation", x:175, y:165, color:"#0057b8", speed:0, home:{x:175,y:165} },
  { name:"", title:"Automation QA", room:"automation", x:245, y:165, color:"#ff7a00", speed:0, home:{x:245,y:165} },
  { name:"", title:"Automation QA", room:"automation", x:315, y:165, color:"#2f7d5a", speed:0, home:{x:315,y:165} },
  { name:"", title:"Automation QA", room:"automation", x:385, y:165, color:"#7b61ff", speed:0, home:{x:385,y:165} },
  { name:"", title:"Automation QA", room:"automation", x:175, y:205, color:"#7b61ff", speed:0, home:{x:175,y:205} },
  { name:"", title:"Automation QA", room:"automation", x:245, y:205, color:"#2f7d5a", speed:0, home:{x:245,y:205} },
  { name:"", title:"Automation QA", room:"automation", x:315, y:205, color:"#0057b8", speed:0, home:{x:315,y:205} },
  { name:"", title:"Automation QA", room:"automation", x:385, y:205, color:"#ff7a00", speed:0, home:{x:385,y:205} },
  { name:"", title:"HR", room:"hr", x:545, y:150, color:"#7b61ff", speed:0, home:{x:545,y:150} },
  { name:"", title:"HR", room:"hr", x:590, y:150, color:"#7b61ff", speed:0, home:{x:590,y:150} },
  { name:"", title:"HR", room:"srhr", x:690, y:150, color:"#2f7d5a", speed:0, home:{x:690,y:150} },
  { name:"", title:"HR", room:"srhr", x:735, y:150, color:"#2f7d5a", speed:0, home:{x:735,y:150} },
  { name:"", title:"Project Manager", room:"manager", x:835, y:150, color:"#ff7a00", speed:0, home:{x:835,y:150} },
  { name:"", title:"Project Manager", room:"manager", x:880, y:150, color:"#ff7a00", speed:0, home:{x:880,y:150} },
  { name:"", title:"Business Development", room:"sales", x:985, y:145, color:"#0b8ca6", speed:0, home:{x:985,y:145} },
  { name:"", title:"Business Development", room:"sales", x:1045, y:145, color:"#0b8ca6", speed:0, home:{x:1045,y:145} },
  { name:"", title:"Business Development", room:"sales", x:985, y:205, color:"#0b8ca6", speed:0, home:{x:985,y:205} },
  { name:"", title:"Business Development", room:"sales", x:1045, y:205, color:"#0b8ca6", speed:0, home:{x:1045,y:205} },
  { name:"", title:"Leadership", room:"director", x:1235, y:145, color:"#d14b7d", speed:0, home:{x:1235,y:145} },
  { name:"", title:"Leadership", room:"director", x:1290, y:145, color:"#d14b7d", speed:0, home:{x:1290,y:145} },
  { name:"", title:"Leadership", room:"director", x:1345, y:145, color:"#d14b7d", speed:0, home:{x:1345,y:145} },
  ...Array.from({length:24},(_,i)=>({ name:"", title:"QA Engineer", room:"qa", x:[690,930,1170][i%3], y:[410,465,520,575,630,685,740,795][Math.floor(i/3)], color:["#0057b8","#ff7a00","#2f7d5a","#7b61ff","#0b8ca6","#9b6b24"][i%6], speed:0, home:{x:[690,930,1170][i%3],y:[410,465,520,575,630,685,740,795][Math.floor(i/3)]} }))
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

      const rect=canvas.getBoundingClientRect();
      ctx.clearRect(0,0,rect.width,rect.height);
      drawWorld(ctx,rect.width,rect.height,p,npcRef.current,now);
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

        <div className={styles.mobilePad} aria-label="Mobile movement controls" onContextMenu={e=>e.preventDefault()}>
          <button type="button" aria-label="Move up" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.w=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.w=false;e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>keysRef.current.w=false}><ChevronUp/></button>
          <button type="button" aria-label="Move left" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.a=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.a=false;e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>keysRef.current.a=false}><ChevronLeft/></button>
          <button type="button" aria-label="Move down" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.s=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.s=false;e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>keysRef.current.s=false}><ChevronDown/></button>
          <button type="button" aria-label="Move right" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.d=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.d=false;e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>keysRef.current.d=false}><ChevronRight/></button>
        </div>

        {mapOpen && <div className={styles.mapPanel}>
          <div className={styles.mapHead}><div><b>OFFICE DIRECTORY</b><span>Click a destination to walk there.</span></div><button type="button" onClick={()=>setMapOpen(false)}><X/></button></div>
          <div className={styles.mapGrid}>
            {rooms.map(r=><button key={r.id} type="button" onClick={()=>teleport(r)}><MapPin size={15}/><span>{r.name}</span><small>{r.subtitle}</small></button>)}
          </div>
        </div>}

        {activeNpc && <div className={styles.npcCard}>
          <button type="button" onClick={()=>setActiveNpc(null)}><X size={15}/></button>
          <div className={styles.npcAvatar}><Users size={23}/></div>
          <p>AM WEBTECH / WORKSTATION</p>
          <h2>{activeNpc.title}</h2>
          <span>Seated • Working on PC</span>
          <small>{rooms.find(r=>r.id===activeNpc.room)?.name||"the office"} · Active workstation</small>
        </div>}

        <div className={styles.tip}><MousePointer2 size={14}/> Every employee stays at a workstation. <b>E</b> inspects nearby work.</div>
      </section>
    </main>
  );
}

function drawWorld(
  ctx:CanvasRenderingContext2D,
  width:number,
  height:number,
  player:Vec,
  npcList:NPC[],
  now:number
){
  const scale=Math.min((width-36)/1536,(height-36)/900);
  const origin={x:(width-1536*scale)/2,y:(height-900*scale)/2+10};
  const iso=(p:Vec,z=0)=>({
    x:origin.x+p.x*scale,
    y:origin.y+p.y*scale-z*scale
  });

  ctx.fillStyle="#071a3d";
  ctx.fillRect(0,0,width,height);

  // Soft floor glow / depth plane.
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
  [690,930,1170].forEach(x=>[410,465,520,575,630,685,740,795].forEach(y=>drawDesk(ctx,iso({x,y}),scale)));
  [175,245,315,385].forEach(x=>{drawDesk(ctx,iso({x,y:165}),scale);drawDesk(ctx,iso({x,y:205}),scale);});

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

function drawPlayer(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number,now:number){
  const pulse=0.5+0.5*Math.sin(now/220);
  ctx.save();
  ctx.translate(p.x,p.y);
  ctx.fillStyle="rgba(37,199,122,"+(0.16+0.10*pulse)+")";
  ctx.beginPath();ctx.ellipse(0,8*scale,15*scale,8*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#0b8f5b";
  ctx.beginPath();ctx.ellipse(0,5*scale,8*scale,6*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#25c77a";
  roundRect(ctx,-7*scale,-10*scale,14*scale,18*scale,5*scale);ctx.fill();
  ctx.fillStyle="#f1c6a6";
  ctx.beginPath();ctx.arc(0,-18*scale,6*scale,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#172331";
  ctx.beginPath();ctx.arc(0,-21*scale,6*scale,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillStyle="#fff";
  ctx.beginPath();ctx.arc(0,-29*scale,3*scale,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="rgba(37,199,122,.8)";
  ctx.lineWidth=Math.max(1,1.5*scale);
  ctx.beginPath();ctx.arc(0,-2*scale,13*scale,0,Math.PI*2);ctx.stroke();
  ctx.restore();
}

function drawNPC(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number,n:NPC,now:number){
  const typing=Math.sin(now/125+p.x)*2;
  ctx.save();ctx.translate(p.x,p.y);
  ctx.fillStyle="rgba(0,0,0,.24)";ctx.beginPath();ctx.ellipse(0,9*scale,9*scale,5*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#18202a";ctx.beginPath();ctx.ellipse(0,10*scale,7*scale,5*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=n.color;roundRect(ctx,-7*scale,-8*scale,14*scale,17*scale,5*scale);ctx.fill();
  ctx.fillStyle="#f1c6a6";ctx.beginPath();ctx.arc(0,-16*scale,6*scale,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#1d2530";ctx.beginPath();ctx.arc(0,-19*scale,6*scale,Math.PI,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#f1c6a6";ctx.lineWidth=Math.max(1,2*scale);ctx.beginPath();ctx.moveTo(-5*scale,-1*scale);ctx.lineTo(-10*scale,typing*scale);ctx.moveTo(5*scale,-1*scale);ctx.lineTo(10*scale,-typing*scale);ctx.stroke();
  ctx.fillStyle="rgba(0,190,255,"+(.22+.18*Math.sin(now/240+p.x))+")";ctx.beginPath();ctx.arc(0,-28*scale,5*scale,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
