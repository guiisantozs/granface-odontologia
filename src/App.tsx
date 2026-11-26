import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { FormEvent, PointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowRight, ArrowLeft, ArrowUp, ChevronDown, Check, CalendarDays, Menu, X, Sparkles, ShieldCheck, ScanLine, Heart, MoveHorizontal, RotateCcw, Maximize2, CircleCheck, Instagram, Facebook, MapPin, Phone, Pause, Play, Mouse, Plus } from 'lucide-react';

const ToothScene = lazy(() => import('./ToothScene'));
gsap.registerPlugin(ScrollTrigger);
const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

const treatments = [
  { title: 'Estética Dental', short: 'Estética', description: 'Harmonia nos detalhes. Um olhar individual para a forma, a cor e a naturalidade do seu sorriso.', detail: 'Lentes e facetas · Planejamento estético', art: 'tooth' },
  { title: 'Ortodontia', short: 'Ortodontia', description: 'Precisão e delicadeza para encontrar o equilíbrio do seu sorriso, em cada etapa da jornada.', detail: 'Alinhadores · Aparelhos ortodônticos', art: 'arch' },
  { title: 'Implantodontia', short: 'Implantes', description: 'Reconstrua possibilidades. Cuidado pensado para devolver conforto e confiança ao sorrir.', detail: 'Implantes · Reabilitação oral', art: 'implant' },
  { title: 'Clareamento Dental', short: 'Clareamento', description: 'A luminosidade do seu sorriso, valorizada com atenção à sua individualidade.', detail: 'Clareamento · Orientação personalizada', art: 'whitening' },
  { title: 'Clínica Geral', short: 'Clínica Geral', description: 'Cuidar começa nos pequenos gestos. Atenção completa para a saúde do seu sorriso.', detail: 'Prevenção · Cuidado contínuo', art: 'general' },
];
const specialists = [
  { name: 'Especialista em ortodontia', role: 'Alinhamento & equilíbrio', image: 'specialist-1.jpg' },
  { name: 'Especialista em estética', role: 'Naturalidade & harmonia', image: 'specialist-2.jpg' },
  { name: 'Especialista em reabilitação', role: 'Conforto & confiança', image: 'specialist-3.jpg' },
  { name: 'Especialista em prevenção', role: 'Saúde & cuidado contínuo', image: 'specialist-2.jpg' },
];
const goals = [
  { id: 'aesthetic', label: 'Valorizar meu sorriso', treatment: 'Estética Dental', text: 'Explore a harmonia entre formas, proporções e naturalidade.', steps: ['Conversa sobre seus objetivos', 'Planejamento estético individual', 'Acompanhamento do seu sorriso'] },
  { id: 'alignment', label: 'Alinhar meus dentes', treatment: 'Ortodontia', text: 'Visualize uma jornada dedicada ao alinhamento e ao equilíbrio.', steps: ['Avaliação do alinhamento', 'Conversa sobre as opções', 'Acompanhamento por etapas'] },
  { id: 'implant', label: 'Reabilitar meu sorriso', treatment: 'Implantodontia', text: 'Conheça visualmente possibilidades de reabilitação do sorriso.', steps: ['Avaliação individual', 'Planejamento da reabilitação', 'Cuidado e acompanhamento'] },
  { id: 'whitening', label: 'Iluminar meu sorriso', treatment: 'Clareamento Dental', text: 'Explore a luminosidade em uma representação ilustrativa.', steps: ['Avaliação da saúde bucal', 'Orientação sobre clareamento', 'Cuidados para o dia a dia'] },
];

