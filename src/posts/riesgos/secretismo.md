---
title: Secretismo y ambición en la carrera armamentística de la IA
description: El secretismo en las empresas de IA representa un obstáculo fundamental para la seguridad y la democracia.
hideTitle: true
---

<script>
	import ParallaxHero from '$lib/components/ParallaxHero.svelte'

	const title = 'Secretismo y ambición en la carrera armamentística de la IA'
	const basePath = '/riesgos/secretismo'
	// from: direction layer enters from (left, right, up, down)
	// travel: distance to travel (1 = 100% of container size)
	const layers = [
		{ src: `${basePath}/background-back.png`, from: 'left', travel: 1 },
		{ src: `${basePath}/background-outlines.png`, from: 'up', travel: 1 },
		{ src: `${basePath}/background-front.png`, from: 'right', travel: 1 },
        { src: `${basePath}/minor-details.png`, from: 'down', travel: 1 },
        { src: `${basePath}/hairs.png`, from: 'down', travel: 1 },
        { src: `${basePath}/trump-body.png`, from: 'left', travel: 1, alt: 'Trump' },
		{ src: `${basePath}/xi-body.png`, from: 'right', travel: 1, alt: 'Xi Jinping' },
	]
</script>

<ParallaxHero
{title}
aspectRatio="750/330"
titleFade={[0.1, 0.3]}
{layers}
/>

A sus 26 años, Suchir Balaji contaba ya con 4 años de experiencia en la gigantesca empresa tecnológica OpenAI. Ni el
éxito de esta, ni su impresionante sueldo le hicieron retroceder el día que fue al New York Times a denunciar las
actividades de la empresa de Sam Altman, creadora de ChatGPT. Suchir destapó un **robo masivo de propiedad
intelectual**, hablando a su vez de la falta de ética por parte de la empresa.

