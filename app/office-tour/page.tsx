"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  ArrowLeft, Building2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp,
  MapPin, MousePointer2, Users, X, Zap
} from "lucide-react";
import styles from "./office-tour.module.css";

type Room = {
  id:string; name:string; subtitle:string;
  x:number; z:number; w:number; d:number;
  floor:string; accent:string;
};
type Worker = {
  title:string; room:string; x:number; z:number; color:string;
  group?:THREE.Group; phase:number;
  roam?:{points:number[][];duration:number};
};

const rooms:Room[]=[
  {id:"automation",name:"Automation Team",subtitle:"8 seats",x:-11.1,z:-6.0,w:7.2,d:4.3,floor:"#d9b27b",accent:"#0057b8"},
  {id:"hr",name:"HR",subtitle:"2 seats",x:-5.9,z:-6.0,w:2.6,d:4.3,floor:"#dfbc89",accent:"#ff7a00"},
  {id:"srhr",name:"Sr HR",subtitle:"2 seats",x:-3.0,z:-6.0,w:2.6,d:4.3,floor:"#dfbc89",accent:"#ff7a00"},
  {id:"manager",name:"Manager",subtitle:"2 seats",x:0.0,z:-6.0,w:2.8,d:4.3,floor:"#dfbc89",accent:"#ff7a00"},
  {id:"sales",name:"Sales Team",subtitle:"4 seats",x:3.8,z:-6.0,w:4.3,d:4.3,floor:"#dfbc89",accent:"#0057b8"},
  {id:"director",name:"Director",subtitle:"3 seats",x:7.9,z:-6.0,w:5.3,d:4.3,floor:"#dfbc89",accent:"#ff7a00"},
  {id:"male",name:"Male Washroom",subtitle:"Facilities",x:-11.6,z:-3.0,w:3.3,d:1.8,floor:"#cbd7dc",accent:"#6d7f89"},
  {id:"female",name:"Female Washroom",subtitle:"Facilities",x:-8.2,z:-3.0,w:3.3,d:1.8,floor:"#cbd7dc",accent:"#6d7f89"},
  {id:"kitchen",name:"Kitchen",subtitle:"2 seats",x:-9.9,z:-0.4,w:6.6,d:2.9,floor:"#d9c19c",accent:"#ff7a00"},
  {id:"meeting",name:"Meeting Room",subtitle:"6 seats",x:-9.5,z:4.0,w:7.4,d:4.3,floor:"#cfc4b1",accent:"#0057b8"},
  {id:"reception",name:"Reception / Entry",subtitle:"Welcome",x:-2.1,z:7.0,w:4.5,d:2.0,floor:"#8b6035",accent:"#25c77a"},
  {id:"qa",name:"QA Team Cabins (Open)",subtitle:"Approximately 24 seats",x:4.1,z:2.0,w:17.2,d:8.5,floor:"#d6bd91",accent:"#0057b8"},
];