function Logo() { return <a className="brand" href="#inicio" aria-label="Granface Odontologia — início"><span className="brand-original"><img src={asset('granface-transparent.png')} alt="Granface Odontologia" /></span></a> }
function BookingLink({ children = 'Agendar avaliação', light = false, small = false }: { children?: React.ReactNode; light?: boolean; small?: boolean }) { return <a href="#agendamento" className={`button ${light ? 'button-light' : ''} ${small ? 'button-small' : ''}`}><CalendarDays size={15}/><span>{children}</span><ArrowUpRight size={17}/></a> }
function SectionTitle({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) { return <div className="section-heading reveal"><span className="eyebrow">{label}</span><h2>{children}</h2>{description && <p>{description}</p>}</div> }
function SceneLoader() { return <div className="scene-loader"><span/>Preparando a experiência</div> }

function DentalArt({ type }: { type: string }) {
  const crown = 'M64 36C48 17 18 27 24 57c5 25 11 30 13 58 3 32 13 35 18 6 5-29 11-29 16 0 5 29 15 26 18-6 2-28 8-33 13-58 6-30-24-40-38-21Z';
  return <svg viewBox="0 0 140 180" className={`dental-art art-${type}`} aria-hidden="true"><defs><linearGradient id={`glass-${type}`} x1="0" x2="1" y2="1"><stop stopColor="#fcf3d6"/><stop offset=".18" stopColor="#c8a768" stopOpacity=".2"/><stop offset=".45" stopColor="#f4dfab" stopOpacity=".8"/><stop offset=".62" stopColor="#a17e47" stopOpacity=".15"/><stop offset="1" stopColor="#fae6b7"/></linearGradient><filter id={`glow-${type}`}><feGaussianBlur stdDeviation="4"/></filter></defs>
    <ellipse cx="70" cy="157" rx="40" ry="5" fill="#d8b574" opacity=".15" filter={`url(#glow-${type})`}/>
    {type === 'arch' || type === 'whitening' ? <g transform="translate(3 29)">{[0,1].map(row => <g key={row} transform={`translate(0 ${row*48})`}>{Array.from({length:8}, (_, i) => <rect key={i} x={8+i*14} y={Math.abs(3.5-i)*-3} width="15" height="38" rx="6" fill={`url(#glass-${type})`} stroke="#ead1a0" strokeWidth=".6" transform={`rotate(${(i-3.5)*-3} ${15+i*14} 20)`}/>)}</g>)}{type === 'arch' && <path d="M14 21Q64 36 114 21M14 68Q64 83 114 68" stroke="#e5d2ab" fill="none" strokeWidth="2"/>}</g> : <g transform={type === 'implant' ? 'translate(5 -5) scale(1 .75)' : 'translate(5 0)'}><path d={crown} fill={`url(#glass-${type})`} stroke="#e9d3a8" strokeWidth=".7"/><path d="M37 42Q48 30 59 42M70 43Q82 30 92 42M33 53Q41 82 44 106" stroke="#fff5dc" strokeWidth="2" fill="none" opacity=".8"/><path d="M30 48Q49 68 66 49Q82 63 98 47" stroke="#fff2d3" fill="none" opacity=".4"/>{type === 'general' && <path d="M61 58v25m-12-12h25" stroke="#fff2d3" strokeWidth="4"/>}</g>}
    {type === 'implant' && <g>{Array.from({length:8},(_,i)=><path key={i} d={`M52 ${95+i*5}h30l-3 4H55Z`} fill={`url(#glass-${type})`} stroke="#ddc18e" strokeWidth=".5"/>)}<path d="M54 134l13 20 13-20" fill={`url(#glass-${type})`}/></g>}
    {type === 'whitening' && <g fill="#f7e5b8"><path d="m114 15 2 8 8 2-8 2-2 8-2-8-8-2 8-2Z"/><path d="m23 110 2 6 6 2-6 2-2 6-2-6-6-2 6-2Z"/></g>}
  </svg>;
}

function Simulator() {
  const [goalIndex, setGoalIndex] = useState(0);
  const [shade, setShade] = useState('bright');
  const [selected, setSelected] = useState(6);
  const [autoRotate, setAutoRotate] = useState(true);
  const [view, setView] = useState('front');
  const [expanded, setExpanded] = useState(false);
  const goal = goals[goalIndex];
  return <section className="simulator section" id="simulador">
    <SectionTitle label="EXPERIÊNCIA INTERATIVA" description="Seu sorriso tem uma história. Explore as possibilidades do próximo capítulo.">Planeje a jornada<br className="mobile-br"/> do seu sorriso.</SectionTitle>
    <div className={`simulator-grid reveal ${expanded ? 'is-expanded' : ''}`}>
      <div className="sim-controls"><div className="control-block"><span className="panel-label"><span>01</span> Seu objetivo</span><div className="goal-options">{goals.map((g,i)=><button key={g.id} className={`goal-option ${goalIndex===i?'selected':''}`} onClick={()=>{setGoalIndex(i);setSelected(i===2?6:selected)}}><span className="radio-dot"/>{g.label}<ArrowUpRight size={13}/></button>)}</div></div>
        <div className="control-block"><span className="panel-label"><span>02</span> Visualização</span><div className="segmented"><button className={shade==='natural'?'selected':''} onClick={()=>setShade('natural')}>Natural</button><button className={shade==='bright'?'selected':''} onClick={()=>setShade('bright')}>Iluminado <Sparkles size={12}/></button></div></div>
        <div className="control-block"><span className="panel-label"><span>03</span> Explore os detalhes</span><p>Toque em um dente para destacar.<br/>Arraste o modelo para girar.</p><button className="text-button" onClick={()=>{setGoalIndex(0);setShade('bright');setSelected(6);setView('front');setAutoRotate(true)}}><RotateCcw size={13}/> Recomeçar experiência</button></div>
      </div>
      <div className="sim-viewport"><div className="viewport-top"><span>SEU SORRISO, EM PERSPECTIVA</span><button className="icon-button" aria-label={expanded?'Reduzir visualização':'Ampliar visualização'} onClick={()=>setExpanded(!expanded)}>{expanded?<X size={15}/>:<Maximize2 size={15}/>}</button></div><div className="model-orbit"/><Suspense fallback={<SceneLoader/>}><ToothScene mode="arch" goal={goal.id} shade={shade} selected={selected} onSelect={setSelected} view={view} autoRotate={autoRotate} interactive/></Suspense><div className="model-tag"><span/>Dente {selected+1 < 10 ? `0${selected+1}` : selected+1} em destaque</div><div className="viewport-bottom"><div className="view-options">{[['front','Frontal'],['side','Lateral'],['top','Superior']].map(([id,label])=><button key={id} className={view===id?'selected':''} onClick={()=>setView(id)}>{label}</button>)}</div><button className="icon-button" onClick={()=>setAutoRotate(!autoRotate)} aria-label={autoRotate?'Pausar rotação':'Retomar rotação'}>{autoRotate?<Pause size={15}/>:<Play size={15}/>}</button></div></div>
      <div className="sim-result" key={goal.id}><span className="panel-label">Sua jornada começa aqui <Sparkles size={14}/></span><span className="result-kicker">POSSIBILIDADE EXPLORADA</span><h3>{goal.treatment}</h3><p>{goal.text}</p><div className="journey-steps">{goal.steps.map((s,i)=><div key={s}><span>0{i+1}</span>{s}<Check size={13}/></div>)}</div><a className="button button-small" href="#agendamento">Conversar sobre meu sorriso<ArrowUpRight size={15}/></a><div className="sim-disclaimer"><ShieldCheck size={15}/><span>Experiência visual ilustrativa.<br/>A indicação depende de avaliação profissional.</span></div></div>
    </div>
    <p className="section-note"><Mouse size={13}/> Uma demonstração de possibilidades. Sem diagnóstico, valores ou previsão de resultados.</p>
  </section>;
}

function Results() {
  const [category, setCategory] = useState(0);
  const [slide, setSlide] = useState(0);
  const [position, setPosition] = useState(50);
  function moveCompare(e: PointerEvent<HTMLInputElement>) { const bounds=e.currentTarget.getBoundingClientRect(); setPosition(Math.min(98,Math.max(2,Math.round((e.clientX-bounds.left)/bounds.width*100)))); }
  const titles = ['A beleza está na naturalidade.', 'Equilíbrio em cada detalhe.', 'Confiança para novos capítulos.', 'Um sorriso com mais luz.'];
  const descriptions = ['Forma, proporção e delicadeza. Conheça uma representação visual do cuidado estético.', 'Explore como o planejamento considera a harmonia do sorriso e a individualidade de cada pessoa.', 'Uma visão ilustrativa das possibilidades do cuidado e da reabilitação oral.', 'Uma visualização de luminosidade para explorar o cuidado com o seu sorriso.'];
  function change(next: number) {setCategory((next+4)%4);setPosition(50)}
  return <section className="results section" id="resultados"><SectionTitle label="POSSIBILIDADES QUE INSPIRAM" description="Cada sorriso é único. E merece ser cuidado assim.">O cuidado transforma<br className="mobile-br"/> a experiência.</SectionTitle>
    <div className="result-tabs reveal" role="tablist" aria-label="Categorias de demonstração">{treatments.slice(0,4).map((t,i)=><button role="tab" aria-selected={category===i} key={t.short} className={category===i?'active':''} onClick={()=>{change(i);setSlide(i)}}>{t.title}</button>)}</div>
    <div className="results-grid reveal"><div className="result-story" key={category}><span className="eyebrow">UM NOVO OLHAR</span><h3>{titles[category]}</h3><p>{descriptions[category]}</p><h4>Um cuidado pensado para você</h4><ul><li><Check size={14}/>Escuta e atenção individual</li><li><Check size={14}/>Planejamento personalizado</li><li><Check size={14}/>Respeito à sua naturalidade</li></ul><span className="illustration-tag">EXEMPLO ILUSTRATIVO</span></div>
      <div className={`comparison comparison-${category}`}><img className="comparison-image after" src={asset('smile-comparison-pair.png')} alt="Retrato ilustrativo gerado por IA: sorriso alinhado e claro"/><div className="comparison-before" style={{clipPath:`inset(0 ${100-position}% 0 0)`}}><img className="comparison-image before" src={asset('smile-comparison-pair.png')} alt="A mesma pessoa no mesmo enquadramento: dentes amarelados e desalinhados, ilustração gerada por IA"/></div><div className="compare-labels"><span>ANTES · ILUSTRAÇÃO</span><span>DEPOIS · ILUSTRAÇÃO</span></div><div className="compare-handle" style={{left:`${position}%`}}><span><MoveHorizontal size={22}/></span></div><input type="range" min="2" max="98" value={position} onChange={e=>setPosition(Number(e.target.value))} onPointerDown={e=>{e.preventDefault();e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);moveCompare(e)}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))moveCompare(e)}} onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}} aria-label="Comparador visual de antes e depois"/><span className="drag-hint">ARRASTE PARA EXPLORAR</span></div>
      <div className="result-portrait"><div className="portrait-image"><img src={asset('smile-comparison-pair.png')} alt="Pessoa fictícia com sorriso alinhado, imagem ilustrativa gerada por IA"/><span><Sparkles size={14}/> A SUA ESSÊNCIA, EM EVIDÊNCIA.</span></div><p>Mais do que uma mudança no sorriso.<br/>Uma nova forma de se sentir.</p><div className="carousel-controls"><button className="circle-button" aria-label="Exemplo anterior" onClick={()=>{setSlide((slide+3)%4);change(category-1)}}><ArrowLeft size={17}/></button><span>0{slide+1}<i> / 04</i></span><button className="circle-button" aria-label="Próximo exemplo" onClick={()=>{setSlide((slide+1)%4);change(category+1)}}><ArrowRight size={17}/></button></div></div>
    </div><p className="section-note">Imagens geradas por IA para demonstração. Não representam pacientes ou resultados clínicos da Granface.</p>
  </section>;
}

