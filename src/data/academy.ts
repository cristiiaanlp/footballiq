import type { AcademyModule } from "@/types";

const opt = (id: string, text: string, correct: boolean, feedback: string) => ({
  id,
  text,
  correct,
  feedback,
});

/**
 * Módulos de la Academia. Cada lección lleva `frames` animados (posiciones de
 * jugadores) que el SceneView reproduce para *mostrar* el concepto en lugar de
 * describirlo. Cada módulo cierra con un `exam` (bucle aprende→practica→examina).
 */
export const ACADEMY: AcademyModule[] = [
  {
    slug: "pressing",
    title: "Pressing",
    concept: "Recuperar el balón con presión coordinada.",
    icon: "Zap",
    accent: "danger",
    premium: false,
    lessons: [
      {
        id: "press-arc",
        title: "Presión en arco",
        summary:
          "Presiona desde un ángulo para tapar un carril de pase y orientar el juego a un lado.",
        keyPoints: [
          "Aproxímate en curva, no en línea recta",
          "Usa el cuerpo para tapar el pase interior",
          "Presiona como unidad: el segundo presionador cubre el siguiente pase",
        ],
        xp: 30,
        frames: [
          {
            ball: { x: 50, y: 30 },
            players: [
              { pos: { x: 50, y: 30 }, number: 5, role: "DEF", team: "away" },
              { pos: { x: 30, y: 25 }, number: 4, role: "DEF", team: "away" },
              { pos: { x: 70, y: 25 }, number: 6, role: "DEF", team: "away" },
              { pos: { x: 50, y: 55 }, number: 9, role: "FWD", team: "home" },
              { pos: { x: 30, y: 50 }, number: 7, role: "FWD", team: "home" },
            ],
          },
          {
            ball: { x: 50, y: 30 },
            players: [
              { pos: { x: 50, y: 30 }, number: 5, role: "DEF", team: "away" },
              { pos: { x: 30, y: 25 }, number: 4, role: "DEF", team: "away" },
              { pos: { x: 70, y: 25 }, number: 6, role: "DEF", team: "away" },
              { pos: { x: 58, y: 42 }, number: 9, role: "FWD", team: "home" },
              { pos: { x: 38, y: 42 }, number: 7, role: "FWD", team: "home" },
            ],
          },
          {
            ball: { x: 70, y: 25 },
            players: [
              { pos: { x: 50, y: 30 }, number: 5, role: "DEF", team: "away" },
              { pos: { x: 30, y: 25 }, number: 4, role: "DEF", team: "away" },
              { pos: { x: 70, y: 25 }, number: 6, role: "DEF", team: "away" },
              { pos: { x: 60, y: 33 }, number: 9, role: "FWD", team: "home" },
              { pos: { x: 66, y: 30 }, number: 7, role: "FWD", team: "home" },
            ],
            highlights: [
              { pos: { x: 60, y: 18 }, w: 20, h: 18, color: "rgba(239,68,68,0.18)" },
            ],
          },
        ],
      },
    ],
    exam: [
      {
        id: "ex-press-1",
        prompt: "¿Por qué se presiona en curva y no de frente?",
        xp: 25,
        options: [
          opt("a", "Para tapar un carril de pase y orientar al rival a un lado", true,
            "La curva sombrea una opción y empuja el juego hacia donde el equipo está listo para robar."),
          opt("b", "Para llegar antes al balón", false,
            "La curva no es más rápida; su valor es tapar líneas, no la velocidad."),
          opt("c", "Para no cansarse tanto", false,
            "No tiene que ver con el esfuerzo, sino con orientar la presión."),
        ],
      },
      {
        id: "ex-press-2",
        prompt: "¿Qué hace que un pressing sea eficaz?",
        xp: 25,
        options: [
          opt("a", "La coordinación: presionar a la vez tapando opciones", true,
            "Sin sincronía, un solo pase supera la presión por muy intensa que sea."),
          opt("b", "Que el delantero corra solo lo máximo posible", false,
            "El esfuerzo aislado se supera fácil con un pase."),
          opt("c", "Hacer faltas constantes", false,
            "La falta es recurso puntual, no la base del pressing."),
        ],
      },
    ],
  },
  {
    slug: "transitions",
    title: "Transiciones",
    concept: "Los 5 segundos tras ganar o perder el balón deciden partidos.",
    icon: "Shuffle",
    accent: "gold",
    premium: false,
    lessons: [
      {
        id: "counter-press",
        title: "Contrapressing",
        summary:
          "Salta sobre el balón en el instante en que lo pierdes, con el rival descolocado.",
        keyPoints: [
          "Los 2-3 más cercanos colapsan sobre el balón al momento",
          "Los demás tapan los pases adelante",
          "Robas en 5 segundos o repliegas a tu forma",
        ],
        xp: 30,
        frames: [
          {
            ball: { x: 50, y: 45 },
            players: [
              { pos: { x: 50, y: 45 }, number: 6, role: "MID", team: "away" },
              { pos: { x: 45, y: 50 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 60, y: 52 }, number: 10, role: "MID", team: "home" },
              { pos: { x: 40, y: 38 }, number: 7, role: "FWD", team: "home" },
            ],
          },
          {
            ball: { x: 50, y: 45 },
            players: [
              { pos: { x: 50, y: 45 }, number: 6, role: "MID", team: "away" },
              { pos: { x: 47, y: 47 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 55, y: 48 }, number: 10, role: "MID", team: "home" },
              { pos: { x: 46, y: 41 }, number: 7, role: "FWD", team: "home" },
            ],
            highlights: [
              { pos: { x: 42, y: 38 }, w: 18, h: 16, color: "rgba(250,204,21,0.2)" },
            ],
          },
          {
            ball: { x: 48, y: 46 },
            players: [
              { pos: { x: 52, y: 47 }, number: 6, role: "MID", team: "away" },
              { pos: { x: 48, y: 46 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 54, y: 48 }, number: 10, role: "MID", team: "home" },
              { pos: { x: 47, y: 42 }, number: 7, role: "FWD", team: "home" },
            ],
          },
        ],
      },
    ],
    exam: [
      {
        id: "ex-trans-1",
        prompt: "Acabas de robar arriba y el rival está desorganizado. ¿Qué haces?",
        xp: 25,
        options: [
          opt("a", "El pase vertical más adelantado posible", true,
            "La velocidad gana a la posesión: ataca antes de que se recoloquen."),
          opt("b", "Reciclar en horizontal", false,
            "Das tiempo al rival a recuperar su forma."),
          opt("c", "Frenar y esperar apoyos", false,
            "Los huecos se cierran en segundos."),
        ],
      },
      {
        id: "ex-trans-2",
        prompt: "¿Qué es el contrapressing?",
        xp: 25,
        options: [
          opt("a", "Saltar a robar de inmediato al perder el balón", true,
            "Los más cercanos colapsan sobre el balón mientras el rival está descolocado."),
          opt("b", "Replegar todos al perder el balón", false,
            "Eso cede la iniciativa en vez de robar arriba."),
          opt("c", "Hacer falta siempre que pierdes", false,
            "La falta es recurso puntual, no el principio."),
        ],
      },
    ],
  },
  {
    slug: "width-depth",
    title: "Amplitud y profundidad",
    concept: "Estirar el campo para crear espacio entre defensas.",
    icon: "Maximize",
    accent: "sky",
    premium: false,
    lessons: [
      {
        id: "stretch",
        title: "Crear amplitud",
        summary:
          "Los extremos pegados a la banda separan a los defensas y abren los pasillos interiores.",
        keyPoints: [
          "La amplitud obliga a la defensa a elegir: abrirse o dejarse estirar",
          "La profundidad (un jugador a la espalda) frena a los defensas",
          "Combina ambas para abrir el espacio entre líneas",
        ],
        xp: 30,
        frames: [
          {
            players: [
              { pos: { x: 35, y: 45 }, number: 7, role: "FWD", team: "home" },
              { pos: { x: 65, y: 45 }, number: 11, role: "FWD", team: "home" },
              { pos: { x: 40, y: 40 }, number: 4, role: "DEF", team: "away" },
              { pos: { x: 60, y: 40 }, number: 5, role: "DEF", team: "away" },
            ],
          },
          {
            players: [
              { pos: { x: 14, y: 45 }, number: 7, role: "FWD", team: "home" },
              { pos: { x: 86, y: 45 }, number: 11, role: "FWD", team: "home" },
              { pos: { x: 30, y: 40 }, number: 4, role: "DEF", team: "away" },
              { pos: { x: 70, y: 40 }, number: 5, role: "DEF", team: "away" },
            ],
            highlights: [
              { pos: { x: 38, y: 30 }, w: 24, h: 22, color: "rgba(59,130,246,0.18)" },
            ],
          },
        ],
      },
    ],
    exam: [
      {
        id: "ex-width-1",
        prompt: "¿Qué consigue tener extremos muy abiertos?",
        xp: 25,
        options: [
          opt("a", "Estirar a la defensa y abrir los pasillos interiores", true,
            "La amplitud separa a los defensas y libera el centro y los medio-espacios."),
          opt("b", "Acercar a los extremos para centrar", false,
            "No abren para centrar, sino para generar espacio."),
          opt("c", "Perder tiempo", false,
            "No tiene que ver con el reloj sino con la estructura."),
        ],
      },
      {
        id: "ex-width-2",
        prompt: "¿Para qué sirve un jugador atacando la profundidad?",
        xp: 25,
        options: [
          opt("a", "Frena a los centrales y abre el espacio entre líneas", true,
            "La amenaza a la espalda impide que la defensa dé un paso adelante."),
          opt("b", "Solo sirve si recibe el balón", false,
            "Aunque no reciba, su movimiento condiciona y abre espacio."),
          opt("c", "Atrae a los extremos rivales", false,
            "Afecta sobre todo a los centrales."),
        ],
      },
    ],
  },
  {
    slug: "third-man",
    title: "El tercer hombre",
    concept: "Usar una pared para liberar a un jugador escondido.",
    icon: "Spline",
    accent: "pitch",
    premium: true,
    lessons: [
      {
        id: "third-man-run",
        title: "Combinación del tercer hombre",
        summary:
          "Un pase al jugador B prepara una descarga de primeras para C, al que la defensa no vigilaba.",
        keyPoints: [
          "El jugador A pasa a B (el enlace)",
          "B descarga de primeras para C",
          "C llega desde atrás al espacio que la defensa ignoró",
        ],
        xp: 40,
        frames: [
          {
            ball: { x: 30, y: 60 },
            players: [
              { pos: { x: 30, y: 60 }, number: 6, role: "MID", team: "home" },
              { pos: { x: 50, y: 45 }, number: 9, role: "FWD", team: "home" },
              { pos: { x: 70, y: 65 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 50, y: 38 }, number: 5, role: "DEF", team: "away" },
            ],
          },
          {
            ball: { x: 50, y: 45 },
            players: [
              { pos: { x: 32, y: 58 }, number: 6, role: "MID", team: "home" },
              { pos: { x: 50, y: 45 }, number: 9, role: "FWD", team: "home" },
              { pos: { x: 64, y: 52 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 50, y: 40 }, number: 5, role: "DEF", team: "away" },
            ],
          },
          {
            ball: { x: 62, y: 35 },
            players: [
              { pos: { x: 34, y: 56 }, number: 6, role: "MID", team: "home" },
              { pos: { x: 50, y: 46 }, number: 9, role: "FWD", team: "home" },
              { pos: { x: 62, y: 35 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 50, y: 42 }, number: 5, role: "DEF", team: "away" },
            ],
            highlights: [
              { pos: { x: 56, y: 24 }, w: 18, h: 16, color: "rgba(34,197,94,0.2)" },
            ],
          },
        ],
      },
    ],
    exam: [
      {
        id: "ex-third-1",
        prompt: "En la combinación del tercer hombre, ¿quién recibe en el espacio?",
        xp: 30,
        options: [
          opt("a", "El tercer jugador (C), que llega desde atrás sin marca", true,
            "B descarga de primeras y C aparece en el espacio que nadie vigilaba."),
          opt("b", "El primer pasador (A)", false,
            "A inicia la jugada, no es quien remata el espacio."),
          opt("c", "El enlace (B), que se gira con el balón", false,
            "B es el punto de apoyo que descarga, no quien ataca el espacio."),
        ],
      },
    ],
  },
  {
    slug: "superiorities",
    title: "Superioridades",
    concept: "Ventajas numéricas, posicionales y cualitativas.",
    icon: "Layers",
    accent: "gold",
    premium: true,
    lessons: [
      {
        id: "overload",
        title: "Crear y explotar sobrecargas",
        summary:
          "Sobrecarga un lado para atraer defensas y explota el lado débil aislado.",
        keyPoints: [
          "Numérica: más jugadores que defensas en una zona",
          "Sobrecarga un lado, finaliza por el otro",
          "El hombre libre se crea dos pases antes de que reciba",
        ],
        xp: 40,
        frames: [
          {
            ball: { x: 28, y: 55 },
            players: [
              { pos: { x: 28, y: 55 }, number: 6, role: "MID", team: "home" },
              { pos: { x: 20, y: 45 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 35, y: 40 }, number: 7, role: "FWD", team: "home" },
              { pos: { x: 80, y: 45 }, number: 11, role: "FWD", team: "home" },
              { pos: { x: 26, y: 48 }, number: 4, role: "DEF", team: "away" },
              { pos: { x: 36, y: 44 }, number: 5, role: "DEF", team: "away" },
              { pos: { x: 60, y: 44 }, number: 6, role: "DEF", team: "away" },
            ],
          },
          {
            ball: { x: 80, y: 45 },
            players: [
              { pos: { x: 28, y: 55 }, number: 6, role: "MID", team: "home" },
              { pos: { x: 20, y: 45 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 35, y: 40 }, number: 7, role: "FWD", team: "home" },
              { pos: { x: 80, y: 45 }, number: 11, role: "FWD", team: "home" },
              { pos: { x: 30, y: 48 }, number: 4, role: "DEF", team: "away" },
              { pos: { x: 40, y: 44 }, number: 5, role: "DEF", team: "away" },
              { pos: { x: 64, y: 44 }, number: 6, role: "DEF", team: "away" },
            ],
            highlights: [
              { pos: { x: 74, y: 30 }, w: 22, h: 22, color: "rgba(250,204,21,0.2)" },
            ],
          },
        ],
      },
    ],
    exam: [
      {
        id: "ex-super-1",
        prompt: "¿Para qué sirve sobrecargar un lado del campo?",
        xp: 30,
        options: [
          opt("a", "Atraer defensas a un lado para finalizar por el otro", true,
            "Sobrecargas para fijar al rival y rematar en el lado débil liberado."),
          opt("b", "Tener a todos juntos para combinar siempre ahí", false,
            "Insistir donde están todos anula la ventaja creada."),
          opt("c", "Defender mejor", false,
            "La sobrecarga es un recurso ofensivo, no defensivo."),
        ],
      },
    ],
  },
  {
    slug: "blocks",
    title: "Bloque alto y bloque bajo",
    concept: "Dónde defiendes define todo el partido.",
    icon: "Shield",
    accent: "sky",
    premium: true,
    lessons: [
      {
        id: "block-height",
        title: "Elegir la altura del bloque",
        summary:
          "El bloque alto asfixia la salida; el bloque bajo protege la portería y contraataca.",
        keyPoints: [
          "Bloque alto: robas cerca de su área, gran riesgo a la espalda",
          "Bloque bajo: compacto, seguro, invita presión para contraatacar",
          "Bloque medio: equilibrio, controlas el espacio ante tu defensa",
        ],
        xp: 40,
        frames: [
          {
            players: [
              { pos: { x: 30, y: 35 }, number: 4, role: "DEF", team: "home" },
              { pos: { x: 50, y: 33 }, number: 5, role: "DEF", team: "home" },
              { pos: { x: 70, y: 35 }, number: 6, role: "DEF", team: "home" },
              { pos: { x: 40, y: 28 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 60, y: 28 }, number: 7, role: "MID", team: "home" },
            ],
            highlights: [
              { pos: { x: 6, y: 6 }, w: 88, h: 32, color: "rgba(239,68,68,0.12)" },
            ],
          },
          {
            players: [
              { pos: { x: 30, y: 78 }, number: 4, role: "DEF", team: "home" },
              { pos: { x: 50, y: 80 }, number: 5, role: "DEF", team: "home" },
              { pos: { x: 70, y: 78 }, number: 6, role: "DEF", team: "home" },
              { pos: { x: 40, y: 68 }, number: 8, role: "MID", team: "home" },
              { pos: { x: 60, y: 68 }, number: 7, role: "MID", team: "home" },
            ],
            highlights: [
              { pos: { x: 6, y: 62 }, w: 88, h: 32, color: "rgba(59,130,246,0.14)" },
            ],
          },
        ],
      },
    ],
    exam: [
      {
        id: "ex-block-1",
        prompt: "¿Cuándo conviene un bloque bajo?",
        xp: 30,
        options: [
          opt("a", "Ante un rival superior, para proteger la portería y salir al contra", true,
            "Reduce el espacio cerca de tu área y abre la vía del contraataque."),
          opt("b", "Siempre, por ser lo más seguro", false,
            "Invita presión constante; no siempre es lo óptimo."),
          opt("c", "Cuando dominas claramente", false,
            "Si dominas, suele convenir presionar alto."),
        ],
      },
      {
        id: "ex-block-2",
        prompt: "¿Cuál es el principal riesgo del bloque alto?",
        xp: 30,
        options: [
          opt("a", "El espacio a la espalda de la defensa", true,
            "Defender arriba deja mucho campo libre por detrás de la última línea."),
          opt("b", "Que te marquen muchos córners", false,
            "No es la consecuencia táctica principal del bloque alto."),
          opt("c", "Cansar al portero", false,
            "El riesgo es el espacio a la espalda, no el desgaste del GK."),
        ],
      },
    ],
  },
];

export const ACADEMY_MAP = Object.fromEntries(
  ACADEMY.map((m) => [m.slug, m])
) as Record<string, AcademyModule>;
