import { useEffect, useState } from 'react'
import PokemonList from './PokemonList.jsx'
import PokemonDetail from './PokemonDetail.jsx'

export default function App() {
  // Las rutas usan # (por ejemplo #/pokemon/25) para que funcionen en GitHub Pages
  const [ruta, setRuta] = useState(window.location.hash)
  const [conectado, setConectado] = useState(navigator.onLine)

  useEffect(() => {
    const actualizar = () => {
      setRuta(window.location.hash)
      setConectado(navigator.onLine)
    }
    window.addEventListener('hashchange', actualizar)
    window.addEventListener('online', actualizar)
    window.addEventListener('offline', actualizar)
    return () => {
      window.removeEventListener('hashchange', actualizar)
      window.removeEventListener('online', actualizar)
      window.removeEventListener('offline', actualizar)
    }
  }, [])

  const id = ruta.match(/^#\/pokemon\/(.+)$/)?.[1]

  return (
    <>
      <header className="header">
        <a href="#/">Pokédex</a>
      </header>
      {!conectado && <div className="offline">Sin conexión: mostrando datos guardados</div>}
      <main>{id ? <PokemonDetail id={id} /> : <PokemonList />}</main>
    </>
  )
}
