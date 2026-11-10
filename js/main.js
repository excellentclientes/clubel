/* =====================================================
   CONFIGURAÇÃO — preencha com os dados reais do Clubel
   ===================================================== */
const CONFIG = {
  whatsapp: "",   // só números com DDI+DDD. Ex.: "5511999999999"
  mensagemPadrao: "Olá! Vim pelo site e quero saber mais sobre o Clubel.",
  // Imagens do portfólio (ordem dos 6 cards). Hoje são ilustrações embutidas no arquivo, por isso carregam na hora.
  // Para usar fotos reais, troque cada item por "fotos/arquivo.jpg".
  // Fotos da equipe (embutidas no arquivo; para trocar, use caminhos como "fotos/arquivo.jpg")
  imagens: [
    "img/equipe/equipe-1.jpg",
    "img/equipe/equipe-2.jpg",
    "img/equipe/equipe-3.jpg",
    "img/equipe/equipe-4.jpg"
  ],
  alts: ["Duas integrantes da equipe Clubel com camisetas da marca em um evento", "Equipe Clubel posando em um estande de feira com parede de rosas", "Duas integrantes da equipe Clubel em evento", "Equipe Clubel em evento em parede branca com triângulos"]
};

/* ---------- WhatsApp ---------- */
const num = CONFIG.whatsapp.replace(/\D/g,"");
const waLink = t => num ? `https://wa.me/${num}?text=${encodeURIComponent(t)}` : "#cadastro";
["waFloat","footWa"].forEach(id=>{const el=document.getElementById(id);el.href=waLink(CONFIG.mensagemPadrao);if(!num)el.removeAttribute("target")});
document.getElementById("leadForm").addEventListener("submit",e=>{
  e.preventDefault();
  const v=id=>document.getElementById(id).value.trim();
  if(!num){alert("Defina o número do WhatsApp na CONFIG do código para ativar o envio.");return}
  const m=`Olá! Quero cadastrar meu salão no Clubel.\n\nNome: ${v("nome")}\nWhatsApp: ${v("tel")}\nAtuação: ${v("prof")}`+(v("salao")?`\nEstabelecimento: ${v("salao")}`:"");
  window.open(waLink(m),"_blank","noopener");
});

/* ---------- Equipe: um card único, troca sozinho a cada 4 s ---------- */
(function(){
  const imgs=CONFIG.imagens,alts=CONFIG.alts,n=imgs.length;
  const stage=document.getElementById("teamStage"),dots=document.getElementById("teamDots"),bar=document.getElementById("teamBar"),card=document.getElementById("teamCard");
  const slides=imgs.map((src,i)=>{const im=new Image();im.src=src;im.alt=alts[i]||"Equipe Clubel";im.className="team-slide";stage.appendChild(im);return im});
  const ds=imgs.map((_,i)=>{const b=document.createElement("button");b.setAttribute("aria-label","Foto "+(i+1));b.onclick=()=>{show(i);restart()};dots.appendChild(b);return b});
  let cur=0,timer=null;
  function show(i){
    cur=(i+n)%n;
    slides.forEach((s,k)=>s.classList.toggle("on",k===cur));
    ds.forEach((d,k)=>d.classList.toggle("on",k===cur));
    bar.style.animation="none";void bar.offsetWidth;bar.style.animation="";
  }
  function restart(){clearInterval(timer);timer=setInterval(()=>show(cur+1),4000)}
  card.addEventListener("mouseenter",()=>{clearInterval(timer);bar.style.animationPlayState="paused"});
  card.addEventListener("mouseleave",()=>{bar.style.animationPlayState="";restart()});
  document.addEventListener("visibilitychange",()=>document.hidden?clearInterval(timer):restart());
  show(0);restart();
})();

/* ---------- Filtro do portfólio ---------- */
(function(){
  const bs=document.querySelectorAll("#filters button"),ws=document.querySelectorAll("#gallery .work");
  bs.forEach(b=>b.onclick=()=>{
    bs.forEach(x=>x.classList.toggle("on",x===b));
    ws.forEach(w=>w.classList.toggle("gone",b.dataset.f!=="all"&&w.dataset.cat!==b.dataset.f));
  });
})();

