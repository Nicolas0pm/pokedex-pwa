// Nombre en español y color de cada tipo
export const TIPOS = {
  normal: ['Normal', '#a8a878'],
  fire: ['Fuego', '#f08030'],
  water: ['Agua', '#6890f0'],
  grass: ['Planta', '#78c850'],
  electric: ['Eléctrico', '#f8d030'],
  ice: ['Hielo', '#98d8d8'],
  fighting: ['Lucha', '#c03028'],
  poison: ['Veneno', '#a040a0'],
  ground: ['Tierra', '#e0c068'],
  flying: ['Volador', '#a890f0'],
  psychic: ['Psíquico', '#f85888'],
  bug: ['Bicho', '#a8b820'],
  rock: ['Roca', '#b8a038'],
  ghost: ['Fantasma', '#705898'],
  dragon: ['Dragón', '#7038f8'],
  dark: ['Siniestro', '#705848'],
  steel: ['Acero', '#b8b8d0'],
  fairy: ['Hada', '#ee99ac'],
}

export const nombreTipo = (tipo) => TIPOS[tipo]?.[0] || tipo

export default function TypeBadge({ type }) {
  return (
    <span className="badge" style={{ background: TIPOS[type]?.[1] || '#777' }}>
      {nombreTipo(type)}
    </span>
  )
}