function DemoModal({ close }: { close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current;dialog?.showModal(); const onCancel=(e:Event)=>{e.preventDefault();close()};dialog?.addEventListener('cancel',onCancel);document.body.style.overflow='hidden';return()=>{dialog?.removeEventListener('cancel',onCancel);document.body.style.overflow=''}},[close]);
  return <dialog ref={ref} className="demo-modal" onClick={e=>{if(e.target===ref.current)close()}}><button className="modal-close icon-button" aria-label="Fechar demonstração" onClick={close}><X size={20}/></button><span className="modal-icon"><CircleCheck size={32} strokeWidth={1}/></span><span className="eyebrow">O FUTURO COMEÇA COM UM SORRISO</span><h2>Imagine essa<br/>nova experiência.</h2><p>Esta é uma demonstração visual do futuro site da Granface.</p><span className="modal-note">Nenhum agendamento foi realizado.<br/>Os dados preenchidos não foram enviados nem salvos.</span><button className="button" onClick={close}>Continuar explorando<ArrowRight size={16}/></button></dialog>;
}

export default function App() {
  const [menuOpen,setMenuOpen]=useState(false);
  const [activeTreatment,setActiveTreatment]=useState(0);
  const [specialistIndex,setSpecialistIndex]=useState(0);
  const [showModal,setShowModal]=useState(false);
  const [phone,setPhone]=useState('');
  const slider=useRef<HTMLDivElement>(null);
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx=gsap.context(()=>{
      if(reduced)return;
      gsap.from('.hero-line > span',{yPercent:110,duration:1.25,stagger:.12,ease:'power3.out',delay:.15});
      gsap.from('.hero-detail',{opacity:0,y:20,duration:1,stagger:.13,delay:.8});
      gsap.from('.hero-model',{opacity:0,scale:.88,duration:1.8,ease:'power2.out',delay:.2});
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:.95,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 92%',once:true}}));
      gsap.to('.about-image',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.about',start:'top bottom',end:'bottom top',scrub:1.2}});
    },root);
    return()=>ctx.revert();
  },[]);
  const nav=[['A Granface','sobre'],['Tratamentos','tratamentos'],['Especialistas','especialistas'],['Seu sorriso','simulador'],['Resultados','resultados']];
  const moveSpecialists=(direction:number)=>{const next=(specialistIndex+direction+specialists.length)%specialists.length;setSpecialistIndex(next);const el=slider.current;if(el){const card=el.querySelector<HTMLElement>('.specialist-card');el.scrollTo({left:next*((card?.offsetWidth||270)+18),behavior:'smooth'})}};
  const today = new Date();
  const minDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  function formatPhone(value:string) {const d=value.replace(/\D/g,'').slice(0,11);return d.length>6?`(${d.slice(0,2)}) ${d.slice(2,d.length===11?7:6)}-${d.slice(d.length===11?7:6)}`:d.length>2?`(${d.slice(0,2)}) ${d.slice(2)}`:d}
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(e.currentTarget.checkValidity()){setShowModal(true);e.currentTarget.reset();setPhone('')}}
  return <div ref={root}>
    <a href="#conteudo" className="skip-link">Ir para o conteúdo</a>
    <header className="site-header"><Logo/><nav aria-label="Navegação principal" className={menuOpen?'nav-open':''}>{nav.map(([label,id])=><a href={`#${id}`} key={id} onClick={()=>setMenuOpen(false)}>{label}</a>)}</nav><div className="header-actions"><BookingLink small/><button className="menu-toggle icon-button" onClick={()=>setMenuOpen(!menuOpen)} aria-label={menuOpen?'Fechar menu':'Abrir menu'} aria-expanded={menuOpen}>{menuOpen?<X/>:<Menu/>}</button></div></header>
    <main id="conteudo">
      <section className="hero" id="inicio"><div className="hero-glow"/><div className="hero-left"><span className="eyebrow hero-detail"><span className="tiny-star">✦</span> ODONTOLOGIA COM PROPÓSITO</span><h1><span className="hero-line"><span>Mais do que</span></span><span className="hero-line"><span>sorrisos.</span></span></h1><p className="hero-detail">Excelência odontológica<br/>em cada detalhe.</p><div className="hero-signature hero-detail"><span/> Cuidado que respeita a sua essência.</div></div><div className="hero-model"><Suspense fallback={<SceneLoader/>}><ToothScene/></Suspense><span className="model-caption"><span/> PRECISÃO. NATURALIDADE. VOCÊ.</span></div><div className="hero-right"><h2><span className="hero-line"><span>Cuidamos</span></span><span className="hero-line"><span>de <em>histórias.</em></span></span></h2><div className="hero-detail"><BookingLink/><p>Seu próximo capítulo começa aqui.</p></div></div><a className="scroll-hint hero-detail" href="#sobre"><span>DESCUBRA A GRANFACE</span><ChevronDown size={16}/></a><span className="hero-edition hero-detail">UMA NOVA EXPERIÊNCIA EM ODONTOLOGIA</span></section>
      <section className="about" id="sobre"><img className="about-image" src={asset('clinic.jpg')} alt="Fotografia ilustrativa de um consultório odontológico moderno"/><div className="about-overlay"/><div className="about-content reveal"><span className="eyebrow">BEM-VINDO À GRANFACE</span><h2>Uma nova experiência<br/>em odontologia.</h2><p>Na Granface, cada detalhe é pensado para proporcionar conforto, confiança e cuidado com o seu sorriso.</p><a href="#tratamentos" className="text-link">Conheça o nosso cuidado<ArrowUpRight size={17}/></a></div><span className="about-image-note">AMBIENTE ILUSTRATIVO</span><div className="about-values reveal">{[[Heart,'Cuidado humano','Você no centro de tudo.'],[ScanLine,'Olhar preciso','Atenção em cada detalhe.'],[Sparkles,'Essência natural','Seu sorriso, sua identidade.'],[ShieldCheck,'Confiança','Do primeiro ao próximo sorriso.']].map(([Icon,title,desc])=>{const I=Icon as typeof Heart;return <div key={title as string}><I size={23} strokeWidth={1.3}/><div><h3>{title as string}</h3><p>{desc as string}</p></div></div>})}</div></section>
      <section className="treatments section" id="tratamentos"><SectionTitle label="CUIDADOS PARA CADA SORRISO" description="Um olhar completo. Diferentes especialidades, a mesma atenção a você.">Excelência em cada detalhe.</SectionTitle><div className="treatment-cards reveal" onMouseLeave={()=>setActiveTreatment(0)}>{treatments.map((t,i)=><button key={t.title} className={`treatment-card ${activeTreatment===i?'is-active':''}`} onMouseEnter={()=>setActiveTreatment(i)} onFocus={()=>setActiveTreatment(i)} onClick={()=>setActiveTreatment(i)} aria-expanded={activeTreatment===i}><span className="treatment-number">0{i+1}</span><div className="treatment-art"><img className={`dental-art dental-render render-${t.art}`} src={asset(`model-${t.art==='arch'||t.art==='whitening'?'arch':t.art==='implant'?'implant':'tooth'}.png`)} alt={`Modelo 3D ilustrativo de ${t.title}`} loading="lazy"/></div><span className="treatment-copy"><span className="treatment-title">{t.title}</span><span className="treatment-description">{t.description}<small>{t.detail}</small></span></span><span className="treatment-arrow"><Plus size={18}/></span></button>)}</div><div className="center-action reveal"><BookingLink/></div></section>
      <section className="specialists section" id="especialistas"><div className="specialists-intro reveal"><span className="eyebrow">QUEM CUIDA DE VOCÊ</span><h2>Por trás de cada<br/>sorriso, <em>pessoas.</em></h2><p>Técnica, sensibilidade e atenção.<br/>Uma apresentação de como a equipe Granface poderá ganhar vida neste espaço.</p><a className="text-link" href="#agendamento">Encontre o seu cuidado<ArrowUpRight size={16}/></a><span className="demo-label">PERFIS E FOTOGRAFIAS ILUSTRATIVOS</span><div className="carousel-controls"><button className="circle-button" aria-label="Especialista anterior" onClick={()=>moveSpecialists(-1)}><ArrowLeft size={17}/></button><span>0{specialistIndex+1}<i> / 04</i></span><button className="circle-button" aria-label="Próximo especialista" onClick={()=>moveSpecialists(1)}><ArrowRight size={17}/></button></div></div><div className="specialist-slider reveal" ref={slider} onScroll={()=>{const el=slider.current;const card=el?.querySelector<HTMLElement>('.specialist-card');if(el&&card)setSpecialistIndex(Math.min(3,Math.round(el.scrollLeft/(card.offsetWidth+18))))}}>{specialists.map((s,i)=><article className="specialist-card" key={s.name}><div className="specialist-photo"><img src={asset(s.image)} alt={`Fotografia de banco para perfil ilustrativo ${i+1}`} loading="lazy"/><span className="specialist-tag">{i===0?'ORTODONTIA':i===1?'ESTÉTICA DENTAL':i===2?'REABILITAÇÃO':'CLÍNICA GERAL'}</span><span className="specialist-plus"><ArrowUpRight size={18}/></span></div><div className="specialist-info"><span>PERFIL DEMONSTRATIVO</span><h3>{s.name}</h3><p>{s.role}</p></div></article>)}</div></section>
      <Simulator/>
      <Results/>
      <section className="booking section" id="agendamento"><div className="booking-decoration booking-arch" aria-hidden="true"><DentalArt type="arch"/></div><div className="booking-decoration booking-tooth" aria-hidden="true"><Suspense fallback={null}><ToothScene/></Suspense></div><SectionTitle label="SEU PRÓXIMO CAPÍTULO" description="Todo grande sorriso começa com um primeiro encontro.">Dê o primeiro passo.</SectionTitle><form className="booking-form reveal" onSubmit={submit}><div className="form-grid"><label><span>Como podemos chamar você?</span><input name="name" placeholder="Seu nome" autoComplete="off" minLength={2} maxLength={80} required/></label><label><span>Seu telefone</span><input name="phone" type="tel" placeholder="(00) 00000-0000" autoComplete="off" value={phone} onChange={e=>setPhone(formatPhone(e.target.value))} pattern="\([0-9]{2}\) [0-9]{4,5}-[0-9]{4}" required/></label><label><span>O que você procura?</span><select name="treatment" required defaultValue=""><option value="" disabled>Selecione um tratamento</option>{treatments.map(t=><option key={t.title}>{t.title}</option>)}<option>Avaliação inicial</option></select><ChevronDown size={15}/></label><label><span>Uma boa data para você</span><input name="date" aria-label="Data desejada" type="date" min={minDate} required/></label></div><div className="form-footer"><button type="submit" className="button"><CalendarDays size={15}/>Confirmar avaliação<ArrowUpRight size={16}/></button><p><ShieldCheck size={15}/><span>Agendamento demonstrativo.<br/>Seus dados não serão enviados.</span></p></div></form><span className="booking-bottom">CUIDAR DO SEU SORRISO É CUIDAR DE VOCÊ.</span></section>
    </main>
    <footer className="footer"><div className="footer-top"><div className="footer-brand"><Logo/><p>Mais do que sorrisos.<br/>Cuidamos de histórias.</p></div><div className="footer-navigation"><span className="eyebrow">EXPLORE</span>{nav.map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}</div><div className="footer-contact"><span className="eyebrow">VAMOS CONVERSAR</span><p><Phone size={14}/>Contato a definir</p><p><MapPin size={14}/>Endereço da clínica a definir</p><span className="footer-small">Informações demonstrativas.</span></div><div className="footer-social"><span className="eyebrow">ACOMPANHE A GRANFACE</span><button className="text-link" onClick={()=>setShowModal(true)}><Instagram size={15}/>Instagram<ArrowUpRight size={14}/></button><button className="text-link" onClick={()=>setShowModal(true)}><Facebook size={15}/>Facebook<ArrowUpRight size={14}/></button><a href="#inicio" className="back-top">Voltar ao topo<ArrowUp size={16}/></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Granface Odontologia.</span><span>PROTÓTIPO VISUAL · EXPERIÊNCIA DEMONSTRATIVA</span><span>Feito para inspirar novos sorrisos.</span></div><span className="footer-watermark" aria-hidden="true">GRANFACE</span></footer>
    {showModal&&<DemoModal close={()=>setShowModal(false)}/>}
  </div>;
}