/* ---------- Header, menu, progresso ---------- */
const header=document.querySelector("header"),bar=document.getElementById("progress");
function onScroll(){header.classList.toggle("s",scrollY>40);const h=document.documentElement;bar.style.width=(scrollY/(h.scrollHeight-h.clientHeight)*100)+"%"}
onScroll();addEventListener("scroll",onScroll,{passive:true});
const burger=document.getElementById("burger"),menu=document.getElementById("menu");
burger.onclick=()=>{burger.classList.toggle("open");menu.classList.toggle("open")};
menu.querySelectorAll("a").forEach(a=>a.onclick=()=>{burger.classList.remove("open");menu.classList.remove("open")});

/* ---------- Título do hero: entrada palavra por palavra ---------- */
document.querySelectorAll("#h1 .w span").forEach((s,i)=>s.style.animationDelay=(.15+i*.09)+"s");

/* ---------- Reveal + contadores + linha dos passos ---------- */
const io=new IntersectionObserver(es=>es.forEach(x=>{
  if(!x.isIntersecting)return;
  x.target.classList.add("in");io.unobserve(x.target);
  x.target.querySelectorAll("[data-count]").forEach(countUp);
  if(x.target.matches("[data-count]"))countUp(x.target);
}),{threshold:.15});
document.querySelectorAll(".rv").forEach(el=>io.observe(el));
function countUp(el){
  if(el.dataset.done)return;el.dataset.done=1;
  const end=+el.dataset.count,t0=performance.now(),d=1400;
  (function f(t){const p=Math.min((t-t0)/d,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0);
}

/* ---------- Brilho que segue o cursor + spotlight nos cards + tilt 3D ---------- */
const glow=document.getElementById("glow"),fine=matchMedia("(pointer:fine)").matches;
if(fine){
  addEventListener("mousemove",e=>{glow.style.opacity=1;glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
  document.querySelectorAll(".tilt").forEach(c=>{
    c.addEventListener("mousemove",e=>{
      const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
      c.style.setProperty("--mx",x+"px");c.style.setProperty("--my",y+"px");
      c.style.transform=`perspective(800px) rotateX(${((y/r.height)-.5)*-8}deg) rotateY(${((x/r.width)-.5)*8}deg) translateY(-4px)`;
    });
    c.addEventListener("mouseleave",()=>c.style.transform="");
  });
  /* botões magnéticos */
  document.querySelectorAll(".mag").forEach(b=>{
    b.addEventListener("mousemove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});
    b.addEventListener("mouseleave",()=>b.style.transform="");
  });
}

/* ---------- Partículas douradas no hero ---------- */
(function(){
  const c=document.getElementById("fx"),x=c.getContext("2d");let W,H,P=[];
  const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  function size(){W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;P=Array.from({length:Math.min(70,Math.floor(W/18))},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*2+.6,vx:(Math.random()-.5)*.25,vy:-Math.random()*.45-.1,a:Math.random()*.6+.2,p:Math.random()<.18}))}
  size();addEventListener("resize",size);
  let mx=-999,my=-999;c.parentElement.addEventListener("mousemove",e=>{const r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
  (function loop(){
    x.clearRect(0,0,W,H);
    for(const p of P){
      const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);if(d<120){p.x+=dx/d*1.4;p.y+=dy/d*1.4}
      p.x+=p.vx;p.y+=p.vy;if(p.y<-5){p.y=H+5;p.x=Math.random()*W}if(p.x<-5)p.x=W+5;if(p.x>W+5)p.x=-5;
      x.beginPath();x.arc(p.x,p.y,p.r,0,6.283);x.fillStyle=p.p?`rgba(255,79,154,${p.a})`:`rgba(255,214,10,${p.a})`;x.fill();
    }
    if(!reduce)requestAnimationFrame(loop);
  })();
})();

document.getElementById("logoFoot").src=document.getElementById("logoImg").src;
document.getElementById("year").textContent=new Date().getFullYear();
