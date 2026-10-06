import type { ProjectShowcase } from "../../types";
import UrlImage from "../../assets/img/lab-url.png";

export const urlShowcase: ProjectShowcase = {
  summary:
    "Gestión personal de enlaces con un espacio privado y redirecciones públicas.",
  status: "private",
  statusNote:
    "La aplicación de gestión requiere autenticación del propietario. Este caso de estudio muestra la implementación; los enlaces emitidos se pueden visitar sin iniciar sesión.",
  description:
    "Crea, copia, lista y elimina enlaces cortos desde una interfaz exclusiva del propietario. Una ruta de Astro resuelve cada código numérico mediante la API del backend y redirige al destino almacenado.",
  purpose:
    "Una herramienta full-stack práctica para convertir URLs largas en enlaces fáciles de compartir, con una separación clara entre la gestión privada y la resolución pública.",
  images: [
    {
      src: UrlImage,
      alt: "Interfaz anterior del acortador con el campo de URL y la tabla de enlaces guardados.",
      caption:
        "Interfaz anterior: creación y listado de enlaces. El espacio de gestión actual requiere autenticación del propietario.",
    },
  ],
  highlights: [
    {
      title: "Asignación fiable de códigos",
      description:
        "Códigos numéricos aleatorios criptográficamente seguros, índices únicos y reintentos limitados ante colisiones. La misma URL exacta reutiliza su enlace existente.",
    },
    {
      title: "Gestión privada, redirecciones públicas",
      description:
        "La autenticación protege la creación, el listado y la eliminación. Las credenciales del backend permanecen en el servidor; los visitantes resuelven enlaces sin acceso de propietario.",
    },
    {
      title: "Una API pequeña y explícita",
      description:
        "Un servicio Express guarda los enlaces en MongoDB mediante Mongoose. La paginación por cursor limita el tamaño de la lista de gestión.",
    },
    {
      title: "Validación y recuperación",
      description:
        "La validación de URLs HTTP(S) y de contratos de respuesta protege el límite de la API. La interfaz conserva la entrada ante fallos y respeta las pausas por límites de solicitudes.",
    },
  ],
  tech: [
    "Astro",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
  ],
  links: [
    {
      label: "Repositorio frontend",
      url: "https://github.com/Khanos/khanos.frontend",
      type: "repository",
    },
    {
      label: "Repositorio backend",
      url: "https://github.com/Khanos/khanos.backend",
      type: "repository",
    },
  ],
};
