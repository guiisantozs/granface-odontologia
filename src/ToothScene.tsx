import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Lightformer, OrbitControls, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';

function sculptTooth(includeRoots = true) {
  const resolution=66;
  const surface=new MarchingCubes(resolution,new THREE.MeshBasicMaterial(),false,false,40000);
  surface.isolation=0;
  const ellipsoid=(x:number,y:number,z:number,cx:number,cy:number,cz:number,rx:number,ry:number,rz:number)=>{const qx=(x-cx)/rx,qy=(y-cy)/ry,qz=(z-cz)/rz;const k0=Math.sqrt(qx*qx+qy*qy+qz*qz);const k1=Math.sqrt(qx*qx/(rx*rx)+qy*qy/(ry*ry)+qz*qz/(rz*rz));return k0*(k0-1)/(k1||1)};
  const smoothUnion=(a:number,b:number,k:number)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25};
  for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++){
    const px=(x/resolution*2-1)*2.1,py=(y/resolution*2-1)*2.1,pz=(z/resolution*2-1)*2.1;
    let d=ellipsoid(px,py,pz,0,.47,0,.86,.67,.58);
    for(const sx of [-1,1])for(const sz of [-1,1]) d=smoothUnion(d,ellipsoid(px,py,pz,sx*.4,.97,sz*.26,.43,.43,.37),.17);
    if(includeRoots){
      d=smoothUnion(d,ellipsoid(px,py,pz,-.41,-.57,-.02,.3,1.06,.31),.22);
      d=smoothUnion(d,ellipsoid(px,py,pz,.42,-.56,.02,.28,1.02,.29),.22);
    }
    surface.field[x+y*resolution+z*resolution*resolution]=-d;
  }
  surface.update();
  const geometry=surface.geometry.clone();geometry.scale(2.1,2.1,2.1);
  surface.geometry.dispose();(surface.material as THREE.Material).dispose();
  return geometry;
}
const toothGeometry=sculptTooth();
const crownGeometry=sculptTooth(false);

export function Tooth({ small = false, implant = false }: { small?: boolean; implant?: boolean }) {
  return <group scale={small ? .72 : 1}>
    <mesh geometry={implant ? crownGeometry : toothGeometry} scale={implant ? [1, .95, 1] : 1} position={implant ? [0, -.12, 0] : [0, 0, 0]}>
      <MeshTransmissionMaterial resolution={384} samples={5} backside={false} color="#fff7df" metalness={0} roughness={.085} transmission={.94} thickness={1.25} ior={1.65} chromaticAberration={.018} anisotropicBlur={.08} distortion={.12} distortionScale={.35} temporalDistortion={.04} attenuationColor="#d8b574" attenuationDistance={5} clearcoat={1} envMapIntensity={2.2} />
    </mesh>
    {[[-.35,.65,0,.32],[.3,.4,.07,.35],[0,.85,.1,.24],[-.37,-.3,0,.21],[.36,-.25,0,.18]].filter(([,y])=>!implant || y>0).map(([x,y,z,s],i)=><mesh key={i} position={[x,y,z]} scale={[s,s*1.5,s]} rotation={[i*.7,i*.8,i*.3]}><icosahedronGeometry args={[1,0]}/><meshPhysicalMaterial color={i%2?'#ecdfbf':'#a68a55'} metalness={.5} roughness={.12} transparent opacity={.65} envMapIntensity={2.5}/></mesh>)}
    {implant && <group position={[0, -1, 0]}>
      <mesh><cylinderGeometry args={[.31, .16, 1.3, 32]}/><meshStandardMaterial color="#b5a084" metalness={.85} roughness={.24}/></mesh>
      {Array.from({length: 10}, (_, i) => <mesh key={i} position={[0, -.52 + i * .11, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.2 + i * .009, .04, 8, 32]}/><meshStandardMaterial color="#e1c487" metalness={.9} roughness={.2}/></mesh>)}
    </group>}
  </group>;
}

