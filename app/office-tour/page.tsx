// @ts-nocheck
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
  // Layout follows the supplied reference floor plan: six private rooms across the north,
  // facilities + kitchen + meeting room on the west, open QA benches on the east,
  // and reception/entry at the south-center.
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
  {id:"qa",name:"QA Team Cabins (Open)",subtitle:"Approximately 24 seats",x:5.2,z:2.0,w:13.8,d:8.5,floor:"#d6bd91",accent:"#0057b8"},
];

const workerData=[
  ...([[ -12.2,-6.0],[-10.7,-6.0],[-9.2,-6.0],[-7.7,-6.0],[-12.2,-4.7],[-10.7,-4.7],[-9.2,-4.7],[-7.7,-4.7]].map(([x,z],i)=>({title:"Automation QA",room:"automation",x,z,color:["#0057b8","#ff7a00","#2f7d5a","#7b61ff"][i%4]}))),
  ...([[-6.4,-6.0],[-5.4,-4.7]].map(([x,z])=>({title:"HR",room:"hr",x,z,color:"#7b61ff"}))),
  ...([[-3.5,-6.0],[-2.5,-4.7]].map(([x,z])=>({title:"HR",room:"srhr",x,z,color:"#2f7d5a"}))),
  ...([[-.5,-6.0],[.5,-4.7]].map(([x,z])=>({title:"Project Manager",room:"manager",x,z,color:"#ff7a00"}))),
  ...([[3.0,-6.0],[4.4,-6.0],[3.0,-4.7],[4.4,-4.7]].map(([x,z])=>({title:"Business Development",room:"sales",x,z,color:"#0b8ca6"}))),
  ...([[7.0,-6.0],[8.4,-6.0],[7.7,-4.7]].map(([x,z])=>({title:"Leadership",room:"director",x,z,color:"#d14b7d"}))),
  ...Array.from({length:24},(_,i)=>{
    const x=[2.0,5.2,8.4][i%3];
    const z=[-1.0,.25,1.5,2.75,4.0,5.25,6.5,7.75][Math.floor(i/3)];
    const roaming=[1,8,15,22].includes(i);
    return {
      title:"QA Engineer",room:"qa",x,z,
      color:["#0057b8","#ff7a00","#2f7d5a","#7b61ff","#0b8ca6","#9b6b24"][i%6],
      ...(roaming?{roam:{points:[
        [x-.98,z],[x-.98,5.15],[3.45,5.15],[3.45,-1.25],[6.55,-1.25],[6.55,5.15],[9.75,5.15],[9.75,-1.25],[x-.98,-1.25],[x-.98,z]
      ],duration:22+i*.35}}:{})
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
  addChair(parent,x,z+d*.92);
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
  const walking=!!w.roam;
  const g=new THREE.Group();g.position.set(w.x,0,w.z);w.group=g;
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.30,16),new THREE.MeshBasicMaterial({color:"#000",transparent:true,opacity:.16}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=.02;g.add(shadow);
  if(walking){
    const body=new THREE.Mesh(new THREE.CapsuleGeometry(.20,.48,5,10),makeMat(w.color,.7));body.position.y=.62;g.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.19,12,8),makeMat("#e9b994"));head.position.y=1.18;g.add(head);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.195,12,8,0,Math.PI*2,0,Math.PI*.5),makeMat("#20252b"));hair.position.y=1.25;g.add(hair);
    const armL=new THREE.Mesh(new THREE.CapsuleGeometry(.045,.30,4,6),makeMat("#e9b994"));armL.position.set(-.20,.68,.02);armL.rotation.x=-.35;g.add(armL);
    const armR=armL.clone();armR.position.x=.20;g.add(armR);
    const legL=new THREE.Mesh(new THREE.CapsuleGeometry(.06,.34,4,6),makeMat("#202b35"));legL.position.set(-.10,.25,.02);g.add(legL);
    const legR=legL.clone();legR.position.x=.10;g.add(legR);
  }else{
    const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.20,.30,5,10),makeMat(w.color,.7));torso.position.y=.43;g.add(torso);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.18,12,8),makeMat("#e9b994"));head.position.y=.79;g.add(head);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.185,12,8,0,Math.PI*2,0,Math.PI*.5),makeMat("#20252b"));hair.position.y=.86;g.add(hair);
    const armL=new THREE.Mesh(new THREE.CapsuleGeometry(.045,.25,4,6),makeMat("#e9b994"));armL.position.set(-.18,.50,.16);armL.rotation.x=-1.05;g.add(armL);
    const armR=armL.clone();armR.position.x=.18;g.add(armR);
    const legL=new THREE.Mesh(new THREE.CapsuleGeometry(.055,.25,4,6),makeMat("#202b35"));legL.position.set(-.10,.23,.22);legL.rotation.x=-.15;g.add(legL);
    const legR=legL.clone();legR.position.x=.10;g.add(legR);
  }
  parent.add(g);
}
type WallSide = "north"|"south"|"east"|"west";
function doorSide(id:string):WallSide|null{
  if(["automation","hr","srhr","manager","sales","director","male","female"].includes(id)) return "south";
  if(id==="kitchen" || id==="meeting") return "east";
  if(id==="reception") return "north";
  if(id==="qa") return null; // open south edge; the reference has a clear entry aisle.
  return null;
}
function addWallWithDoor(root:THREE.Group,r:Room,side:WallSide,material:THREE.Material,height:number,thickness:number,doorWidth=.95){
  const isH=side==="north"||side==="south";
  const edge=isH ? r.z+(side==="north"?-1:1)*r.d/2 : r.x+(side==="east"?1:-1)*r.w/2;
  const span=isH?r.w:r.d;
  const center=isH?r.x:r.z;
  const gap=doorSide(r.id)===side?doorWidth:0;
  const addSeg=(a:number,b:number)=>{
    const len=b-a;
    if(len<=.05)return;
    const mid=(a+b)/2;
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(isH?len:thickness,height,isH?thickness:len),material);
    mesh.position.set(isH?mid:edge,height/2,isH?edge:mid);
    root.add(mesh);
  };
  if(gap){
    addSeg(center-span/2,center-gap/2);
    addSeg(center+gap/2,center+span/2);
  }else{
    addSeg(center-span/2,center+span/2);
  }
}
function addRoomShell(root:THREE.Group,r:Room){
  const floor=box(root,[r.w,.16,r.d],[r.x,0,r.z],r.floor,.9);
  floor.receiveShadow=true;
  const wallH=1.65,wall=.16;
  const glass=r.id==="qa";
  if(glass){
    const glassMat=new THREE.MeshPhysicalMaterial({color:"#9ebfc4",transparent:true,opacity:.28,roughness:.18,metalness:.08});
    const lowH=.78;
    (["north","east","west"] as WallSide[]).forEach(side=>addWallWithDoor(root,r,side,glassMat,lowH,wall,1.25));
    return;
  }
  const wm=new THREE.MeshStandardMaterial({color:"#eef1f2",roughness:.5,metalness:.08});
  const sideMat=new THREE.MeshStandardMaterial({color:"#d8dee1",roughness:.52});
  (["north","south"] as WallSide[]).forEach(side=>addWallWithDoor(root,r,side,wm,wallH,wall));
  (["east","west"] as WallSide[]).forEach(side=>addWallWithDoor(root,r,side,sideMat,wallH,wall));
  const label=makeLabel(r.name,r.subtitle,r.accent);
  label.position.set(r.x,.08,r.z-r.d*.05);
  label.rotation.x=-Math.PI/2;root.add(label);
}
function makeLabel(title:string,sub:string,color:string){
  const c=document.createElement("canvas");c.width=512;c.height=128;const x=c.getContext("2d")!;
  x.fillStyle="rgba(7,16,28,.94)";
  x.beginPath();
  if(typeof (x as any).roundRect==="function") (x as any).roundRect(8,8,496,112,18);
  else x.rect(8,8,496,112);
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
  // QA open floor: three long shared bench islands, four seats on each side.
  // Their spacing creates the same three central aisles as the supplied reference.
  [2.0,5.2,8.4].forEach(x=>addQABench(root,x,3.35));
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
function addVisitor(root:THREE.Group){
  const g=new THREE.Group();g.name="visitor";
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.34,16),new THREE.MeshBasicMaterial({color:"#000",transparent:true,opacity:.2}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=.02;g.add(shadow);
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(.22,.50,5,10),makeMat("#25c77a",.65));body.position.y=.62;g.add(body);
  const head=new THREE.Mesh(new THREE.SphereGeometry(.20,12,8),makeMat("#e9b994"));head.position.y=1.20;g.add(head);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.205,12,8,0,Math.PI*2,0,Math.PI*.5),makeMat("#20252b"));hair.position.y=1.27;g.add(hair);
  const armL=new THREE.Mesh(new THREE.CapsuleGeometry(.05,.30,4,6),makeMat("#e9b994"));armL.position.set(-.21,.68,.02);g.add(armL);
  const armR=armL.clone();armR.position.x=.21;g.add(armR);
  g.traverse(o=>{if(o instanceof THREE.Mesh)o.castShadow=true;});
  root.add(g);return g;
}
type CollisionRect={x:number;z:number;w:number;d:number};

