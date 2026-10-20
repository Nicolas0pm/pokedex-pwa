const API = import.meta.env.VITE_API_URL || 'https://pokedex-backend-g1ql.onrender.com'

// fetch con tiempo límite (el backend puede tardar ~50s en despertar)
async function get(path) {
  const control = new AbortController()
  const timer = setTimeout(() => control.abort(), 60000)
  try {
    const res = await fetch(API + path, { signal: control.signal })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Error del servidor (${res.status})`)
    return await res.json()
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('El servidor tardó demasiado en responder')
    if (err instanceof TypeError) throw new Error('No hay conexión con el servidor')
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export function getPokemonList({ limit = 20, offset = 0, search = '', type = '' }) {
  const params = new URLSearchParams({ limit, offset })
  if (search) params.set('search', search)
  if (type) params.set('type', type)
  return get(`/api/pokemon?${params}`)
}

export const getPokemon = (idOrName) => get(`/api/pokemon/${idOrName}`)
export const getTypes = () => get('/api/types')