const workerData=[
  ...([[ -12.2,-6.0],[-10.7,-6.0],[-9.2,-6.0],[-7.7,-6.0],[-12.2,-4.7],[-10.7,-4.7],[-9.2,-4.7],[-7.7,-4.7]].map(([x,z],i)=>({title:"Automation QA",room:"automation",x,z,color:["#0057b8","#ff7a00","#2f7d5a","#7b61ff"][i%4]}))),
  ...([[-6.4,-6.0],[-5.4,-4.7]].map(([x,z])=>({title:"HR",room:"hr",x,z,color:"#7b61ff"}))),
  ...([[-3.5,-6.0],[-2.5,-4.7]].map(([x,z])=>({title:"HR",room:"srhr",x,z,color:"#2f7d5a"}))),
  ...([[-.5,-6.0],[.5,-4.7]].map(([x,z])=>({title:"Project Manager",room:"manager",x,z,color:"#ff7a00"}))),
  ...([[3.0,-6.0],[4.4,-6.0],[3.0,-4.7],[4.4,-4.7]].map(([x,z])=>({title:"Business Development",room:"sales",x,z,color:"#0b8ca6"}))),
  ...([[7.0,-6.0],[8.4,-6.0],[7.7,-4.7]].map(([x,z])=>({title:"Leadership",room:"director",x,z,color:"#d14b7d"}))),
  ...Array.from({length:24},(_,i)=>{
    const x=[1.4,4.6,7.8][i%3];
    const z=[-1.0,.25,1.5,2.75,4.0,5.25,6.5,7.75][Math.floor(i/3)];
    const roaming=[1,8,15,22].includes(i);
    return {
      title:"QA Engineer",room:"qa",x,z,
      color:["#0057b8","#ff7a00","#2f7d5a","#7b61ff","#0b8ca6","#9b6b24"][i%6],
      ...(roaming?{roam:{points:[[x,z],[x,-2.55],[0,-3.15],[0,-5.15],[0,-3.15],[x,-2.55],[x,z]],duration:18+i*.35}}:{})
    };
  })
];

function roomById(id:string){return rooms.find(r=>r.id===id);}
function makeMat(color:string,rough=.72,metal=0){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
function box(scene:THREE.Group|THREE.Scene,size:[number,number,number],pos:[number,number,number],color:string,rough=.72){
  const m=new THREE.Mesh(new THREE.BoxGeometry(...size),makeMat(color,rough));
  m.position.set(...pos);scene.add(m);return m;
}
function addPlant(parent:THREE.Group,x:number,z:number,scale=1){
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(.16*scale,.2*scale,.34*scale,12),makeMat("#6d4b2e"));
  pot.position.set(x,.2*scale,z);parent.add(pot);
  for(let i=0;i<5;i++){
    const leaf=new THREE.Mesh(new THREE.SphereGeometry(.17*scale,8,6),makeMat(i%2?"#2f7d5a":"#3f8f4c"));
    leaf.scale.set(.65,1.25,.65);leaf.position.set(x+(i-2)*.09*scale,.48*scale,z+((i%2)-.5)*.08*scale);parent.add(leaf);
  }
}
function addDesk(parent:THREE.Group,x:number,z:number,rotation=0,qa=false){
  const w=qa?1.35:1.35,d=.75,h=.8;
  const top=box(parent,[w,.13,d],[x,h,z],"#b9783e",.5);top.rotation.y=rotation;
  box(parent,[.08,.65,.08],[x-w*.38,.43,z-d*.36],"#654126");
  box(parent,[.08,.65,.08],[x+w*.38,.43,z-d*.36],"#654126");
  box(parent,[.08,.65,.08],[x-w*.38,.43,z+d*.36],"#654126");
  box(parent,[.08,.65,.08],[x+w*.38,.43,z+d*.36],"#654126");
  const mon=box(parent,[.44,.38,.08],[x,.98,z-.03],"#17232e",.25);
  mon.rotation.y=rotation;
  box(parent,[.06,.18,.04],[x,.78,z-.03],"#4a5660",.4);
  const screen=box(parent,[.32,.20,.025],[x,.99,z-.075],"#0b67c1",.2);
  screen.rotation.y=rotation;
  addChair(parent,x,z+d*.92,rotation);
}
function addQABench(parent:THREE.Group,x:number,z:number){
  // Long vertical bench islands: 4 seats on each side, matching the reference.
  const length=6.8,depth=1.18,height=.8;
  const table=box(parent,[depth,.13,length],[x,height,z],"#b9783e",.5);
  table.castShadow=true;
  [-2.55,-.85,.85,2.55].forEach(offset=>{
    const stationZ=z+offset;
    box(parent,[.44,.38,.08],[x,.98,stationZ],"#17232e",.25);
    box(parent,[.32,.20,.025],[x,.99,stationZ-.075],"#0b67c1",.2);
    box(parent,[.04,.18,.04],[x,.78,stationZ],"#4a5660",.4);
    addChair(parent,x-.98,stationZ,Math.PI/2);
    addChair(parent,x+.98,stationZ,-Math.PI/2);
  });
  box(parent,[.12,.14,length],[x,1.05,z],"#5d6a72",.45);
}

