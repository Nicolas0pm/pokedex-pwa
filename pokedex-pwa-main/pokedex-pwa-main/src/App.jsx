import { useEffect, useState } from 'react'
import PokemonList from './PokemonList.jsx'
import PokemonDetail from './PokemonDetail.jsx'

// Rutas con # (#/pokemon/25) para que funcionen en GitHub Pages
function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export default function App() {
  const hash = useHash()
  const online = useOnline()
  const match = hash.match(/^#\/pokemon\/(.+)$/)

  return (
    <>
      <header className="header">
        <a href="#/">Pokedex</a>
      </header>
      {!online && <div className="offline">Estás offline — mostrando datos guardados</div>}
      <main>{match ? <PokemonDetail id={match[1]} /> : <PokemonList />}</main>
    </>
  )
}
