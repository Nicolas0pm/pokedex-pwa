import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL || 'https://pokedex-backend-g1ql.onrender.com'

// Pide datos al servidor. Espera hasta 60 s porque el servidor puede tardar en despertar.
async function get(ruta) {
  try {
    const res = await fetch(API + ruta, { signal: AbortSignal.timeout(60000) })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Error del servidor (${res.status})`)
    return await res.json()
  } catch (err) {
    if (err.name === 'TimeoutError') throw new Error('El servidor tardó demasiado en responder')
    if (err instanceof TypeError) throw new Error('No hay conexión con el servidor')
    throw err
  }
}

export function getPokemonList({ limit, offset, search, type }) {
  const params = new URLSearchParams({ limit, offset })
  if (search) params.set('search', search)
  if (type) params.set('type', type)
  return get(`/api/pokemon?${params}`)
}

export const getPokemon = (id) => get(`/api/pokemon/${id}`)
export const getTypes = () => get('/api/types')

// Hook que carga datos y devuelve { data, loading, error, retry }.
// Se vuelve a ejecutar cada vez que cambia algo de la lista "deps".
export function useFetch(cargar, deps) {
  const [data, setData] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError('')
    cargar()
      .then((d) => activo && setData(d))
      .catch((e) => activo && setError(e.message))
      .finally(() => activo && setLoading(false))
    return () => (activo = false)
  }, [...deps, intento])

  return { data, loading, error, retry: () => setIntento(intento + 1) }
}
