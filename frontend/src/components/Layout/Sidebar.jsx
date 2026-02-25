import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useProject } from '../../context/ProjectContext'
import { useRole } from '../../context/RoleContext'
import './Sidebar.css'

const NAV_CLIENTE = [
  { to: '/dashboard',       icon: '📊', label: 'Dashboard' },
  { to: '/ivb',             icon: '🎯', label: 'Voto Blando (IVB)' },
  { divider: true },
  { to: '/narrativas',      icon: '📖', label: 'Narrativas' },
  { to: '/emociones',       icon: '🎭', label: 'Emociones' },
  { to: '/arquetipos',      icon: '👤', label: 'Arquetipos' },
  { to: '/lenguaje',        icon: '💬', label: 'Lenguaje' },
  { to: '/comunidades',     icon: '🌐', label: 'Comunidades' },
  { to: '/riesgos',         icon: '⚠️',  label: 'Riesgos' },
  { to: '/evolucion',       icon: '📈', label: 'Evolución' },
  { divider: true },
  { to: '/simulacion',      icon: '🤖', label: 'Simulación IA' },
  { to: '/recomendaciones', icon: '💡', label: 'Recomendaciones IA' },
]

const NAV_ADMIN_EXTRA = [
  { divider: true },
  { to: '/proyectos', icon: '🗂️', label: 'Proyectos' },
]

export default function Sidebar() {
  const { activeProject } = useProject()
  const { isAdmin, loginAdmin, logoutAdmin } = useRole()

  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')

  const NAV = isAdmin ? [...NAV_CLIENTE, ...NAV_ADMIN_EXTRA] : NAV_CLIENTE

  const handleLogin = () => {
    const ok = loginAdmin(password)
    if (ok) {
      setShowLogin(false)
      setPassword('')
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">🌍</span>
          <div className="brand-text">
            <h1>Social Rank</h1>
            <p>Bolivia · Gobernación SCZ</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) =>
            item.divider
              ? <div key={i} className="nav-divider" />
              : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              )
          )}
        </nav>

        {/* Indicador de rol + botón toggle */}
        <div className="sidebar-role">
          {isAdmin ? (
            <div className="role-row">
              <span className="role-dot dot-verde" />
              <span className="role-label">Administrador</span>
              <button className="role-exit-btn" onClick={logoutAdmin} title="Salir de modo admin">
                ✕ Salir
              </button>
            </div>
          ) : (
            <div className="role-row">
              <span className="role-dot dot-azul" />
              <span className="role-label">Vista Cliente</span>
              <button
                className="role-exit-btn role-admin-btn"
                onClick={() => { setShowLogin(true); setError('') }}
                title="Acceso administrador"
              >
                🔐 Admin
              </button>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="project-label">Proyecto activo</div>
          <div className="project-name">
            {activeProject ? activeProject.nombre : '— Sin proyecto —'}
          </div>
          {activeProject?.cliente && (
            <div className="project-client">{activeProject.cliente}</div>
          )}
        </div>
      </aside>

      {/* Modal de login admin */}
      {showLogin && (
        <div
          className="modal-overlay open"
          onClick={e => e.target.className.includes('modal-overlay') && setShowLogin(false)}
        >
          <div className="modal" style={{ maxWidth: 360 }}>
            <h3 style={{ marginBottom: 6 }}>🔐 Acceso Administrador</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 18 }}>
              Ingresa la contraseña para acceder a las herramientas de gestión y carga de datos.
            </p>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                autoFocus
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="Contraseña de administrador"
              />
            </div>
            {error && (
              <p style={{ fontSize: 12, color: 'var(--accent4)', marginTop: -8, marginBottom: 12 }}>
                ⚠️ {error}
              </p>
            )}
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => { setShowLogin(false); setPassword(''); setError('') }}
              >
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleLogin}>
                Ingresar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
