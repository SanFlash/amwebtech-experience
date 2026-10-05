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
  { id:"automation", name:"Automation Team", subtitle:"8 seats", x:85, y:55, w:390, h:225, floor:"#e6d2b0", accent:"#0057b8" },
  { id:"hr", name:"HR", subtitle:"2 seats", x:490, y:55, w:145, h:225, floor:"#ead8bb", accent:"#ff7a00" },
  { id:"srhr", name:"Sr HR", subtitle:"2 seats", x:650, y:55, w:145, h:225, floor:"#ead8bb", accent:"#ff7a00" },
  { id:"manager", name:"Manager", subtitle:"2 seats", x:810, y:55, w:155, h:225, floor:"#ead8bb", accent:"#ff7a00" },
  { id:"sales", name:"Sales Team", subtitle:"4 seats", x:980, y:55, w:235, h:225, floor:"#ead8bb", accent:"#0057b8" },
  { id:"director", name:"Director", subtitle:"3 seats", x:1230, y:55, w:305, h:225, floor:"#ead8bb", accent:"#ff7a00" },
  { id:"male", name:"Male Washroom", subtitle:"Facilities", x:70, y:300, w:175, h:95, floor:"#d4dde2", accent:"#71808a" },
  { id:"female", name:"Female Washroom", subtitle:"Facilities", x:250, y:300, w:175, h:95, floor:"#d4dde2", accent:"#71808a" },
  { id:"kitchen", name:"Kitchen", subtitle:"2 seats", x:70, y:405, w:355, h:170, floor:"#e3cfad", accent:"#ff7a00" },
  { id:"meeting", name:"Meeting Room", subtitle:"6 seats", x:70, y:590, w:425, h:245, floor:"#cfc4b1", accent:"#0057b8" },
  { id:"reception", name:"Reception / Entry", subtitle:"Welcome", x:500, y:745, w:260, h:115, floor:"#b89567", accent:"#25c77a" },
  { id:"qa", name:"QA Team Cabins (Open)", subtitle:"Approximately 24 seats", x:505, y:305, w:1030, h:430, floor:"#e4d1ae", accent:"#0057b8" },
];

const npcs: NPC[] = [
  ...([[160,165],[245,165],[330,165],[415,165],[160,235],[245,235],[330,235],[415,235]].map(([x,y],i)=>({name:"",title:"Automation QA",room:"automation",x,y,color:["#0057b8","#ff7a00","#2f7d5a","#7b61ff"][i%4],speed:0,home:{x,y}}))),
  ...([[545,155],[590,225]].map(([x,y])=>({name:"",title:"HR",room:"hr",x,y,color:"#7b61ff",speed:0,home:{x,y}}))),
  ...([[705,155],[750,225]].map(([x,y])=>({name:"",title:"HR",room:"srhr",x,y,color:"#2f7d5a",speed:0,home:{x,y}}))),
  ...([[865,155],[920,225]].map(([x,y])=>({name:"",title:"Project Manager",room:"manager",x,y,color:"#ff7a00",speed:0,home:{x,y}}))),
  ...([[1030,150],[1100,150],[1030,225],[1100,225]].map(([x,y])=>({name:"",title:"Business Development",room:"sales",x,y,color:"#0b8ca6",speed:0,home:{x,y}}))),
  ...([[1320,155],[1400,155],[1360,225]].map(([x,y])=>({name:"",title:"Leadership",room:"director",x,y,color:"#d14b7d",speed:0,home:{x,y}}))),
  ...Array.from({length:24},(_,i)=>({name:"",title:"QA Engineer",room:"qa",x:[690,930,1170][i%3],y:[365,415,465,515,565,615,665,715][Math.floor(i/3)],color:["#0057b8","#ff7a00","#2f7d5a","#7b61ff","#0b8ca6","#9b6b24"][i%6],speed:0,home:{x:[690,930,1170][i%3],y:[365,415,465,515,565,615,665,715][Math.floor(i/3)]}}))
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

function roundRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  const radius=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);
  ctx.beginPath();
  ctx.moveTo(x+radius,y);
  ctx.arcTo(x+w,y,x+w,y+h,radius);
  ctx.arcTo(x+w,y+h,x,y+h,radius);
  ctx.arcTo(x,y+h,x,y,radius);
  ctx.arcTo(x,y,x+w,y,radius);
  ctx.closePath();
}