function addWorker(parent:THREE.Group,w:Worker){
  const g=new THREE.Group();g.position.set(w.x,0,w.z);w.group=g;
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.33,16),new THREE.MeshBasicMaterial({color:"#000",transparent:true,opacity:.18}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=.02;g.add(shadow);
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(.22,.48,5,10),makeMat(w.color,.7));body.position.y=.62;g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.2,12,8),makeMat("#e9b994"));head.position.y=1.18;g.add(head);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.205,12,8,0,Math.PI*2,0,Math.PI*.5),makeMat("#20252b"));hair.position.y=1.25;g.add(hair);
  const armL=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.3,4,6),makeMat("#e9b994"));armL.position.set(-.2,.68,.16);armL.rotation.x=-.8;g.add(armL);
  const armR=armL.clone();armR.position.x=.2;g.add(armR);
  parent.add(g);
}
function addRoomShell(root:THREE.Group,r:Room){
  const floor=box(root,[r.w,.16,r.d],[r.x,0,r.z],r.floor,.9);
  floor.receiveShadow=true;
  const wallH=1.65,wall=.16;
  const glass=r.id==="qa";
  if(glass){
    const glassMat=new THREE.MeshPhysicalMaterial({color:"#9ebfc4",transparent:true,opacity:.32,roughness:.18,metalness:.08});
    const lowH=.78;
    [[r.w,wall,r.d/2],[r.w,wall,-r.d/2]].forEach(([w,h,z])=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(w,lowH,wall),glassMat);
      m.position.set(r.x,.39,r.z+z);root.add(m);
    });
    [-1,1].forEach(s=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(wall,lowH,r.d),glassMat);
      m.position.set(r.x+s*r.w/2,.39,r.z);root.add(m);
    });
    return;
  }
  const wm=new THREE.MeshStandardMaterial({color:"#eef1f2",roughness:.5,metalness:.08});
  [[r.w,wall,r.d/2],[r.w,wall,-r.d/2]].forEach(([w,h,z])=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,wallH,wall),wm);
    m.position.set(r.x,.83,r.z+z);root.add(m);
  });
  const sideMat=new THREE.MeshStandardMaterial({color:"#d8dee1",roughness:.52});
  [-1,1].forEach(s=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(wall,wallH,r.d),sideMat);
    m.position.set(r.x+s*r.w/2,.83,r.z);root.add(m);
  });
  const label=makeLabel(r.name,r.subtitle,r.accent);
  label.position.set(r.x,.08,r.z-r.d*.05);
  label.rotation.x=-Math.PI/2;root.add(label);
}
function makeLabel(title:string,sub:string,color:string){
  const c=document.createElement("canvas");c.width=512;c.height=128;const x=c.getContext("2d")!;
  x.fillStyle="rgba(7,16,28,.94)";
  x.beginPath();
  x.roundRect(8,8,496,112,18);
  x.fill();
  x.strokeStyle=color;x.lineWidth=5;x.stroke();
  x.fillStyle="#fff";x.font="800 27px Arial";x.textAlign="center";x.fillText(title.toUpperCase(),256,55);
  x.fillStyle="#c6d5e2";x.font="500 19px Arial";x.fillText(sub,256,88);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));
  s.scale.set(3.0,.75,1);return s;
}
function addRoomFurniture(root:THREE.Group){
  [ -12.2,-10.7,-9.2,-7.7].forEach(x=>{addDesk(root,x,-6.0);addDesk(root,x,-4.7);});
  [[-6.4,-6],[-5.4,-4.7],[-3.5,-6],[-2.5,-4.7],[-.5,-6],[.5,-4.7],[3,-6],[4.4,-6],[3,-4.7],[4.4,-4.7],[7,-6],[8.4,-6],[7.7,-4.7]].forEach(([x,z])=>addDesk(root,x,z));
  // QA open floor: three long shared bench islands, four seats per side.
  [1.4,4.6,7.8].forEach(x=>addQABench(root,x,3.35));
  // Kitchen
  box(root,[4.8,.9,.38],[-9.9,.55,-.95],"#795331");box(root,[2.0,.72,1.1],[-9.9,.45,.1],"#c98c4c");
  // Meeting room
  box(root,[3.8,.12,1.8],[-9.5,.75,4.0],"#c98c4c",.5);
  [-11.2,-9.5,-7.8].forEach(x=>{addChair(root,x,2.8);addChair(root,x,5.2);});
  // Reception
  box(root,[3.8,1.15,.65],[-2.1,.62,7],"#5b321d",.5);
  // Plants / planters
  [[-14,-7.7],[-7.2,-7.7],[.9,-7.7],[6.3,-7.7],[10.3,-7.7],[-13,-.9],[-5.7,.4],[-5.5,6.9],[.2,6.9],[9.8,6.9]].forEach(([x,z])=>addPlant(root,x,z,1.15));
}
function addChair(root:THREE.Group,x:number,z:number){
  const seat=box(root,[.55,.12,.55],[x,.34,z],"#17212a",.5);
  box(root,[.55,.65,.1],[x,.68,z+.24],"#263540",.5);
  seat.castShadow=true;
}
function buildScene(scene:THREE.Scene){
  scene.background=new THREE.Color("#1d2934");
  scene.fog=new THREE.Fog("#1d2934",25,55);
  scene.add(new THREE.HemisphereLight("#f6f7f8","#4a5965",2.1));
  const sun=new THREE.DirectionalLight("#fff7df",4.2);sun.position.set(-10,22,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);scene.add(sun);
  const fill=new THREE.DirectionalLight("#b9d9ff",1.4);fill.position.set(14,10,-16);scene.add(fill);
  const root=new THREE.Group();scene.add(root);
  box(root,[31,.25,18],[0,-.15,0],"#cbd3d7",1);
  rooms.forEach(r=>addRoomShell(root,r));
  addRoomFurniture(root);
  workerData.forEach((d,i)=>addWorker(root,{...d,phase:i*.55}));
  // Entry doors and brand wall.
  box(root,[2.2,2.0,.18],[-2.1,1,8.0],"#f1f4f5",.5);
  const brand=makeLabel("AM WEBTECH","QUALITY ENGINEERING","#25c77a");brand.position.set(-2.1,1.4,7.45);brand.scale.set(1.25,.32,1);brand.rotation.x=-Math.PI/2;root.add(brand);
  return root;
}

