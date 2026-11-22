/* Photo-based LUMA reconstruction with a scroll-guided component tour. */
(() => {
  'use strict';
  const chapters = [
  {
    "short": "Overview",
    "eyebrow": "LUMA / The physical prototype",
    "view": [
      0.82,
      0.49,
      11.6,
      0,
      1.65,
      0
    ],
    "focus": 0
  },
  {
    "short": "Presence",
    "eyebrow": "Entrance / HC-SR04 & status LED",
    "view": [
      0.05,
      0.14,
      5.6,
      -0.12,
      1,
      1.7
    ],
    "focus": 1
  },
  {
    "short": "Access",
    "eyebrow": "Entrance / Matrix keypad & SSD1306 OLED",
    "view": [
      0.02,
      0.08,
      5.3,
      -0.8,
      1.95,
      1.75
    ],
    "focus": 1
  },
  {
    "short": "Door",
    "eyebrow": "Entrance / Servo actuator",
    "view": [
      0.28,
      0.18,
      6.2,
      0.95,
      1.2,
      1.6
    ],
    "door": true,
    "focus": 1
  },
  {
    "short": "Curtain",
    "eyebrow": "Curtain / 28BYJ-48 stepper & driver",
    "view": [
      1.48,
      0.24,
      6.8,
      2.05,
      1.65,
      0
    ],
    "curtain": true,
    "focus": 2
  },
  {
    "short": "Sensors",
    "eyebrow": "Curtain node / DHT22 & TSL2561",
    "view": [
      0.8,
      0.95,
      7.5,
      0.95,
      0.65,
      0.1
    ],
    "roof": true,
    "xray": true,
    "explode": 0.12,
    "focus": 3
  },
  {
    "short": "Ventilation",
    "eyebrow": "Curtain node / Fan & relay",
    "view": [
      -0.48,
      1,
      7.4,
      -1.15,
      0.6,
      -0.8
    ],
    "roof": true,
    "xray": true,
    "explode": 0.18,
    "fan": true,
    "focus": 3
  },
  {
    "short": "MQTT",
    "eyebrow": "System / ESP32, Wi-Fi & MQTT",
    "view": [
      0.8,
      0.95,
      8.6,
      0,
      0.7,
      -0.65
    ],
    "roof": true,
    "xray": true,
    "explode": 0.25,
    "focus": 3
  },
  {
    "short": "Assembly",
    "eyebrow": "Construction / Enclosure & integration",
    "view": [
      0.86,
      0.72,
      13,
      0,
      1.6,
      0
    ],
    "roof": true,
    "xray": true,
    "explode": 0.8,
    "focus": 3
  },
  {
    "short": "Explore",
    "eyebrow": "Inspector / Explore freely",
    "view": [
      0.82,
      0.49,
      11.6,
      0,
      1.65,
      0
    ],
    "roof": true,
    "explode": 0.25,
    "focus": 0
  }
];
  const notes = [
    ['A connected home in miniature','Two ESP32 nodes coordinate access, sensing, the curtain and ventilation through MQTT. Scroll to explore the house.'],
    ['Presence at the entrance','The ultrasonic sensor detects an approaching visitor. The LED and OLED prepare the interface before the PIN is entered.'],
    ['Keypad & OLED','A four-character demonstration PIN controls local access. The horizontal OLED shows prompts and feedback.'],
    ['The door comes to life','A servo opens the miniature door after the access sequence, or on a remote MQTT command.'],
    ['The automated curtain','A geared stepper moves the fabric curtain. Manual commands and automatic modes share the same actuator.'],
    ['Temperature, tested outside','The DHT sensor sits outside the house. The team applied a nearby heat source during testing to check the response to a temperature change. Light is measured by the TSL2561.'],
    ['Ventilation from the ceiling','The fan is mounted beneath the roof. A relay switches it from the curtain node; only its blades rotate in this demonstration.'],
    ['Two nodes, one system','The entrance and curtain run independent MicroPython applications. MQTT carries commands and environmental readings to the dashboard.'],
    ['Inside the model','The roof and walls separate to reveal the relationship between the exterior controls and the two embedded nodes.'],
    ['Explore freely','Drag to orbit, zoom in or open the model controls. Continue scrolling for a short account of the project.']
  ];
  chapters[5].view=[1.95,.18,6.5,2.15,2.25,-1.2];Object.assign(chapters[5],{roof:false,xray:false,explode:0});
  chapters[6].view=[-.65,-.20,7.8,-.9,2.55,-.27];Object.assign(chapters[6],{roof:false,xray:true,explode:0});
  const markup = () => `<section class="luma-hero" aria-label="LUMA scroll-guided 3D presentation">
    <div class="luma-hero-top"><p>Embedded / Smart Home</p><span>2026 · Team project</span></div>
    <header class="luma-scroll-heading"><div class="luma-identity"><h2 id="storyTitle">LUMA</h2><img src="assets/projects/luma/logo.webp" width="72" height="72" alt="LUMA project logo"></div><p>Explore a connected home,<br>one component at a time.<span>Scroll to begin the guided tour</span></p></header>
    <div class="luma-scroll-story">
      <div class="luma-scroll-sticky">
        <div class="luma-tour-status"><span class="luma-tour-count">01 / 10</span><span class="luma-tour-label">The physical prototype</span></div>
        <div class="luma-viewer"><div class="luma-stage"><img class="luma-poster" src="assets/projects/luma/prototype.webp" alt="The real LUMA prototype used as the reconstruction reference"><div class="luma-loading" role="status">Building the miniature…</div><canvas class="luma-canvas" tabindex="0" role="img" aria-label="3D model of LUMA, following the component explanations as you scroll. Drag or use arrow keys to orbit, plus and minus to zoom, and Home to reset the current view."></canvas>
          <div class="luma-hotspots"><button type="button" data-luma-hotspot="1" aria-label="Read about the entrance"><span></span><b>Entrance</b></button><button type="button" data-luma-hotspot="4" aria-label="Read about the curtain"><span></span><b>Curtain</b></button><button type="button" data-luma-hotspot="7" aria-label="Read about the ESP32 nodes"><span></span><b>ESP32 × 2</b></button></div>
          <aside class="luma-callout" aria-live="polite"><p class="luma-eyebrow">The physical prototype</p><h3>${notes[0][0]}</h3><p class="luma-callout-text">${notes[0][1]}</p></aside>
          <p class="luma-gesture">Scroll to follow <span>·</span> Drag to inspect</p><div class="luma-zoom"><button type="button" data-luma-action="zoom-in" aria-label="Zoom in">+</button><button type="button" data-luma-action="zoom-out" aria-label="Zoom out">−</button><button type="button" data-luma-action="reset" aria-label="Reset the current 3D view">Reset</button></div>
        </div></div>
        <nav class="luma-tour-nav" aria-label="Jump to a component">${chapters.map((item,i)=>`<button type="button" data-luma-chapter="${i}" aria-label="${item.short}" aria-pressed="${i===0}" title="${item.short}"><span></span></button>`).join('')}</nav>
        <details class="luma-inspector-tools"><summary>Model controls</summary><div class="luma-controls" aria-label="3D model controls"><div class="luma-toggles"><button type="button" data-luma-action="rotate" aria-pressed="false">Auto orbit</button><button type="button" data-luma-action="xray" aria-pressed="false">X-ray</button><button type="button" data-luma-action="roof" aria-pressed="false">Lift roof</button><button type="button" data-luma-action="door" aria-pressed="false">Open door</button><button type="button" data-luma-action="curtain" aria-pressed="false">Raise curtain</button><button type="button" data-luma-action="fan" aria-pressed="false">Run fan</button></div><label class="luma-explode">Explode <input type="range" min="0" max="100" value="0" aria-label="Explode the LUMA model"><output>0%</output></label></div></details>
      </div>
      <div class="luma-narrative" aria-hidden="true">${chapters.map((item,i)=>`<div class="luma-scroll-chapter${i===0?' is-active':''}" data-luma-step="${i}"></div>`).join('')}</div>
    </div>
    <div class="luma-model-note"><p>Photo-based reconstruction. Proportions are approximate; hidden electronics and wire routes are schematic.</p><a href="#story-overview" data-story-section="story-overview">Continue to the project story</a></div>
  </section>`;
  function mount(host) {
    let disposed = false, disposeScene = () => {};
    const controller = new AbortController();
    const on = (target, event, listener, options = {}) => target.addEventListener(event, listener, {...options, signal:controller.signal});
    const buttons = selector => [...host.querySelectorAll(selector)];
    const stage = host.querySelector('.luma-stage');
    const canvas = host.querySelector('canvas');
    const loading = host.querySelector('.luma-loading');
    const scroller = host.closest('dialog');
    const steps = buttons('[data-luma-step]');
    const sticky = host.querySelector('.luma-scroll-sticky');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 760px)');
    const state = {chapter:0,rotate:false,xray:false,roof:false,door:false,curtain:false,fan:false,explode:0};
    let yaw = .82, pitch = .49, radius = 11.6;
    let targetYaw=yaw,targetPitch=pitch,targetRadius=radius;
    let focusX=0,focusY=1.65,focusZ=0,targetX=0,targetY=1.65,targetZ=0;
    let wake=()=>{},scrollFrame=0;
    function updateButtons() {
      buttons('[data-luma-action]').forEach(button=>{
        const key=button.dataset.lumaAction;
        if(key in state)button.setAttribute('aria-pressed',String(state[key]));
        if(key==='door')button.textContent=state.door?'Close door':'Open door';
        if(key==='curtain')button.textContent=state.curtain?'Lower curtain':'Raise curtain';
        if(key==='roof')button.textContent=state.roof?'Lower roof':'Lift roof';
        if(key==='fan')button.textContent=state.fan?'Stop fan':'Run fan';
      });
      buttons('[data-luma-chapter]').forEach(button=>{
        const selected=Number(button.dataset.lumaChapter)===state.chapter;
        button.setAttribute('aria-pressed',String(selected));
        if(selected)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
      });
    }
    function chapter(index) {
      const view=chapters[index];if(!view)return;
      Object.assign(state,{chapter:index,rotate:false,roof:!!view.roof,xray:!!view.xray,door:!!view.door,curtain:!!view.curtain,fan:!!view.fan,explode:view.explode||0});
      [targetYaw,targetPitch,targetRadius,targetX,targetY,targetZ]=view.view;
      steps.forEach((step,i)=>step.classList.toggle('is-active',i===index));
      host.querySelector('.luma-tour-count').textContent=`${String(index+1).padStart(2,'0')} / ${chapters.length}`;
      host.querySelector('.luma-tour-label').textContent=view.eyebrow.split(' / ').slice(-1)[0];
      const input=host.querySelector('input');input.value=Math.round(state.explode*100);host.querySelector('output').textContent=input.value+'%';
      const popup=host.querySelector('.luma-callout');popup.querySelector('.luma-eyebrow').textContent=view.eyebrow;
      popup.querySelector('h3').textContent=notes[index][0];popup.querySelector('.luma-callout-text').textContent=notes[index][1];
      if(!reduced.matches)popup.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:220});
      updateButtons();wake();
    }
    function measureScroll() {
      scrollFrame=0;if(disposed)return;
      const rect=scroller.getBoundingClientRect(),header=scroller.querySelector('.story-bar');
      const top=getComputedStyle(header).position==='sticky'?header.getBoundingClientRect().height+10:0;
      host.style.setProperty('--luma-sticky-top',top+'px');
      const focus=rect.top+rect.height*.5;
      let active=0;steps.forEach((step,i)=>{if(step.getBoundingClientRect().top<=focus)active=i;});
      if(active!==state.chapter)chapter(active);
    }
    const scheduleScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(measureScroll);};
    function jump(index) {
      const rect=scroller.getBoundingClientRect(),offset=rect.height*.25;
      scroller.scrollTo({top:scroller.scrollTop+steps[index].getBoundingClientRect().top-rect.top-offset,behavior:reduced.matches?'auto':'smooth'});
    }
    buttons('[data-luma-chapter],[data-luma-hotspot]').forEach(button=>on(button,'click',()=>jump(Number(button.dataset.lumaChapter??button.dataset.lumaHotspot))));
    on(scroller,'scroll',scheduleScroll,{passive:true});on(window,'resize',scheduleScroll,{passive:true});on(host.querySelector('details'),'toggle',scheduleScroll);
    buttons('[data-luma-action]').forEach(button=>on(button,'click',()=>{
      const action=button.dataset.lumaAction;
      if(action==='zoom-in')targetRadius=Math.max(4,targetRadius-.8);
      else if(action==='zoom-out')targetRadius=Math.min(16,targetRadius+.8);
      else if(action==='reset')chapter(state.chapter);
      else state[action]=!state[action];
      updateButtons();wake();
    }));
    on(host.querySelector('input'),'input',event=>{state.explode=Number(event.target.value)/100;host.querySelector('output').textContent=event.target.value+'%';wake();});
    let pointer=null;
    on(canvas,'pointerdown',event=>{if(event.button!==0)return;pointer={id:event.pointerId,x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);state.rotate=false;updateButtons();});
    on(canvas,'pointermove',event=>{if(!pointer||pointer.id!==event.pointerId)return;targetYaw-=(event.clientX-pointer.x)*.008;if(event.pointerType==='mouse')targetPitch=Math.max(-.35,Math.min(1.25,targetPitch+(event.clientY-pointer.y)*.006));pointer.x=event.clientX;pointer.y=event.clientY;wake();});
    const release=()=>{pointer=null;};on(canvas,'pointerup',release);on(canvas,'pointercancel',release);on(canvas,'lostpointercapture',release);
    on(canvas,'keydown',event=>{
      if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(event.key))return;
      event.preventDefault();state.rotate=false;
      if(event.key==='ArrowLeft')targetYaw+=.15;if(event.key==='ArrowRight')targetYaw-=.15;
      if(event.key==='ArrowUp')targetPitch=Math.min(1.25,targetPitch+.12);if(event.key==='ArrowDown')targetPitch=Math.max(-.35,targetPitch-.12);
      if(event.key==='+'||event.key==='=')targetRadius=Math.max(4,targetRadius-.8);if(event.key==='-')targetRadius=Math.min(16,targetRadius+.8);if(event.key==='Home')chapter(state.chapter);
      updateButtons();wake();
    });
    const fail=error=>{if(disposed)return;host.classList.add('luma-unavailable');loading.textContent='The 3D view is unavailable on this browser. The component tour and original photographs remain available below.';loading.setAttribute('role','status');console.warn('LUMA 3D:',error);};
    chapter(0);scheduleScroll();
    import('./assets/vendor/three.module.min.js').then(async THREE=>{
      if(disposed)return;
      const {Scene,Group,Color,Vector3,PerspectiveCamera,WebGLRenderer,Mesh,BoxGeometry,CylinderGeometry,SphereGeometry,TorusGeometry,PlaneGeometry,MeshStandardMaterial,MeshBasicMaterial,ShadowMaterial,AmbientLight,HemisphereLight,DirectionalLight,CanvasTexture,SRGBColorSpace,ACESFilmicToneMapping,PCFSoftShadowMap,DoubleSide,CatmullRomCurve3,TubeGeometry,InstancedMesh,Object3D}=THREE;
      let renderer;
      try { const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'}); if(!context)throw new Error('WebGL unavailable'); renderer=new WebGLRenderer({canvas,context,alpha:true,antialias:true,powerPreference:'low-power'}); }
      catch { const {createCanvasRenderer}=await import('./luma-canvas-renderer.js'); if(disposed)return; renderer=createCanvasRenderer(THREE,canvas); }

      renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.outputColorSpace=SRGBColorSpace;renderer.toneMapping=ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.shadowMap.enabled=true;renderer.shadowMap.type=PCFSoftShadowMap;
      const scene=new Scene();const camera=new PerspectiveCamera(36,1,.1,70);const root=new Group();scene.add(root);
      scene.add(new HemisphereLight(0xecf5ff,0x3b3022,2.6));scene.add(new AmbientLight(0xffffff,.35));
      const key=new DirectionalLight(0xffe4bf,4);key.position.set(-3,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:6,bottom:-5,near:.5,far:22});key.shadow.bias=-.0004;key.shadow.normalBias=.025;scene.add(key);
      const fill=new DirectionalLight(0xa8cdff,2);fill.position.set(5,4,-3);scene.add(fill);
      let seed=43;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
      const materials=[];const geometries=[];const textures=[];
      const material=(color,extra={})=>{const m=new MeshStandardMaterial({color,roughness:.75,...extra});materials.push(m);return m;};
      function texture(paint,w=512,h=512){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;textures.push(t);return t;}
      const woodTexture=texture((ctx,w,h)=>{ctx.fillStyle='#d5c8ad';ctx.fillRect(0,0,w,h);for(let i=0;i<700;i++){ctx.strokeStyle=`rgba(${random()>.5?'105,81,48':'255,250,229'},${.02+random()*.045})`;const y=random()*h;ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(w*.3,y+random()*9,w*.7,y-random()*9,w,y);ctx.stroke();}});
      const wood=material(0xeee3cc,{map:woodTexture}),edge=material(0xaa8c63),white=material(0xe4e2d4),dark=material(0x121b22),metal=material(0xaab4b9,{metalness:.75,roughness:.3}),blue=material(0x215699),green=material(0x1a4030),pcb=material(0x155c50),black=material(0x161b1d),gold=material(0xc39d48,{metalness:.6,roughness:.4}),red=material(0xad4030),grass=material(0x365334),glass=material(0x8dabb3,{transparent:true,opacity:.38,metalness:.15,roughness:.15});
      const walls=[];
      function mesh(geometry,mat,parent,x=0,y=0,z=0){geometries.push(geometry);const m=new Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
      const box=(p,w,h,d,x,y,z,m=wood)=>mesh(new BoxGeometry(w,h,d),m,p,x,y,z);
      const cylinder=(p,rt,rb,h,x,y,z,m=metal,segments=24)=>mesh(new CylinderGeometry(rt,rb,h,segments),m,p,x,y,z);
      const sphere=(p,r,x,y,z,m)=>mesh(new SphereGeometry(r,16,12),m,p,x,y,z);
      const makeGroup=(x=0,y=0,z=0)=>{const g=new Group();g.position.set(x,y,z);root.add(g);return g;};
      const shadow=mesh(new PlaneGeometry(30,30),new ShadowMaterial({opacity:.28}),scene,0,-.1,0);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
      const base=makeGroup();box(base,5.7,.14,4.9,0,0,0,wood);for(let i=0;i<4;i++)box(base,5.72,.015,4.92,0,-.065+i*.025,0,i%2?edge:wood);
      box(base,5.54,.06,4.74,0,.1,0,grass);box(base,2.15,.04,1.02,.15,.13,2.5,material(0x716a60));
      const turf=new InstancedMesh(new PlaneGeometry(.024,.09),grass,2200);geometries.push(turf.geometry);const dummy=new Object3D();let index=0;for(let i=0;i<4000&&index<2200;i++){const x=(random()-.5)*5.5,z=(random()-.5)*4.7;if(Math.abs(x)<1.98&&Math.abs(z)<1.68)continue;dummy.position.set(x,.14+random()*.035,z);dummy.rotation.set(0,random()*Math.PI,random()*.35);dummy.updateMatrix();turf.setMatrixAt(index++,dummy.matrix);}turf.count=index;base.add(turf);
      const floor=makeGroup(0,.18,0);box(floor,3.85,.09,3.25,0,0,0,wood);
      const facade=makeGroup(0,0,1.65);const right=makeGroup(1.95,0,0);const rear=makeGroup(0,0,-1.65);const left=makeGroup(-1.95,0,0);
      // Door and window openings are built from separate panels, never painted over a solid wall.
      [box(facade,2.48,2.63,.075,-.71,1.54,0),box(facade,.52,2.63,.075,1.69,1.54,0),box(facade,.9,1.03,.075,.98,2.34,0),box(rear,3.98,2.63,.075,0,1.54,0),box(left,.075,2.63,3.3,0,1.54,0)].forEach(m=>walls.push(m));
      [box(right,.075,2.63,.68,0,1.54,-1.31),box(right,.075,2.63,.68,0,1.54,1.31),box(right,.075,.57,1.95,0,.51,0),box(right,.075,.59,1.95,0,2.56,0)].forEach(m=>walls.push(m));
      for(const x of [-1.95,1.95])for(const z of [-1.65,1.65])box(root,.08,2.67,.08,x,1.54,z,edge);
      // Entrance: white trim, real door pivot, servo, display, keypad and vertically stacked ultrasonic transducers.
      const doorPivot=new Group();doorPivot.position.set(1.39,.25,1.7);facade.add(doorPivot);doorPivot.position.z=.05;
      box(doorPivot,.83,1.5,.055,-.415,.75,0,wood);box(doorPivot,.08,.045,.045,-.67,.84,.052,metal);
      for(const x of [.51,1.43])box(facade,.06,1.6,.075,x,1,.06,white);box(facade,.98,.06,.075,.97,1.8,.06,white);
      const servo=new Group();facade.add(servo);servo.position.set(1.21,1.61,-.15);box(servo,.29,.23,.15,0,0,0,blue);cylinder(servo,.035,.035,.18,0,.14,0,white);
      // Keep each printed face at the same aspect ratio as its canvas texture.
      const screenTexture=texture((ctx,w,h)=>{ctx.fillStyle='#07191d';ctx.fillRect(0,0,w,h);ctx.fillStyle='#8de8d3';ctx.textAlign='center';ctx.font='bold 28px monospace';ctx.fillText('LUMA',w/2,43);ctx.font='15px monospace';ctx.fillText('ENTER PIN',w/2,76);ctx.font='18px monospace';ctx.fillText('_ _ _ _',w/2,106);},256,128);
      box(facade,.34,.26,.035,-.15,1.97,.08,dark);
      mesh(new PlaneGeometry(.28,.14),material(0xffffff,{map:screenTexture,emissive:0x58cdb9,emissiveMap:screenTexture,emissiveIntensity:.28}),facade,-.15,1.97,.102);
      const keypadWidth=.60,keypadHeight=.70;
      const keypad=texture((ctx,w,h)=>{
        ctx.fillStyle='#11151a';ctx.fillRect(0,0,w,h);
        ctx.strokeStyle='#a5a7a8';ctx.lineWidth=5;ctx.beginPath();ctx.roundRect(12,12,w-24,h-24,25);ctx.stroke();
        const labels=['1','2','3','A','4','5','6','B','7','8','9','C','*','0','#','D'];
        const size=104,gap=16,grid=size*4+gap*3,startX=(w-grid)/2,startY=(h-grid)/2;
        ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 53px Arial, sans-serif';
        for(let row=0;row<4;row++)for(let col=0;col<4;col++){
          const x=startX+col*(size+gap),y=startY+row*(size+gap);
          ctx.fillStyle=col===3?'#b03936':'#285b9c';ctx.beginPath();ctx.roundRect(x,y,size,size,10);ctx.fill();
          ctx.strokeStyle='#b3bbc8';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#ffffff';
          ctx.fillText(labels[row*4+col],x+size/2,y+size/2+2);
        }
      },600,700);
      box(facade,keypadWidth,keypadHeight,.035,-1.14,1.96,.085,black);
      mesh(new PlaneGeometry(keypadWidth*.96,keypadHeight*.96),material(0xffffff,{map:keypad}),facade,-1.14,1.96,.105);
      box(facade,.23,.47,.035,-.12,.76,.075,blue);for(const y of [.64,.89]){const can=cylinder(facade,.095,.095,.075,-.12,y,.15,metal);can.rotation.x=Math.PI/2;const face=cylinder(facade,.069,.069,.078,-.12,y,.17,dark);face.rotation.x=Math.PI/2;for(let k=0;k<6;k++){const ring=mesh(new TorusGeometry(.015+k*.008,.002,3,24),metal,facade,-.12,y,.212);ring.castShadow=false;}}
      sphere(facade,.025,.66,1.93,.09,material(0xffd65c,{emissive:0xffce3e,emissiveIntensity:.8}));
      // Side window, motor and fabric awning match the visible side of the real model.
      box(right,.10,1.34,1.86,.10,1.52,0,glass);
      for(const z of [-1,1])box(right,.14,1.55,.055,.10,1.52,z,white);for(const y of [.75,2.3])box(right,.14,.055,2.05,.10,y,0,white);
      const roller=cylinder(right,.065,.065,2.15,.16,2.35,0,white);roller.rotation.x=Math.PI/2;
      const motor=cylinder(right,.17,.17,.16,.16,2.35,1.18,metal);motor.rotation.x=Math.PI/2;box(right,.18,.16,.08,.16,2.16,1.18,blue);
      const fabricTexture=texture((ctx,w,h)=>{ctx.fillStyle='#dddcd0';ctx.fillRect(0,0,w,h);for(let y=0;y<h;y+=128){ctx.fillStyle='#8b9b9d';ctx.fillRect(0,y+64,w,64);}for(let i=0;i<1000;i++){ctx.strokeStyle='rgba(255,255,255,.13)';let x=random()*w;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}});
      const clothMat=material(0xffffff,{map:fabricTexture,side:DoubleSide,roughness:1});const cloth=mesh(new PlaneGeometry(1.91,1.66,12,16),clothMat,right,.47,1.60,0);cloth.rotation.y=Math.PI/2;cloth.rotation.x=0; // Plane local X runs across the window, local Y follows its drop.
      cloth.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new Vector3(0,0,-1),new Vector3(-.28,.96,0),new Vector3(.96,.28,0)));
      const hem=cylinder(right,.035,.035,1.98,.70,.80,0,white);hem.rotation.x=Math.PI/2;
      // The roof is a light hinged lid with corrugated edges, as in the source photographs.
      const roof=makeGroup(0,2.91,-1.72);const roofPanel=box(roof,4.27,.065,3.60,0,0,1.72,wood);roof.rotation.x=-.09;
      const roofRibs=[];for(let i=0;i<23;i++)roofRibs.push(box(roof,.022,.016,3.58,-2.05+i*.185,.04,1.72,edge));
      for(const x of [-1.5,1.5])box(rear,.26,.10,.13,x,2.83,.03,metal);
      // Two schematic ESP32 assemblies are revealed in inspection mode.
      const electronics=makeGroup(0,.36,0);const boardGroups=[];
      function board(x,z){const g=new Group();g.position.set(x,0,z);electronics.add(g);box(g,.49,.035,.86,0,0,0,pcb);box(g,.25,.05,.30,0,.045,.12,metal);box(g,.21,.035,.24,0,.045,-.17,black);for(const side of [-1,1])for(let i=0;i<13;i++)box(g,.027,.065,.023,side*.205,-.013,-.34+i*.052,gold);box(g,.18,.08,.10,0,.035,.45,metal);for(let i=0;i<5;i++)box(g,.27,.006,.015,0,.022,-.33+i*.03,gold);boardGroups.push(g);return g;}
      board(-.85,-.65);board(.85,-.65);
      // Exterior DHT and ceiling-mounted fan follow the team's physical placement.
      const exteriorDHT=makeGroup(2.17,2.25,-1.2);exteriorDHT.rotation.y=Math.PI/2;
      box(exteriorDHT,.22,.32,.035,0,0,0,blue);box(exteriorDHT,.15,.23,.065,0,.02,.045,white);
      for(let row=0;row<4;row++)for(let col=0;col<3;col++)box(exteriorDHT,.023,.023,.006,-.045+col*.045,-.055+row*.045,.081,dark);
      box(electronics,.19,.025,.20,1.3,.07,.15,blue);sphere(electronics,.045,1.3,.105,.15,gold);
      box(electronics,.34,.12,.27,1.15,.09,-1.10,blue);
      const fan=new Group();fan.position.set(-.9,-.15,1.45);roof.add(fan);
      box(fan,.72,.07,.72,0,0,0,dark);
      const rim=mesh(new TorusGeometry(.29,.025,8,40),metal,fan,0,-.07,0);rim.rotation.x=Math.PI/2;
      cylinder(fan,.07,.07,.10,0,-.085,0,black);
      const fanRotor=new Group();fanRotor.position.y=-.095;fan.add(fanRotor);
      const bladeShape=new THREE.Shape();bladeShape.moveTo(.025,.01);bladeShape.bezierCurveTo(.15,.15,.31,.12,.27,.015);bladeShape.bezierCurveTo(.22,-.045,.10,-.025,.025,-.01);bladeShape.closePath();
      for(let i=0;i<5;i++){const blade=mesh(new THREE.ShapeGeometry(bladeShape),material(0x617b84,{side:DoubleSide,metalness:.5,roughness:.45}),fanRotor);blade.rotation.x=Math.PI/2;blade.rotation.z=i*Math.PI*2/5;}
      for(const x of [-.29,.29])for(const z of [-.29,.29])cylinder(fan,.025,.025,.12,x,-.01,z,metal,10);
      function wire(points,color){const curve=new CatmullRomCurve3(points.map(p=>new Vector3(...p)));return mesh(new TubeGeometry(curve,18,.009,5,false),material(color),electronics);}
      wire([[-.8,.06,-.5],[-1.15,.15,-.1],[-1.3,.12,.9],[-1.1,.8,1.55]],0xbb533c);wire([[-.6,.07,-.5],[-.35,.13,-.1],[.2,.17,.5],[1.2,.10,.7]],0xc6a644);wire([[.9,.06,-.5],[1.3,.15,-.2],[1.6,.25,.1],[1.75,1.8,.5]],0x436d98);wire([[.8,.06,-.6],[1.2,.17,-.9],[1.8,1.5,-1.2],[2.14,1.85,-1.2]],0x35333b);
      // Small exterior details anchor the reconstruction to the photograph.
      const plant=makeGroup(2.25,.18,1.98);cylinder(plant,.24,.17,.42,0,.21,0,material(0xa65e3d));cylinder(plant,.255,.255,.06,0,.43,0,material(0xbc7650));cylinder(plant,.225,.225,.012,0,.45,0,material(0x30251e));
      for(let i=0;i<13;i++){const angle=i*2.39996;const leaf=mesh(new THREE.ConeGeometry(.07,.65+random()*.4,4),material(i%2?0x31503b:0x4a6740),plant,Math.sin(angle)*.10,.74+random()*.09,Math.cos(angle)*.10);leaf.rotation.z=Math.cos(angle)*.6;leaf.rotation.x=Math.sin(angle)*.6;}
      for(const x of [-1.95,1.95])for(const z of [-1.65,1.65])box(root,.12,.17,.12,x,.30,z,metal);
      const original={facade:facade.position.clone(),right:right.position.clone(),rear:rear.position.clone(),left:left.position.clone()};
      const originalWallMaterials=new Map(walls.map(w=>[w,w.material]));const ghost=material(0x91c8bd,{transparent:true,opacity:.14,depthWrite:false,side:DoubleSide,roughness:.5});
      let frame=0,visible=true,lastTime=0,settledFrames=0;
      let explode=0,lift=0,doorAngle=0,curtainOpen=0;
      const spotElements=buttons('[data-luma-hotspot]');const anchors=[new Vector3(-.6,1.95,1.78),new Vector3(2.14,2.4,.3),new Vector3(0,.7,-.65)];
      const project=new Vector3();let width=1,height=1;
      const highlight=mesh(new TorusGeometry(.30,.008,6,48),material(0xd66d4c,{emissive:0xb74627,emissiveIntensity:.4}),root);highlight.castShadow=false;
      function resize(){const rect=stage.getBoundingClientRect();if(rect.width<1||rect.height<1)return;width=rect.width;height=rect.height;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();wake();}
      function render(time){frame=0;if(disposed||!visible||document.hidden)return;const dt=Math.min((time-lastTime)/1000||.016,.06);lastTime=time;const a=reduced.matches?1:1-Math.exp(-dt*7);
        if(state.rotate&&!pointer)targetYaw+=dt*.15;
        yaw+=(targetYaw-yaw)*a;pitch+=(targetPitch-pitch)*a;radius+=(targetRadius-radius)*a;focusX+=(targetX-focusX)*a;focusY+=(targetY-focusY)*a;focusZ+=(targetZ-focusZ)*a;
        explode+=(state.explode-explode)*a;lift+=((state.roof?1:0)-lift)*a;doorAngle+=((state.door?-1.35:0)-doorAngle)*a;curtainOpen+=((state.curtain ? .84 : 0)-curtainOpen)*a;
        facade.position.z=original.facade.z+explode*.95;rear.position.z=original.rear.z-explode*.95;left.position.x=original.left.x-explode*.95;right.position.x=original.right.x+explode*1.2;
        roof.position.y=2.91+lift*1.7+explode*1.7;roof.rotation.x=-.09-lift*.30;electronics.position.y=.36+explode*.5;boardGroups.forEach((b,i)=>b.position.x=(i?1:-1)*(.85+explode*.35));
        roof.visible=true;roofPanel.visible=state.chapter!==7;roofPanel.material=state.chapter===6?ghost:wood;roofRibs.forEach(rib=>{rib.visible=![6,7].includes(state.chapter);});if(state.fan&&!reduced.matches)fanRotor.rotation.y+=dt*6;
        doorPivot.rotation.y=doorAngle;cloth.scale.y=1-curtainOpen;const drop=1.66*(1-curtainOpen);cloth.position.set(.16+drop*.14,2.35-drop*.48,0);hem.position.set(.16+drop*.28,2.35-drop*.96,0);
        walls.forEach(w=>{w.material=state.xray?ghost:originalWallMaterials.get(w);w.castShadow=!state.xray;});
        const fittedRadius=radius*Math.max(1,.98/camera.aspect)*(1+explode*.13+lift*.04);
        camera.position.set(focusX+Math.sin(yaw)*Math.cos(pitch)*fittedRadius,focusY+Math.sin(pitch)*fittedRadius,focusZ+Math.cos(yaw)*Math.cos(pitch)*fittedRadius);camera.lookAt(focusX,focusY,focusZ);
        const component=[null,[-.12,.85,1.88,.8],[-.8,1.98,1.85,1.8],[1.0,1.12,1.83,2.0],[2.3,1.7,.1,2.5],[2.25,2.25,-1.2,.75],[-.9,2.70,-.27,1.4],[0,.65,-.65,2.3]][state.chapter];
        highlight.visible=!!component&&state.chapter!==2;if(component){highlight.position.set(component[0]+(state.chapter===4?explode*1.2:0),component[1]+(state.chapter>=7?explode*.5:0),component[2]+(state.chapter<=3?explode*.95:0));highlight.scale.setScalar(component[3]);highlight.quaternion.copy(camera.quaternion);}
        renderer.render(scene,camera);
        anchors[0].set(state.chapter===1?-.12:state.chapter===3?1.0:-.8,state.chapter===1?.85:state.chapter===3?1.2:1.98,1.88+explode*.95);
        anchors[1].set(2.18+explode*1.2,2.4,.3);anchors[2].set(state.chapter===5?2.25:state.chapter===6?-.9:0,state.chapter===5?2.4:state.chapter===6?2.7:.75+explode*.5,state.chapter===5?-1.2:state.chapter===6?-.27:-.65);
        const focus=chapters[state.chapter].focus;
        spotElements.forEach((el,i)=>{project.copy(anchors[i]).project(camera);el.style.left=`${(project.x*.5+.5)*width}px`;el.style.top=`${(-project.y*.5+.5)*height-(state.chapter===2?100:42)}px`;el.hidden=(focus>0&&focus!==i+1)||(i===2&&!state.roof&&!state.xray&&explode<.2)||project.z>1||Math.abs(project.x)>.92||Math.abs(project.y)>.9;});
        spotElements[0].querySelector('b').textContent=state.chapter===1?'HC-SR04':state.chapter===2?'Keypad + OLED':state.chapter===3?'Door servo':'Entrance';
        spotElements[2].querySelector('b').textContent=state.chapter===5?'DHT22 + TSL2561':state.chapter===6?'Fan + relay':'ESP32 × 2';
        const changing=Math.abs(targetYaw-yaw)+Math.abs(targetPitch-pitch)+Math.abs(targetRadius-radius)+Math.abs(targetX-focusX)+Math.abs(targetY-focusY)+Math.abs(targetZ-focusZ)+Math.abs(state.explode-explode)+Math.abs((state.roof?1:0)-lift)+Math.abs((state.door?-1.35:0)-doorAngle)+Math.abs((state.curtain ? .84 : 0)-curtainOpen)>.002;
        settledFrames=changing?0:settledFrames+1;if(changing||state.rotate||(state.fan&&!reduced.matches)||settledFrames<2)frame=requestAnimationFrame(render);
      }
      wake=()=>{settledFrames=0;if(!frame&&visible&&!document.hidden&&!disposed)frame=requestAnimationFrame(render);};
      const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
      const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){lastTime=0;wake();}else if(frame){cancelAnimationFrame(frame);frame=0;}},{threshold:.01});intersection.observe(sticky);
      on(document,'visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{lastTime=0;wake();}});
      on(reduced,'change',()=>{if(reduced.matches){state.rotate=false;updateButtons();}wake();});
      on(canvas,'webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(frame);frame=0;fail('WebGL context lost');});
      disposeScene=()=>{cancelAnimationFrame(frame);resizeObserver.disconnect();intersection.disconnect();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());shadow.material.dispose();renderer.dispose();renderer.forceContextLoss();};
      resize();host.classList.add('luma-ready');loading.hidden=true;wake();
    }).catch(fail);
    return ()=>{disposed=true;controller.abort();cancelAnimationFrame(scrollFrame);disposeScene();};
  }
  window.LumaHero={markup,mount};
})();
