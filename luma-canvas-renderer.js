/* Depth-buffered software 3D fallback. Renders the same geometry when WebGL is unavailable. */
export function createCanvasRenderer(THREE,canvas) {
  const context=canvas.getContext('2d',{alpha:true});
  if(!context)throw new Error('No supported drawing context');
  const {Vector3,Matrix4,Color}=THREE;
  let width=1,height=1,pixelRatio=1,imageData,depth;
  const projection=new Matrix4(),a=new Vector3(),b=new Vector3(),c=new Vector3(),normal=new Vector3(),edge=new Vector3(),pa=new Vector3(),pb=new Vector3(),pc=new Vector3();
  const key=new Vector3(-3,8,6).normalize(),fill=new Vector3(5,4,-3).normalize();const textureCache=new WeakMap();
  function getTexture(image){
    if(!image)return null;if(textureCache.has(image))return textureCache.get(image);
    const ctx=image.getContext?.('2d');if(!ctx)return null;
    const data={width:image.width,height:image.height,pixels:ctx.getImageData(0,0,image.width,image.height).data};textureCache.set(image,data);return data;
  }
  function raster(triangle){
    const [p0,p1,p2]=triangle.p;
    const minX=Math.max(0,Math.floor(Math.min(p0.x,p1.x,p2.x))),maxX=Math.min(canvas.width-1,Math.ceil(Math.max(p0.x,p1.x,p2.x)));
    const minY=Math.max(0,Math.floor(Math.min(p0.y,p1.y,p2.y))),maxY=Math.min(canvas.height-1,Math.ceil(Math.max(p0.y,p1.y,p2.y)));
    const denom=(p1.y-p2.y)*(p0.x-p2.x)+(p2.x-p1.x)*(p0.y-p2.y);if(Math.abs(denom)<.01)return;
    const inv=1/denom,aa=(p1.y-p2.y)*inv,ab=(p2.x-p1.x)*inv,ba=(p2.y-p0.y)*inv,bb=(p0.x-p2.x)*inv;
    const ac=-(aa*p2.x+ab*p2.y),bc=-(ba*p2.x+bb*p2.y),pixels=imageData.data;
    const tex=triangle.texture,opacity=triangle.opacity;
    for(let y=minY;y<=maxY;y++){
      let l0=aa*(minX+.5)+ab*(y+.5)+ac,l1=ba*(minX+.5)+bb*(y+.5)+bc;
      let pixel=y*canvas.width+minX;
      for(let x=minX;x<=maxX;x++,pixel++,l0+=aa,l1+=ba){
        const l2=1-l0-l1;if(l0<-.0001||l1<-.0001||l2<-.0001)continue;
        const z=l0*p0.z+l1*p1.z+l2*p2.z;if(z>depth[pixel]+.000001)continue;
        let r=triangle.color[0],g=triangle.color[1],b=triangle.color[2];
        if(tex){
          const divisor=l0*p0.iw+l1*p1.iw+l2*p2.iw;
          const u=(l0*p0.u*p0.iw+l1*p1.u*p1.iw+l2*p2.u*p2.iw)/divisor;
          const v=(l0*p0.v*p0.iw+l1*p1.v*p1.iw+l2*p2.v*p2.iw)/divisor;
          const tx=Math.max(0,Math.min(tex.width-1,Math.floor(u*tex.width))),ty=Math.max(0,Math.min(tex.height-1,Math.floor((1-v)*tex.height)));
          const offset=(ty*tex.width+tx)*4;r=tex.pixels[offset]*r/255;g=tex.pixels[offset+1]*g/255;b=tex.pixels[offset+2]*b/255;
        }
        const offset=pixel*4;
        if(opacity>=.99){pixels[offset]=r;pixels[offset+1]=g;pixels[offset+2]=b;pixels[offset+3]=255;depth[pixel]=z;}
        else {const da=pixels[offset+3]/255,oa=opacity+da*(1-opacity);pixels[offset]=(r*opacity+pixels[offset]*da*(1-opacity))/oa;pixels[offset+1]=(g*opacity+pixels[offset+1]*da*(1-opacity))/oa;pixels[offset+2]=(b*opacity+pixels[offset+2]*da*(1-opacity))/oa;pixels[offset+3]=oa*255;}
      }
    }
  }
  return {
    shadowMap:{},
    setPixelRatio(value){pixelRatio=Math.min(value,1.15);},
    setSize(w,h){width=w;height=h;canvas.width=Math.round(w*pixelRatio);canvas.height=Math.round(h*pixelRatio);imageData=context.createImageData(canvas.width,canvas.height);depth=new Float32Array(canvas.width*canvas.height);},
    render(scene,camera){
      scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);const e=projection.elements,triangles=[];
      scene.traverseVisible(object=>{
        if(!object.isMesh||object.material?.isShadowMaterial||object.isInstancedMesh)return;
        const geometry=object.geometry,position=geometry.attributes.position,uv=geometry.attributes.uv;if(!position)return;
        const mat=Array.isArray(object.material)?object.material[0]:object.material;if(!mat||mat.visible===false||mat.opacity===0)return;
        const indices=geometry.index,count=indices?indices.count:position.count;const color=(mat.color||new Color(0xffffff)).getHex(THREE.SRGBColorSpace);const red=(color>>16)&255,green=(color>>8)&255,blue=color&255;
        for(let i=0;i<count;i+=3){
          const ia=indices?indices.getX(i):i,ib=indices?indices.getX(i+1):i+1,ic=indices?indices.getX(i+2):i+2;
          a.fromBufferAttribute(position,ia).applyMatrix4(object.matrixWorld);b.fromBufferAttribute(position,ib).applyMatrix4(object.matrixWorld);c.fromBufferAttribute(position,ic).applyMatrix4(object.matrixWorld);
          pa.copy(a).applyMatrix4(projection);pb.copy(b).applyMatrix4(projection);pc.copy(c).applyMatrix4(projection);
          if(pa.z>1||pb.z>1||pc.z>1||pa.z< -1||pb.z< -1||pc.z< -1)continue;
          const x0=(pa.x*.5+.5)*canvas.width,y0=(-pa.y*.5+.5)*canvas.height,x1=(pb.x*.5+.5)*canvas.width,y1=(-pb.y*.5+.5)*canvas.height,x2=(pc.x*.5+.5)*canvas.width,y2=(-pc.y*.5+.5)*canvas.height;
          const signed=(x1-x0)*(y2-y0)-(y1-y0)*(x2-x0);if(mat.side!==THREE.DoubleSide&&signed>=0)continue;if(Math.abs(signed)<.025)continue;
          normal.subVectors(b,a).cross(edge.subVectors(c,a)).normalize();if(signed>0)normal.negate();const light=.67+Math.max(0,normal.dot(key))*.30+Math.max(0,normal.dot(fill))*.12;
          triangles.push({p:[{x:x0,y:y0,z:pa.z,iw:1/(e[3]*a.x+e[7]*a.y+e[11]*a.z+e[15]),u:uv?.getX(ia)||0,v:uv?.getY(ia)||0},{x:x1,y:y1,z:pb.z,iw:1/(e[3]*b.x+e[7]*b.y+e[11]*b.z+e[15]),u:uv?.getX(ib)||0,v:uv?.getY(ib)||0},{x:x2,y:y2,z:pc.z,iw:1/(e[3]*c.x+e[7]*c.y+e[11]*c.z+e[15]),u:uv?.getX(ic)||0,v:uv?.getY(ic)||0}],z:(pa.z+pb.z+pc.z)/3,color:[Math.min(255,red*light),Math.min(255,green*light),Math.min(255,blue*light)],opacity:mat.transparent?mat.opacity:1,texture:getTexture(mat.map?.image)});
        }
      });
      triangles.sort((x,y)=>y.z-x.z);depth.fill(Infinity);imageData.data.fill(0);for(const t of triangles)raster(t);context.putImageData(imageData,0,0);
      const center=new Vector3(0,-.08,0).project(camera);context.save();context.globalCompositeOperation='destination-over';context.translate((center.x*.5+.5)*canvas.width,(-center.y*.5+.5)*canvas.height);context.scale(1,.3);const gradient=context.createRadialGradient(0,0,10,0,0,canvas.width*.38);gradient.addColorStop(0,'rgba(0,0,0,.38)');gradient.addColorStop(1,'rgba(0,0,0,0)');context.fillStyle=gradient;context.fillRect(-canvas.width*.4,-canvas.width*.4,canvas.width*.8,canvas.width*.8);context.restore();
    },
    dispose(){context.clearRect(0,0,canvas.width,canvas.height);imageData=null;depth=null;},forceContextLoss(){}
  };
}