Al [incisivo artículo](https://www.nytimes.com/2024/10/23/technology/openai-copyright-law.html), publicado el 23 de
octubre de 2024, le siguió una invitación para declarar en juicio. En este se investigarían las posibles violaciones de
la propiedad intelectual ajena por parte de OpenAI.**El 26 de noviembre, el joven ingeniero fue encontrado sin vida en
su piso**. Suchir afirmaba poseer documentos relevantes para respaldar sus acusaciones, los cuales pretendía llevar
consigo al testificar. Hacía tan solo 5 días desde su cumpleaños. Había mantenido recientemente conversaciones con sus
padres, quienes no vieron ningún comportamiento extraño por su parte.

> El joven ingeniero Suchir Balaji afirmaba poseer documentos para respaldar sus acusaciones contra OpenAI

Un criticado informe, emitido por las autoridades de San Francisco, **descartó rápidamente la posibilidad de que se t
ratara de un homicidio**. Se habló de un joven, bajo el efecto de varias sustancias, que tomó su propia vida con un
disparo. Todo encontrándose solo, en un apartamento cerrado con llave, y al cual nadie más había podido acceder.

La falta inicial de detalles, así como la relevancia del hecho, llevaron a una ola de críticas hacia la resolución
oficial del caso. Los archivos que Suchir iba a llevar al juicio no se encontraban en el apartamento. Esta, su
residencia, se puede ver manga por hombro en las imágenes que se publicaron junto al informe. Una autopsia independiente
indicó que **Suchir no había atentado contra su propia vida**, y su familia sigue a día de hoy reivindicando la falta de
rigor en la evaluación oficial del caso.

<div class="center">

![Prueba del delito](/riesgos/secretismo/chalk.png)

</div>

Había razones para dudar.

OpenAI acostumbraba a tener una política muy estricta en cuanto a la confidencialidad de sus tecnologías. Desde 2019,
los empleados que accedían a trabajar para Altman se veían obligados a firmar un acuerdo de confidencialidad muy
restrictivo, tanto que **cuando este fue filtrado la empresa tuvo que retractarse para evitar así conflictos legales**.
El acuerdo forzaba a los empleados a no criticar a la empresa y sus actividades durante el resto de sus vidas, sin
excepción, enfrentándose a pérdidas millonarias en caso de hacerlo. Resultaba paradójico ver cómo el CEO alertaba de los
inminentes riesgos de la IA, mientras cerraba de forma desesperada cualquier vía para su transparencia.

> Un acuerdo de confidencialidad forzaba de por vida a los empleados de OpenAI a no criticar a la empresa

Este secretismo no era un caso aislado. Y uno puede averiguar rápidamente por qué. Por una parte, existían antecedentes
legales que llevaron a todas las empresas a adoptar un perfil de absoluta confidencialidad. Por ejemplo, en 2009, una
mujer de Minnesota recibió una multa de 1.900.000$ por descargar y distribuir 24 canciones. Esta alta suma se debe al
hecho de que en EEUU, donde muchas de las principales empresas de IA operan, la multa por usar material protegido de
forma ilícita puede ascender hasta **150.000$ por cada infracción**.

Imaginemos que una empresa tecnológica, la cual ha accedido de forma no necesariamente legal a miles de millones de
obras protegidas, tuviese que hacer frente a las consecuencias legales de sus actos. Esto supondría un coste inasumible:
conscientes de ello, la mayoría optan por no desvelar en ningún momento el origen de sus datos.

## La guerra FrÍA

El porqué del secretismo no se limita a lo económico. En enero de 1961, durante su despedida, el presidente
estadounidense Dwight D.Eisenhower alertó del auge del "complejo militar industrial". Este estaba viendo un crecimiento
exponencial, avivado por las llamas de la Guerra Fría. De vuelta a la década del 2020, Joe Biden hace una declaración
similar durante su salida de la Casa Blanca, hablando de un **"complejo industrial de tecnológicas"**. Sus palabras,
puestas en el contexto de lo que se vivía entonces, rimaron con las de Eisenhower.

Pese a la imagen humanitaria que pretenden ofrecer, las empresas tecnológicas están sumidas en una auténtica carrera
armamentística, donde el bien común y la cooperación no son necesariamente lo prioritario. A diferencia de lo que sucede
en el método científico abierto, no se incentiva a los investigadores a publicar y debatir públicamente sus resultados y
métodos. Este formato de competición tecnológica ha tomado una dirección que se asemeja, y mucho, a lo que sucedió en la
Guerra Fría.

Las empresas y los países están compitiendo por dominar una prometedora tecnología, y eso las lleva a emplear todos los
métodos posibles por opacos que sean, y a evitar a toda costa soltar una sola miga de información. Esto inicia una
espiral difícil de romper, donde **las empresas tecnológicas tienen cada vez menos incentivos para explicar sus métodos,
y más respaldo institucional para no hacerlo**. Una frase común en EEUU en este ámbito es "si no lo hacemos, China lo
hará", con esto se resucita el fantasma de la amenaza nuclear rusa, dejando la ética en segundo plano con el pretexto de
preservar la soberanía y seguridad nacional.

> La frase "si no lo hacemos, China lo hará" resucita el fantasma de la amenaza nuclear rusa

¿Y qué papel desempeña China en todo esto? El secretismo forma parte de la manera de funcionar del Partido Comunista
Chino, ese es uno de los motivos por los que desde Occidente a menudo nos cuesta evaluar sus intenciones. Sabemos que
**la gran potencia asiática apuesta fuerte por el desarrollo tecnológico** y compite con EEUU en numerosos campos,
también en inteligencia artificial. Así lo atestigua la aparición de modelos como DeepSeek y Kimi, que sorprenden por
sus prestaciones. Por otra parte, hablamos de un país donde ese mismo desarrollo tecnológico se somete a un férreo
control en cuanto pone en peligro la estructura política, tal y como quedó patente con la censura en internet y las
redes sociales.

Para no salir todos perdiendo, las naciones occidentales y China están obligadas a entenderse en algunas materias
esenciales, y la seguridad de la IA no tiene por qué ser una excepción. Las autoridades chinas propusieron la creación
de un organismo mundial de regulación de esta tecnología, lo llaman **World Artificial Intelligence Cooperation
Organization (WAICO)**. El tiempo dirá si esta es una iniciativa sincera que puede servir de contrapeso a la temeridad
actual de EEUU, o se enmarca simplemente en el interés del Gobierno de Xi Jinping por incrementar su influencia
internacional.

![caras](/riesgos/secretismo/faces.png)

Volvamos a Silicon Valley. La competencia allí es feroz, no se cortan a la hora de robar todos los datos a su alcance, o
tomar todos los atajos posibles. En 2025 **fueron el principal lobby del país americano**. Particulares y empresas del
ámbito tecnológico aportaron enormes sumas para impulsar regulaciones que les favoreciesen.

La campaña inaugural de Trump en 2025 fue tres veces mayor que la de sus antecesores Joe Biden y Barack Obama, reuniendo
más de 170 millones de dólares en donaciones. Destacan figuras como la de Elon Musk, Cofundador de OpenAI y
posteriormente xAI, que **invirtió 277 millones de dólares durante la campaña de Trump y los Republicanos**. Lejos de
ser la única, la aportación de Musk es una más entre las de Meta, Google, Palantir, Microsoft, Amazon o Apple por
nombrar algunas. El objetivo de estas donaciones, así como su alcance real, son en gran parte un misterio para el resto
de la población.

> En EEUU, el sector tecnológico dona enormes sumas para impulsar regulaciones favorables

El resultado es un campo carente de regulación, donde las empresas operan a sus anchas, sin dar explicaciones, y sin
auditoría posible. En EEUU, las empresas que lideran este avance están sujetas a menos control que prácticamente
cualquier otra empresa. **Un empleado de un restaurante de comida rápida tiene que seguir unas regulaciones
considerablemente mayores que uno que se encuentre en el campo de la IA**. Y eso que EEUU no es famoso por su regulación
en dicho ámbito.

En septiembre de 2025, hubo [https://fortune.com/2025/09/05/trump-tech-dinner-full-attendee-list/](un encuentro) que
mostró el enorme vínculo entre el presidente y las empresas tecnológicas. A este singular evento fueron invitados 31
magnates de Silicon Valley. Entre ellos se encuentran nombres de la talla de:

- Mark Zuckerberg (Meta)
- Bill Gates (Microsoft)
- Tim Cook (Apple)
- Sundar Pichai (Google)
- Sam Altman (OpenAI)
- ....

No, Elon Musk no fue invitado. Pero al igual que él, los allí presentes gozan de unas condiciones legales extremadamente
favorables para su actividad empresarial. A su vez, sus empresas están cada vez más vinculadas con la gestión del país.
Educación, sanidad, economía, seguridad... **Poco a poco, han conseguido acaparar una cantidad de competencias que les
hace indispensables para el funcionamiento de la nación**. Se genera así una dependencia mutua que dificulta la
supervisión de su trabajo, así como la rendición de cuentas.

![reunion](/riesgos/secretismo/reunion.png)

## Las leyes que nos protegen

El enfoque al que se supedita el plan de acción sobre IA de la administración Trump
([America's AI Action Plan](https://www.whitehouse.gov/wp-content/uploads/2025/07/Americas-AI-Action-Plan.pdf)) es
"ganar la carrera" contra China: aboga por suprimir los trámites burocráticos (página 3), aunque por lo menos admite el
deficiente conocimiento que hay sobre los mecanismos internos de la IA, y propone invertir en interpretabilidad y
control (página 9).

En cualquier caso, no parece haber muchas garantías de que en EEUU el apartado de seguridad vaya a tratarse de manera
seria en medio del estruendo del tecno-optimismo, la dinámica de la carrera internacional, y el peso de los donantes.

La batalla por una legislación que pida unas mínimas responsabilidades a las empresas la están dando allí estados como
California ([con la ley SB 53](https://www.gov.ca.gov/2025/09/29/governor-newsom-signs-sb-53-advancing-californias-world-leading-artificial-intelligence-industry/))
y Nueva York (cuyo reglamento
[RAISE, 'Responsible AI Safety and Education'](https://www.nysenate.gov/legislation/bills/2025/A6453/amendment/A), se
encuentra en tramitación al escribir este artículo). A esto se opuso **la propuesta de prohibir a los estados que
legislaran sobre IA, ¡en los próximos diez años!** Fue una iniciativa incluida en la mastodóndica ley 'Big Beautiful
Bill' y tumbada por 99 votos a uno tras una [movilización popular](https://pauseaius.substack.com/p/pauseai-us-newsletter-5-august-2025?open=false#%C2%A7ai-preemption-defeated-a-tale-of-grassroots-victory)
en la que participó PauseAI USA. Pero el [mensaje](https://truthsocial.com/@realDonaldTrump/posts/115573090200730933)
que meses después Trump lanzó contra el "exceso de regulación" por parte de los estados del país augura que la batalla
continuará.

En el caso de la Unión Europea, la situación es algo distinta: contamos con un reglamento comunitario
([el 'AI Act'](https://www.boe.es/buscar/doc.php?id=DOUE-L-2024-81079)). Es complejo y con lagunas, pero se esfuerza en
establecer una clasificación de riesgos de los productos y aplicaciones, dejando vía libre a las empresas cuando se
considere que el peligro es mínimo, y aplicando medidas de supervisión en el resto de casos. Los "modelos de uso
general" como ChatGPT ocupan un apartado especial por conllevar a juicio de la UE **"riesgos sistémicos"** que podrían
"afectar a la sociedad en su conjunto" (capítulo 1, artículo 3, punto 65).

> El Reglamento Europeo sobre IA no pone trabas a los usos militares o relacionados con la seguridad nacional

No obstante, el capítulo 1 también deja claro en su artículo 2.3 que **el Reglamento Europeo no afecta a sistemas de
inteligencia artificial que se usen "con fines militares, de defensa o de seguridad nacional"**. Queda abierta la puerta
por tanto a todo tipo de abusos cometidos bajo esa excusa. Y los derechos de los ciudadanos podrían diluirse todavía más
si salen adelante revisiones a la baja del Reglamento. Por ejemplo el
['Digital Omnibus'](https://digital-strategy.ec.europa.eu/en/library/digital-omnibus-regulation-proposal) propuesto por
la Comisión Europea contempla retrasar [16 meses](https://elpais.com/tecnologia/2025-11-19/la-ue-concede-a-las-tecnologicas-16-meses-mas-para-que-su-ia-de-alto-riesgo-cumpla-la-normativa.html)
la entrada en vigor de la normativa sobre sistemas de IA de alto riesgo: un 'periodo de gracia' de un año y cuatro meses
a beneficio del sector tecnológico. Este tipo de propuestas se presentan con un mensaje de simplificar la legislación y
favorecer la competitividad, pero hemos de estar alerta, no vaya a ser que el resultado nos perjudique a todos.

La batalla en la regulación no solo se está viviendo a nivel gubernamental, también la estamos empezando a ver dentro de
todas estas empresas. OpenAI, Facebook, Amazon, todas habían tenido un compromiso con no adentrarse en lo militar,
señalando las implicaciones morales de esto. Google tenía en sus inicios el lema "do no _evil_" (no hagas mal), el cual
silenciosamente eliminó tiempo después. De la misma forma, **desaparecieron también las cláusulas que prevenían que
estas empresas pusieran pie en la industria militar**.

## Datos de dudosa procedencia

Comportamientos similares venían sucedido durante tiempo en otros terrenos de las tecnologías de la información. Los
perfiles de gustos de usuarios, el almacenamiento de biometrías, las redes de contactos, las interacciones con el
contenido... Todos eran datos explotables, pero con implicaciones que no invitaban a la transparencia por parte de
quienes lo hacían.

No por gusto, **la IA es un fruto del dato**. Se basa en su recopilación y estudio en masa. La calidad y capacidad de
los modelos depende de cuánto datos se tenga para entrenarlos, y de qué tan buenos o útiles sean. En ocasiones, como
sucede en la sanidad, dar un acceso completo y participativo a los datos favorece la reproducibilidad, la cooperación, y
el rigor en el trabajo de los investigadores. Pero en la mayoría de casos fuera de este campo, donde el objetivo es
dominar el mercado, el dato se trata como una herramienta comercial y de inteligencia más. De nuevo, el conflicto reside
en que desconocemos a cuántos datos tienen verdaderamente acceso estas empresas. Pero hay antecedentes que pueden
suscitar cierta preocupación.

> Asistimos a una búsqueda desesperada de datos para mejorar los modelos de inteligencia artificial

Tal y como anunció el ex trabajador de la CIA Edward Snowden hace más de una década, grandes corporaciones trabajaban ya
con agencias de la inteligencia estadounidense por aquel entonces. Con el pretexto de la seguridad nacional, o lo que
fuera que estuviese de moda en su momento, se había habilitado un sistema que **permitía recopilar, y en casos
conservar, información de la vida privada de los ciudadanos dentro y fuera de el país**. Muchas de éstas son las mismas
empresas que hoy día lideran el avance de la IA, las cuales buscan de forma desesperada acceso a todos los datos
posibles para mejorar así sus modelos.

Dada la cantidad de facilidades y recursos que EEUU ha otorgado a dichas empresas recientemente, no es descabellado
pensar que hayan permitido hacer la vista gorda para la explotación de esta información privada. Por otro lado, los
_data brokers_ inundaban e inundan la red, ofreciendo acceso a estos mismos datos. Estos se dedican a recopilar y vender
odo aquello que desvelamos de nosotros en la red (o lo que logran atrapar por otros medios).

A una escala desconocida, pero innegablemente alta, **los modelos se entrenan con datos de la vida de personas reales**.
Más allá de las posibles vulnerabilidades que esto acarrea, da una razón más a las empresas para denegar trazabilidad en
sus datos.

## Analfabetos tecnológicos al frente

El último catalizador de este fenómeno se encuentra fuera de las empresas tecnológicas. Hay un detalle que diferencia a
quienes lideran el desarrollo de la IA de quienes la regulan. La sociedad y sus líderes carecen de recursos para
comprender y participar en el desarrollo de la IA. La falta de información, la confidencialidad del proceso, los
conflictos de interés de muchos dirigentes, la inmensa influencia de estas empresas... Pueden dar forma a la opinión
pública, el acceso a la información, la educación y cultura.

A esta asimetría en la información se le suma la ingente cantidad de dinero invertida en sesgar la opinión de ciertos
líderes, el cuento de la guerra tecnológica, las promesas de riquezas sin fin, y un constante blanqueamiento y
ensalzamiento de la IA. **Nos enfrentamos a un problema donde las personas con capacidad de decisión o bien no saben
absolutamente nada del campo, o trabajan para una empresa tecnológica**.

Por suerte, vivimos en democracia, y hay una cura para esto. Hay que leer, alfabetizarse, darle un espacio a la IA en
nuestras conversaciones equivalente al peso que tiene en nuestras vidas. **La IA puede traer consecuencias maravillosas,
pero de ello depende que quienes la impulsan las tengan como objetivo**. Si esta tecnología va a ser tan transformadora
como prometen, deberíamos tener todos el derecho y la capacidad de dar forma a esta transformación.

Esto comienza por entenderla.

---

✍️Esta página fue redactada al 100% por un humano.

Secretismo y ambición es una pésima combinación que guía la carrera de la IA.
[Únete a PauseAI](https://pauseai.es/inscripcion) y ayúdanos a impulsar una pausa en el desarrollo de los modelos
avanzados de inteligencia artificial hasta que se demuestre que son seguros.
