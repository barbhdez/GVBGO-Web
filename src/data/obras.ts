import type { ImageMetadata } from 'astro';

const archivos = import.meta.glob<{ default: ImageMetadata }>('../assets/obras/*.jpg', { eager: true });
const f = (nombre: string): ImageMetadata => {
  const a = archivos[`../assets/obras/${nombre}.jpg`];
  if (!a) throw new Error(`Falta la foto ${nombre}`);
  return a.default;
};
const serie = (base: string, n: number) => Array.from({ length: n }, (_, i) => f(`${base}-${i + 1}`));

export type Categoria = 'Patrimonio' | 'Miradores' | 'Edificios' | 'Obra civil';

export interface Obra {
  id: string;
  titulo: string;
  lugar: string;
  tipo: string;
  categoria: Categoria;
  texto: string;
  fotos: ImageMetadata[];
}

export const obras: Obra[] = [
  {
    id: 'piedrashitas',
    titulo: 'Mirador de Piedrashitas',
    lugar: 'Posada de Valdeón, León',
    tipo: 'Construcción singular · Mirador',
    categoria: 'Miradores',
    texto: 'Nuevo mirador sobre el valle de Valdeón, con un voladizo de 7,5 metros y suelo de vidrio.',
    fotos: [...serie('piedrashitas', 8)],
  },
  {
    id: 'castillo',
    titulo: 'Castillo de El Barco',
    lugar: 'El Barco de Ávila, Ávila',
    tipo: 'Restauración de patrimonio',
    categoria: 'Patrimonio',
    texto: 'Restauración del recinto amurallado: consolidación de los lienzos de piedra, nuevo pavimento del patio de armas, pasarelas de ronda y núcleos de comunicación vertical en acero.',
    fotos: [...serie('castillo', 8), f('castillo-antes'), f('castillo-despues')],
  },
  {
    id: 'convento',
    titulo: 'Convento de Santa Clara',
    lugar: 'Soria',
    tipo: 'Rehabilitación de patrimonio',
    categoria: 'Patrimonio',
    texto: 'Rehabilitación del convento para un nuevo uso: forjados y entreplantas metálicas dentro de la iglesia gótica, escaleras, carpinterías de madera y cubierta de madera recuperada.',
    fotos: [...serie('convento', 9), f('convento-antes')],
  },
  {
    id: 'puertopico',
    titulo: 'Mirador del Puerto del Pico',
    lugar: 'Puerto del Pico, Ávila',
    tipo: 'Construcción singular · Mirador',
    categoria: 'Miradores',
    texto: 'Mirador circular en voladizo sobre el puerto, con estructura metálica, suelo de rejilla y graderío de madera para contemplar el valle.',
    fotos: [...serie('puertopico', 4), f('puertopico-2'), f('puertopico-despues')],
  },
  {
    id: 'aldeadavila',
    titulo: 'Pasarela mirador',
    lugar: 'Aldeadávila de la Ribera, Salamanca',
    tipo: 'Construcción singular · Mirador',
    categoria: 'Miradores',
    texto: 'Pasarela de acero corten volada sobre los Arribes del Duero.',
    fotos: [...serie('aldeadavila', 4)],
  },
  {
    id: 'galiana',
    titulo: 'Mirador de La Galiana',
    lugar: 'Cañón del Río Lobos, Soria',
    tipo: 'Construcción singular · Mirador',
    categoria: 'Miradores',
    texto: 'Plataformas de madera y rejilla metálica asomadas al cañón, con barandillas de corten y madera.',
    fotos: [...serie('galiana', 4), f('galiana-2'), f('galiana-despues')],
  },
  {
    id: 'prendao',
    titulo: 'Mirador del Prendao',
    lugar: 'León',
    tipo: 'Construcción singular · Mirador',
    categoria: 'Miradores',
    texto: 'Pasarela y mirador de madera y metal elevados entre el arbolado.',
    fotos: [...serie('prendao', 3)],
  },
  {
    id: 'tdi',
    titulo: 'Nave TDI',
    lugar: 'Alcalá de Henares, Madrid',
    tipo: 'Construcción singular · Nave industrial',
    categoria: 'Edificios',
    texto: 'Edificio industrial con oficinas, desde el montaje de la estructura metálica hasta la fachada de vidrio y los acabados interiores.',
    fotos: [f('tdi-despues'), ...serie('tdi', 4), ...serie('nave', 3), f('tdi-antes')],
  },
  {
    id: 'cras',
    titulo: 'Centro de Recuperación de Animales Silvestres',
    lugar: 'Valsemana, La Ercina, León',
    tipo: 'Construcción singular · Equipamiento',
    categoria: 'Edificios',
    texto: 'Construcción del CRAS de Valsemana, en León.',
    fotos: [...serie('cras', 4)],
  },
  {
    id: 'urogallo',
    titulo: 'Centro del Urogallo',
    lugar: 'Caboalles de Arriba, León',
    tipo: 'Construcción singular · Equipamiento',
    categoria: 'Edificios',
    texto: 'Recinto cubierto que recrea el hábitat natural del urogallo.',
    fotos: [f('urogallo-despues'), f('urogallo-antes')],
  },
  {
    id: 'pozomaria',
    titulo: 'Pozo María',
    lugar: 'Villablino, León',
    tipo: 'Rehabilitación de patrimonio industrial',
    categoria: 'Patrimonio',
    texto: 'Rehabilitación del antiguo conjunto minero: castillete y estructuras metálicas, edificios de piedra y naves interiores.',
    fotos: [...serie('pozomaria', 5)],
  },
  {
    id: 'navafria',
    titulo: 'Casa del Parque',
    lugar: 'Navafría, Segovia',
    tipo: 'Rehabilitación · Centro de interpretación',
    categoria: 'Patrimonio',
    texto: 'Rehabilitación de un edificio de piedra y construcción de un nuevo edificio como casa de interpretación de la naturaleza.',
    fotos: [...serie('navafria', 2)],
  },
  {
    id: 'parquesegovia',
    titulo: 'Parque de Santa Clara',
    lugar: 'Soria',
    tipo: 'Reordenación',
    categoria: 'Obra civil',
    texto: 'Reordenación del parque: caminos, zonas verdes, alumbrado y área de juegos.',
    fotos: [f('parquesegovia-despues'), f('parquesegovia-1'), f('parquesegovia-antes')],
  },
  {
    id: 'depuradora',
    titulo: 'Depuradora',
    lugar: 'Soria',
    tipo: 'Obra civil e hidráulica',
    categoria: 'Obra civil',
    texto: 'Incorporación de caudales para la nueva depuradora de Soria.',
    fotos: [...serie('depuradora', 7)],
  },
];

