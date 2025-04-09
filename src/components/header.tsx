import NavLink from "./nav-link"

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center py-4">
      <h1 className="text-4xl">Salvo Santos</h1>
      <nav>
        <ul>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/ranking">Ranking</NavLink>
          <NavLink to="/config">Configurações</NavLink>
        </ul>
      </nav>
    </header>
  )
}
export default Header
