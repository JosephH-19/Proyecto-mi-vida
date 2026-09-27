// Aquí van TODAS nuestras fotos. Para agregar o editar una, solo cambia estos datos.
// 'src'  -> la ruta o link de tu foto (súbela a assets/fotos/ o pon tu link del repo)
// 'alt'  -> texto alternativo corto (para accesibilidad)
// 'descripcion' -> qué pasó en esa foto
// 'frase' -> tu frase de amor para esa foto
const FOTOS = [
  {
    src: "assets/fotos/foto1.jpeg",
    alt: "Foto 1 de Joseph y Ohanna",
    descripcion: "Nuestra primera foto juntos en el campo, el día que supe que eras más que especial para mi corazón",
    frase: "Desde ese momento, supe que mi corazón tenía dueña"
  },
  {
    src: "assets/fotos/foto2.jpg",
    alt: "Foto 2 de Joseph y Ohanna",
    descripcion: "Una mia miestras trabajo y estudio y te tengo presente siempre",
    frase: "Contigo, hasta en mi mente" 
  },
  {
    src: "assets/fotos/foto3.jpg",
    alt: "Foto 3 de Joseph y Ohanna",
    descripcion: "Nuestra primer concierto, donde las miradas decían más que las palabras",
    frase: "Tus ojos son el mapa que guía mi alma"
  },
  {
    src: "assets/fotos/foto4.jpg",
    alt: "Foto 4 de Joseph y Ohanna",
    descripcion: "Risas sin fin por esa foto esperda aunque no salimos tan bien",
    frase: "Reír contigo es mi medicina favorita"
  },
  {
    src: "assets/fotos/foto5.jpg",
    alt: "Foto 5 de Joseph y Ohanna",
    descripcion: "una casual tuya, que me gusta revisar y ver porque me recuerda tu sesencia",
    frase: "Las cosas más simples de tu ser me enamoran más"
  },
  {
    src: "assets/fotos/foto6.jpg",
    alt: "Foto 6 de Joseph y Ohanna",
    descripcion: "Besito en la frente",
    frase: "No olvides que siempre tendras uno"
  },
  {
    src: "assets/fotos/foto7.jpg",
    alt: "Foto 7 de Joseph y Ohanna",
    descripcion: "Una noche casual de nuestras noches de juegos",
    frase: "Cada noche se convirtió en el mejor dia"
  },
  {
    src: "assets/fotos/foto8.jpg",
    alt: "Foto 8 de Joseph y Ohanna",
    descripcion: "Paseo y primer picknik ",
    frase: "Amo recordar cada detalle de ese dia"
  },
  {
    src: "assets/fotos/foto9.jpg",
    alt: "Foto 9 de Joseph y Ohanna",
    descripcion: "Foto de nuestra comida y de nuestra peli con lo mejor que pudimos hacer",
    frase: "Hacer cualquier cosa a tu lado es hermoso para mi"
  },
  {
    src: "assets/fotos/foto10.jpg",
    alt: "Foto 10 de Joseph y Ohanna",
    descripcion: "Noche del cumple de tu papi",
    frase: "Mi noche favorita del muno, la he pasado yo contigo"
  },
  {
    src: "assets/fotos/foto11.jpg",
    alt: "Foto 11 de Joseph y Ohanna",
    descripcion: "Una más de ti, porque me encata verte",
    frase: "Despertar y verte es mi bendición matutina"
  },
  {
    src: "assets/fotos/foto12.jpg",
    alt: "Foto 12 de Joseph y Ohanna",
    descripcion: "Selfie con filtros, celebrando que juntos somos los mejores",
    frase: "Juntos somos la mejor versión de nosotros mismos"
  },
  {
    src: "assets/fotos/foto13.jpg",
    alt: "Foto 13 de Joseph y Ohanna",
    descripcion: "Una casula tuya, me encatá ver esa foto, tiene mucha ternura y está mucho de mi niña que me gusta ver",
    frase: "Yo protegere a mi niña hermosa"
  },
  {
    src: "assets/fotos/foto14.jpg",
    alt: "Foto 14 de Joseph y Ohanna",
    descripcion: "Ahora una mia para que no olvides que estoy presente en tu vida",
    frase: "Estoy y siempre estaré a unpaso tuyo"
  },
  {
    src: "assets/fotos/foto15.jpg",
    alt: "Foto 15 de Joseph y Ohanna",
    descripcion: "Me encata este dia porque la pasamos bonito",
    frase: "Tu sonrisa es el faro que guía mis días"
  },
  {
    src: "assets/fotos/foto16.jpg",
    alt: "Foto 16 de Joseph y Ohanna",
    descripcion: "Noche de estrellas en el campo, aprendiendo que el universo es pequeño ante lo que siento por ti",
    frase: "Contigo, el infinito tiene sentido"
  },
  {
    src: "assets/fotos/foto17.jpg",
    alt: "Foto 17 de Joseph y Ohanna",
    descripcion: "Foto de ti, no importa donde estes siempre te tengo conmigo",
    frase: "Gané el premio más grande el día que te conocí"
  },
  {
    src: "assets/fotos/foto18.jpg",
    alt: "Foto 18 de Joseph y Ohanna",
    descripcion: "Esta muestra tu belleza, encanto y serieda",
    frase: "Contigo, hasta el silencio y desorden es perfecto"
  },
  {
    src: "assets/fotos/foto19.jpg",
    alt: "Foto 19 de Joseph y Ohanna",
    descripcion: "Noche casual, no salimos bien pero estamos feliz y es lo que importa",
    frase: "Hoy Campturamos la felicidad, no siempre una buena foto"
  },
  {
    src: "assets/fotos/foto20.jpg",
    alt: "Foto 20 de Joseph y Ohanna",
    descripcion: "No importa que tan lejos esté o que tan serca",
    frase: "Mi corrazon te sigue amando sin importar la distancia"
  },
  {
    src: "assets/fotos/foto21.jpg",
    alt: "Foto 21 de Joseph y Ohanna",
    descripcion: "Tus flores favorias",
    frase: "Eres la felicidad que me da la felicida"
  },
  {
    src: "assets/fotos/foto22.jpg",
    alt: "Foto 22 de Joseph y Ohanna",
    descripcion: "Hermosa donde estes",
    frase: "Contigo, cada cosa es una aventura"
  },
  {
    src: "assets/fotos/foto23.jpg",
    alt: "Foto 23 de Joseph y Ohanna",
    descripcion: "Noche de juegos de baile, felicidad y un dulce sueño",
    frase: "Eres mi lugar favorito de toda mi vida"
  },
  {
    src: "assets/fotos/foto24.jpg",
    alt: "Foto 24 de Joseph y Ohanna",
    descripcion: "Foto de nuestro colage, de ese dia especial",
    frase: "Me gustan estas porque recuerdo lo que siento"
  }
];