function drawWorld(ctx:CanvasRenderingContext2D,width:number,height:number,player:Vec,npcList:NPC[],now:number){
  const mobile=width<=800;
  const scale=mobile?Math.min(width/560,height/760):Math.min((width-30)/1600,(height-30)/900);
  let origin:{x:number,y:number};
  if(mobile){
    const viewW=width/scale,viewH=height/scale;
    const cameraX=clamp(player.x,viewW/2,1600-viewW/2);
    const cameraY=clamp(player.y,viewH/2,900-viewH/2);
    origin={x:width/2-cameraX*scale,y:height/2-cameraY*scale+8};
  }else origin={x:(width-1600*scale)/2,y:(height-900*scale)/2+8};
  const iso=(p:Vec,z=0)=>({x:origin.x+p.x*scale,y:origin.y+p.y*scale-z*scale});

  const bg=ctx.createRadialGradient(width*.48,height*.36,20,width*.48,height*.36,Math.max(width,height)*.85);
  bg.addColorStop(0,"#536372");bg.addColorStop(.55,"#283847");bg.addColorStop(1,"#101923");
  ctx.fillStyle=bg;ctx.fillRect(0,0,width,height);

  const A=iso({x:45,y:25}),B=iso({x:1560,y:25}),C=iso({x:1560,y:875}),D=iso({x:45,y:875});
  ctx.save();ctx.fillStyle="rgba(0,0,0,.42)";ctx.beginPath();ctx.moveTo(A.x+12,A.y+18);ctx.lineTo(B.x+12,B.y+18);ctx.lineTo(C.x+12,C.y+18);ctx.lineTo(D.x+12,D.y+18);ctx.closePath();ctx.fill();ctx.restore();
  const slab=ctx.createLinearGradient(0,0,0,height);slab.addColorStop(0,"#dce3e7");slab.addColorStop(.55,"#c9d2d7");slab.addColorStop(1,"#aeb9c0");
  ctx.fillStyle=slab;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.lineTo(C.x,C.y);ctx.lineTo(D.x,D.y);ctx.closePath();ctx.fill();

  ctx.save();ctx.globalAlpha=.12;ctx.strokeStyle="#53616b";ctx.lineWidth=Math.max(1,scale);
  for(let x=70;x<=1560;x+=80){const p1=iso({x,y:35}),p2=iso({x,y:875});ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
  for(let y=55;y<=875;y+=70){const p1=iso({x:50,y}),p2=iso({x:1560,y});ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
  ctx.restore();

  rooms.forEach(r=>drawIsoRoom(ctx,iso,r,scale));
  [160,245,330,415].forEach(x=>{drawDesk(ctx,iso({x,y:165}),scale,"row");drawDesk(ctx,iso({x,y:235}),scale,"row");});
  [[545,155],[590,225],[705,155],[750,225],[865,155],[920,225],[1030,150],[1100,150],[1030,225],[1100,225],[1320,155],[1400,155],[1360,225]].forEach(([x,y])=>drawDesk(ctx,iso({x,y}),scale,"single"));
  [690,930,1170].forEach(x=>[365,415,465,515,565,615,665,715].forEach(y=>drawDesk(ctx,iso({x,y}),scale,"qa")));
  drawKitchen(ctx,iso({x:245,y:490}),scale);drawMeetingTable(ctx,iso({x:282,y:715}),scale);drawReception(ctx,iso({x:630,y:810}),scale);
  npcList.forEach(n=>drawNPC(ctx,iso({x:n.x,y:n.y}),scale,n,now));
  drawPlayer(ctx,iso(player),scale,now);

  const e=iso({x:630,y:860});const pulse=.5+.5*Math.sin(now/260);
  ctx.save();ctx.fillStyle="rgba(37,199,122,"+(.10+.08*pulse)+")";ctx.beginPath();ctx.ellipse(e.x,e.y+7*scale,58*scale,20*scale,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#25c77a";ctx.font="800 "+Math.max(9,12*scale)+"px Manrope";ctx.textAlign="center";ctx.fillText("ENTRY",e.x,e.y-12*scale);ctx.restore();
}

function drawIsoRoom(ctx:CanvasRenderingContext2D,iso:(p:Vec,z?:number)=>{x:number,y:number},r:Room,scale:number){
  const a=iso({x:r.x,y:r.y}),b=iso({x:r.x+r.w,y:r.y}),c=iso({x:r.x+r.w,y:r.y+r.h}),d=iso({x:r.x,y:r.y+r.h});
  ctx.save();const floor=ctx.createLinearGradient(a.x,a.y,c.x,c.y);floor.addColorStop(0,r.floor);floor.addColorStop(1,"#c5b18f");
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle=floor;ctx.fill();
  ctx.strokeStyle="rgba(13,28,42,.62)";ctx.lineWidth=Math.max(1,2*scale);ctx.stroke();
  const wallH=30*scale;
  [[a,b],[b,c],[c,d],[d,a]].forEach(([p1,p2])=>{ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.lineTo(p2.x,p2.y-wallH);ctx.lineTo(p1.x,p1.y-wallH);ctx.closePath();const g=ctx.createLinearGradient(p1.x,p1.y-wallH,p2.x,p2.y);g.addColorStop(0,"#f5f7f8");g.addColorStop(.45,"#aeb8bf");g.addColorStop(1,"#65727c");ctx.fillStyle=g;ctx.fill();ctx.strokeStyle="rgba(18,31,43,.65)";ctx.stroke();});
  if(r.id==="qa"){ctx.globalAlpha=.7;ctx.fillStyle="rgba(185,226,232,.22)";ctx.fillRect(a.x,a.y-wallH,b.x-a.x,wallH);ctx.globalAlpha=1;}
  const label=iso({x:r.x+r.w*.5,y:r.y+r.h*.5},34);const labelW=Math.min(250,Math.max(105,r.name.length*6.2))*scale,labelH=35*scale;
  ctx.fillStyle="rgba(8,19,30,.9)";roundRect(ctx,label.x-labelW/2,label.y-labelH/2,labelW,labelH,8*scale);ctx.fill();ctx.strokeStyle=r.accent;ctx.lineWidth=Math.max(1,1.5*scale);ctx.stroke();
  ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="800 "+Math.max(8,10*scale)+"px Manrope";ctx.fillText(r.name.toUpperCase(),label.x,label.y-2*scale);
  ctx.fillStyle="#c7d5df";ctx.font="500 "+Math.max(6,7.5*scale)+"px Manrope";ctx.fillText(r.subtitle,label.x,label.y+10*scale);ctx.restore();
}

function drawDesk(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number,kind:string){
  const wide=kind==="qa",w=(wide?50:42)*scale,h=(wide?24:22)*scale;ctx.save();ctx.translate(p.x,p.y);
  ctx.fillStyle="rgba(0,0,0,.25)";ctx.beginPath();ctx.ellipse(0,12*scale,(wide?31:27)*scale,11*scale,0,0,Math.PI*2);ctx.fill();
  const wood=ctx.createLinearGradient(-w/2,-h/2,w/2,h/2);wood.addColorStop(0,"#f0bf78");wood.addColorStop(.5,"#c98b48");wood.addColorStop(1,"#8f5d2c");ctx.fillStyle=wood;roundRect(ctx,-w/2,-h/2,w,h,3*scale);ctx.fill();
  ctx.fillStyle="#18232d";roundRect(ctx,-8*scale,-h*.38,16*scale,10*scale,1.5*scale);ctx.fill();ctx.fillStyle="#0057b8";ctx.globalAlpha=.8;ctx.fillRect(-6*scale,-h*.28,12*scale,5*scale);ctx.globalAlpha=1;ctx.fillStyle="#3e4b55";ctx.fillRect(-1.5*scale,-h*.05,3*scale,6*scale);
  ctx.fillStyle="#17212a";ctx.beginPath();ctx.ellipse(0,h*.62,8*scale,6*scale,0,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawKitchen(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number){
  ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="#775331";roundRect(ctx,-80*scale,-35*scale,160*scale,20*scale,4*scale);ctx.fill();ctx.fillStyle="#d8dde0";roundRect(ctx,-74*scale,-31*scale,48*scale,10*scale,2*scale);ctx.fill();ctx.fillStyle="#252d34";ctx.fillRect(42*scale,-31*scale,24*scale,13*scale);ctx.fillStyle="#c99150";roundRect(ctx,-35*scale,4*scale,70*scale,35*scale,4*scale);ctx.fill();ctx.fillStyle="#1b252e";ctx.beginPath();ctx.ellipse(-48*scale,22*scale,8*scale,6*scale,0,0,Math.PI*2);ctx.ellipse(48*scale,22*scale,8*scale,6*scale,0,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawMeetingTable(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number){
  ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(0,0,0,.2)";ctx.beginPath();ctx.ellipse(0,20*scale,100*scale,25*scale,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#c99150";roundRect(ctx,-90*scale,-32*scale,180*scale,64*scale,6*scale);ctx.fill();ctx.fillStyle="#5b3820";ctx.fillRect(-5*scale,30*scale,10*scale,20*scale);[[-72,-46],[0,-48],[72,-46],[-72,46],[0,48],[72,46]].forEach(([x,y])=>{ctx.fillStyle="#17212a";ctx.beginPath();ctx.ellipse(x*scale,y*scale,12*scale,8*scale,0,0,Math.PI*2);ctx.fill();});ctx.restore();
}

function drawReception(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number){
  ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(0,0,0,.22)";ctx.beginPath();ctx.ellipse(0,22*scale,105*scale,24*scale,0,0,Math.PI*2);ctx.fill();const g=ctx.createLinearGradient(-90*scale,-20*scale,90*scale,20*scale);g.addColorStop(0,"#4b2d18");g.addColorStop(.5,"#9b6632");g.addColorStop(1,"#4b2d18");ctx.fillStyle=g;roundRect(ctx,-90*scale,-22*scale,180*scale,48*scale,5*scale);ctx.fill();ctx.fillStyle="#fff";ctx.font="800 "+Math.max(7,9*scale)+"px Manrope";ctx.textAlign="center";ctx.fillText("AM WEBTECH",0,7*scale);ctx.fillStyle="#25c77a";ctx.fillRect(-42*scale,-5*scale,84*scale,2*scale);ctx.restore();
}

function drawPlayer(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number,now:number){
  const pulse=.5+.5*Math.sin(now/180);ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(37,199,122,"+(.18+.12*pulse)+")";ctx.beginPath();ctx.ellipse(0,11*scale,18*scale,9*scale,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#0b8f5b";ctx.beginPath();ctx.ellipse(0,7*scale,9*scale,6*scale,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#25c77a";roundRect(ctx,-8*scale,-11*scale,16*scale,21*scale,5*scale);ctx.fill();ctx.fillStyle="#f1c6a6";ctx.beginPath();ctx.arc(0,-20*scale,7*scale,0,Math.PI*2);ctx.fill();ctx.fillStyle="#18222c";ctx.beginPath();ctx.arc(0,-23*scale,7*scale,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(0,-33*scale,3.5*scale,0,Math.PI*2);ctx.fill();ctx.strokeStyle="rgba(37,199,122,.9)";ctx.lineWidth=Math.max(1,1.5*scale);ctx.beginPath();ctx.arc(0,-2*scale,16*scale,0,Math.PI*2);ctx.stroke();ctx.restore();
}

function drawNPC(ctx:CanvasRenderingContext2D,p:{x:number,y:number},scale:number,n:NPC,now:number){
  const typing=Math.sin(now/120+p.x)*2.5;ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle="rgba(0,0,0,.25)";ctx.beginPath();ctx.ellipse(0,10*scale,10*scale,5*scale,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#17212a";ctx.beginPath();ctx.ellipse(0,11*scale,8*scale,5*scale,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=n.color;roundRect(ctx,-7*scale,-9*scale,14*scale,18*scale,5*scale);ctx.fill();ctx.fillStyle="#f1c6a6";ctx.beginPath();ctx.arc(0,-17*scale,6*scale,0,Math.PI*2);ctx.fill();ctx.fillStyle="#1d2530";ctx.beginPath();ctx.arc(0,-20*scale,6*scale,Math.PI,Math.PI*2);ctx.fill();ctx.strokeStyle="#f1c6a6";ctx.lineWidth=Math.max(1,2*scale);ctx.beginPath();ctx.moveTo(-5*scale,-1*scale);ctx.lineTo(-10*scale,typing*scale);ctx.moveTo(5*scale,-1*scale);ctx.lineTo(10*scale,-typing*scale);ctx.stroke();ctx.fillStyle="rgba(0,190,255,"+(.18+.15*Math.sin(now/240+p.x))+")";ctx.beginPath();ctx.arc(0,-29*scale,5*scale,0,Math.PI*2);ctx.fill();ctx.restore();
}
