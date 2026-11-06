// Genera linkedin.md con textos listos para copiar y pegar en LinkedIn, a partir de perfil.json
import { readFileSync, writeFileSync } from "node:fs";

const p = JSON.parse(readFileSync("perfil.json", "utf8"));
const { persona: per, contacto: c, habilidades: h } = p;

// Límites de caracteres de LinkedIn
const LIM = { titular: 220, acerca: 2600, experiencia: 2000, proyecto: 2000 };
const avisos = [];
const medir = (nombre, texto, limite) => {
  const n = [...texto].length;
  if (n > limite) avisos.push(`⚠️ ${nombre}: ${n}/${limite} caracteres. Recórtalo en perfil.json.`);
  return `<sub>${n}/${limite} caracteres</sub>`;
};

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
const fecha = (f) => {
  if (!f) return null;
  if (f === "Actual") return "Actualidad";
  const [a, m] = f.split("-");
  return m ? `${MESES[Number(m) - 1]}. ${a}` : a;
};
const ESTADOS = {
  produccion: "En producción", publicado: "Publicado", desarrollo: "En desarrollo",
  privado: "Privado", colaboracion: "Colaboración externa", academico: "Proyecto académico",
};

// 1. Titular
const titular = `${per.titular} | ${per.frase.replace(/\.$/, "")}`;

// 2. Acerca de
const proyectosLi = p.proyectos.filter((x) => x.canales.includes("linkedin"));
const acerca = [
  per.sobre_mi,
  "",
  "🔍 Lo que hago:",
  "• Pruebas de calidad (QA): casos de prueba, reporte de defectos, Gherkin y pruebas de API con Postman.",
  `• Desarrollo web con ${h.desarrollo.slice(0, 3).join(", ")} y bases de datos SQL.`,
  "• Automatización de procesos operativos.",
  "",
  "📂 Proyectos destacados:",
  ...proyectosLi.slice(0, 3).map((x) => `• ${x.nombre}: ${x.descripcion}`),
  "",
  `🏢 Fundador de Gutierrez Systems: ${c.empresa}`,
  `🌐 Portafolio: ${c.portafolio}`,
  `💻 GitHub: ${c.github}`,
  "",
  `📩 ${c.correo}`,
].join("\n");

// Medir antes de construir el contenido para que sus avisos entren en "⚠️ Revisar"
const medidaTitular = medir("Titular", titular, LIM.titular);
const medidaAcerca = medir("Acerca de", acerca, LIM.acerca);

// 3. Experiencia
const experiencia = p.experiencia.map((e) => {
  const desde = fecha(e.inicio);
  const hasta = fecha(e.fin);
  const periodo = desde ? `${desde} – ${hasta}` : hasta;
  return `### ${e.cargo}
- **Empresa:** ${e.empresa}
- **Periodo:** ${periodo}
- **Descripción:**

\`\`\`
${e.resumen}
\`\`\`
${medir(`Experiencia "${e.cargo}"`, e.resumen, LIM.experiencia)}`;
}).join("\n\n");

// 4. Proyectos
const proyectos = proyectosLi.map((x) => {
  const desc = `${x.descripcion}${x.stack?.length ? `\n\nTecnologías: ${x.stack.join(", ")}` : ""}\nEstado: ${ESTADOS[x.estado] ?? x.estado}`;
  return `### ${x.nombre}
- **Enlace:** ${x.url ?? "—"}
- **Descripción:**

\`\`\`
${desc}
\`\`\`
${medir(`Proyecto "${x.nombre}"`, desc, LIM.proyecto)}`;
}).join("\n\n");

// 5. Aptitudes (LinkedIn permite destacar 5 arriba)
const aptitudes = [...h.qa.slice(0, 3), ...h.lenguajes, ...h.desarrollo.slice(0, 3), ...h.bases_de_datos.slice(0, 2), "Git", "Scrum"];

// 6. Formación e idiomas
const formacion = p.formacion.map((f) => `- **${f.titulo}** — ${f.institucion} · ${f.estado}`).join("\n");
const idiomas = p.idiomas.map((i) => `- ${i.idioma}: ${i.nivel}`).join("\n");

const md = `<!-- ⚠️ Archivo generado automáticamente desde perfil.json. No lo edites a mano. -->

# Textos para LinkedIn

> Copia cada bloque y pégalo en la sección correspondiente de tu perfil. Generado el ${p.actualizado}.

${avisos.length ? `## ⚠️ Revisar\n\n${avisos.map((a) => `- ${a}`).join("\n")}\n` : ""}
## 1. Titular
*Perfil → lápiz junto a tu nombre → Titular*

\`\`\`
${titular}
\`\`\`
${medidaTitular}

## 2. Acerca de
*Perfil → Acerca de → lápiz*

\`\`\`
${acerca}
\`\`\`
${medidaAcerca}

## 3. Experiencia
*Perfil → Experiencia → + o lápiz en cada cargo*

${experiencia}

## 4. Proyectos
*Perfil → Añadir sección → Recomendado → Añadir proyectos*

${proyectos}

## 5. Aptitudes
*Perfil → Aptitudes → +. Fija arriba las 5 primeras.*

${aptitudes.map((a, i) => `${i + 1}. ${a}`).join("\n")}

## 6. Educación
${formacion}

## 7. Idiomas
${idiomas}

## 8. Información de contacto
- Sitio web (Empresa): ${c.empresa}
- Sitio web (Portafolio): ${c.portafolio}
- Sitio web (Otro): ${c.github}
`;

writeFileSync("linkedin.md", md);
console.log(`linkedin.md generado: ${p.experiencia.length} experiencias, ${proyectosLi.length} proyectos.`);
if (avisos.length) avisos.forEach((a) => console.warn(a));
