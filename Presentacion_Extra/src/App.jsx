import { useState, useEffect, useCallback } from 'react'
import './App.css'

/* ─────────────────────────────────────────────
   Primitive components
───────────────────────────────────────────── */
const Tag = ({ color, children }) => (
  <span className={`slide__tag tag--${color}`}>{children}</span>
)

const Card = ({ children, className = '', style = {} }) => (
  <div className={`card ${className}`} style={style}>{children}</div>
)

const Stat = ({ num, label, color }) => (
  <div className={`stat stat--${color}`}>
    <div className="stat__num">{num}</div>
    <div className="stat__label">{label}</div>
  </div>
)

const Pill = ({ children }) => <span className="pill">{children}</span>

const ListItem = ({ children, sub, icon = '›', iconColor }) => (
  <div className="list__item">
    <span className="list__icon" style={iconColor ? { color: iconColor } : {}}>{icon}</span>
    <div>
      <div className="list__text">{children}</div>
      {sub && <div className="list__sub">{sub}</div>}
    </div>
  </div>
)

const InfoBanner = ({ icon = 'ℹ', children }) => (
  <div className="info-banner">
    <span className="info-banner__icon">{icon}</span>
    <span>{children}</span>
  </div>
)

/* ─────────────────────────────────────────────
   Slide 1 — Resumen ejecutivo
───────────────────────────────────────────── */
function SlideResumen() {
  return (
    <div className="slide slide--active" id="slide-0">
      <Tag color="blue">📄 Resumen ejecutivo</Tag>
      <h1 className="slide__title">TuMangaOnline (TMO)<br />Operación y cierre</h1>

      <div className="grid-2-1">
        {/* Timeline */}
        <div className="timeline">
          {[
            { date: '2014', dot: '', title: 'Inicio de operaciones', sub: 'Distribución no autorizada de manga en español a gran escala' },
            { date: 'Durante operación', dot: '', title: 'Monetización agresiva', sub: 'Publicidad, pop-ups, criptomonedas, CDN, mirrors y dominios alternativos' },
            { date: 'Abril 2026', dot: 'danger', title: 'Desmantelamiento', sub: 'Operativo policial — 3 detenidos, servidores y monederos incautados' },
          ].map((item, i, arr) => (
            <div className="t-item" key={i}>
              <div className="t-line">
                <div className={`t-dot${item.dot ? ` t-dot--${item.dot}` : ''}`} />
                {i < arr.length - 1 && <div className="t-connector" />}
              </div>
              <div className="t-content">
                <div className="t-date">{item.date}</div>
                <div className="t-text">{item.title}</div>
                <div className="t-sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Stat num=">€4M" label="Ingresos acumulados estimados" color="red" />
          <Stat num="€400K+" label="Criptomonedas en monederos incautados" color="amber" />
          <Stat num="3" label="Personas detenidas en el operativo" color="blue" />
        </div>
      </div>

      <div className="pills">
        {['⚖️ Propiedad intelectual', '💻 Delitos informáticos', '₿ Posible lavado de activos', '🔒 Datos personales'].map(p => (
          <Pill key={p}>{p}</Pill>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Slide 2 — Marco normativo
───────────────────────────────────────────── */
function SlideMarco() {
  const laws = [
    {
      icon: '💻',
      iconColor: '#c4b5fd',
      label: 'Ley 21.459',
      title: 'Delitos informáticos',
      body: 'Acceso ilícito, interceptación, daño a sistemas e integridad de datos. Penas de presidio y multas.',
    },
    {
      icon: '©',
      iconColor: '#93c5fd',
      label: 'Ley 17.336',
      title: 'Derechos de autor',
      body: 'Infracción penal y civil por distribuir obras sin autorización. Bloqueo de dominios, retiro de contenidos, comiso.',
    },
    {
      icon: '🔒',
      iconColor: '#5eead4',
      label: 'Ley 19.628',
      title: 'Datos personales',
      body: 'Tratamiento sin base legal ni seguridad adecuada. Sanciones administrativas y obligaciones de reparación.',
    },
    {
      icon: '🪙',
      iconColor: '#fcd34d',
      label: 'Ley 20.393',
      title: 'Lavado de activos',
      body: 'Conversión de ingresos a criptomonedas. Responsabilidad penal de personas jurídicas involucradas.',
    },
  ]

  return (
    <div className="slide slide--active" id="slide-1">
      <Tag color="purple">⚖️ Marco normativo — Chile</Tag>
      <h1 className="slide__title">Leyes aplicables al caso</h1>

      <div className="grid-2">
        {laws.map(l => (
          <Card key={l.label}>
            <span className="card__icon" style={{ color: l.iconColor }}>{l.icon}</span>
            <div className="card__label">{l.label}</div>
            <div className="card__title">{l.title}</div>
            <div className="card__body">{l.body}</div>
          </Card>
        ))}
      </div>

      <InfoBanner icon="ℹ️">
        También aplica <strong style={{ color: '#f1f5f9' }}>Ley 19.496</strong> (protección al consumidor)
        si hubo cobros, suscripciones o publicidad engañosa dirigida a usuarios.
      </InfoBanner>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Slide 3 — Delitos Ley 21.459
───────────────────────────────────────────── */
function SlideDelitos() {
  return (
    <div className="slide slide--active" id="slide-2">
      <Tag color="red">⚠️ Tipificación penal</Tag>
      <h1 className="slide__title">Delitos Ley 21.459 aplicables</h1>

      <div className="grid-2">
        <div className="list" style={{ gap: 12 }}>
          <Card style={{ borderLeftColor: '#f87171', color: '#f87171' }} className="card__accent-left">
            <div className="card__label" style={{ color: '#f87171' }}>Art. 2 — Acceso ilícito</div>
            <div className="card__body" style={{ marginTop: 4 }}>
              Ingresar sin autorización superando barreras técnicas: credenciales robadas,
              explotación de vulnerabilidades o bypass de controles de acceso.
            </div>
            <div className="card__body" style={{ marginTop: 8, color: '#64748b' }}>
              <strong style={{ color: '#94a3b8' }}>Pena:</strong> presidio menor grado mínimo o multa;
              agravada si hubo ánimo de apoderamiento o divulgación.
            </div>
          </Card>

          <Card style={{ borderLeftColor: '#fbbf24', color: '#fbbf24' }} className="card__accent-left">
            <div className="card__label" style={{ color: '#fbbf24' }}>Art. 3 — Interceptación ilícita</div>
            <div className="card__body" style={{ marginTop: 4 }}>
              Comercializar, almacenar o usar datos obtenidos ilícitamente;
              suplantar identidades; defraudar mediante sistemas informáticos.
            </div>
            <div className="card__body" style={{ marginTop: 8, color: '#64748b' }}>
              Aplica directamente a la monetización con datos de usuarios de la plataforma.
            </div>
          </Card>
        </div>

        <div className="list" style={{ gap: 12 }}>
          <Card>
            <div className="card__label">Otras figuras concurrentes</div>
            <div className="list" style={{ marginTop: 10 }}>
              {[
                ['🗄️', 'Ataque a integridad de sistemas o datos'],
                ['🔄', 'Receptación de datos informáticos'],
                ['💳', 'Fraude informático'],
                ['🪪', 'Falsificación informática'],
              ].map(([icon, text]) => (
                <ListItem key={text} icon={icon}>{text}</ListItem>
              ))}
            </div>
          </Card>

          <Card className="card--surface">
            <div className="card__label">Agravante clave</div>
            <div className="card__body">
              Abuso de confianza por posición de administrador o explotación masiva
              con fines económicos puede elevar las penas aplicables.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Slide 4 — Comparación internacional
───────────────────────────────────────────── */
function SlideComparacion() {
  const rows = [
    { country: 'EE.UU.', law: 'CFAA — 18 U.S.C. §1030', sanctions: 'Prisión + multas + acciones civiles', level: 'high', featured: false },
    { country: 'Unión Europea', law: 'NIS2 Directive', sanctions: 'Sanciones admin. + responsabilidad directiva', level: 'med', featured: false },
    { country: 'Brasil', law: 'Ley 12.737 (Carolina Dieckmann)', sanctions: 'Detención + multa agravada por lucro', level: 'med', featured: false },
    { country: 'Chile ★', law: 'Ley 21.459', sanctions: 'Presidio + multas + incautación', level: 'high', featured: true },
  ]

  return (
    <div className="slide slide--active" id="slide-3">
      <Tag color="purple">🌐 Derecho comparado</Tag>
      <h1 className="slide__title">Marcos regulatorios internacionales</h1>

      <div className="comp-table">
        <div className="comp-row comp-row--head">
          <span>País / Marco</span>
          <span>Sanciones principales</span>
          <span>Aplicabilidad</span>
        </div>

        {rows.map(r => (
          <div key={r.country} className={`comp-row comp-row--body${r.featured ? ' comp-row--featured' : ''}`}>
            <div>
              <div className="comp__country">{r.country}</div>
              <div className="comp__law">{r.law}</div>
            </div>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>{r.sanctions}</div>
            <div>
              <span className={`badge badge--${r.level}`}>
                {r.level === 'high' ? 'Alta' : r.level === 'med' ? 'Media' : 'Baja'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <InfoBanner icon="🌍">
        La incautación de servidores y la trazabilidad de criptomonedas habilita
        cooperación internacional con múltiples jurisdicciones de forma simultánea.
      </InfoBanner>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Slide 5 — Responsabilidades
───────────────────────────────────────────── */
function SlideResponsabilidades() {
  const actors = [
    {
      icon: '⚙️',
      iconColor: '#c4b5fd',
      label: 'Operadores y admins',
      title: 'Máxima exposición',
      items: [
        { icon: '⚖️', text: 'Penal: Ley 21.459 — acceso ilícito, interceptación' },
        { icon: '📋', text: 'Civil: daños, lucro cesante, daño moral a víctimas' },
        { icon: '🏦', text: 'Administrativa: sanciones sectoriales complementarias' },
      ],
    },
    {
      icon: '🖥️',
      iconColor: '#93c5fd',
      label: 'Proveedores hosting / CDN',
      title: 'Exposición indirecta',
      items: [
        { icon: '🔍', text: 'Deben entregar información ante órdenes judiciales' },
        { icon: '🚫', text: 'Obligados a suspender servicios ante abuso comprobado' },
        { icon: '⚠️', text: 'Civil si se prueba negligencia en facilitar actividad ilícita' },
      ],
    },
    {
      icon: '👤',
      iconColor: '#5eead4',
      label: 'Usuarios / Víctimas',
      title: 'Sin riesgo penal directo',
      items: [
        { icon: '📸', text: 'Recopilar pruebas: capturas, comunicaciones' },
        { icon: '🔑', text: 'Cambiar credenciales comprometidas de inmediato' },
        { icon: '📢', text: 'Denuncia penal + reclamo ante SERNAC' },
      ],
    },
  ]

  return (
    <div className="slide slide--active" id="slide-4">
      <Tag color="teal">👥 Responsabilidades legales</Tag>
      <h1 className="slide__title">Actores y sus riesgos legales</h1>

      <div className="grid-3">
        {actors.map(a => (
          <Card key={a.label}>
            <span className="card__icon" style={{ color: a.iconColor }}>{a.icon}</span>
            <div className="card__label">{a.label}</div>
            <div className="card__title">{a.title}</div>
            <div className="list" style={{ marginTop: 12 }}>
              {a.items.map(item => (
                <ListItem key={item.text} icon={item.icon}>{item.text}</ListItem>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Slide 6 — Datos personales
───────────────────────────────────────────── */
function SlideDatos() {
  return (
    <div className="slide slide--active" id="slide-5">
      <Tag color="green">🔒 Privacidad y datos</Tag>
      <h1 className="slide__title">Infracción a Ley 19.628</h1>

      <div className="grid-2">
        <div className="list" style={{ gap: 12 }}>
          <Card>
            <div className="card__label">Datos recopilados por TMO</div>
            <div className="pills" style={{ marginTop: 10 }}>
              {['Correos electrónicos', 'Direcciones IP', 'Historial de lectura', 'Cuentas de usuario', 'Registros de acceso'].map(p => (
                <Pill key={p}>{p}</Pill>
              ))}
            </div>
          </Card>

          <Card>
            <div className="card__label">Incumplimientos detectados</div>
            <div className="list" style={{ marginTop: 10 }}>
              {[
                'Sin consentimiento informado del titular',
                'Sin medidas de seguridad adecuadas',
                'Sin base legal para el tratamiento',
                'Vulneración de derechos ARCO',
              ].map(t => (
                <ListItem key={t} icon="✗" iconColor="#f87171">{t}</ListItem>
              ))}
            </div>
          </Card>
        </div>

        <div className="list" style={{ gap: 12 }}>
          <Card>
            <div className="card__label">Consecuencias legales</div>
            <div className="list" style={{ marginTop: 10 }}>
              {[
                { icon: '📌', text: 'Acciones administrativas', sub: 'Sanciones por infracciones a la normativa' },
                { icon: '💼', text: 'Responsabilidad civil', sub: 'Reparación de daños a titulares afectados' },
                { icon: '⚖️', text: 'Exposición penal', sub: 'Según gravedad de la vulneración cometida' },
              ].map(item => (
                <ListItem key={item.text} icon={item.icon} sub={item.sub}>{item.text}</ListItem>
              ))}
            </div>
          </Card>

          <Card className="card--surface">
            <div className="card__label">Mandato legal para plataformas</div>
            <div className="card__body">
              Implementar políticas de privacidad robustas, seguridad informática
              y procesos de consentimiento transparente para evitar infracciones y sanciones.
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Slide 7 — Conclusiones
───────────────────────────────────────────── */
function SlideConclusiones() {
  const actions = [
    {
      num: '01',
      color: '#60a5fa',
      label: 'Persecución penal y civil',
      body: 'Acciones dirigidas a responsables identificados, apoyadas en peritajes forenses y trazabilidad de criptomonedas.',
    },
    {
      num: '02',
      color: '#2dd4bf',
      label: 'Reparación y protección',
      body: 'Retirada de contenidos, indemnizaciones a titulares y apoyo a usuarios para mitigar riesgos de seguridad.',
    },
    {
      num: '03',
      color: '#fbbf24',
      label: 'Políticas preventivas',
      body: 'Cooperación internacional con hosting, mayor control a intermediarios y promoción de alternativas legales.',
    },
  ]

  return (
    <div className="slide slide--active" id="slide-6">
      <Tag color="amber">🏁 Conclusiones</Tag>
      <h1 className="slide__title">Acciones prioritarias</h1>

      <div className="grid-3">
        {actions.map(a => (
          <Card key={a.num} style={{ borderTop: `2px solid ${a.color}`, borderRadius: '0 0 16px 16px' }}>
            <div className="conclusion-num" style={{ color: a.color }}>{a.num}</div>
            <div className="card__label">{a.label}</div>
            <div className="card__body">{a.body}</div>
          </Card>
        ))}
      </div>

      <Card className="card--surface">
        <div className="card__label" style={{ marginBottom: 8 }}>Riesgos post-cierre que persisten</div>
        <div className="pills">
          {['🪞 Mirrors y sitios clon', '🎣 Phishing con credenciales TMO', '🦠 Malware en sitios clon', '₿ Activos cripto sin rastrear'].map(p => (
            <Pill key={p}>{p}</Pill>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Slide definitions
───────────────────────────────────────────── */
const SLIDES = [
  { id: 'resumen',          component: SlideResumen },
  { id: 'marco',            component: SlideMarco },
  { id: 'delitos',          component: SlideDelitos },
  { id: 'comparacion',      component: SlideComparacion },
  { id: 'responsabilidades',component: SlideResponsabilidades },
  { id: 'datos',            component: SlideDatos },
  { id: 'conclusiones',     component: SlideConclusiones },
]

/* ─────────────────────────────────────────────
   App
───────────────────────────────────────────── */
export default function App() {
  const [current, setCurrent] = useState(0)
  const total = SLIDES.length

  const goPrev = useCallback(() => setCurrent(i => Math.max(0, i - 1)), [])
  const goNext = useCallback(() => setCurrent(i => Math.min(total - 1, i + 1)), [total])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') goNext()
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  const ActiveSlide = SLIDES[current].component

  return (
    <main className="presentation">
      <div className="deck">
        {/* Nav bar */}
        <nav className="deck__nav">
          <div className="deck__dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`deck__dot${i === current ? ' deck__dot--active' : ''}`}
                onClick={() => setCurrent(i)}
                aria-label={`Diapositiva ${i + 1}`}
              />
            ))}
          </div>

          <span className="deck__counter">{current + 1} / {total}</span>

          <div className="deck__arrows">
            <button onClick={goPrev} disabled={current === 0} aria-label="Anterior">‹</button>
            <button onClick={goNext} disabled={current === total - 1} aria-label="Siguiente">›</button>
          </div>
        </nav>

        {/* Slides */}
        <div className="deck__slides">
          <ActiveSlide />
        </div>
      </div>
    </main>
  )
}
