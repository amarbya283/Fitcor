export const ejerciciosEjemplo = [
  { nombre: 'Abdomen (Barra con pesas)', grupo: 'Abdominales', descripcion: 'Barra con pesas', imagen: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Abdomen (Landmine)', grupo: 'Abdominales', descripcion: 'Landmine', imagen: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Abdominal Total', grupo: 'Abdominales', descripcion: 'Total Abdominal', imagen: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Abdominales bicicleta', grupo: 'Abdominales, Piernas', descripcion: 'Peso con el cuerpo', imagen: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Abdominales, levantamiento de rodillas', grupo: 'Abdominales', descripcion: 'Levantamiento de rodillas', imagen: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Flexiones', grupo: 'Pecho, Tríceps', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Sentadillas', grupo: 'Piernas, Glúteos', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Press banca', grupo: 'Pecho', descripcion: 'Barra', imagen: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Dominadas', grupo: 'Espalda, Bíceps', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Remo con barra', grupo: 'Espalda', descripcion: 'Barra', imagen: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Curl bíceps', grupo: 'Bíceps', descripcion: 'Mancuernas', imagen: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Fondos', grupo: 'Tríceps, Pecho', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Press militar', grupo: 'Hombros', descripcion: 'Barra', imagen: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Elevaciones laterales', grupo: 'Hombros', descripcion: 'Mancuernas', imagen: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Zancadas', grupo: 'Piernas, Glúteos', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Peso muerto', grupo: 'Espalda, Piernas', descripcion: 'Barra', imagen: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Gemelos de pie', grupo: 'Piernas', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Crunch', grupo: 'Abdominales', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Plancha', grupo: 'Abdominales', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/2261482/pexels-photo-2261482.jpeg?auto=compress&w=400&h=120&fit=crop' },
  { nombre: 'Burpees', grupo: 'Full Body', descripcion: 'Peso corporal', imagen: 'https://images.pexels.com/photos/260352/pexels-photo-260352.jpeg?auto=compress&w=400&h=120&fit=crop' },
];

// Instrucciones por ejercicio, compartidas por DetalleEjercicio y AñadirEjercicios
export const instrucciones = {
  'Abdomen (Barra con pesas)': [
    'Colócate de rodillas en una esterilla, sujetando la barra con ambas manos, brazos extendidos y la barra apoyada en el suelo.',
    'Rueda la barra hacia adelante, extendiendo el tronco y manteniendo el abdomen contraído, hasta que tu cuerpo quede casi paralelo al suelo.',
    'Haz una pausa breve y regresa lentamente a la posición inicial, evitando arquear la espalda.'
  ],
  'Abdomen (Landmine)': [
    'Coloca un extremo de la barra en una esquina (landmine) y sujeta el otro extremo con ambas manos, de pie y con los pies separados al ancho de hombros.',
    'Gira el tronco llevando la barra de un lado al otro, manteniendo los brazos extendidos y el abdomen firme.',
    'Controla el movimiento y evita girar las caderas.'
  ],
  'Abdominal Total': [
    'Túmbate boca arriba, con las piernas estiradas y los brazos extendidos por detrás de la cabeza.',
    'Eleva simultáneamente el tronco y las piernas, intentando tocar los pies con las manos.',
    'Baja lentamente sin dejar caer la espalda ni las piernas al suelo.'
  ],
  'Abdominales bicicleta': [
    'Túmbate boca arriba, manos detrás de la cabeza y piernas elevadas.',
    'Lleva el codo derecho hacia la rodilla izquierda mientras extiendes la pierna derecha, alternando el movimiento como si pedalearas.',
    'Mantén el abdomen activado y no tires del cuello.'
  ],
  'Abdominales, levantamiento de rodillas': [
    'Cuelga de una barra fija con las manos separadas al ancho de hombros.',
    'Eleva las rodillas hacia el pecho, manteniendo el torso estable y sin balancearte.',
    'Baja las piernas de forma controlada.'
  ],
  'Flexiones': [
    'Coloca las manos en el suelo, alineadas con los hombros, y apoya las puntas de los pies.',
    'Mantén el cuerpo recto y baja el pecho hacia el suelo flexionando los codos.',
    'Empuja con las palmas para volver a la posición inicial.'
  ],
  'Sentadillas': [
    'Ponte de pie con los pies separados al ancho de los hombros y la espalda recta.',
    'Flexiona las rodillas y baja la cadera como si te sentaras, manteniendo el peso en los talones.',
    'Vuelve a subir apretando glúteos y muslos.'
  ],
  'Press banca': [
    'Túmbate en un banco plano, sujeta la barra con las manos un poco más abiertas que los hombros.',
    'Baja la barra controladamente hasta el pecho, manteniendo los codos a 45°.',
    'Empuja la barra hacia arriba hasta extender los brazos.'
  ],
  'Dominadas': [
    'Agárrate a una barra fija con las palmas hacia adelante y los brazos extendidos.',
    'Sube el cuerpo hasta que la barbilla supere la barra, contrayendo la espalda.',
    'Baja lentamente hasta la posición inicial.'
  ],
  'Remo con barra': [
    'De pie, flexiona ligeramente las rodillas y el torso hacia adelante, espalda recta.',
    'Sujeta la barra con las manos separadas al ancho de hombros.',
    'Lleva la barra hacia el abdomen, pegando los codos al cuerpo, y baja controladamente.'
  ],
  'Curl bíceps': [
    'Sujeta las mancuernas con los brazos extendidos a los lados del cuerpo.',
    'Flexiona los codos y sube el peso hacia los hombros, manteniendo los codos pegados al torso.',
    'Baja lentamente a la posición inicial.'
  ],
  'Fondos': [
    'Coloca las manos en barras paralelas, brazos extendidos y cuerpo recto.',
    'Baja el cuerpo flexionando los codos hasta que los hombros estén al nivel de los codos.',
    'Empuja con fuerza para volver a la posición inicial.'
  ],
  'Press militar': [
    'Sujeta la barra a la altura de los hombros, de pie y con la espalda recta.',
    'Empuja la barra por encima de la cabeza hasta extender completamente los brazos.',
    'Baja la barra controladamente a la posición inicial.'
  ],
  'Elevaciones laterales': [
    'Sujeta una mancuerna en cada mano, brazos a los lados.',
    'Eleva los brazos lateralmente hasta la altura de los hombros, manteniendo una ligera flexión en los codos.',
    'Baja lentamente controlando el movimiento.'
  ],
  'Zancadas': [
    'De pie, da un paso largo hacia adelante con una pierna.',
    'Baja la rodilla trasera casi hasta el suelo, manteniendo el torso recto.',
    'Impúlsate con la pierna adelantada para volver a la posición inicial y alterna.'
  ],
  'Peso muerto': [
    'Coloca la barra en el suelo frente a ti, pies al ancho de caderas.',
    'Flexiona las caderas y las rodillas para agarrar la barra, espalda recta.',
    'Levanta la barra extendiendo caderas y rodillas a la vez, manteniendo la barra cerca del cuerpo.'
  ],
  'Gemelos de pie': [
    'Ponte de pie, pies paralelos y separados al ancho de caderas.',
    'Eleva los talones lo más alto posible, contrayendo los gemelos.',
    'Baja lentamente hasta apoyar completamente los pies.'
  ],
  'Crunch': [
    'Túmbate boca arriba con las rodillas flexionadas y los pies apoyados en el suelo.',
    'Coloca las manos detrás de la cabeza o cruzadas sobre el pecho.',
    'Eleva el tronco contrayendo el abdomen, sin despegar la zona lumbar del suelo.'
  ],
  'Plancha': [
    'Apoya los antebrazos y las puntas de los pies en el suelo, cuerpo recto.',
    'Mantén el abdomen y glúteos contraídos, evitando que la cadera caiga o suba.',
    'Respira de forma controlada y mantén la posición el tiempo indicado.'
  ],
  'Burpees': [
    'De pie, baja a una sentadilla y apoya las manos en el suelo.',
    'Lanza los pies hacia atrás para quedar en posición de flexión, realiza una flexión de pecho.',
    'Vuelve a la posición de sentadilla y salta explosivamente hacia arriba.'
  ],
};
