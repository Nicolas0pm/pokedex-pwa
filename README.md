# Pokedex PWA

PWA tipo Pokedex (151 Pokémon de la primera generación) que consume el backend
[pokedex-backend](https://github.com/RickyFreefly/pokedex-backend).

**App desplegada:** https://nicolas0pm.github.io/pokedex-pwa/

## Integrantes

- Nicolas Esteban Rodriguez Calderon ([@Nicolas0pm](https://github.com/Nicolas0pm))
- Santiago Stiven Gutierrez Moralez ([@VantaSec1727](https://github.com/VantaSec1727))

## Funcionalidades

- Listado con paginación, sprite, número, nombre y tipos con color
- Búsqueda por nombre (con debounce) y filtro por tipo
- Detalle con flechas para pasar al Pokémon anterior o siguiente: artwork, descripción, altura/peso, habilidades (ocultas marcadas), stats y evoluciones
- Pantalla "Pokémon no encontrado" (404), estados de carga, vacío y error con reintento
- Instalable como PWA y funciona offline con lo ya visitado (service worker)
- Aviso cuando no hay conexión

## Correr en local

```bash
npm install
cp .env.example .env
npm run dev
```

## Despliegue

Se publica automáticamente en GitHub Pages con GitHub Actions en cada push a `main`
(`.github/workflows/deploy.yml`).