const PLAYER_RADIUS=.34;
function dampNumber(current:number,target:number,smoothing:number,dt:number){
  return THREE.MathUtils.lerp(current,target,1-Math.exp(-smoothing*dt));
}
function pushWallRects(out:CollisionRect[],r:Room,side:WallSide,doorWidth=.95){
  const hasDoor=doorSide(r.id)===side;
  const isH=side==="north"||side==="south";
  const edge=isH?r.z+(side==="north"?-1:1)*r.d/2:r.x+(side==="east"?1:-1)*r.w/2;
  const span=isH?r.w:r.d;
  const center=isH?r.x:r.z;
  const thickness=.24;
  if(hasDoor){
    const gap=Math.max(doorWidth,.82);
    const a1=center-span/2;
    const b1=center-gap/2;
    const a2=center+gap/2;
    const b2=center+span/2;
    if(b1>a1) out.push({x:isH?(a1+b1)/2:edge,z:isH?edge:(a1+b1)/2,w:isH?b1-a1:thickness,d:isH?thickness:b1-a1});
    if(b2>a2) out.push({x:isH?(a2+b2)/2:edge,z:isH?edge:(a2+b2)/2,w:isH?b2-a2:thickness,d:isH?thickness:b2-a2});
  }else{
    out.push({x:isH?r.x:edge,z:isH?edge:r.z,w:isH?r.w:thickness,d:isH?thickness:r.d});
  }
}
function buildCollisionRects():CollisionRect[]{
  const out:CollisionRect[]=[];
  // Outer shell of the reference plan.
  out.push({x:-15.5,z:0,w:.3,d:18},{x:15.5,z:0,w:.3,d:18},{x:0,z:-9,w:31,d:.3},{x:0,z:9,w:31,d:.3});

  rooms.forEach(r=>{
    if(r.id==="qa"){
      // The QA floor is intentionally open at the south-west entry.
      // The player exits reception and enters the open QA floor through this aisle.
      pushWallRects(out,r,"north",1.25);
      pushWallRects(out,r,"east",1.25);
      const westX=r.x-r.w/2;
      const westZ=r.z;
      const wallD=r.d;
      const entranceCenter=5.15;
      const entranceWidth=2.0;
      const gapStart=entranceCenter-entranceWidth/2;
      const gapEnd=entranceCenter+entranceWidth/2;
      const lowerEnd=westZ-wallD/2;
      const upperStart=westZ+wallD/2;
      if(gapStart>lowerEnd) out.push({x:westX,z:(lowerEnd+gapStart)/2,w:.24,d:gapStart-lowerEnd});
      if(upperStart>gapEnd) out.push({x:westX,z:(gapEnd+upperStart)/2,w:.24,d:upperStart-gapEnd});
    } else if(r.id==="reception"){
      // Reception is a lobby, not a sealed room. Keep its side walls but
      // leave the north side open so the avatar can naturally walk into QA.
      pushWallRects(out,r,"east",.95);
      pushWallRects(out,r,"west",.95);
      // South remains the main entry.
    } else {
      (["north","south","east","west"] as WallSide[]).forEach(side=>pushWallRects(out,r,side,.95));
    }
  });

  // Furniture collision: keep real workstations solid, but do NOT block the
  // reception lobby with its decorative front desk. The visible desk remains
  // unchanged; this is intentionally an interaction/entry corridor.
  [-12.2,-10.7,-9.2,-7.7].forEach(x=>[-6.0,-4.7].forEach(z=>out.push({x,z,w:1.45,d:.9})));
  [[-6.4,-6],[-5.4,-4.7],[-3.5,-6],[-2.5,-4.7],[-.5,-6],[.5,-4.7],[3,-6],[4.4,-6],[3,-4.7],[4.4,-4.7],[7,-6],[8.4,-6],[7.7,-4.7]]
    .forEach(([x,z])=>out.push({x,z,w:1.45,d:.9}));
  [2.0,5.2,8.4].forEach(x=>out.push({x,z:3.35,w:1.45,d:7.1}));
  out.push({x:-9.9,z:-.95,w:4.95,d:.55},{x:-9.9,z:.1,w:2.1,d:1.2});
  out.push({x:-9.5,z:4.0,w:4.0,d:2.0});
  return out;
}
function resolvePlayerCollision(candidate:THREE.Vector3,rects:CollisionRect[],radius:number,axis:"x"|"z"):number|null{
  let value=axis==="x"?candidate.x:candidate.z;
  const other=axis==="x"?candidate.z:candidate.x;
  for(const r of rects){
    const minX=r.x-r.w/2-radius,maxX=r.x+r.w/2+radius;
    const minZ=r.z-r.d/2-radius,maxZ=r.z+r.d/2+radius;
    if(other>=minZ && other<=maxZ && value>=minX && value<=maxX){
      value=axis==="x" ? (candidate.x<r.x? r.x-r.w/2-radius : r.x+r.w/2+radius)
                       : (candidate.z<r.z? r.z-r.d/2-radius : r.z+r.d/2+radius);
    }
  }
  return value=== (axis==="x"?candidate.x:candidate.z) ? null : value;
}

