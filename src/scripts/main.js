const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const leerJSON = (id) => JSON.parse(document.getElementById(id)?.textContent || '[]');
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

const barra = $('[data-progreso]');
const rueda = $('[data-rueda]');
const fotoScroll = $('[data-par-scroll]');
const secciones = $$('[data-seccion]');
const enlaces = $$('[data-nav]');
let pendiente = false;

function alHacerScroll() {
  pendiente = false;
  const y = scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  if (barra) barra.style.width = ((y / max) * 100).toFixed(2) + '%';
  if (reducido) return;
  if (rueda) rueda.style.transform = `rotate(${y * 0.35}deg)`;
  if (fotoScroll) {
    const r = fotoScroll.parentElement.getBoundingClientRect();
    const t = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    fotoScroll.style.transform = `scale(1.14) translateY(${(t * -40).toFixed(1)}px)`;
  }
  let actual = '';
  for (const s of secciones) if (s.getBoundingClientRect().top < innerHeight * 0.4) actual = s.id;
  enlaces.forEach((a) => a.classList.toggle('activo', a.dataset.nav === actual));
}
addEventListener('scroll', () => { if (!pendiente) { pendiente = true; requestAnimationFrame(alHacerScroll); } }, { passive: true });
alHacerScroll();

const io = new IntersectionObserver((entradas) => {
  entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
}, { rootMargin: '0px 0px -12% 0px' });
$$('.rv').forEach((el) => io.observe(el));

const carrusel = $('[data-carrusel]');
if (carrusel) {
  const obras = leerJSON('datos-obras');
  const escena = $('[data-escena]');
  const paneles = $$('[data-panel]');
  const puntos = $$('[data-punto]');
  const n = paneles.length;
  const ref = paneles.map((p) => +p.dataset.ref);
  let idx = 0;
  let encima = false;

  const pintar = () => {
    paneles.forEach((p, i) => {
      let d = ((i - idx) % n + n) % n;
      if (d > n / 2) d -= n;
      const a = Math.abs(d);
      p.style.transform = `translate(-50%,-50%) translateX(${d * 60}%) translateZ(${-a * 240}px) rotateY(${-d * 40}deg)`;
      p.style.opacity = a >= 3 ? 0 : a === 2 ? 0.5 : 1;
      p.style.zIndex = 10 - a;
      p.style.filter = d === 0 ? 'none' : 'saturate(.55) brightness(.78)';
      p.style.pointerEvents = a >= 3 ? 'none' : 'auto';
      p.tabIndex = a >= 3 ? -1 : 0;
    });
    puntos.forEach((b, i) => b.setAttribute('aria-current', i === idx ? 'true' : 'false'));
    const o = obras[ref[idx]];
    $('[data-ley-tipo]').textContent = o.tipo;
    $('[data-ley-titulo]').textContent = o.titulo;
    $('[data-ley-lugar]').textContent = o.lugar;
    $('[data-ley-texto]').textContent = o.texto;
  };
  const ir = (i) => { idx = (i + n) % n; pintar(); };

  paneles.forEach((p, i) => p.addEventListener('click', () => (i === idx ? abrirVisor(ref[i]) : ir(i))));
  puntos.forEach((b, i) => b.addEventListener('click', () => ir(i)));
  $('[data-anterior]').addEventListener('click', () => ir(idx - 1));
  $('[data-siguiente]').addEventListener('click', () => ir(idx + 1));
  document.addEventListener('keydown', (e) => {
    if (visor?.open || !encima) return;
    if (e.key === 'ArrowRight') ir(idx + 1);
    if (e.key === 'ArrowLeft') ir(idx - 1);
  });
  carrusel.addEventListener('mouseenter', () => { encima = true; });
  carrusel.addEventListener('mouseleave', () => { encima = false; escena.style.transform = ''; });
  carrusel.addEventListener('mousemove', (e) => {
    if (reducido) return;
    const r = carrusel.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const my = ((e.clientY - r.top) / r.height) * 2 - 1;
    escena.style.transform = `rotateX(${(-my * 5).toFixed(2)}deg) rotateY(${(mx * 7).toFixed(2)}deg)`;
  });
  let x0 = null;
  carrusel.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  carrusel.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  if (!reducido) setInterval(() => { if (!encima && !visor?.open && document.visibilityState === 'visible') ir(idx + 1); }, 5000);
  pintar();
}

const zonaPar = $('[data-parallax]');
if (zonaPar && !reducido) {
  const capas = $$('[data-par]', zonaPar);
  zonaPar.addEventListener('mousemove', (e) => {
    const r = zonaPar.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 2 - 1;
    const py = ((e.clientY - r.top) / r.height) * 2 - 1;
    capas.forEach((c) => { const k = +c.dataset.par; c.style.transform = `translate(${(px * k).toFixed(1)}px,${(py * k).toFixed(1)}px)`; });
  });
}

const textosServ = leerJSON('datos-servicios');
const botonesServ = $$('[data-serv]');
const fotosServ = $$('[data-serv-foto]');
const elegirServ = (i) => {
  botonesServ.forEach((b, j) => b.setAttribute('aria-pressed', j === i ? 'true' : 'false'));
  fotosServ.forEach((f, j) => f.classList.toggle('on', j === i));
  $('[data-serv-texto]').textContent = textosServ[i];
};
let servFijo = false;
botonesServ.forEach((b, i) => {
  b.addEventListener('mouseenter', () => { if (!servFijo) elegirServ(i); });
  b.addEventListener('focus', () => { if (!servFijo) elegirServ(i); });
  b.addEventListener('click', () => { servFijo = true; elegirServ(i); });
});

