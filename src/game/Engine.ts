import type { PenSpec } from './pens';

export type Player = 0 | 1;
export type Body = { x:number;y:number;vx:number;vy:number;a:number;w:number;alive:boolean;spec:PenSpec };
export type Snapshot = { bodies:Body[]; active:Player; phase:'aim'|'moving'|'roundover'; message:string; power:number; scores:[number,number]; round:number };
const clamp=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export class Engine {
  bodies:Body[]=[]; active:Player=0; phase:Snapshot['phase']='aim'; scores:[number,number]=[0,0]; round=1; message='YOUR TURN — Pull back and release'; power=0;
  private settled=0; private last=0; private raf=0; private onUpdate:(s:Snapshot)=>void; private bounds={w:920,h:520}; private hitFlash=0;
  constructor(onUpdate:(s:Snapshot)=>void){this.onUpdate=onUpdate; this.loop=this.loop.bind(this)}
  start(a:PenSpec,b:PenSpec){this.scores=[0,0];this.round=1;this.active=0;this.reset(a,b);cancelAnimationFrame(this.raf);this.raf=requestAnimationFrame(this.loop)}
  reset(a=this.bodies[0]?.spec,b=this.bodies[1]?.spec){if(!a||!b)return;this.bodies=[{x:this.bounds.w*.29,y:this.bounds.h*.53,vx:0,vy:0,a:-.05,w:0,alive:true,spec:a},{x:this.bounds.w*.71,y:this.bounds.h*.47,vx:0,vy:0,a:.08,w:0,alive:true,spec:b}];this.phase='aim';this.power=0;this.message=this.active===0?'YOUR TURN — Pull back and release':'OPPONENT IS AIMING';this.emit()}
  resize(w:number,h:number){this.bounds={w,h};}
  aim(power:number){if(this.phase==='aim') {this.power=power;this.emit()}}
  flick(dx:number,dy:number){if(this.phase!=='aim')return false;const len=Math.hypot(dx,dy);if(len<10)return false;const cap=this.round===1?8.5:14;const p=Math.min(cap,len*.065);const b=this.bodies[this.active];b.vx=-dx/len*p/b.spec.mass;b.vy=-dy/len*p/b.spec.mass;b.w=(dx*b.spec.length*.000006-dy*b.spec.width*.00001)/b.spec.mass;this.phase='moving';this.message='PENS IN MOTION';this.power=0;this.emit();return true}
  private loop(t:number){const dt=Math.min(.032,(t-this.last||16)/1000);this.last=t;if(this.phase==='moving')this.step(dt);this.emit();this.raf=requestAnimationFrame(this.loop)}
  private step(dt:number){const [a,b]=this.bodies;for(const p of this.bodies){p.x+=p.vx*dt*60;p.y+=p.vy*dt*60;p.a+=p.w*dt*60;p.vx*=p.spec.friction;p.vy*=p.spec.friction;p.w*=.972; if(p.x<-28||p.x>this.bounds.w+28||p.y<-28||p.y>this.bounds.h+28)p.alive=false}
    if(a.alive&&b.alive){const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),min=(a.spec.length+b.spec.length)*.33;if(dist<min){const nx=dx/(dist||1),ny=dy/(dist||1);const rvx=b.vx-a.vx,rvy=b.vy-a.vy;const rel=rvx*nx+rvy*ny;if(rel<0){const j=-(1.12)*rel/(1/a.spec.mass+1/b.spec.mass);a.vx-=j*nx/a.spec.mass;a.vy-=j*ny/a.spec.mass;b.vx+=j*nx/b.spec.mass;b.vy+=j*ny/b.spec.mass;const off=(Math.sin(a.a)*dx-Math.cos(a.a)*dy)/min;a.w-=off*j*.017/a.spec.mass;b.w+=off*j*.017/b.spec.mass;this.hitFlash=.18}const overlap=min-dist;a.x-=nx*overlap*.5;a.y-=ny*overlap*.5;b.x+=nx*overlap*.5;b.y+=ny*overlap*.5}}
    this.hitFlash=Math.max(0,this.hitFlash-dt);const slow=this.bodies.every(p=>Math.hypot(p.vx,p.vy)<.08&&Math.abs(p.w)<.01);this.settled=slow?this.settled+dt:0;if(!a.alive||!b.alive||this.settled>.55)this.finish();
  }
  private finish(){const dead=this.bodies.filter(x=>!x.alive);if(dead.length===2){this.phase='roundover';this.message='DOUBLE KNOCKOUT — REPLAY';setTimeout(()=>this.reset(),1100);return}if(dead.length===1){const winner=(this.bodies[0].alive?0:1) as Player;this.scores[winner]++;this.phase='roundover';this.message=winner===0?'PEN TAKEN! YOU WON THE ROUND':'YOUR PEN IS DOWN.';setTimeout(()=>{if(this.scores[winner]>=3){this.message=winner===0?'LAST BENCH LEGEND!':'MATCH OVER — TRY AGAIN';this.emit()}else{this.round++;this.active=(this.round%2?0:1) as Player;this.reset()}},1100);return}this.active=(this.active?0:1);this.phase='aim';this.message=this.active===0?'YOUR TURN — Pull back and release':'OPPONENT IS AIMING';this.emit()}
  aiShot(){if(this.phase!=='aim'||this.active!==1)return;const me=this.bodies[1],op=this.bodies[0];const edgeX=op.x<this.bounds.w/2?0:this.bounds.w,edgeY=op.y<this.bounds.h/2?0:this.bounds.h;const tx=op.x+(op.x-edgeX)*.15+(Math.random()-.5)*38,ty=op.y+(op.y-edgeY)*.15+(Math.random()-.5)*38;setTimeout(()=>this.flick((me.x-tx)*1.3,(me.y-ty)*1.3),650)}
  getHitFlash(){return this.hitFlash} private emit(){this.onUpdate({bodies:this.bodies.map(p=>({...p})),active:this.active,phase:this.phase,message:this.message,power:this.power,scores:this.scores,round:this.round})}
}