function addAvatar(parent:THREE.Group, color:string, scale=1, isPlayer=false){
  const avatar=new THREE.Group(); avatar.name="avatar";
  const seg=isPlayer?14:8, seg2=isPlayer?10:6;
  const skin=makeMat("#c98f6b",.78), shirt=makeMat(color,.68);
  const pants=makeMat("#17222d",.82), shoe=makeMat("#0d1218",.72);
  const hairMat=makeMat("#1b2026",.9), white=makeMat("#f4f7fa",.5), eyeMat=makeMat("#101820",.25);

  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.34*scale,isPlayer?16:8),
    new THREE.MeshBasicMaterial({color:"#000",transparent:true,opacity:.17}));
  shadow.name="shadow"; shadow.rotation.x=-Math.PI/2; shadow.position.y=.018; avatar.add(shadow);

  const torso=new THREE.Group(); torso.name="torso"; torso.position.y=.88*scale; avatar.add(torso);
  const chest=new THREE.Mesh(new THREE.CapsuleGeometry(.28*scale,.46*scale,4,seg2),shirt);
  chest.name="chest"; chest.scale.z=.72; torso.add(chest);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.10*scale,.12*scale,.14*scale,seg2),skin);
  neck.position.y=1.17*scale; avatar.add(neck);

  const head=new THREE.Group(); head.name="head"; head.position.y=1.40*scale; avatar.add(head);
  const face=new THREE.Mesh(new THREE.SphereGeometry(.275*scale,seg,seg2),skin);
  face.scale.set(.92,1.06,.92); head.add(face);
  const hair=new THREE.Mesh(new THREE.SphereGeometry(.282*scale,seg,seg2,0,Math.PI*2,0,Math.PI*.60),hairMat);
  hair.position.y=.07*scale; head.add(hair);

  // Readable anime/game facial accents; kept low-poly for smooth frame time.
  if(isPlayer){
    [-1,1].forEach(side=>{
      const eye=new THREE.Mesh(new THREE.SphereGeometry(.028*scale,6,5),white);
      eye.position.set(side*.09*scale,.015*scale,.255*scale); head.add(eye);
      const pupil=new THREE.Mesh(new THREE.SphereGeometry(.012*scale,6,5),eyeMat);
      pupil.position.set(side*.09*scale,.015*scale,.282*scale); head.add(pupil);
      const brow=new THREE.Mesh(new THREE.BoxGeometry(.075*scale,.014*scale,.014*scale),hairMat);
      brow.position.set(side*.09*scale,.095*scale,.25*scale); brow.rotation.z=side*.08; head.add(brow);
    });
    [-.18,-.09,0,.09,.18].forEach((offset,i)=>{
      const spike=new THREE.Mesh(new THREE.ConeGeometry(.065*scale,.15*scale,5),hairMat);
      spike.name="hairSpike"+i; spike.position.set(offset*scale,.13*scale,.21*scale);
      spike.rotation.x=-.48; spike.rotation.z=offset*.3; head.add(spike);
    });
  }

  const makeArm=(name:string,side:number)=>{
    const arm=new THREE.Group(); arm.name=name; arm.position.set(side*.32*scale,.96*scale,.01); avatar.add(arm);
    const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.07*scale,.29*scale,3,seg2),shirt);
    upper.position.y=-.14*scale; arm.add(upper);
    const fore=new THREE.Mesh(new THREE.CapsuleGeometry(.058*scale,.25*scale,3,seg2),skin);
    fore.position.y=-.40*scale; arm.add(fore);
    if(isPlayer){const hand=new THREE.Mesh(new THREE.SphereGeometry(.065*scale,7,5),skin);hand.position.y=-.55*scale;arm.add(hand);}
    return arm;
  };
  const armL=makeArm("armL",-1), armR=makeArm("armR",1);

  const makeLeg=(name:string,side:number)=>{
    const leg=new THREE.Group(); leg.name=name; leg.position.set(side*.12*scale,.62*scale,.01); avatar.add(leg);
    const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.085*scale,.32*scale,3,seg2),pants);
    thigh.position.y=-.17*scale; leg.add(thigh);
    const shin=new THREE.Mesh(new THREE.CapsuleGeometry(.068*scale,.30*scale,3,seg2),pants);
    shin.position.y=-.47*scale; leg.add(shin);
    const foot=new THREE.Mesh(new THREE.BoxGeometry(.15*scale,.09*scale,.28*scale),shoe);
    foot.position.set(0,-.67*scale,.06*scale); leg.add(foot); return leg;
  };
  const legL=makeLeg("legL",-1), legR=makeLeg("legR",1);

  avatar.userData.parts={torso,head,armL,armR,legL,legR};
  avatar.userData.isPlayer=isPlayer;
  avatar.traverse(o=>{
    if(o instanceof THREE.Mesh){
      // NPC shadows are the main GPU cost. Only the player participates in the shadow map.
      o.castShadow=isPlayer;
      o.receiveShadow=isPlayer;
    }
  });
  parent.add(avatar); return avatar;
}
function buildScene(scene:THREE.Scene,coarse=false){
  // Deliberately uses only core Three.js primitives so the walkthrough remains
  // visible even when optional browser/WebGL features are unavailable.
  scene.background=new THREE.Color("#aab6c0");
  scene.fog=new THREE.Fog("#aab6c0",34,62);
  scene.add(new THREE.HemisphereLight("#ffffff","#52616d",2.2));
  const sun=new THREE.DirectionalLight("#fff3d6",4.0);
  sun.position.set(-12,22,14); sun.castShadow=true;
    const shadowSize=coarse?512:768; sun.shadow.mapSize.set(shadowSize,shadowSize);
    sun.shadow.camera.near=.5; sun.shadow.camera.far=60;
    sun.shadow.camera.left=-22;sun.shadow.camera.right=22;sun.shadow.camera.top=18;sun.shadow.camera.bottom=-18;
    scene.add(sun);

  const root=new THREE.Group(); root.name="office-root"; scene.add(root);
  box(root,[31,.25,18],[0,-.15,0],"#d8dee1",1);

  // Reference floor zoning.
  rooms.forEach(r=>addRoomShell(root,r));

  // North private-office desks.
  [-12.2,-10.7,-9.2,-7.7].forEach(x=>{addDesk(root,x,-6);addDesk(root,x,-4.7);});
  [[-6.4,-6],[-5.4,-4.7],[-3.5,-6],[-2.5,-4.7],[-.5,-6],[.5,-4.7],
   [3,-6],[4.4,-6],[3,-4.7],[4.4,-4.7],[7,-6],[8.4,-6],[7.7,-4.7]]
    .forEach(([x,z])=>addDesk(root,x,z));

  // Three long QA islands matching the reference image.
  [2.0,5.2,8.4].forEach(x=>addQABench(root,x,3.35));

  // Kitchen + meeting room + reception.
  box(root,[4.8,.9,.38],[-9.9,.55,-.95],"#795331",.5);
  box(root,[2.0,.72,1.1],[-9.9,.45,.1],"#c98c4c");
  box(root,[3.8,.12,1.8],[-9.5,.75,4],"#c98c4c",.5);
  [-11.2,-9.5,-7.8].forEach(x=>{addChair(root,x,2.8);addChair(root,x,5.2);});
  box(root,[3.8,1.15,.65],[-2.1,.62,7],"#5b321d",.5);

  [[-14,-7.7],[-7.2,-7.7],[.9,-7.7],[6.3,-7.7],[10.3,-7.7],
   [-13,-.9],[-5.7,.4],[-5.5,6.9],[.2,6.9],[9.8,6.9]]
    .forEach(([x,z])=>addPlant(root,x,z,1.15));

  // Seated office staff: simple, reliable humanoids at every workstation.
  workerData.forEach((d,i)=>{
    const g=new THREE.Group();
    const body=addAvatar(g,d.color,.72,false);
    body.position.y=.02;
    body.userData.seated=true;
    if(d.room==="qa"){
      const q=i-21, side=q%2===0?-.98:.98;
      g.position.set(d.x+side,.0,d.z);
      if(d.roam) d.roam={points:d.roam.points,duration:d.roam.duration};
    }else{
      g.position.set(d.x,.0,d.z+.72);
      g.rotation.y=Math.PI;
    }
    g.userData.workerIndex=i;
    root.add(g);
    d.group=g;
  });

  // Player avatar: always visible and positioned at the real entry.
  const player=addAvatar(root,"#25c77a",1,true);
  player.name="visitor";
  player.position.set(-2.1,0,8.1);

  // Clear entry marker.
  const marker=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,.05,32),new THREE.MeshStandardMaterial({color:"#25c77a",transparent:true,opacity:.65}));
  marker.position.set(-2.1,.04,8.1); root.add(marker);

  return root;
}