export default function OfficeTourPage(){
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const keysRef=useRef<Record<string,boolean>>({});
  const playerRef=useRef(new THREE.Vector3(-2.1,.35,8.1));
  const [activeRoom,setActiveRoom]=useState("reception");
  const [activeNpc,setActiveNpc]=useState<Worker|null>(null);
  const [started,setStarted]=useState(false);
  const [mapOpen,setMapOpen]=useState(false);
  const workersRef=useRef<Worker[]>([]);
  const sceneRef=useRef<THREE.Scene|null>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.7));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    const scene=new THREE.Scene();sceneRef.current=scene;
    buildScene(scene);
    const camera=new THREE.PerspectiveCamera(48,1,.1,100);
    camera.position.set(-2.1,18,22);
    const player=playerRef.current;
    const workerObjects=scene.children.find(o=>o.type==="Group") as THREE.Group|undefined;
    workersRef.current=workerData.map((w,i)=>({...w,group:workerObjects?.children.find(c=>c instanceof THREE.Group && Math.abs(c.position.x-w.x)<.01 && Math.abs(c.position.z-w.z)<.01) as THREE.Group,phase:i*.55}));
    const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();};
    resize();window.addEventListener("resize",resize);

    const onKey=(e:KeyboardEvent)=>{if(["INPUT","TEXTAREA","BUTTON"].includes((e.target as HTMLElement)?.tagName))return;const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","e","m"].includes(k)){e.preventDefault();keysRef.current[k]=true;setStarted(true);if(k==="m")setMapOpen(v=>!v);}};
    const onUp=(e:KeyboardEvent)=>{keysRef.current[e.key.toLowerCase()]=false;};
    window.addEventListener("keydown",onKey);window.addEventListener("keyup",onUp);

    let raf=0,last=performance.now();
    const tick=(now:number)=>{
      const dt=Math.min((now-last)/1000,.04);last=now;
      const k=keysRef.current;let dx=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0);let dz=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0);
      if(dx||dz){const len=Math.hypot(dx,dz);dx/=len;dz/=len;player.x=THREE.MathUtils.clamp(player.x+dx*4.0*dt,-14.2,14.2);player.z=THREE.MathUtils.clamp(player.z+dz*4.0*dt,-8.25,8.25);setStarted(true);}
      const r=rooms.find(q=>player.x>=q.x-q.w/2&&player.x<=q.x+q.w/2&&player.z>=q.z-q.d/2&&player.z<=q.z+q.d/2);
      if(r)setActiveRoom(prev=>prev===r.id?prev:r.id);
      workersRef.current.forEach((w)=>{
        if(!w.group)return;
        if(w.roam){
          const points=w.roam.points;
          const t=((now/1000+w.phase)%w.roam.duration)/w.roam.duration;
          const scaled=t*(points.length-1);
          const seg=Math.min(points.length-2,Math.floor(scaled));
          const local=scaled-seg;
          const a=points[seg],b=points[seg+1];
          const eased=local*local*(3-2*local);
          const nx=THREE.MathUtils.lerp(a[0],b[0],eased);
          const nz=THREE.MathUtils.lerp(a[1],b[1],eased);
          const dx=nx-w.group.position.x,dz=nz-w.group.position.z;
          w.group.position.x=nx;w.group.position.z=nz;
          if(Math.abs(dx)+Math.abs(dz)>.001)w.group.rotation.y=Math.atan2(dx,dz);
          w.group.position.y=.02;
        }else{
          w.group.position.y=.02+Math.sin(now*.004+w.phase)*.012;
          w.group.rotation.y=Math.sin(now*.002+w.phase)*.035;
        }
        const armL=w.group.children[4] as THREE.Object3D|undefined;
        const armR=w.group.children[5] as THREE.Object3D|undefined;
        if(armL)armL.rotation.x=-.8+Math.sin(now*.012+w.phase)*.15;
        if(armR)armR.rotation.x=-.8-Math.sin(now*.012+w.phase)*.15;
      });
      const target=new THREE.Vector3(player.x,0,player.z);
      const desired=new THREE.Vector3(player.x,17.5,player.z+18);
      camera.position.lerp(desired,1-Math.pow(.001,dt));
      camera.lookAt(target);
      renderer.render(scene,camera);
      raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("keydown",onKey);window.removeEventListener("keyup",onUp);renderer.dispose();scene.clear();sceneRef.current=null;};
  },[]);

  const teleport=(room:Room)=>{playerRef.current.set(room.x, .35, room.z);setActiveRoom(room.id);setMapOpen(false);setStarted(true);};
  const interact=()=>{let best:Worker|null=null,min=1.8;workersRef.current.forEach(w=>{const d=Math.hypot(playerRef.current.x-w.x,playerRef.current.z-w.z);if(d<min){min=d;best=w;}});if(best)setActiveNpc(best);};

  return <main className={styles.page}>
    <div className={styles.topbar}>
      <a href="/" className={styles.back}><ArrowLeft size={16}/> AM WEBTECH</a>
      <div className={styles.title}><Building2 size={17}/><span>TRUE 3D OFFICE WALKTHROUGH</span></div>
      <div className={styles.actions}><button type="button" onClick={()=>setMapOpen(v=>!v)}><MapPin size={15}/> Floor Map</button><a href="/" className={styles.exit}><X size={15}/> Exit</a></div>
    </div>
    <section className={styles.game}>
      <canvas ref={canvasRef} className={styles.canvas} aria-label="Interactive true 3D AM Webtech office walkthrough"/>
      {!started&&<div className={styles.intro}>
        <div className={styles.introIcon}><Building2 size={28}/></div>
        <p className={styles.kicker}>AM WEBTECH / QUALITY ENGINEERING</p>
        <h1>Walk through the <span>real office layout.</span></h1>
        <p>True perspective 3D scene matched to the supplied office reference: shared QA bench islands, glass partitions, seated employees, manager updates, reception, meeting room and kitchen.</p>
        <button type="button" className={styles.start} onClick={()=>setStarted(true)}><Zap size={17}/> Start 3D walkthrough</button>
        <div className={styles.controls}><b>WASD / ARROWS</b><span>Move through the office</span><b>E</b><span>Inspect nearby workstation</span><b>M</b><span>Open floor map</span></div>
      </div>}
      <div className={styles.hud}><div><span>LOCATION</span><strong>{roomById(activeRoom)?.name||"Main Floor"}</strong></div><div><span>MODE</span><strong>TRUE 3D WALKOVER</strong></div><button type="button" onClick={interact}><Users size={15}/> Talk / E</button></div>
      <div className={styles.roomRail}>{rooms.filter(r=>!["male","female"].includes(r.id)).map(r=><button key={r.id} type="button" onClick={()=>teleport(r)}><span>{r.name}</span><small>{r.subtitle}</small></button>)}</div>
      <div className={styles.mobilePad} aria-label="Mobile movement controls" onContextMenu={e=>e.preventDefault()}>
        <button type="button" aria-label="Move up" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.w=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.w=false}} onPointerCancel={()=>keysRef.current.w=false}><ChevronUp/></button>
        <button type="button" aria-label="Move left" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.a=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.a=false}} onPointerCancel={()=>keysRef.current.a=false}><ChevronLeft/></button>
        <button type="button" aria-label="Move down" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.s=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.s=false}} onPointerCancel={()=>keysRef.current.s=false}><ChevronDown/></button>
        <button type="button" aria-label="Move right" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.d=true;setStarted(true)}} onPointerUp={e=>{keysRef.current.d=false}} onPointerCancel={()=>keysRef.current.d=false}><ChevronRight/></button>
      </div>
      {mapOpen&&<div className={styles.mapPanel}><div className={styles.mapHead}><div><b>OFFICE DIRECTORY</b><span>Select a destination.</span></div><button type="button" onClick={()=>setMapOpen(false)}><X/></button></div><div className={styles.mapGrid}>{rooms.map(r=><button key={r.id} type="button" onClick={()=>teleport(r)}><MapPin size={15}/><span>{r.name}</span><small>{r.subtitle}</small></button>)}</div></div>}
      {activeNpc&&<div className={styles.npcCard}><button type="button" onClick={()=>setActiveNpc(null)}><X size={15}/></button><div className={styles.npcAvatar}><Users size={23}/></div><p>AM WEBTECH / WORKSTATION</p><h2>{activeNpc.title}</h2><span>Seated • Working on PC</span><small>{roomById(activeNpc.room)?.name||"the office"} · Active workstation</small></div>}
      <div className={styles.tip}><MousePointer2 size={14}/> True 3D perspective · employees remain seated at PCs · <b>E</b> inspects nearby work.</div>
    </section>
  </main>;
}
