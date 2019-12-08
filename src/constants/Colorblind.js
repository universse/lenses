const FilterValues = {
  // none: '1,0,0,0,0 0,1,0,0,0 0,0,1,0,0 0,0,0,1,0',
  protanopia: '0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0',
  protanomaly:
    '0.817,0.183,0,0,0 0.333,0.667,0,0,0 0,0.125,0.875,0,0 0,0,0,1,0',
  deuteranopia: '0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0',
  deuteranomaly: '0.8,0.2,0,0,0 0.258,0.742,0,0,0 0,0.142,0.858,0,0 0,0,0,1,0',
  tritanopia: '0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0',
  tritanomaly:
    '0.967,0.033,0,0,0 0,0.733,0.267,0,0 0,0.183,0.817,0,0 0,0,0,1,0',
  achromatopsia:
    '0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0.299,0.587,0.114,0,0 0,0,0,1,0',
  achromatomaly:
    '0.618,0.320,0.062,0,0 0.163,0.775,0.062,0,0 0.163,0.320,0.516,0,0 0,0,0,1,0'
}

const FilterTypes = Object.keys(FilterValues)

export default {
  FilterValues,
  FilterTypes
}

const Matrices = {
  protanopia: {
    R: [56.667, 43.333, 0],
    G: [55.833, 44.167, 0],
    B: [0, 24.167, 75.833]
  },
  protanomaly: {
    R: [81.667, 18.333, 0],
    G: [33.333, 66.667, 0],
    B: [0, 12.5, 87.5]
  },
  deuteranopia: {
    R: [62.5, 37.5, 0],
    G: [70, 30, 0],
    B: [0, 30, 70]
  },
  deuteranomaly: {
    R: [80, 20, 0],
    G: [25.833, 74.167, 0],
    B: [0, 14.167, 85.833]
  },
  tritanopia: {
    R: [95, 5, 0],
    G: [0, 43.333, 56.667],
    B: [0, 47.5, 52.5]
  },
  tritanomaly: {
    R: [96.667, 3.333, 0],
    G: [0, 73.333, 26.667],
    B: [0, 18.333, 81.667]
  },
  achromatopsia: {
    R: [29.9, 58.7, 11.4],
    G: [29.9, 58.7, 11.4],
    B: [29.9, 58.7, 11.4]
  },
  achromatomaly: {
    R: [61.8, 32, 6.2],
    G: [16.3, 77.5, 6.2],
    B: [16.3, 32.0, 51.6]
  }
}

// /*

//     The Color Blind Simulation function is
//     copyright (c) 2000-2001 by Matthew Wickline and the
//     Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

//     It is used with the permission of Matthew Wickline and HCIRN,
//     and is freely available for non-commercial use. For commercial use, please
//     contact the Human-Computer Interaction Resource Network ( http://hcirn.com/ ).

// */

// var rBlind={'protan':{'cpu':0.735,'cpv':0.265,'am':1.273463,'ayi':-0.073894},
//             'deutan':{'cpu':1.14,'cpv':-0.14,'am':0.968437,'ayi':0.003331},
//             'tritan':{'cpu':0.171,'cpv':-0.003,'am':0.062921,'ayi':0.292119};

// var fBlind={'Normal':function(v) { return(v); },
//             'Protanopia':function(v) { return(blindMK(v,'protan')); },
//             'Protanomaly':function(v) { return(anomylize(v,blindMK(v,'protan'))); },
//             'Deuteranopia':function(v) { return(blindMK(v,'deutan')); },
//             'Deuteranomaly':function(v) { return(anomylize(v,blindMK(v,'deutan'))); },
//             'Tritanopia':function(v) { return(blindMK(v,'tritan')); },
//             'Tritanomaly':function(v) { return(anomylize(v,blindMK(v,'tritan'))); },
//             'Achromatopsia':function(v) { return(monochrome(v)); },
//             'Achromatomaly':function(v) { return(anomylize(v,monochrome(v))); };

// function blindMK(r,t) { var gamma=2.2, wx=0.312713, wy=0.329016, wz=0.358271;

//     function Color() { this.rgb_from_xyz=xyz2rgb; this.xyz_from_rgb=rgb2xyz; }

//     var b=r[2], g=r[1], r=r[0], c=new Color;

//     c.r=Math.pow(r/255,gamma); c.g=Math.pow(g/255,gamma); c.b=Math.pow(b/255,gamma); c.xyz_from_rgb();

//     var sum_xyz=c.x+c.y+c.z; c.u=0; c.v=0;

//     if(sum_xyz!=0) { c.u=c.x/sum_xyz; c.v=c.y/sum_xyz; }

//     var nx=wx*c.y/wy, nz=wz*c.y/wy, clm, s=new Color(), d=new Color(); d.y=0;

//     if(c.u<rBlind[t].cpu) { clm=(rBlind[t].cpv-c.v)/(rBlind[t].cpu-c.u); } else { clm=(c.v-rBlind[t].cpv)/(c.u-rBlind[t].cpu); }

//     var clyi=c.v-c.u*clm; d.u=(rBlind[t].ayi-clyi)/(clm-rBlind[t].am); d.v=(clm*d.u)+clyi;

//     s.x=d.u*c.y/d.v; s.y=c.y; s.z=(1-(d.u+d.v))*c.y/d.v; s.rgb_from_xyz();

//     d.x=nx-s.x; d.z=nz-s.z; d.rgb_from_xyz();

//     var adjr=d.r?((s.r<0?0:1)-s.r)/d.r:0, adjg=d.g?((s.g<0?0:1)-s.g)/d.g:0, adjb=d.b?((s.b<0?0:1)-s.b)/d.b:0;

//     var adjust=Math.max(((adjr>1||adjr<0)?0:adjr), ((adjg>1||adjg<0)?0:adjg), ((adjb>1||adjb<0)?0:adjb));

//     s.r=s.r+(adjust*d.r); s.g=s.g+(adjust*d.g); s.b=s.b+(adjust*d.b);

//     function z(v) { return(255*(v<=0?0:v>=1?1:Math.pow(v,1/gamma))); }

//     return([z(s.r),z(s.g),z(s.b)]);

// }

// function rgb2xyz() {

//     this.x=(0.430574*this.r+0.341550*this.g+0.178325*this.b);
//     this.y=(0.222015*this.r+0.706655*this.g+0.071330*this.b);
//     this.z=(0.020183*this.r+0.129553*this.g+0.939180*this.b);

//     return this;

// }

// function xyz2rgb() {

//     this.r=( 3.063218*this.x-1.393325*this.y-0.475802*this.z);
//     this.g=(-0.969243*this.x+1.875966*this.y+0.041555*this.z);
//     this.b=( 0.067871*this.x-0.228834*this.y+1.069251*this.z);

//     return this;

// }

// function anomylize(a,b) { var v=1.75, d=v*1+1;

//     return([(v*b[0]+a[0]*1)/d, (v*b[1]+a[1]*1)/d, (v*b[2]+a[2]*1)/d]);

// }

// function monochrome(r) { var z=Math.round(r[0]*.299+r[1]*.587+r[2]*.114); return([z,z,z]); }
