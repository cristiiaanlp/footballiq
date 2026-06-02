export interface GlossaryTerm {
  term: string;
  short: string;
  def: string;
  category: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Pressing", short: "Presión", category: "Defensa", def: "Presión coordinada para recuperar el balón cerca de la portería rival, cortando líneas de pase." },
  { term: "Gegenpressing", short: "Contrapresión", category: "Transiciones", def: "Presionar de inmediato tras perder el balón para recuperarlo en los primeros segundos, con el rival descolocado." },
  { term: "Bloque bajo", short: "Defensa replegada", category: "Defensa", def: "Defender muy cerca de la propia área, compacto, cediendo campo para luego salir al contraataque." },
  { term: "Bloque alto", short: "Defensa adelantada", category: "Defensa", def: "Defender lejos de la propia portería para asfixiar la salida rival; gran riesgo a la espalda." },
  { term: "Medio-espacio", short: "Half-space", category: "Espacios", def: "El carril entre la banda y el centro. Zona de oro: buen ángulo para pasar, conducir y disparar." },
  { term: "Tercer hombre", short: "Combinación", category: "Ataque", def: "A pasa a B, que descarga de primeras para C, un jugador que llega sin marca desde atrás." },
  { term: "Superioridad numérica", short: "Más que ellos", category: "Ataque", def: "Tener más jugadores que el rival en una zona para crear un hombre libre." },
  { term: "Amplitud", short: "Ancho", category: "Ataque", def: "Estirar al equipo hacia las bandas para separar a la defensa y abrir pasillos interiores." },
  { term: "Profundidad", short: "Ataque a la espalda", category: "Ataque", def: "Amenazar el espacio detrás de la defensa para impedir que la línea adelante su posición." },
  { term: "Cobertura", short: "Ayuda defensiva", category: "Defensa", def: "Colocarse en diagonal por detrás del compañero que presiona para frenar al rival si lo superan." },
  { term: "Basculación", short: "Desplazar la línea", category: "Defensa", def: "Mover la defensa como bloque hacia el lado del balón para comprimir ese espacio." },
  { term: "Línea de pase", short: "Carril", category: "Pase", def: "Trayectoria libre entre poseedor y receptor. Crearlas (y taparlas) es clave." },
  { term: "Pase entre líneas", short: "Romper líneas", category: "Pase", def: "Pase que supera una línea rival y llega a alguien orientado de cara a portería." },
  { term: "Salida lavolpiana", short: "Pivote entre centrales", category: "Salida", def: "El mediocentro baja entre los centrales para crear un 3 y superar la presión de 2 delanteros." },
  { term: "Transición", short: "Cambio de fase", category: "Transiciones", def: "El momento de pasar de defender a atacar (o al revés). Los segundos clave del partido." },
  { term: "Rest defense", short: "Estructura de seguridad", category: "Transiciones", def: "Jugadores bien colocados durante el ataque para cortar el contraataque si se pierde el balón." },
  { term: "Pausa", short: "Esperar el momento", category: "Posesión", def: "Sostener el balón un instante hasta que el espacio realmente aparece, sin precipitar el pase clave." },
  { term: "Trampa de presión", short: "Atrapar", category: "Defensa", def: "Orientar al rival a una zona (la banda) y cerrar todas las salidas para robar ahí." },
];
