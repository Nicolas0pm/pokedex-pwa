import { useEffect, useState } from 'react'
import { getPokemon } from './api.js'
import TypeBadge from './TypeBadge.jsx'

const STATS = {
  hp: 'HP', attack: 'Ataque', defense: 'Defensa',
  specialAttack: 'At. Esp.', specialDefense: 'Def. Esp.', speed: 'Velocidad',
}

export default function PokemonDetail({ id }) {
  const [pokemon, setPokemon] = useState(undefined)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    setPokemon(undefined)
    setError('')
    getPokemon(id)
      .then((p) => active && setPokemon(p))
      .catch((e) => active && setError(e.message))
    window.scrollTo(0, 0)
    return () => {
      active = false
    }
  }, [id, retry])

  if (error)
    return (
      <div className="message">
        <p>{error}</p>
        <button onClick={() => setRetry((r) => r + 1)}>Reintentar</button>
      </div>
    )

  if (pokemon === undefined) return <p className="message">Cargando...</p>

  if (pokemon === null)
    return (
      <div className="message">
        <h2>Pokémon no encontrado</h2>
        <a href="#/" className="button">Volver al listado</a>
      </div>
    )

  return (
    <article className="detail">
      <a href="#/">← Volver</a>
      <img src={pokemon.sprites.artworkOfficial} alt={pokemon.name} className="artwork" />
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

      <h2>Stats base</h2>
      {Object.entries(STATS).map(([key, label]) => (
        <div key={key} className="stat">
          <span>{label}</span>
          <span>{pokemon.stats[key]}</span>
          <div className="bar">
            <div style={{ width: `${Math.min(100, (pokemon.stats[key] / 160) * 100)}%` }} />
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
