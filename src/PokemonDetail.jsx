import { useEffect } from 'react'
import { getPokemon, useFetch } from './api.js'
import TypeBadge from './TypeBadge.jsx'

const TOTAL = 151 // Pokémon de la primera generación

const ESTADISTICAS = {
  hp: 'PS', attack: 'Ataque', defense: 'Defensa',
  specialAttack: 'At. Esp.', specialDefense: 'Def. Esp.', speed: 'Velocidad',
}

export default function PokemonDetail({ id }) {
  const { data: pokemon, loading, error, retry } = useFetch(() => getPokemon(id), [id])

  // Al cambiar de Pokémon, subir al inicio de la página
  useEffect(() => window.scrollTo(0, 0), [id])

  if (loading) return <p className="message">Cargando...</p>

  if (error)
    return (
      <div className="message">
        <p>{error}</p>
        <button onClick={retry}>Reintentar</button>
      </div>
    )

  if (!pokemon)
    return (
      <div className="message">
        <h2>Pokémon no encontrado</h2>
        <a href="#/" className="button">Volver al listado</a>
      </div>
    )

  const anterior = pokemon.id - 1
  const siguiente = pokemon.id + 1

  return (
    <article className="detail">
      <a href="#/">← Volver</a>

      <div className="navegacion">
        {anterior >= 1 ? (
          <a href={`#/pokemon/${anterior}`} className="flecha" aria-label="Pokémon anterior">‹</a>
        ) : (
          <span className="flecha desactivada">‹</span>
        )}

        <img src={pokemon.sprites.artworkOfficial} alt={pokemon.name} className="artwork" />

        {siguiente <= TOTAL ? (
          <a href={`#/pokemon/${siguiente}`} className="flecha" aria-label="Pokémon siguiente">›</a>
        ) : (
          <span className="flecha desactivada">›</span>
        )}
      </div>

      <h1>
        #{String(pokemon.id).padStart(3, '0')} {pokemon.name}
      </h1>
      <p className="genus">{pokemon.genus}</p>
      <div>
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </div>
      <p>{pokemon.flavorText}</p>
      <p>
        Altura: {pokemon.height / 10} m · Peso: {pokemon.weight / 10} kg
      </p>

      <h2>Habilidades</h2>
      <ul>
        {pokemon.abilities.map((a) => (
          <li key={a.name}>
            {a.name} {a.isHidden && <em>(oculta)</em>}
          </li>
        ))}
      </ul>

      <h2>Estadísticas base</h2>
      {Object.entries(ESTADISTICAS).map(([clave, nombre]) => (
        <div key={clave} className="stat">
          <span>{nombre}</span>
          <span>{pokemon.stats[clave]}</span>
          <div className="bar">
            <div style={{ width: `${Math.min(100, (pokemon.stats[clave] / 160) * 100)}%` }} />
          </div>
        </div>
      ))}

      <h2>Evoluciones</h2>
      <div className="evolutions">
        {pokemon.evolvesFrom && (
          <a href={`#/pokemon/${pokemon.evolvesFrom.id}`} className="card">
            Evoluciona de
            <strong>{pokemon.evolvesFrom.name}</strong>
          </a>
        )}
        {pokemon.evolvesTo.map((e) => (
          <a key={e.id} href={`#/pokemon/${e.id}`} className="card">
            Evoluciona a
            <strong>{e.name}</strong>
          </a>
        ))}
        {!pokemon.evolvesFrom && pokemon.evolvesTo.length === 0 && <p>No tiene evoluciones.</p>}
      </div>
    </article>
  )
}
