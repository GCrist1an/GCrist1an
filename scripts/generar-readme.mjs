// Genera README.md del perfil de GitHub a partir de perfil.json
import { readFileSync, writeFileSync } from "node:fs";

const p = JSON.parse(readFileSync("perfil.json", "utf8"));
const { persona: per, contacto: c, habilidades: h } = p;

const ESTADOS = {
  produccion: "🟢 En producción",
  publicado: "🟢 Publicado",
  desarrollo: "🟡 En desarrollo",
  privado: "🔒 Privado",
  colaboracion: "🤝 Colaboración externa",
  academico: "🎓 Académico",
};

const proyectos = p.proyectos
  .filter((x) => x.canales.includes("github"))
  .map((x) => {
    const titulo = x.url ? `[${x.nombre}](${x.url})` : x.nombre;
    const stack = x.stack?.length ? `\n  **Stack:** ${x.stack.join(" · ")}` : "";
    return `- **${titulo}** — ${ESTADOS[x.estado] ?? x.estado}\n  ${x.descripcion}${stack}`;
  })
  .join("\n");

const wa = c.whatsapp ? `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` : null;

const md = `<!-- ⚠️ Archivo generado automáticamente desde perfil.json. No lo edites a mano: edita perfil.json. -->

# ${per.nombre_corto}

### ${per.titular}

> ${per.frase}

[![Portafolio](https://img.shields.io/badge/Portafolio-30363d?style=for-the-badge&logo=vercel&logoColor=white)](${c.portafolio}) [![Gutierrez Systems](https://img.shields.io/badge/Gutierrez_Systems-30363d?style=for-the-badge&logo=googlechrome&logoColor=white)](${c.empresa}) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](${c.linkedin}) [![Email](https://img.shields.io/badge/Email-30363d?style=for-the-badge&logo=gmail&logoColor=white)](mailto:${c.correo})${wa ? ` [![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](${wa})` : ""}

---

## Sobre mí

${per.sobre_mi}

📍 ${per.ubicacion} · ${per.disponibilidad}

---

## Habilidades

| Área | Herramientas |
|---|---|
| **QA** | ${h.qa.join(" · ")} |
| **Lenguajes** | ${h.lenguajes.join(" · ")} |
| **Desarrollo** | ${h.desarrollo.join(" · ")} |
| **Bases de datos** | ${h.bases_de_datos.join(" · ")} |
| **Herramientas** | ${h.herramientas.join(" · ")} |

---

## Trabajo seleccionado

${proyectos}

> Parte de los proyectos de Gutierrez Systems son privados, por eso la actividad visible puede no reflejar todo el trabajo realizado.

[![Actividad de GitHub](./profile/streak.svg)](./profile/streak.svg)

---

## Principios de ingeniería

- ✅ **Seguridad por defecto.** Secretos fuera del repositorio y exposición mínima de datos sensibles.
- ✅ **Calidad verificable.** Probar antes de entregar: casos de prueba, evidencia y trazabilidad.
- ✅ **Entrega trazable.** Rama → Pull Request → checks → \`main\`.
- ✅ **Evidencia real.** No presentar métricas, productos ni resultados sin respaldo.
- ✅ **Problemas reales primero.** Cada sistema responde a una necesidad operativa concreta.

---

## Gutierrez Systems

Software · QA · Automatización · Operaciones digitales — [${c.empresa.replace(/^https?:\/\//, "").replace(/\/$/, "")}](${c.empresa}) · [Organización en GitHub](https://github.com/Gutierrez-Systems)

---

<sub>Última actualización del perfil: ${p.actualizado}</sub>
`;

writeFileSync("README.md", md);
console.log("README.md generado con", p.proyectos.filter((x) => x.canales.includes("github")).length, "proyectos.");
