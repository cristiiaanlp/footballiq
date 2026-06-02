import type { Scenario, PlayerRole } from "@/types";

// Helpers compactos
const pl = (x: number, y: number, number: number, role: PlayerRole, team: "home" | "away") => ({
  pos: { x, y },
  number,
  role,
  team,
});
const opt = (id: string, text: string, correct: boolean, feedback: string) => ({
  id,
  text,
  correct,
  feedback,
});

/**
 * Escenarios de partido: una foto táctica + una decisión.
 * Coordenadas: home ataca hacia arriba (y pequeña = portería rival).
 */
export const SCENARIOS: Scenario[] = [
  {
    id: "s-overlap",
    title: "La superposición",
    situation:
      "Tienes el balón en banda derecha (#7). Tu lateral (#2) sube por fuera y el medio-espacio interior está libre.",
    scene: {
      ball: { x: 80, y: 40 },
      players: [
        pl(80, 40, 7, "FWD", "home"),
        pl(90, 28, 2, "DEF", "home"),
        pl(60, 38, 10, "MID", "home"),
        pl(50, 22, 9, "FWD", "home"),
        pl(78, 30, 3, "DEF", "away"),
        pl(62, 26, 4, "DEF", "away"),
        pl(50, 18, 5, "DEF", "away"),
      ],
      highlights: [{ pos: { x: 64, y: 28 }, w: 14, h: 14, color: "rgba(250,204,21,0.18)" }],
    },
    question: "¿Cuál es la decisión de mayor valor?",
    options: [
      opt("a", "Soltar a #2 en la superposición para fijar al defensa y atacar el medio-espacio", true,
        "La superposición fija al lateral en la banda y libera el carril interior para el centro atrás o tu propia llegada."),
      opt("b", "Centrar de primeras al área", false,
        "Centrar ahora es a un área cerrada y en inferioridad: baja probabilidad. Desorganízalos primero."),
      opt("c", "Pasar atrás a #10 y empezar de nuevo", false,
        "Reciclar desaprovecha un 3 contra 3 en banda que ahora mismo te favorece."),
    ],
    xp: 25,
  },
  {
    id: "s-switch",
    title: "Cambiar la orientación",
    situation:
      "El rival ha desplazado todo el bloque a tu izquierda. Tú (#6) acabas de recibir en el centro del campo.",
    scene: {
      ball: { x: 45, y: 58 },
      players: [
        pl(45, 58, 6, "MID", "home"),
        pl(20, 45, 8, "MID", "home"),
        pl(85, 40, 11, "FWD", "home"),
        pl(30, 38, 9, "FWD", "home"),
        pl(25, 50, 4, "DEF", "away"),
        pl(35, 44, 5, "MID", "away"),
        pl(45, 48, 6, "MID", "away"),
        pl(30, 56, 8, "MID", "away"),
      ],
      highlights: [{ pos: { x: 72, y: 30 }, w: 22, h: 20, color: "rgba(34,197,94,0.16)" }],
    },
    question: "¿A dónde debe ir el balón?",
    options: [
      opt("a", "Cambio largo a #11, solo en la banda contraria", true,
        "El rival está volcado al lado del balón. El cambio encuentra a #11 aislado y con espacio para atacar."),
      opt("b", "Forzar un pase en la izquierda saturada", false,
        "Ese lado está lleno; jugar ahí arriesga la pérdida en zona central."),
      opt("c", "Conducir hacia los tres rivales", false,
        "Meterte en la aglomeración es justo lo que la defensa quiere."),
    ],
    xp: 25,
  },
  {
    id: "s-lowblock",
    title: "Romper el bloque bajo",
    situation:
      "El rival defiende muy junto y replegado. Tienes mucha posesión pero no hay espacio entre líneas.",
    scene: {
      ball: { x: 50, y: 60 },
      players: [
        pl(50, 60, 6, "MID", "home"),
        pl(25, 50, 8, "MID", "home"),
        pl(75, 50, 10, "MID", "home"),
        pl(50, 30, 9, "FWD", "home"),
        pl(35, 40, 4, "DEF", "away"),
        pl(50, 38, 5, "DEF", "away"),
        pl(65, 40, 6, "DEF", "away"),
        pl(42, 44, 7, "MID", "away"),
        pl(58, 44, 8, "MID", "away"),
      ],
      highlights: [
        { pos: { x: 6, y: 18 }, w: 16, h: 26, color: "rgba(59,130,246,0.16)" },
        { pos: { x: 78, y: 18 }, w: 16, h: 26, color: "rgba(59,130,246,0.16)" },
      ],
    },
    question: "¿Cómo creas un hueco?",
    options: [
      opt("a", "Mover el balón rápido de lado a lado para arrastrar el bloque y abrir una grieta", true,
        "La circulación rápida desplaza un bloque compacto; en cuanto bascula, se abre un pasillo vertical entre defensas."),
      opt("b", "Disparar de lejos a la primera", false,
        "Un disparo lejano es válido a veces, pero no es la forma fiable de romper un bloque bajo."),
      opt("c", "Meter a todos en el área y centrar sin parar", false,
        "Centrar a un área llena y replegada juega a favor de los defensas."),
    ],
    xp: 30,
  },
  {
    id: "s-2v1",
    title: "El 2 contra 1",
    situation:
      "Sales al contra a toda velocidad. Sois tú (#9) y un compañero (#11) contra un único defensa que repliega (#5).",
    scene: {
      ball: { x: 45, y: 45 },
      players: [
        pl(45, 45, 9, "FWD", "home"),
        pl(70, 42, 11, "FWD", "home"),
        pl(56, 32, 5, "DEF", "away"),
        pl(50, 14, 1, "GK", "away"),
      ],
      highlights: [{ pos: { x: 64, y: 18 }, w: 16, h: 18, color: "rgba(34,197,94,0.18)" }],
    },
    question: "¿Cuál es la jugada de manual?",
    options: [
      opt("a", "Conducir hacia el defensa para fijarlo y soltar a #11 a la espalda", true,
        "Fijar al único defensa le obliga a decidir. Cuando va a por ti, el pase libera a #11 solo ante el portero."),
      opt("b", "Pasar a #11 de inmediato desde lejos", false,
        "Pasar pronto deja que el defensa se deslice y cubra a #11."),
      opt("c", "Disparar de primeras desde lejos", false,
        "Con un 2 contra 1 tienes ventaja enorme; el disparo lejano la tira."),
    ],
    xp: 25,
  },
  {
    id: "s-press-trap",
    title: "La trampa de presión",
    situation:
      "El lateral rival recibe cerca de su propia banda. Tu equipo está preparado para atrapar.",
    scene: {
      ball: { x: 14, y: 55 },
      players: [
        pl(14, 50, 3, "DEF", "away"),
        pl(22, 60, 7, "FWD", "home"),
        pl(30, 48, 8, "MID", "home"),
        pl(14, 38, 6, "MID", "home"),
        pl(28, 66, 2, "DEF", "home"),
      ],
      highlights: [{ pos: { x: 2, y: 40 }, w: 26, h: 30, color: "rgba(239,68,68,0.16)" }],
    },
    question: "¿Cuál es el gatillo para tu equipo?",
    options: [
      opt("a", "Cerrar la trampa: presionar el balón y tapar las opciones cortas para robar en el córner", true,
        "La banda es un defensor. Con los carriles cerrados, el lateral atrapado no tiene salida: salta y roba arriba."),
      opt("b", "Dejarle salir jugando", false,
        "Has montado la trampa; echarte atrás desperdicia todo el planteamiento."),
      opt("c", "Que solo presione el delantero y el resto aguante", false,
        "Una presión en solitario se supera con un pase; la trampa necesita cerrar los carriles."),
    ],
    xp: 30,
  },
  {
    id: "s-third-man",
    title: "El tercer hombre",
    situation:
      "Tú (#6) tienes el balón. #9 baja a recibir de espaldas y #8 llega desde atrás sin que nadie lo vigile.",
    scene: {
      ball: { x: 35, y: 60 },
      players: [
        pl(35, 60, 6, "MID", "home"),
        pl(50, 46, 9, "FWD", "home"),
        pl(68, 56, 8, "MID", "home"),
        pl(50, 40, 5, "DEF", "away"),
        pl(40, 50, 4, "DEF", "away"),
      ],
      highlights: [{ pos: { x: 58, y: 30 }, w: 18, h: 16, color: "rgba(34,197,94,0.2)" }],
    },
    question: "¿Cuál es la combinación correcta?",
    options: [
      opt("a", "Pase a #9 que descarga de primeras para #8, que llega lanzado", true,
        "El tercer hombre: tú pasas al apoyo (#9), él deja para #8, que aparece desde atrás en el espacio que nadie vigilaba."),
      opt("b", "Pase largo directo a la espalda sin apoyo", false,
        "Sin el punto de apoyo intermedio, el largo es fácil de leer para los centrales."),
      opt("c", "Conducir tú solo hacia los dos defensas", false,
        "Conducir contra dos rivales desaprovecha el desmarque de #8."),
    ],
    xp: 30,
  },
  {
    id: "s-keeper-press",
    title: "Salida bajo presión",
    situation:
      "Tu portero (#1) tiene el balón. El delantero rival (#9) presiona en arco tapando al central derecho. Tu pivote (#6) baja a la zona.",
    scene: {
      ball: { x: 50, y: 88 },
      players: [
        pl(50, 88, 1, "GK", "home"),
        pl(30, 80, 4, "DEF", "home"),
        pl(70, 80, 5, "DEF", "home"),
        pl(50, 72, 6, "MID", "home"),
        pl(58, 82, 9, "FWD", "away"),
      ],
      highlights: [{ pos: { x: 18, y: 66 }, w: 24, h: 22, color: "rgba(34,197,94,0.16)" }],
    },
    question: "¿Cuál es el pase más seguro y útil?",
    options: [
      opt("a", "Al central izquierdo (#4), libre porque la presión tapa el otro lado", true,
        "La presión en arco del #9 orienta el juego: deja libre al central del lado contrario, que recibe de cara para progresar."),
      opt("b", "Forzar al central derecho que está presionado", false,
        "Es justo el lado que el delantero quiere que uses para robar."),
      opt("c", "Balón largo directo bajo presión", false,
        "Tienes un hombre libre claro; el largo regala la posesión sin necesidad."),
    ],
    xp: 25,
  },
  {
    id: "s-cross-defend",
    title: "Defender el centro",
    situation:
      "Llega un centro desde la derecha rival. Eres el central (#5). Hay un delantero en el primer palo y otro esperando atrás.",
    scene: {
      ball: { x: 82, y: 18 },
      players: [
        pl(82, 18, 7, "FWD", "away"),
        pl(45, 14, 9, "FWD", "away"),
        pl(55, 24, 10, "FWD", "away"),
        pl(48, 18, 5, "DEF", "home"),
        pl(60, 16, 4, "DEF", "home"),
        pl(50, 8, 1, "GK", "home"),
      ],
      highlights: [{ pos: { x: 40, y: 18 }, w: 24, h: 14, color: "rgba(239,68,68,0.14)" }],
    },
    question: "¿Cómo te orientas para defender el área?",
    options: [
      opt("a", "De perfil, viendo balón y delantero, listo para atacar el centro o seguir al de atrás", true,
        "El perfil abierto te deja reaccionar a la trayectoria del centro y al desmarque del segundo atacante sin perder de vista a ninguno."),
      opt("b", "De espaldas al balón, fijo en tu par", false,
        "Sin ver el balón no puedes anticipar el centro ni el rechace."),
      opt("c", "Mirando solo el balón en el aire", false,
        "Mirando solo el balón pierdes al atacante que llega a tu espalda."),
    ],
    xp: 25,
  },
  {
    id: "s-counterpress",
    title: "Robar tras perder",
    situation:
      "Acabas de perder el balón en campo rival. El rival (#6) lo controla pero está rodeado y aún de espaldas. Tienes 3 jugadores cerca.",
    scene: {
      ball: { x: 50, y: 45 },
      players: [
        pl(50, 45, 6, "MID", "away"),
        pl(45, 50, 8, "MID", "home"),
        pl(60, 48, 10, "MID", "home"),
        pl(48, 38, 7, "FWD", "home"),
      ],
      highlights: [{ pos: { x: 42, y: 38 }, w: 18, h: 16, color: "rgba(250,204,21,0.2)" }],
    },
    question: "¿Qué hace tu equipo en los primeros segundos?",
    options: [
      opt("a", "Contrapressing: los 3 cercanos saltan a la vez al balón tapando salidas", true,
        "Mientras el rival está descolocado y de espaldas, colapsar sobre el balón con los más próximos es la mejor opción de robo inmediato."),
      opt("b", "Replegar todos rápido a tu campo", false,
        "Bajar regala la iniciativa y desaprovecha que el rival aún no está organizado."),
      opt("c", "Esperar a ver qué hace el rival", false,
        "Esperar le da el segundo que necesita para girarse y salir jugando."),
    ],
    xp: 30,
  },
  {
    id: "s-overload-far",
    title: "Sobrecarga y lado débil",
    situation:
      "Has acumulado jugadores en la izquierda y arrastrado al rival. #11 está solo en la banda derecha (lado débil).",
    scene: {
      ball: { x: 28, y: 55 },
      players: [
        pl(28, 55, 6, "MID", "home"),
        pl(20, 45, 8, "MID", "home"),
        pl(35, 40, 7, "FWD", "home"),
        pl(82, 42, 11, "FWD", "home"),
        pl(26, 48, 4, "DEF", "away"),
        pl(36, 44, 5, "DEF", "away"),
        pl(58, 44, 6, "DEF", "away"),
      ],
      highlights: [{ pos: { x: 74, y: 30 }, w: 22, h: 22, color: "rgba(250,204,21,0.2)" }],
    },
    question: "¿Cómo aprovechas la sobrecarga que has creado?",
    options: [
      opt("a", "Cambiar al lado débil para que #11 ataque en superioridad", true,
        "La sobrecarga sirve para atraer al rival a un lado y rematar por el otro: el cambio libera a #11 contra un solo defensa."),
      opt("b", "Seguir combinando en la izquierda saturada", false,
        "Insistir donde están todos anula la ventaja que acabas de generar."),
      opt("c", "Pasar atrás y reiniciar", false,
        "Reiniciar deja que el rival recupere su forma equilibrada."),
    ],
    xp: 30,
  },
  {
    id: "s-fullback-step",
    title: "Salir o aguantar",
    situation:
      "El extremo rival (#7) recibe en banda con espacio. Eres el lateral (#3). Tu central (#5) está colocado para cubrir.",
    scene: {
      ball: { x: 85, y: 45 },
      players: [
        pl(85, 45, 7, "FWD", "away"),
        pl(80, 52, 3, "DEF", "home"),
        pl(62, 55, 5, "DEF", "home"),
        pl(70, 40, 11, "FWD", "away"),
      ],
      highlights: [{ pos: { x: 70, y: 50 }, w: 16, h: 16, color: "rgba(59,130,246,0.16)" }],
    },
    question: "¿Qué haces como lateral?",
    options: [
      opt("a", "Salir a contener orientándolo a la banda, con el central cubriendo por dentro", true,
        "Sales a contener pero orientas al extremo hacia la línea (un defensor más), mientras tu central tapa el pase interior."),
      opt("b", "Lanzarte a robar de inmediato", false,
        "Si te lanzas y te regatea, dejas un hueco enorme a tu espalda."),
      opt("c", "Replegar hasta el área sin presionar", false,
        "Darle todo el espacio le permite centrar o conducir con comodidad."),
    ],
    xp: 25,
  },
  {
    id: "s-diagonal-run",
    title: "El desmarque de ruptura",
    situation:
      "Tú (#10) tienes el balón de cara entre líneas. #9 prepara un desmarque y la defensa rival está en línea alta.",
    scene: {
      ball: { x: 50, y: 48 },
      players: [
        pl(50, 48, 10, "MID", "home"),
        pl(58, 42, 9, "FWD", "home"),
        pl(35, 38, 4, "DEF", "away"),
        pl(52, 36, 5, "DEF", "away"),
        pl(68, 38, 6, "DEF", "away"),
      ],
      highlights: [{ pos: { x: 56, y: 18 }, w: 18, h: 16, color: "rgba(34,197,94,0.2)" }],
    },
    question: "¿Qué tipo de pase y desmarque buscas?",
    options: [
      opt("a", "Desmarque diagonal de #9 a la espalda y pase al hueco entre central y lateral", true,
        "El desmarque diagonal ataca el punto ciego entre dos defensas y evita el fuera de juego al cruzar la línea desde fuera hacia dentro."),
      opt("b", "Pase al pie de #9 con la defensa tan alta", false,
        "Con línea alta y #9 de cara, desperdicias el espacio enorme a la espalda."),
      opt("c", "Disparo inmediato desde donde estás", false,
        "Tienes una ruptura a la espalda mucho más peligrosa que el disparo lejano."),
    ],
    xp: 30,
  },
  {
    id: "s-keep-or-go",
    title: "Conservar o arriesgar",
    situation:
      "Ganas 1-0 a falta de poco. Recuperas en tu campo. Hay opción de contra pero también de mantener el balón con seguridad.",
    scene: {
      ball: { x: 40, y: 65 },
      players: [
        pl(40, 65, 6, "MID", "home"),
        pl(25, 60, 8, "MID", "home"),
        pl(75, 45, 11, "FWD", "home"),
        pl(45, 50, 6, "MID", "away"),
        pl(55, 55, 8, "MID", "away"),
      ],
      highlights: [{ pos: { x: 20, y: 55 }, w: 18, h: 16, color: "rgba(34,197,94,0.14)" }],
    },
    question: "¿Cuál es la decisión más inteligente para el contexto?",
    options: [
      opt("a", "Conservar con un apoyo seguro y consumir reloj sin riesgo", true,
        "Ganando y con poco tiempo, mantener la posesión lejos de tu área reduce el riesgo y desgasta el reloj: gestión del partido."),
      opt("b", "Lanzar un contra arriesgado de inmediato", false,
        "Un contra forzado ganando 1-0 puede acabar en pérdida y transición rival peligrosa."),
      opt("c", "Despejar el balón a cualquier parte", false,
        "Despejar regala la posesión y te obliga a defender otra vez enseguida."),
    ],
    xp: 25,
  },
  {
    id: "s-numerical-build",
    title: "Superar la primera presión",
    situation:
      "Sales jugando. Dos delanteros rivales presionan a tus dos centrales. Tu pivote (#6) puede bajar.",
    scene: {
      ball: { x: 35, y: 80 },
      players: [
        pl(35, 80, 4, "DEF", "home"),
        pl(65, 80, 5, "DEF", "home"),
        pl(50, 74, 6, "MID", "home"),
        pl(42, 70, 9, "FWD", "away"),
        pl(58, 70, 11, "FWD", "away"),
      ],
      highlights: [{ pos: { x: 38, y: 66 }, w: 24, h: 18, color: "rgba(34,197,94,0.16)" }],
    },
    question: "¿Cómo generas superioridad para salir?",
    options: [
      opt("a", "El pivote baja entre los centrales para formar un 3 contra 2", true,
        "Al bajar el #6 entre centrales creas un 3 contra 2 ante los dos delanteros: aparece el hombre libre para progresar."),
      opt("b", "Los dos centrales se juntan en el centro", false,
        "Juntarse facilita que dos delanteros tapen a los dos a la vez."),
      opt("c", "Pase largo a presión sobre el delantero", false,
        "El largo evita resolver la presión en vez de superarla jugando."),
    ],
    xp: 30,
  },
  {
    id: "s-wide-overload",
    title: "El 3 contra 2 en banda",
    situation:
      "En banda derecha tienes a #7, #2 y #8 contra el lateral (#3) y un mediocentro (#6) rivales.",
    scene: {
      ball: { x: 78, y: 50 },
      players: [
        pl(78, 50, 7, "FWD", "home"),
        pl(88, 38, 2, "DEF", "home"),
        pl(64, 46, 8, "MID", "home"),
        pl(80, 42, 3, "DEF", "away"),
        pl(68, 40, 6, "MID", "away"),
      ],
      highlights: [{ pos: { x: 82, y: 26 }, w: 16, h: 18, color: "rgba(34,197,94,0.18)" }],
    },
    question: "¿Cómo resuelves la superioridad en banda?",
    options: [
      opt("a", "Fijar a los dos rivales con #7 y #8 y soltar a #2 por fuera a la espalda", true,
        "En un 3 contra 2, fijas a los dos defensores con dos jugadores y el tercero (#2) ataca el espacio libre por fuera."),
      opt("b", "Que #7 intente regatear a los dos", false,
        "Forzar el regate al 1 contra 2 desaprovecha la superioridad numérica."),
      opt("c", "Centrar de primeras sin fijar", false,
        "Centrar sin fijar deja a los defensas cómodos para despejar."),
    ],
    xp: 30,
  },
];
