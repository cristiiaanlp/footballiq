import type { Quiz, QuizCategory } from "@/types";

export const QUIZ_CATEGORIES: {
  id: QuizCategory;
  label: string;
  icon: string;
  accent: "pitch" | "sky" | "gold" | "danger";
}[] = [
  { id: "pressing", label: "Pressing", icon: "Zap", accent: "danger" },
  { id: "possession", label: "Posesión", icon: "Repeat", accent: "pitch" },
  { id: "spaces", label: "Espacios", icon: "Maximize", accent: "sky" },
  { id: "covering", label: "Coberturas", icon: "Shield", accent: "sky" },
  { id: "passing-lines", label: "Líneas de pase", icon: "Spline", accent: "gold" },
  { id: "build-up", label: "Salida de balón", icon: "ArrowUpFromLine", accent: "pitch" },
  { id: "defending", label: "Defensa", icon: "ShieldCheck", accent: "danger" },
  { id: "transitions", label: "Transiciones", icon: "Shuffle", accent: "gold" },
];

// Helper compacto para declarar opciones: [texto, correcta, feedback]
const opt = (id: string, text: string, correct: boolean, feedback: string) => ({
  id,
  text,
  correct,
  feedback,
});

export const QUIZZES: Quiz[] = [
  // ── PRESSING ──────────────────────────────────────────────────
  {
    id: "q-press-1",
    category: "pressing",
    difficulty: 2,
    prompt:
      "El central rival recibe el balón sin presión. Tu delantero es el más cercano. ¿Cuál es el gatillo de presión correcto?",
    options: [
      opt("a", "Ir directo y de frente a por el balón", false,
        "De frente le dejas pasar a cualquier lado y rompes la línea sin cobertura detrás."),
      opt("b", "Presionar en curva para tapar el pase a un lado", true,
        "La presión en arco tapa un carril de pase y orienta el juego al lado donde tu equipo está preparado para robar."),
      opt("c", "Quedarse y esperar a que él venga", false,
        "Esperar pasivo le regala la iniciativa a un central libre."),
    ],
    xp: 20,
  },
  {
    id: "q-press-2",
    category: "pressing",
    difficulty: 3,
    prompt:
      "Presionas alto pero el rival juega un balón largo por encima. ¿Cuál es la primera responsabilidad de la línea defensiva?",
    options: [
      opt("a", "Aguantar la línea y dar el fuera de juego", false,
        "Subir a ciegas ante un balón largo es altísimo riesgo: un mal tiempo y es ocasión clara."),
      opt("b", "Caer juntos para proteger la espalda; el portero barre", true,
        "Al presionar alto, defensa y portero deben defender el espacio a la espalda como unidad; el GK actúa de líbero."),
      opt("c", "Cada defensa marca a un hombre y le sigue", false,
        "El marcaje puro ante el balón largo separa la línea y abre huecos."),
    ],
    xp: 25,
  },
  {
    id: "q-press-3",
    category: "pressing",
    difficulty: 2,
    prompt:
      "¿Qué situación es el mejor gatillo para activar una presión colectiva?",
    options: [
      opt("a", "Un pase hacia atrás o un mal control del rival", true,
        "Un pase atrás o un control orientado hacia su propia portería es el momento ideal: el rival está de espaldas y sin opciones cómodas."),
      opt("b", "Cuando el rival tiene el balón controlado de cara", false,
        "De cara y con opciones, presionar es arriesgado y fácil de superar."),
      opt("c", "Justo después de que tu equipo pierda la pelota lejos", false,
        "Si está lejos y desorganizado, mejor recolocarse antes de presionar."),
    ],
    xp: 20,
  },
  {
    id: "q-press-4",
    category: "pressing",
    difficulty: 1,
    prompt:
      "En un pressing hombre a hombre arriba, ¿qué jugador suele quedar como referencia libre del rival?",
    options: [
      opt("a", "El portero rival", true,
        "Al emparejar a todos, el portero queda como hombre libre; por eso muchos equipos incluyen presionar o tapar al GK en el plan."),
      opt("b", "El delantero centro rival", false,
        "Al delantero lo marca un central; no suele quedar libre."),
      opt("c", "El lateral rival", false,
        "Los laterales se emparejan con extremos o carrileros."),
    ],
    xp: 15,
  },
  {
    id: "q-press-5",
    category: "pressing",
    difficulty: 3,
    prompt:
      "Tu equipo presiona pero un mediocentro rival siempre recibe libre entre líneas. ¿Cómo lo solucionas sin romper el bloque?",
    options: [
      opt("a", "Que un mediocentro tuyo le siga al marcaje y deje su zona", false,
        "Seguirle a todas partes abre justo la zona que él libera; te desorganiza."),
      opt("b", "Usar la sombra del delantero para tapar ese pase al presionar", true,
        "Presionar con 'cover shadow': el delantero presiona al central tapando con su cuerpo el pase interior al mediocentro."),
      opt("c", "Bajar todo el equipo 20 metros", false,
        "Renuncias a la presión alta por completo en vez de ajustarla."),
    ],
    xp: 30,
  },
  {
    id: "q-press-6",
    category: "pressing",
    difficulty: 2,
    prompt:
      "¿Qué define la 'intensidad' efectiva de una presión, más allá de correr mucho?",
    options: [
      opt("a", "La coordinación: presionar todos a la vez y tapando opciones", true,
        "Correr aislado no sirve. La presión es eficaz cuando es sincronizada y cada jugador cierra una línea de pase."),
      opt("b", "Que el delantero corra lo máximo posible", false,
        "Un esfuerzo individual sin apoyos se supera con un solo pase."),
      opt("c", "Hacer faltas tácticas constantes", false,
        "La falta es recurso puntual, no la base de un buen pressing."),
    ],
    xp: 20,
  },

  // ── POSESIÓN ──────────────────────────────────────────────────
  {
    id: "q-poss-1",
    category: "possession",
    difficulty: 1,
    prompt:
      "Quieres mantener la posesión ante una presión agresiva. ¿Qué principio posicional ayuda más?",
    options: [
      opt("a", "Que todos bajen a pedir el balón al pie", false,
        "Si todos vienen cortos quitas profundidad y la presión te aprieta en una zona pequeña."),
      opt("b", "Crear triángulos para que el poseedor tenga 2+ opciones", true,
        "Los triángulos garantizan ángulos de pase; con 2+ opciones el presionador nunca cubre ambas líneas."),
      opt("c", "Jugar siempre en largo para aliviar", false,
        "El largo continuo regala el balón: aquí el objetivo es conservarlo."),
    ],
    xp: 15,
  },
  {
    id: "q-poss-2",
    category: "possession",
    difficulty: 2,
    prompt:
      "¿Para qué sirve realmente tener la posesión del balón a nivel táctico?",
    options: [
      opt("a", "Para acumular pases y estadísticas bonitas", false,
        "Posesión sin intención no genera nada; el pase por el pase no rompe defensas."),
      opt("b", "Para mover al rival, fijarlo y abrir espacios donde atacar", true,
        "La posesión es una herramienta: desplaza al rival, lo fija a un lado y abre el espacio en el otro o entre líneas."),
      opt("c", "Para cansar al rival y nada más", false,
        "Cansar es un efecto secundario; el fin es crear y proteger ventajas."),
    ],
    xp: 20,
  },
  {
    id: "q-poss-3",
    category: "possession",
    difficulty: 2,
    prompt:
      "El rival defiende en bloque medio. Tienes el balón en tu mediocentro. ¿Qué pase hace progresar mejor?",
    options: [
      opt("a", "El pase entre líneas a un jugador que recibe de cara", true,
        "Un pase que rompe una línea y llega a alguien orientado hacia portería progresa de verdad y obliga a defender hacia atrás."),
      opt("b", "Un pase lateral a otro mediocentro", false,
        "Es seguro pero no progresa: el bloque no se ve obligado a reaccionar."),
      opt("c", "Un pase atrás al central", false,
        "A veces necesario, pero no es la opción que hace daño aquí."),
    ],
    xp: 20,
  },
  {
    id: "q-poss-4",
    category: "possession",
    difficulty: 3,
    prompt:
      "¿Qué es la 'pausa' en la fase de posesión y por qué importa?",
    options: [
      opt("a", "Frenar el ritmo para que el rival no recupere su forma", false,
        "Eso es perder tiempo; la pausa no es ralentizar porque sí."),
      opt("b", "Esperar el instante justo para dar el pase decisivo cuando se abre el hueco", true,
        "La pausa es no precipitar el pase clave: sostener el balón un segundo hasta que el espacio realmente aparece."),
      opt("c", "Dar siempre un toque de más", false,
        "El toque de más sin lectura es justo lo contrario a una buena pausa."),
    ],
    xp: 30,
  },
  {
    id: "q-poss-5",
    category: "possession",
    difficulty: 2,
    prompt:
      "¿Qué hace el 'hombre libre' en una construcción con posesión?",
    options: [
      opt("a", "Quedarse quieto esperando el balón", false,
        "El hombre libre debe orientarse y prepararse para progresar, no esperar pasivo."),
      opt("b", "Recibir orientado y dar el siguiente pase de progresión", true,
        "Crear y encontrar al hombre libre permite recibir sin presión y avanzar el balón hacia la siguiente línea."),
      opt("c", "Devolverla siempre al portero", false,
        "Eso desaprovecha la superioridad que acabas de generar."),
    ],
    xp: 20,
  },
  {
    id: "q-poss-6",
    category: "possession",
    difficulty: 1,
    prompt:
      "Para conservar el balón bajo presión, ¿qué cualidad del primer toque es clave?",
    options: [
      opt("a", "Un control orientado hacia el espacio libre", true,
        "El primer toque orientado hacia donde no hay presión te saca del aprieto y te deja de cara para seguir jugando."),
      opt("b", "Parar el balón en seco siempre", false,
        "Pararlo en seco bajo presión te deja de espaldas y sin salida."),
      opt("c", "Controlar siempre con la suela", false,
        "Es una opción más, no un principio: depende de dónde esté el espacio."),
    ],
    xp: 15,
  },

  // ── ESPACIOS ──────────────────────────────────────────────────
  {
    id: "q-space-1",
    category: "spaces",
    difficulty: 2,
    prompt:
      "Tu extremo está marcado pegado a la banda. ¿Dónde aparecerá el espacio para un compañero?",
    options: [
      opt("a", "En el medio-espacio por dentro del lateral", true,
        "Cuando el extremo fija al lateral en la banda, se abre el medio-espacio interior, ideal para una llegada en diagonal."),
      opt("b", "Justo por detrás del extremo", false,
        "Esa zona la cubre el defensa que marca; es la más disputada."),
      opt("c", "Delante de los centrales rivales", false,
        "Esa zona central suele estar saturada ante una defensa colocada."),
    ],
    xp: 20,
  },
  {
    id: "q-space-2",
    category: "spaces",
    difficulty: 2,
    prompt:
      "¿Qué es el 'medio-espacio' (half-space) y por qué es tan valioso?",
    options: [
      opt("a", "El carril entre la banda y el centro, desde donde se ve toda la portería", true,
        "Desde el medio-espacio puedes pasar, conducir o tirar con buen ángulo, y es difícil de defender porque cae entre lateral y central."),
      opt("b", "El centro exacto del campo", false,
        "El centro suele estar más vigilado; el medio-espacio es el carril intermedio."),
      opt("c", "La línea de banda", false,
        "La banda limita opciones (la línea es un 'defensor' más)."),
    ],
    xp: 20,
  },
  {
    id: "q-space-3",
    category: "spaces",
    difficulty: 1,
    prompt:
      "Un compañero conduce hacia un defensa. ¿Cómo le creas un espacio sin tocar el balón?",
    options: [
      opt("a", "Hacer un desmarque de arrastre que se lleve al defensa", true,
        "Un movimiento que arrastra a tu marcador abre el espacio para que el conductor ataque la zona que has vaciado."),
      opt("b", "Quedarte parado en su línea de pase", false,
        "Quedarte estático no fija a nadie y encima tapas opciones."),
      opt("c", "Pedirle el balón al pie de inmediato", false,
        "Pedir corto cancela la conducción y no genera espacio."),
    ],
    xp: 15,
  },
  {
    id: "q-space-4",
    category: "spaces",
    difficulty: 3,
    prompt:
      "Tu equipo ataca por la derecha y el rival se desplaza a ese lado. ¿Dónde está el espacio de mayor valor?",
    options: [
      opt("a", "En el lado izquierdo, lejos del balón", true,
        "Cuando el bloque rival bascula al lado del balón, el lado contrario queda liberado: cambiar la orientación encuentra a un jugador solo."),
      opt("b", "En el mismo lado, forzando por dentro", false,
        "Ese lado está saturado; insistir ahí es jugar a favor del rival."),
      opt("c", "Detrás de tu propia línea", false,
        "Ahí no atacas, solo retrasas."),
    ],
    xp: 30,
  },
  {
    id: "q-space-5",
    category: "spaces",
    difficulty: 2,
    prompt:
      "¿Qué efecto tiene un delantero que ataca constantemente la espalda de la defensa?",
    options: [
      opt("a", "Obliga a la defensa a retrasarse y abre el espacio entre líneas", true,
        "La amenaza de profundidad hace que los centrales no puedan dar un paso adelante, liberando la zona entre defensa y medios."),
      opt("b", "No sirve si no recibe el balón", false,
        "Aunque no reciba, su movimiento ya condiciona y abre espacio para otros."),
      opt("c", "Atrae a los extremos rivales", false,
        "Afecta sobre todo a los centrales, no a los extremos."),
    ],
    xp: 20,
  },

  // ── COBERTURAS ────────────────────────────────────────────────
  {
    id: "q-cover-1",
    category: "covering",
    difficulty: 2,
    prompt:
      "Tu lateral izquierdo sale a presionar. ¿Qué compañero debe dar la cobertura por detrás?",
    options: [
      opt("a", "El central más cercano se desliza a cubrir", true,
        "La línea bascula: el central próximo cubre el espacio que dejó el lateral, manteniendo la línea conectada."),
      opt("b", "El lateral contrario cruza todo el campo", false,
        "Llega tarde y deja ambas bandas expuestas."),
      opt("c", "Nadie: el lateral nunca debería salir", false,
        "Los laterales deben presionar a veces; la clave es la cobertura, no la pasividad."),
    ],
    xp: 20,
  },
  {
    id: "q-cover-2",
    category: "covering",
    difficulty: 2,
    prompt:
      "En la teoría de coberturas, ¿qué hace el segundo defensa cuando el primero va al balón?",
    options: [
      opt("a", "Se coloca en diagonal por detrás para cubrir si superan al primero", true,
        "El defensa de cobertura se sitúa en diagonal y un poco por detrás, listo para frenar al rival si gana al que presiona."),
      opt("b", "Va también al balón para robar entre dos", false,
        "Si los dos van al balón, un solo regate deja a ambos atrás."),
      opt("c", "Se queda en línea con el primero", false,
        "En línea no hay profundidad de cobertura: un pase los rompe a la vez."),
    ],
    xp: 20,
  },
  {
    id: "q-cover-3",
    category: "covering",
    difficulty: 1,
    prompt:
      "¿Qué es 'bascular' como línea defensiva?",
    options: [
      opt("a", "Desplazarse todos juntos hacia el lado del balón", true,
        "Bascular es mover la línea como bloque hacia el balón para comprimir ese lado y dejar lejos el espacio del lado contrario."),
      opt("b", "Que cada defensa vaya a por su hombre", false,
        "Eso es marcaje individual, no basculación."),
      opt("c", "Subir todos a presionar", false,
        "Eso sería un ajuste de altura, no la basculación lateral."),
    ],
    xp: 15,
  },
  {
    id: "q-cover-4",
    category: "covering",
    difficulty: 3,
    prompt:
      "Llega un centro lateral. ¿Cómo debe estar orientado el defensa para una buena cobertura del área?",
    options: [
      opt("a", "De perfil, viendo balón y atacante a la vez", true,
        "El perfil abierto (cuerpo orientado para ver balón y rival) permite reaccionar al centro y al desmarque sin perder de vista a ninguno."),
      opt("b", "De espaldas al balón, mirando solo a su par", false,
        "Si no ve el balón, no puede anticipar la trayectoria del centro."),
      opt("c", "Mirando solo el balón", false,
        "Mirando solo el balón pierde el desmarque del atacante a su espalda."),
    ],
    xp: 30,
  },
  {
    id: "q-cover-5",
    category: "covering",
    difficulty: 2,
    prompt:
      "El mediocentro defensivo, ¿a qué espacio debe dar cobertura prioritaria?",
    options: [
      opt("a", "A la zona delante de los centrales (la 'zona 14')", true,
        "El pivote protege el espacio justo delante de la defensa, por donde llegarían los pases entre líneas más peligrosos."),
      opt("b", "A las bandas", false,
        "Las bandas son responsabilidad de laterales y carrileros."),
      opt("c", "Al área pequeña", false,
        "Esa zona la cubren los centrales y el portero."),
    ],
    xp: 20,
  },

  // ── LÍNEAS DE PASE ────────────────────────────────────────────
  {
    id: "q-line-1",
    category: "passing-lines",
    difficulty: 1,
    prompt:
      "Un rival está justo en la línea de pase entre tú y tu delantero. ¿Solución más limpia?",
    options: [
      opt("a", "Forzar el pase igualmente", false,
        "Forzarlo es la intercepción clásica que provoca un contraataque."),
      opt("b", "Cambiar el ángulo: mover el balón en lateral para abrir otra línea", true,
        "Un pase lateral reorienta al defensa y abre una línea limpia hacia el delantero."),
      opt("c", "Regatear directo hacia el defensa", false,
        "Conducir hacia el que cubre invita a la entrada en zona peligrosa."),
    ],
    xp: 15,
  },
  {
    id: "q-line-2",
    category: "passing-lines",
    difficulty: 2,
    prompt:
      "¿Qué significa 'recibir en el perfil correcto'?",
    options: [
      opt("a", "Orientar el cuerpo al recibir para ver el mayor campo posible", true,
        "Recibir abriendo el cuerpo hacia el espacio libre te permite continuar la jugada hacia delante en un solo movimiento."),
      opt("b", "Recibir siempre con la pierna derecha", false,
        "No es cuestión de pierna fija, sino de orientación corporal."),
      opt("c", "Recibir de espaldas a portería siempre", false,
        "De espaldas limitas la continuidad salvo casos concretos (pivote de área)."),
    ],
    xp: 20,
  },
  {
    id: "q-line-3",
    category: "passing-lines",
    difficulty: 2,
    prompt:
      "Para abrir una línea de pase interior, ¿qué movimiento sin balón es más útil?",
    options: [
      opt("a", "Un apoyo en diagonal que cambie el ángulo de pase", true,
        "Moverte en diagonal crea un nuevo ángulo y obliga al defensa a elegir, abriendo la línea interior."),
      opt("b", "Quedarte en la misma línea recta del pasador", false,
        "En línea recta es la opción más fácil de tapar para el defensa."),
      opt("c", "Alejarte del balón al máximo", false,
        "Alejarte demasiado elimina la opción de pase corto."),
    ],
    xp: 20,
  },
  {
    id: "q-line-4",
    category: "passing-lines",
    difficulty: 3,
    prompt:
      "¿Qué es un pase 'que rompe líneas' y por qué vale más?",
    options: [
      opt("a", "Un pase que supera a una o varias líneas rivales de una vez", true,
        "Romper líneas elimina rivales del juego de golpe y obliga a defender hacia su propia portería, ganando metros y tiempo."),
      opt("b", "Cualquier pase largo", false,
        "Largo no es sinónimo de romper líneas: un largo puede no superar a nadie útil."),
      opt("c", "Un pase atrás seguro", false,
        "El pase atrás no supera líneas, las cede."),
    ],
    xp: 30,
  },
  {
    id: "q-line-5",
    category: "passing-lines",
    difficulty: 1,
    prompt:
      "El delantero pide el balón al pie con un defensa pegado. ¿Qué pase es mejor?",
    options: [
      opt("a", "Al pie del lado contrario al defensa, para que proteja", true,
        "Pasar al pie alejado del marcador le permite proteger el balón con el cuerpo y aguantar de espaldas."),
      opt("b", "Al espacio a su espalda siempre", false,
        "Si el defensa está pegado y no hay carrera, el balón a la espalda se pierde."),
      opt("c", "Un pase fuerte y centrado al cuerpo", false,
        "Al cuerpo le complicas el control y facilitas el robo."),
    ],
    xp: 15,
  },

  // ── SALIDA DE BALÓN ───────────────────────────────────────────
  {
    id: "q-build-1",
    category: "build-up",
    difficulty: 3,
    prompt:
      "Sales desde atrás y el rival presiona con 2 delanteros sobre tus 2 centrales. ¿Cómo creas un hombre libre?",
    options: [
      opt("a", "Bajar un mediocentro entre los centrales para formar un 3", true,
        "La 'salida lavolpiana': el pivote baja entre centrales y crea un 3 contra 2, generando el hombre libre para progresar."),
      opt("b", "Que ambos laterales se queden junto a los centrales", false,
        "Acumulas gente atrás pero no superas la presión central."),
      opt("c", "Que el portero la mande larga siempre", false,
        "El largo evita la salida en vez de resolverla jugando."),
    ],
    xp: 25,
  },
  {
    id: "q-build-2",
    category: "build-up",
    difficulty: 2,
    prompt:
      "¿Cuál es la función del portero en una salida de balón moderna?",
    options: [
      opt("a", "Ser un jugador de campo más: dar el +1 y opción de pase seguro", true,
        "El portero con buen pie suma un hombre en la primera fase, ofreciendo apoyo y permitiendo superar al primer presionador."),
      opt("b", "Despejar siempre lo más lejos posible", false,
        "Despejar por despejar regala la posesión y la segunda jugada."),
      opt("c", "No tocar nunca el balón con el pie", false,
        "Renunciar a sus pies elimina una ventaja numérica clave."),
    ],
    xp: 20,
  },
  {
    id: "q-build-3",
    category: "build-up",
    difficulty: 2,
    prompt:
      "En la primera fase, ¿por qué conviene abrir mucho a los centrales?",
    options: [
      opt("a", "Para ampliar al rival y abrir líneas interiores de pase", true,
        "Centrales abiertos estiran a los delanteros rivales y abren los pasillos interiores para encontrar al pivote o entre líneas."),
      opt("b", "Para estar más cerca de la banda y centrar", false,
        "Los centrales no abren para centrar, sino para generar ángulos de salida."),
      opt("c", "Para perder tiempo", false,
        "No tiene que ver con el reloj, sino con la estructura."),
    ],
    xp: 20,
  },
  {
    id: "q-build-4",
    category: "build-up",
    difficulty: 1,
    prompt:
      "Si el rival no presiona y espera en bloque medio, ¿qué debe hacer tu salida?",
    options: [
      opt("a", "Avanzar con el balón controlado hasta provocar una reacción", true,
        "Si te dan tiempo, conduce y progresa con el balón hasta que el rival salga; entonces se abrirán los espacios."),
      opt("b", "Jugar rápido en largo igualmente", false,
        "Sin presión, regalar el balón en largo es absurdo."),
      opt("c", "Pasar el balón entre los centrales sin avanzar", false,
        "Tocar en horizontal sin progresar no obliga al rival a nada."),
    ],
    xp: 15,
  },
  {
    id: "q-build-5",
    category: "build-up",
    difficulty: 3,
    prompt:
      "El rival presiona hombre a hombre toda tu salida. ¿Recurso más eficaz?",
    options: [
      opt("a", "Buscar el balón largo a la espalda o a un duelo que ganes", true,
        "Contra marcaje individual total, atacar la espalda o buscar un duelo aéreo favorable rompe el plan rival y evita el robo arriba."),
      opt("b", "Insistir en pases cortos entre líneas marcadas", false,
        "Con todos emparejados, el pase corto es justo lo que el rival quiere robar."),
      opt("c", "Devolver siempre al portero y repetir", false,
        "Repetir el mismo patrón marcado acaba en pérdida o en saque largo forzado."),
    ],
    xp: 30,
  },

  // ── DEFENSA ───────────────────────────────────────────────────
  {
    id: "q-def-1",
    category: "defending",
    difficulty: 2,
    prompt:
      "El rival ataca un 2 contra 2 a toda velocidad. Como defensa más profundo, ¿tu prioridad?",
    options: [
      opt("a", "Que los dos defensas entren a robar", false,
        "Si ambos se lanzan, una entrada fallida deja carrera libre a portería."),
      opt("b", "Retrasar: uno presiona el balón y el otro cubre el pase", true,
        "En un 2 contra 2, el retraso da tiempo a recuperar. Presión + cobertura evita el pase de la muerte."),
      opt("c", "Bajar hasta la línea de gol", false,
        "Bajar demasiado invita al disparo y cede todo el campo."),
    ],
    xp: 20,
  },
  {
    id: "q-def-2",
    category: "defending",
    difficulty: 1,
    prompt:
      "¿Qué busca un defensa al 'temporizar' (contener) en un 1 contra 1?",
    options: [
      opt("a", "Ganar tiempo para que lleguen las coberturas y reducir opciones", true,
        "Temporizar no es no hacer nada: es contener, orientar al atacante y esperar el momento o la ayuda para robar."),
      opt("b", "Lanzarse al suelo cuanto antes", false,
        "Tirarse al suelo te elimina del juego si fallas; es último recurso."),
      opt("c", "Dejar pasar al atacante para sorprenderlo", false,
        "Dejar pasar sin más es regalar la acción."),
    ],
    xp: 15,
  },
  {
    id: "q-def-3",
    category: "defending",
    difficulty: 2,
    prompt:
      "¿Cuándo conviene defender en bloque bajo en lugar de presionar arriba?",
    options: [
      opt("a", "Ante un rival superior, para proteger la portería y salir al contra", true,
        "El bloque bajo reduce el espacio cerca de tu área, frustra al rival con más calidad y abre la opción del contraataque."),
      opt("b", "Siempre, porque es lo más seguro", false,
        "El bloque bajo invita presión constante; no siempre es lo óptimo."),
      opt("c", "Cuando dominas claramente al rival", false,
        "Si dominas, suele convenir presionar alto y mantenerlo encerrado."),
    ],
    xp: 20,
  },
  {
    id: "q-def-4",
    category: "defending",
    difficulty: 3,
    prompt:
      "Defiendes en zona. Un atacante entra desde otra zona a la tuya. ¿Qué haces?",
    options: [
      opt("a", "Lo tomo mientras está en mi zona y aviso para el relevo", true,
        "En defensa zonal cada uno protege su espacio: tomas al rival que entra en tu zona y lo entregas al compañero cuando sale de ella."),
      opt("b", "Le sigo por todo el campo allá donde vaya", false,
        "Seguirle a todas partes es marcaje individual y rompe la estructura zonal."),
      opt("c", "Lo ignoro porque no es 'mi hombre'", false,
        "En zona no hay 'mi hombre': proteges el espacio, así que sí lo tomas."),
    ],
    xp: 30,
  },
  {
    id: "q-def-5",
    category: "defending",
    difficulty: 2,
    prompt:
      "¿Qué error de la línea defensiva genera más fueras de juego fallidos y goles?",
    options: [
      opt("a", "Que un defensa suba más tarde o antes que el resto", true,
        "La línea debe subir coordinada; un defensa descolgado habilita al rival y rompe la trampa del fuera de juego."),
      opt("b", "Subir todos a la vez y rápido", false,
        "Subir coordinados es justo lo correcto, no un error."),
      opt("c", "Comunicarse en voz alta", false,
        "Comunicarse es bueno; mantiene la línea ordenada."),
    ],
    xp: 20,
  },

  // ── TRANSICIONES ──────────────────────────────────────────────
  {
    id: "q-trans-1",
    category: "transitions",
    difficulty: 3,
    prompt:
      "Acabas de robar el balón arriba y el rival está desorganizado. ¿Acción ideal?",
    options: [
      opt("a", "El pase vertical más adelantado que sea viable", true,
        "En transición la velocidad gana a la posesión: el primer pase vertical ataca la desorganización antes de que se recoloquen."),
      opt("b", "Reciclar en horizontal para asegurar", false,
        "Ir en lateral da tiempo al rival a recuperar su forma y se pierde el momento."),
      opt("c", "Frenar y esperar apoyos", false,
        "Esperar mata la ventaja: los huecos se cierran en segundos."),
    ],
    xp: 25,
  },
  {
    id: "q-trans-2",
    category: "transitions",
    difficulty: 2,
    prompt:
      "Pierdes el balón atacando. ¿Cuál es el principio del 'contrapressing' en los primeros 5 segundos?",
    options: [
      opt("a", "Los más cercanos saltan al balón para robarlo de inmediato", true,
        "El contrapressing (gegenpressing): los jugadores próximos colapsan sobre el balón mientras el rival aún está descolocado."),
      opt("b", "Bajar todos rápido a colocarse", false,
        "Bajar cede la iniciativa; el contrapressing intenta robar antes de que salgan."),
      opt("c", "Hacer falta para parar el ataque", false,
        "La falta táctica es último recurso, no el principio."),
    ],
    xp: 20,
  },
  {
    id: "q-trans-3",
    category: "transitions",
    difficulty: 2,
    prompt:
      "En transición defensiva (acabas de perder el balón) y no puedes robar rápido. ¿Qué prioriza el equipo?",
    options: [
      opt("a", "Frenar el balón y proteger el centro mientras se recoloca", true,
        "Si no se roba en el primer momento, la prioridad es retrasar el ataque y cerrar el centro para dar tiempo a reorganizarse."),
      opt("b", "Ir todos a por el balón a la vez", false,
        "Sin coordinación es fácil de superar y deja huecos enormes."),
      opt("c", "Quedarse mirando dónde está el balón", false,
        "La pasividad en transición defensiva acaba en ocasión rival."),
    ],
    xp: 20,
  },
  {
    id: "q-trans-4",
    category: "transitions",
    difficulty: 1,
    prompt:
      "¿Qué es 'el resto' o 'rest defense' en fase de ataque?",
    options: [
      opt("a", "La estructura de jugadores preparados para defender si se pierde el balón", true,
        "El 'rest defense' es dejar jugadores bien colocados durante el ataque para cortar el contraataque rival si se pierde la pelota."),
      opt("b", "Los jugadores que descansan en el banquillo", false,
        "No tiene que ver con suplentes, sino con la estructura en campo."),
      opt("c", "Defender con todo el equipo en el área", false,
        "Eso es replegar, no la estructura de seguridad durante el ataque."),
    ],
    xp: 15,
  },
  {
    id: "q-trans-5",
    category: "transitions",
    difficulty: 3,
    prompt:
      "Sales al contraataque 3 contra 3. ¿Qué decisión maximiza el peligro?",
    options: [
      opt("a", "Atacar con velocidad fijando a un defensa para crear el 2 contra 1", true,
        "Conducir a un defensa para fijarlo y liberar a un compañero convierte el 3 contra 3 en una superioridad local decisiva."),
      opt("b", "Esperar a que suban más compañeros", false,
        "Esperar deja que la defensa se reorganice y desaparezca la ventaja."),
      opt("c", "Disparar de lejos cuanto antes", false,
        "El disparo lejano apresurado tira a la basura una transición prometedora."),
    ],
    xp: 30,
  },
];

export function quizzesByCategory(cat: QuizCategory) {
  return QUIZZES.filter((q) => q.category === cat);
}