function FloorPlanMap(){
  return <div className={styles.floorMapWrap}>
    <div className={styles.floorMapTitle}>REFERENCE OFFICE / INTERACTIVE DESTINATION MAP</div>
    <svg className={styles.floorMap} viewBox="0 0 1000 620" role="img" aria-label="AM Webtech office floor plan">
      <rect x="18" y="18" width="964" height="584" rx="18" fill="#e9e2d4"/>
      <g fill="#d7b47e" stroke="#263746" strokeWidth="5">
        <rect x="45" y="45" width="250" height="120" rx="8"/><rect x="305" y="45" width="90" height="120" rx="8"/>
        <rect x="405" y="45" width="90" height="120" rx="8"/><rect x="505" y="45" width="105" height="120" rx="8"/>
        <rect x="620" y="45" width="150" height="120" rx="8"/><rect x="780" y="45" width="175" height="120" rx="8"/>
      </g>
      <g fill="#dfe6e8" stroke="#263746" strokeWidth="5">
        <rect x="45" y="180" width="115" height="62" rx="7"/><rect x="170" y="180" width="115" height="62" rx="7"/>
      </g>
      <rect x="45" y="255" width="300" height="105" rx="8" fill="#d8c09a" stroke="#263746" strokeWidth="5"/>
      <rect x="45" y="375" width="300" height="190" rx="8" fill="#cfc4b1" stroke="#263746" strokeWidth="5"/>
      <rect x="365" y="465" width="220" height="100" rx="8" fill="#8b6035" stroke="#263746" strokeWidth="5"/>
      <rect x="365" y="180" width="590" height="265" rx="10" fill="#e6d49b" stroke="#263746" strokeWidth="5"/>
      <g stroke="#b9783e" strokeWidth="26" strokeLinecap="round">
        <line x1="475" y1="220" x2="475" y2="410"/><line x1="650" y1="220" x2="650" y2="410"/><line x1="825" y1="220" x2="825" y2="410"/>
      </g>
      <g fill="#fff" fontFamily="Arial" fontWeight="800" textAnchor="middle">
        <text x="170" y="105" fontSize="22">AUTOMATION · 8</text><text x="350" y="105" fontSize="18">HR</text>
        <text x="450" y="105" fontSize="18">SR HR</text><text x="557" y="105" fontSize="18">MANAGER</text>
        <text x="695" y="105" fontSize="18">SALES · 4</text><text x="868" y="105" fontSize="18">DIRECTOR · 3</text>
        <text x="102" y="218" fontSize="13">MALE WASHROOM</text><text x="228" y="218" fontSize="13">FEMALE WASHROOM</text>
        <text x="195" y="310" fontSize="20">KITCHEN</text><text x="195" y="475" fontSize="20">MEETING ROOM</text>
        <text x="660" y="325" fontSize="24">QA TEAM · OPEN · 24 SEATS</text><text x="475" y="525" fontSize="19">RECEPTION / ENTRY</text>
      </g>
      <g fill="#25c77a" stroke="#fff" strokeWidth="3"><circle cx="475" cy="570" r="14"/></g>
      <text x="500" y="577" fill="#1d6b43" fontFamily="Arial" fontSize="16" fontWeight="800">ENTRY</text>
    </svg>
  </div>;
}

