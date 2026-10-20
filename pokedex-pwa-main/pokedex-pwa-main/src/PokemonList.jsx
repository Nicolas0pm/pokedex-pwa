import { useEffect, useState } from 'react'
import { getPokemonList, getTypes } from './api.js'
import TypeBadge from './TypeBadge.jsx'

const LIMIT = 20
const number = (id) => '#' + String(id).padStart(3, '0')

export default function PokemonList() {
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(0)
  const [types, setTypes] = useState([])
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  // Tipos para el filtro
  useEffect(() => {
    getTypes().then((r) => setTypes(r?.data || [])).catch(() => {})
  }, [])

  // Debounce: espera a que el usuario deje de escribir
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(text.trim().toLowerCase())
      setPage(0)
    }, 400)
    return () => clearTimeout(t)
  }, [text])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getPokemonList({ limit: LIMIT, offset: page * LIMIT, search, type })
      .then((r) => active && setResult(r))
      .catch((e) => active && setError(e.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [search, type, page, retry])

  const total = result?.meta.total || 0
  const pages = Math.ceil(total / LIMIT)

  return (
    <>
      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por nombre..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            setPage(0)
          }}
        >
          <option value="">Todos los tipos</option>
          {types.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name} ({t.pokemonCount})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="card skeleton" />
          ))}
          <p className="message">Cargando... la primera vez puede tardar hasta un minuto mientras el servidor despierta.</p>
        </div>
      )}

      {!loading && error && (
        <div className="message">
          <p>{error}</p>
          <button onClick={() => setRetry((r) => r + 1)}>Reintentar</button>
        </div>
      )}

      {!loading && !error && result?.data.length === 0 && (
        <p className="message">No se encontraron Pokémon.</p>
      )}

      {!loading && !error && result?.data.length > 0 && (
        <>
          <div className="grid">
            {result.data.map((p) => (
              <a key={p.id} href={`#/pokemon/${p.id}`} className="card">
                <img src={p.sprite} alt={p.name} loading="lazy" width="96" height="96" />
                <small>{number(p.id)}</small>
                <strong>{p.name}</strong>
                <div>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
              </a>
            ))}
          </div>
          {pages > 1 && (
            <div className="pager">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}>
                Anterior
              </button>
              <span>
                Página {page + 1} de {pages}
              </span>
              <button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