const fichas = $$('[data-obra]');
const filtros = $$('[data-filtro]');
filtros.forEach((f) => f.addEventListener('click', () => {
  filtros.forEach((g) => g.setAttribute('aria-pressed', g === f ? 'true' : 'false'));
  fichas.forEach((c) => { c.hidden = !(f.dataset.filtro === 'Todas' || c.dataset.cat === f.dataset.filtro); });
}));
fichas.forEach((c) => c.addEventListener('click', () => abrirVisor(+c.dataset.obra)));

const zonaCursor = $('[data-cursor-zona]');
const cursor = $('[data-cursor]');
if (zonaCursor && cursor) {
  let sobreFicha = false;
  let cx = 0, cy = 0;
  const mover = () => { cursor.style.transform = `translate(${cx - 56}px,${cy - 56}px) scale(${sobreFicha ? 1 : 0})`; };
  zonaCursor.addEventListener('mousemove', (e) => {
    const r = zonaCursor.getBoundingClientRect();
    cx = e.clientX - r.left; cy = e.clientY - r.top; mover();
  });
  fichas.forEach((c) => {
    c.addEventListener('mouseenter', () => { sobreFicha = true; mover(); });
    c.addEventListener('mouseleave', () => { sobreFicha = false; mover(); });
  });
}

const visor = $('[data-visor]');
let vObra = 0, vFoto = 0;
const datosObras = leerJSON('datos-obras');
function pintarVisor() {
  const o = datosObras[vObra];
  const img = $('[data-visor-img]');
  img.src = o.fotos[vFoto];
  img.alt = `${o.titulo}, foto ${vFoto + 1}`;
  $('[data-visor-tipo]').textContent = o.tipo;
  $('[data-visor-titulo]').textContent = o.titulo;
  $('[data-visor-lugar]').textContent = o.lugar;
  $('[data-visor-texto]').textContent = o.texto;
  $('[data-visor-pos]').textContent = `${vFoto + 1} / ${o.fotos.length}`;
}
function abrirVisor(i) {
  if (!visor) return;
  vObra = i; vFoto = 0; pintarVisor();
  visor.showModal();
}
if (visor) {
  const mover = (d) => { const l = datosObras[vObra].fotos.length; vFoto = (vFoto + d + l) % l; pintarVisor(); };
  $('[data-visor-cerrar]').addEventListener('click', () => visor.close());
  $('[data-visor-ant]').addEventListener('click', () => mover(-1));
  $('[data-visor-sig]').addEventListener('click', () => mover(1));
  document.addEventListener('keydown', (e) => { if (!visor.open) return; if (e.key === 'ArrowRight') mover(1); if (e.key === 'ArrowLeft') mover(-1); });
  visor.addEventListener('click', (e) => { if (e.target === visor) visor.close(); });
}

const textosPasos = leerJSON('datos-pasos');
const botonesPaso = $$('[data-paso]');
const linea = $('[data-linea]');
const grua = $('[data-grua]');
const ilustraciones = $$('.ilu');
const elegirPaso = (i) => {
  botonesPaso.forEach((b, j) => { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); b.classList.toggle('hecho', j <= i); });
  const fraccion = i / (botonesPaso.length - 1);
  if (linea) linea.style.width = fraccion * 100 + '%';
  if (grua) grua.style.left = `calc(${i} * (20% + 1.6px) + 12px)`;
  ilustraciones.forEach((s, j) => s.classList.toggle('on', j === i));
  $('[data-paso-texto]').textContent = textosPasos[i];
};
botonesPaso.forEach((b, i) => ['mouseenter', 'focus', 'click'].forEach((ev) => b.addEventListener(ev, () => elegirPaso(i))));

const form = $('[data-form]');
if (form) {
  const tipo = $('[data-tipo]', form);
  const chips = $$('[data-necesidad]', form);
  chips.forEach((c) => c.addEventListener('click', () => {
    chips.forEach((d) => d.setAttribute('aria-pressed', d === c ? 'true' : 'false'));
    tipo.value = c.dataset.necesidad;
  }));
  const campoContacto = $('[data-contacto]', form);
  const esEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const esTelefono = (v) => /^\+?[\d\s().-]+$/.test(v) && v.replace(/\D/g, '').length >= 9;
  campoContacto.addEventListener('input', () => campoContacto.setCustomValidity(''));
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const v = campoContacto.value.trim();
    if (!esEmail(v) && !esTelefono(v)) {
      campoContacto.setCustomValidity('Escribe un teléfono de al menos 9 cifras o un email válido.');
      campoContacto.reportValidity();
      return;
    }
    const error = $('[data-form-error]', form);
    error.hidden = true;
    const destino = form.getAttribute('action');
    try {
      if (!destino.startsWith('[')) {
        await fetch(destino, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(new FormData(form)) });
      }
      form.hidden = true;
      $('[data-gracias]').hidden = false;
    } catch {
      error.hidden = false;
    }
  });
}

$$('[data-fundido]').forEach((b) => b.addEventListener('click', () => {
  b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
}));