function DentalArch({ goal, shade, selected, onSelect, autoRotate, view }: SceneProps) {
  const group = useRef<Group>(null);
  const target = useMemo(() => new THREE.Color(shade === 'natural' ? '#e7d5af' : '#fff6df'), [shade]);
  useFrame((state, delta) => {
    if (group.current) {
      const angle = view === 'side' ? .9 : view === 'top' ? .1 : 0;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, angle + (autoRotate ? Math.sin(state.clock.elapsedTime * .3) * .3 : 0), 3, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, view === 'top' ? .65 : .1, 3, delta);
    }
  });
  return <group ref={group} position={[0, .1, 0]}>
    {[1, -1].map((jaw) => <group key={jaw} position={[0, jaw * .53, 0]}>
      <mesh position={[0, jaw * .33, .3]} rotation={[-Math.PI / 2,0,0]} scale={[1.1,.82,1]}><torusGeometry args={[1.43,.15,14,64,Math.PI]}/><meshPhysicalMaterial color="#d8b574" transmission={.7} thickness={.5} roughness={.18} transparent opacity={.65}/></mesh>
      {Array.from({length: 14}, (_, i) => {
        const a = (i / 13) * Math.PI;
        const id = i + (jaw === 1 ? 0 : 14);
        const alignment = goal === 'alignment' && shade === 'natural' ? Math.sin(i * 3.4) * .06 : 0;
        return <group key={id} position={[Math.cos(a) * 1.65, alignment, -Math.sin(a) * 1.18 + .3]} rotation={[0, -a + Math.PI / 2 + alignment, 0]} onClick={(e) => {e.stopPropagation(); onSelect?.(id)}}>
          <RoundedBox args={[.37, jaw === 1 ? .66 : .54, (i<3||i>10) ? .53 : .39]} radius={.12} smoothness={4}>
            <meshPhysicalMaterial color={selected === id ? '#d8b574' : target} roughness={.17} transmission={.28} thickness={.6} metalness={selected === id ? .32 : .05} clearcoat={1} />
          </RoundedBox>
          <mesh position={[0, jaw * .4, 0]} scale={[.1, .21, .12]}><sphereGeometry args={[1, 12, 12]}/><meshPhysicalMaterial color="#c5a572" transparent opacity={.45} transmission={.4}/></mesh>
          {goal === 'alignment' && <RoundedBox args={[.14, .13, .06]} radius={.025} position={[0, 0, .225]}><meshStandardMaterial color="#e7d9bd" metalness={.85} roughness={.2}/></RoundedBox>}
          {goal === 'implant' && id === selected && <mesh position={[0, jaw * .52, 0]}><cylinderGeometry args={[.08, .05, .46, 16]}/><meshStandardMaterial color="#c7a465" metalness={.8} roughness={.2}/></mesh>}
        </group>;
      })}
    </group>)}
  </group>;
}

interface SceneProps { mode?: 'tooth' | 'arch' | 'implant'; goal?: string; shade?: string; selected?: number; onSelect?: (id: number) => void; autoRotate?: boolean; view?: string; className?: string; interactive?: boolean }

function Scene({ mode = 'tooth', ...props }: SceneProps) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (group.current && mode !== 'arch') {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -.42 + Math.sin(state.clock.elapsedTime * .32) * .25 + state.pointer.x * .13, 2, delta);
      group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, -.12 + Math.sin(state.clock.elapsedTime * .22) * .05, 2, delta);
    }
  });
  return <>
    <ambientLight intensity={.7} />
    <spotLight position={[3, 5, 4]} intensity={40} color="#ffedc8" angle={.6} penumbra={1}/>
    <pointLight position={[-3, -1, 2]} intensity={18} color="#ffffff"/>
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={7} position={[-3, 2, 3]} rotation={[0, .6, 0]} scale={[1, 6, 1]}/>
      <Lightformer intensity={6} position={[3, 1, 2]} rotation={[0, -.6, 0]} scale={[.6, 5, 1]} color="#fff3d4"/>
      <Lightformer intensity={3} position={[-2, 0, -3]} rotation={[0, Math.PI, 0]} scale={[2, 4, 1]} color="#d2ab61"/>
      <Lightformer intensity={4} position={[1, -1, -4]} rotation={[0, Math.PI, .5]} scale={[1, 5, 1]} color="#fffdf7"/>
      <Lightformer intensity={.65} position={[0, 0, 5]} scale={[10, 10, 1]} color="#ead9b9"/>
      <Lightformer intensity={4} position={[0, 4, -1]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 3, 1]}/>
      <Lightformer intensity={2} position={[0, -3, 2]} scale={[5, 1, 1]} color="#b58b49"/>
    </Environment>
    <Float speed={1.3} rotationIntensity={.08} floatIntensity={.25}>
      {mode === 'arch' ? <DentalArch {...props}/> : <group ref={group}><Tooth implant={mode === 'implant'}/></group>}
    </Float>
    {props.interactive && <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={.6} maxPolarAngle={2.2} enableDamping dampingFactor={.07} />}
  </>;
}

export default function ToothScene(props: SceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [supported] = useState(() => { try {return !!document.createElement('canvas').getContext('webgl2')} catch {return false} });
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={host} className={`tooth-scene ${props.className || ''}`} role="img" aria-label={props.mode === 'arch' ? 'Modelo tridimensional ilustrativo de arcadas dentárias' : 'Dente tridimensional de cristal dourado'}>
    {supported ? <Canvas camera={{ position: props.mode === 'arch' ? [0, 1.2, 6.2] : [0, .1, 6.5], fov: 36 }} dpr={[1, 1.6]} frameloop={visible ? 'always' : 'never'} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: import.meta.env.DEV && new URLSearchParams(location.search).has('asset') }}><Suspense fallback={null}><Scene {...props}/></Suspense></Canvas> : <div className="webgl-fallback">◇<span>Ative a aceleração gráfica para explorar o modelo 3D.</span></div>}
  </div>;
}
