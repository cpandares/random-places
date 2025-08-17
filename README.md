# Random Places • Carabobo

Pequeña app en React + Vite para sortear lugares por categoría. Ahora integra Geoapify Places como fuente remota, con fallback a `src/data/random.json`.

## Configuración rápida

1) Crea tu API Key en Geoapify (gratis)
   - https://www.geoapify.com/

2) Copia el ejemplo de variables y añade tu key

```sh
cp .env.example .env
# edita .env y pon tu clave
```

3) Instala dependencias y ejecuta

```sh
npm install
npm run dev
```

La app intentará cargar lugares remotos por categoría. Si no hay `VITE_GEOAPIFY_KEY` o falla la petición, usa el dataset local.
