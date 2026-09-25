export type PenSpec = { id:string; name:string; mass:number; friction:number; length:number; width:number; color:string; cap:string; stats:[number,number,number,number,number] };
export const PENS: PenSpec[] = [
  {id:'classic',name:'Classic',mass:1,friction:.985,length:118,width:16,color:'#1b5e9e',cap:'#e6edf1',stats:[5,8,6,7,5]},
  {id:'turbo',name:'Turbo',mass:.72,friction:.979,length:108,width:14,color:'#e6573e',cap:'#f5c44d',stats:[4,5,9,4,7]},
  {id:'tank',name:'The Tank',mass:1.65,friction:.99,length:128,width:19,color:'#25313d',cap:'#b5c0c7',stats:[9,6,3,10,3]},
  {id:'spinner',name:'The Spinner',mass:.92,friction:.982,length:115,width:15,color:'#7442a5',cap:'#d9b4ff',stats:[5,7,7,5,10]}
];