export const dynamic = "force-dynamic";
export default function OfficeTourPage(){
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const keysRef=useRef<Record<string,boolean>>({});
  const playerRef=useRef(new THREE.Vector3(-2.1,.35,8.1));
  const playerVelocityRef=useRef(new THREE.Vector2());
  const collisionRectsRef=useRef<any[]>([]);
  const startedRef=useRef(false);
  const inputVectorRef=useRef(new THREE.Vector2());
  const collisionCandidateRef=useRef(new THREE.Vector3());
  const cameraTargetRef=useRef(new THREE.Vector3());
  const cameraDesiredRef=useRef(new THREE.Vector3());
  const [activeRoom,setActiveRoom]=useState("reception");
  const [activeNpc,setActiveNpc]=useState<Worker|null>(null);
  const [started,setStarted]=useState(false);
  const [mapOpen,setMapOpen]=useState(false);
  const [tourError,setTourError]=useState("");
  const workersRef=useRef<Worker[]>([]);
  const sceneRef=useRef<THREE.Scene|null>(null);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    let safeRaf=0;
    let safeFailed=false;
    try {
    const coarse=window.matchMedia("(pointer:coarse)").matches;
    const renderer=new THREE.WebGLRenderer({canvas,antialias:!coarse,alpha:false,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,coarse?1.15:1.35));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.12;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    const scene=new THREE.Scene();sceneRef.current=scene;
    buildScene(scene,coarse);
    const collisionRects=buildCollisionRects();
    collisionRectsRef.current=collisionRects;
    const camera=new THREE.PerspectiveCamera(58,1,.1,100);
    camera.position.set(-2.1,8.5,16);
    const player=playerRef.current;
    const workerObjects=scene.getObjectByName("office-root") as THREE.Group|undefined;
    workersRef.current=workerData.map((w,i)=>({...w,group:workerObjects?.children.find(c=>c instanceof THREE.Group && c.userData.workerIndex===i) as THREE.Group,phase:i*.55}));
    const resize=()=>{const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=Math.max(1,r.width)/Math.max(1,r.height);camera.updateProjectionMatrix();};
    const cameraTarget=new THREE.Vector3();
    const cameraDesired=new THREE.Vector3();
    const collisionCandidate=new THREE.Vector3();
    let activeRoomId="";
    let npcAccumulator=0;
    let disposed=false;
    resize();window.addEventListener("resize",resize);

    const onContextLost=(e:Event)=>{e.preventDefault();};
    canvas.addEventListener("webglcontextlost",onContextLost as EventListener,{passive:false});
    const onKey=(e:KeyboardEvent)=>{if(["INPUT","TEXTAREA","BUTTON"].includes((e.target as HTMLElement)?.tagName))return;const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","e","m"].includes(k)){e.preventDefault();keysRef.current[k]=true;if(!startedRef.current){startedRef.current=true;setStarted(true);}if(k==="m")setMapOpen(v=>!v);}};
    const onUp=(e:KeyboardEvent)=>{keysRef.current[e.key.toLowerCase()]=false;};
    window.addEventListener("keydown",onKey);window.addEventListener("keyup",onUp);

    let raf=0,last=performance.now();
    let lastSafeX=player.x,lastSafeZ=player.z,lastProgressAt=performance.now();
    const tick=(now:number)=>{
      if(safeFailed)return;
      try {
      const dt=Math.min((now-last)/1000,.04);last=now;
      const k=keysRef.current;
      const inputX=(k.d||k.arrowright?1:0)-(k.a||k.arrowleft?1:0);
      const inputZ=(k.s||k.arrowdown?1:0)-(k.w||k.arrowup?1:0);
      const inputLen=Math.hypot(inputX,inputZ);
      const input=inputVectorRef.current;
      if(inputLen){input.set(inputX/inputLen,inputZ/inputLen);}else input.set(0,0);
      const maxSpeed=3.55,acceleration=18,drag=inputLen?3.2:11;
      const velocity=playerVelocityRef.current;
      if(inputLen){
        velocity.x=dampNumber(velocity.x,input.x*maxSpeed,acceleration,dt);
        velocity.y=dampNumber(velocity.y,input.y*maxSpeed,acceleration,dt);
        if(!startedRef.current){startedRef.current=true;setStarted(true);}
      }else{
        velocity.x=dampNumber(velocity.x,0,drag,dt);
        velocity.y=dampNumber(velocity.y,0,drag,dt);
      }

      // Fixed movement substeps prevent tunnelling through walls and remove the
      // "sticky corner" feeling caused by large frame-time jumps.
      const distance=Math.hypot(velocity.x,velocity.y)*dt;
      const steps=Math.max(1,Math.min(6,Math.ceil(distance/.075)));
      const stepDt=dt/steps;
      const collisionCandidate=collisionCandidateRef.current;
      for(let step=0;step<steps;step++){
        const nextX=player.x+velocity.x*stepDt;
        collisionCandidate.set(nextX,player.y,player.z);
        const resolvedX=resolvePlayerCollision(collisionCandidate,collisionRects,PLAYER_RADIUS,"x");
        if(resolvedX!==null){
          player.x=resolvedX;
          velocity.x=0;
        }else player.x=nextX;

        const nextZ=player.z+velocity.y*stepDt;
        collisionCandidate.set(player.x,player.y,nextZ);
        const resolvedZ=resolvePlayerCollision(collisionCandidate,collisionRects,PLAYER_RADIUS,"z");
        if(resolvedZ!==null){
          player.z=resolvedZ;
          velocity.y=0;
        }else player.z=nextZ;
      }
      const moved=Math.hypot(player.x-lastSafeX,player.z-lastSafeZ);
      if(moved>.12){lastSafeX=player.x;lastSafeZ=player.z;lastProgressAt=now;}
      else if(inputLen && now-lastProgressAt>1800){
        player.x=lastSafeX;player.z=lastSafeZ;velocity.set(0,0);lastProgressAt=now;
      }
      const r=rooms.find(q=>player.x>=q.x-q.w/2&&player.x<=q.x+q.w/2&&player.z>=q.z-q.d/2&&player.z<=q.z+q.d/2);
      if(r && activeRoomId!==r.id){activeRoomId=r.id;setActiveRoom(r.id);}
      npcAccumulator+=dt;
      if(npcAccumulator>=.033){
        npcAccumulator=0;
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
        const avatar=w.group.children[0] as THREE.Group|undefined;
        const parts=avatar?.userData.parts as any;
        if(parts){
          const walking=!!w.roam;
          const stride=Math.sin(now*.011+w.phase);
          if(walking){
            parts.armL.rotation.x=stride*.38;
            parts.armR.rotation.x=-stride*.38;
            parts.legL.rotation.x=-stride*.48;
            parts.legR.rotation.x=stride*.48;
            parts.torso.rotation.z=Math.sin(now*.006+w.phase)*.018;
          }else{
            // Natural seated micro-movements: typing/looking at the monitor.
            parts.armL.rotation.x=-1.02+Math.sin(now*.004+w.phase)*.035;
            parts.armR.rotation.x=-1.02+Math.sin(now*.004+w.phase+1.4)*.035;
            parts.legL.rotation.x=-.28;
            parts.legR.rotation.x=-.28;
            parts.torso.rotation.z=Math.sin(now*.0025+w.phase)*.012;
            parts.head.rotation.y=Math.sin(now*.0018+w.phase)*.055;
          }
        }
        });
      }
      const visitor=workerObjects?.getObjectByName("visitor");
      if(visitor){
        visitor.position.x=player.x;
        visitor.position.z=player.z;
        if(inputLen)visitor.rotation.y=Math.atan2(input.x,input.y);
      }
      const cameraDesired=cameraDesiredRef.current;
      const cameraTarget=cameraTargetRef.current;
      cameraDesired.set(player.x,7.2,player.z+7.8);
      camera.position.lerp(cameraDesired,1-Math.exp(-7.5*dt));
      cameraTarget.set(player.x,.55,player.z);
      camera.lookAt(cameraTarget);
      if(!document.hidden && !disposed) renderer.render(scene,camera);
      raf=requestAnimationFrame(tick);
      } catch(error) {
        console.error("Office Tour frame error:",error);
        safeFailed=true;
        cancelAnimationFrame(raf);
        setTourError("3D rendering paused safely. Use the office map to continue.");
      }
    };
    raf=requestAnimationFrame(tick);
    safeRaf=raf;
    return()=>{disposed=true;cancelAnimationFrame(raf);canvas.removeEventListener("webglcontextlost",onContextLost as EventListener);window.removeEventListener("resize",resize);window.removeEventListener("keydown",onKey);window.removeEventListener("keyup",onUp);renderer.dispose();scene.clear();sceneRef.current=null;playerVelocityRef.current.set(0,0);collisionRectsRef.current=[];startedRef.current=false;};
    } catch(error) {
      console.error("Office Tour initialization failed:",error);
      safeFailed=true;
      setTourError("3D rendering could not start on this device. The office map remains available.");
    }
  },[]);

  const destinationFor=(room:Room):[number,number]=>{
    const points:Record<string,[number,number]>={
      automation:[-11.1,-3.55],hr:[-5.9,-3.55],srhr:[-3,-3.55],manager:[0,-3.55],
      sales:[3.8,-3.55],director:[7.9,-3.55],male:[-11.6,-2.05],female:[-8.2,-2.05],
      kitchen:[-6.0,-.4],meeting:[-5.8,4.0],reception:[-2.1,8.05],qa:[5.2,6.95]
    };
    return points[room.id]||[room.x,room.z];
  };
  const teleport=(room:Room)=>{
    const [x,z]=destinationFor(room);
    playerRef.current.set(x,.35,z);
    playerVelocityRef.current.set(0,0);
    setActiveRoom(room.id);setActiveNpc(null);setMapOpen(false);setStarted(true);
  };
  const interact=()=>{let best:Worker|null=null,min=1.8;workersRef.current.forEach(w=>{const d=Math.hypot(playerRef.current.x-w.x,playerRef.current.z-w.z);if(d<min){min=d;best=w;}});if(best)setActiveNpc(best);};

  return <main className={styles.page}>
    {tourError && <div className={styles.rendererError} role="alert">
      <strong>3D Office Tour paused safely</strong>
      <span>{tourError}</span>
      <button type="button" onClick={()=>window.location.reload()}>Retry 3D</button>
    </div>}
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
        <button type="button" aria-label="Move up" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.w=true;setStarted(true)}} onPointerUp={()=>{keysRef.current.w=false}} onLostPointerCapture={()=>{keysRef.current.w=false}} onPointerCancel={()=>keysRef.current.w=false}><ChevronUp/></button>
        <button type="button" aria-label="Move left" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.a=true;setStarted(true)}} onPointerUp={()=>{keysRef.current.a=false}} onLostPointerCapture={()=>{keysRef.current.a=false}} onPointerCancel={()=>keysRef.current.a=false}><ChevronLeft/></button>
        <button type="button" aria-label="Move down" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.s=true;setStarted(true)}} onPointerUp={()=>{keysRef.current.s=false}} onLostPointerCapture={()=>{keysRef.current.s=false}} onPointerCancel={()=>keysRef.current.s=false}><ChevronDown/></button>
        <button type="button" aria-label="Move right" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keysRef.current.d=true;setStarted(true)}} onPointerUp={()=>{keysRef.current.d=false}} onLostPointerCapture={()=>{keysRef.current.d=false}} onPointerCancel={()=>keysRef.current.d=false}><ChevronRight/></button>
      </div>
      {mapOpen&&<div className={styles.mapPanel}><div className={styles.mapHead}><div><b>OFFICE DIRECTORY</b><span>Select a destination.</span></div><button type="button" onClick={()=>setMapOpen(false)}><X/></button></div><FloorPlanMap/><div className={styles.mapGrid}>{rooms.map(r=><button key={r.id} type="button" onClick={()=>teleport(r)}><MapPin size={15}/><span>{r.name}</span><small>{r.subtitle}</small></button>)}</div></div>}
      {activeNpc&&<div className={styles.npcCard}><button type="button" onClick={()=>setActiveNpc(null)}><X size={15}/></button><div className={styles.npcAvatar}><Users size={23}/></div><p>AM WEBTECH / WORKSTATION</p><h2>{activeNpc.title}</h2><span>Seated • Working on PC</span><small>{roomById(activeNpc.room)?.name||"the office"} · Active workstation</small></div>}
      <div className={styles.tip}><MousePointer2 size={14}/> True 3D perspective · employees remain seated at PCs · <b>E</b> inspects nearby work.</div>
    </section>
  </main>;
}