export const destacadas = ['aldeadavila', 'piedrashitas', 'castillo', 'convento', 'puertopico', 'galiana', 'tdi'];

export const fotosProceso = [
  { nombre: 'Parque de Santa Clara', lugar: 'Soria', obra: f('parquesegovia-antes'), fin: f('parquesegovia-despues') },
  { nombre: 'Nave TDI', lugar: 'Alcalá de Henares', obra: f('tdi-antes'), fin: f('tdi-despues') },
  { nombre: 'Castillo de El Barco', lugar: 'El Barco de Ávila', obra: f('castillo-antes'), fin: f('castillo-despues') },
  { nombre: 'Convento de Santa Clara', lugar: 'Soria', obra: f('convento-antes'), fin: f('convento-1') },
  { nombre: 'Mirador del Puerto del Pico', lugar: 'Ávila', obra: f('puertopico-2'), fin: f('puertopico-despues') },
  { nombre: 'Mirador de La Galiana', lugar: 'Soria', obra: f('galiana-2'), fin: f('galiana-despues') },
];

export const servicios = [
  {
    nombre: 'Restauración',
    foto: f('castillo-1'),
    alt: 'Patio de armas restaurado del castillo de El Barco de Ávila',
    texto: 'Castillos, conventos y patrimonio histórico: recuperamos el conjunto.',
  },
  {
    nombre: 'Rehabilitación',
    foto: f('pozomaria-4'),
    alt: 'Castillete del antiguo conjunto minero de Pozo María, en Villablino',
    texto: 'Damos un nuevo uso a edificios existentes: conjuntos industriales y centros de interpretación.',
  },
  {
    nombre: 'Construcción singular',
    foto: f('tdi-3'),
    alt: 'Nave industrial TDI en Alcalá de Henares',
    texto: 'Miradores, pasarelas, naves industriales y edificios que necesitan soluciones a medida.',
  },
  {
    nombre: 'Ejecución de obras',
    foto: f('cras-3'),
    alt: 'Hormigonado de una losa en la obra del CRAS de Valsemana',
    texto: 'Planificamos la obra y estudiamos los recursos necesarios, en aras de conseguir un resultado final óptimo.',
  },
];

export const pasos = [
  { nombre: 'Proyecto', texto: 'Comprobamos el presupuesto y planificamos la obra.' },
  { nombre: 'Trámites', texto: 'Nos ocupamos del papeleo necesario para poder empezar la obra.' },
  { nombre: 'Seguridad', texto: 'Actuamos en consonancia con lo reflejado en el estudio de seguridad y salud.' },
  { nombre: 'Ejecución', texto: 'Ejecutamos la obra con nuestro equipo y empresas especializadas para cumplir con plazos y dar una garantía de calidad.' },
  { nombre: 'Entrega', texto: 'Revisamos cada detalle y entregamos la obra terminada con su documentación.' },
];

export const empresaFotos = {
  pasillo: f('castillo-4'),
  equipo: f('piedrashitas-2'),
  operario: f('aldeadavila-4'),
  mirador: f('galiana-4'),
};

export const provincias = ['Madrid', 'Soria', 'Segovia', 'Burgos', 'Ávila', 'León', 'Zamora', 'Guadalajara', 'Toledo'];

export const contacto = {
  telefono: '699 21 87 91',
  telefonoHref: 'tel:+34699218791',
  email: 'ahernandez@gvbgo.com',
  emailHref: 'mailto:ahernandez@gvbgo.com',
  whatsappHref: 'https://wa.me/34699218791',
  direccion: 'CNV, Calle Valle del Roncal, Villafranca del Castillo (Madrid)',
  cif: 'B44551539',
  razonSocial: 'GVB Gestión y Obras S.L.',
  marca: 'GVB GO',
  registro: 'Registro Mercantil de Madrid, tomo 44567, folio 1, hoja M-785071, inscripción 1.ª',
  dominio: 'gvbgo.com',
  actualizado: '24 de octubre de 2026',
};
