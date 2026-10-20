import { useEffect, useState } from 'react'
import { getPokemonList, getTypes, useFetch } from './api.js'
import TypeBadge, { nombreTipo } from './TypeBadge.jsx'

const POR_PAGINA = 20

export default function PokemonList() {
  const [texto, setTexto] = useState('') // lo que el usuario escribe
  const [busqueda, setBusqueda] = useState('') // lo que se envía al servidor
  const [tipo, setTipo] = useState('')
  const [pagina, setPagina] = useState(0)

  // Espera a que el usuario deje de escribir antes de buscar
  useEffect(() => {
    const espera = setTimeout(() => {
      setBusqueda(texto.trim().toLowerCase())
      setPagina(0)
    }, 400)
    return () => clearTimeout(espera)
  }, [texto])

  const tipos = useFetch(getTypes, [])
  const lista = useFetch(
    () => getPokemonList({ limit: POR_PAGINA, offset: pagina * POR_PAGINA, search: busqueda, type: tipo }),
    [busqueda, tipo, pagina]
  )

  const pokemones = lista.data?.data || []
  const totalPaginas = Math.ceil((lista.data?.meta.total || 0) / POR_PAGINA)

  return (
    <>
      <div className="filters">
        <input
          type="search"
          placeholder="Buscar por nombre..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />
        <select
          value={tipo}
          onChange={(e) => {
            setTipo(e.target.value)
            setPagina(0)
          }}
        >
          <option value="">Todos los tipos</option>
          {(tipos.data?.data || []).map((t) => (
            <option key={t.name} value={t.name}>
              {nombreTipo(t.name)} ({t.pokemonCount})
            </option>
          ))}
        </select>
      </div>

      {lista.loading ? (
        <p className="message">
          Cargando... la primera vez puede tardar hasta un minuto mientras el servidor despierta.
        </p>
      ) : lista.error ? (
        <div className="message">
          <p>{lista.error}</p>
          <button onClick={lista.retry}>Reintentar</button>
        </div>
      ) : pokemones.length === 0 ? (
        <p className="message">No se encontraron Pokémon.</p>
      ) : (
        <>
          <div className="grid">
            {pokemones.map((p) => (
              <a key={p.id} href={`#/pokemon/${p.id}`} className="card">
                <img src={p.sprite} alt={p.name} loading="lazy" width="96" height="96" />
                <small>#{String(p.id).padStart(3, '0')}</small>
                <strong>{p.name}</strong>
                <div>
                  {p.types.map((t) => (
                    <TypeBadge key={t} type={t} />
                  ))}
                </div>
              </a>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="pager">
              <button disabled={pagina === 0} onClick={() => setPagina(pagina - 1)}>
                Anterior
              </button>
              <span>
                Página {pagina + 1} de {totalPaginas}
              </span>
              <button disabled={pagina + 1 >= totalPaginas} onClick={() => setPagina(pagina + 1)}>
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
