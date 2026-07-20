import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useI18n } from '../i18n/I18nContext'
import library from '../data/library.json'
import '../styles/loyalty-bump-chart.css'

const PALETTE = [
  'var(--genre-hiphop)',
  'var(--genre-rnb)',
  'var(--genre-alt-rock)',
  'var(--genre-pop)',
  'var(--genre-electronic)',
  'var(--genre-other)',
  'var(--accent-strong)',
]

export default function LoyaltyBumpChart() {
  const { t, fmtNumber } = useI18n()
  const [hovered, setHovered] = useState(null)

  // Ranks are unbounded in the source data (a handful of "fell way off" years
  // reach into the hundreds). Anything outside the top-RANK_CAP window is
  // treated like the existing nulls (a gap in the line) so the chart stays a
  // readable top-tier bump chart instead of one outlier crushing every other
  // artist's line into a sliver of the y-axis.
  const RANK_CAP = 32

  const rows = useMemo(() => {
    const source = library.artistRankByYear || []
    return source.map((row) => {
      const capped = { year: row.year }
      Object.keys(row).forEach((key) => {
        if (key === 'year') return
        const value = row[key]
        capped[key] = value == null || value > RANK_CAP ? null : value
      })
      return capped
    })
  }, [])

  const artists = useMemo(() => {
    if (!rows || !rows.length) return []
    const names = new Set()
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== 'year') names.add(key)
      })
    })
    // Stable order: by best (lowest) rank ever achieved, then alphabetically.
    return Array.from(names).sort((a, b) => {
      const bestA = Math.min(...rows.map((r) => (r[a] == null ? Infinity : r[a])))
      const bestB = Math.min(...rows.map((r) => (r[b] == null ? Infinity : r[b])))
      if (bestA !== bestB) return bestA - bestB
      return a.localeCompare(b)
    })
  }, [rows])

  const colorByArtist = useMemo(() => {
    const map = {}
    artists.forEach((artist, i) => {
      map[artist] = PALETTE[i % PALETTE.length]
    })
    return map
  }, [artists])

  function handleEnter(artist) {
    setHovered(artist)
  }

  function handleLeave() {
    setHovered(null)
  }

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null
    const visible = payload.filter((p) => p.value != null)
    if (!visible.length) return null
    return (
      <div className="loyalty-bump-chart__tooltip">
        <div className="loyalty-bump-chart__tooltip-year">{label}</div>
        {visible
          .slice()
          .sort((a, b) => a.value - b.value)
          .map((p) => (
            <div key={p.dataKey} className="loyalty-bump-chart__tooltip-row">
              <span
                className="loyalty-bump-chart__tooltip-dot"
                style={{ background: p.stroke }}
              />
              <span className="loyalty-bump-chart__tooltip-name">{p.dataKey}</span>
              <span className="loyalty-bump-chart__tooltip-rank">
                {t('chart.loyalty.rank')} {fmtNumber(p.value)}
              </span>
            </div>
          ))}
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="card__title">{t('chart.loyalty.title')}</h2>
      <p className="card__caption">{t('chart.loyalty.caption')}</p>
      <div className="loyalty-bump-chart__chart">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={rows} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="year"
              stroke="var(--muted)"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              type="number"
              reversed
              domain={[1, RANK_CAP]}
              allowDecimals={false}
              width={40}
              stroke="var(--muted)"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              label={{
                value: t('chart.loyalty.rank'),
                angle: -90,
                position: 'insideLeft',
                fill: 'var(--muted)',
                fontSize: 12,
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)' }} />
            <Legend
              onMouseEnter={(entry) => handleEnter(entry.dataKey)}
              onMouseLeave={handleLeave}
              wrapperStyle={{ fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}
            />
            {artists.map((artist) => {
              const isHovered = hovered === artist
              const isDimmed = hovered !== null && !isHovered
              return (
                <Line
                  key={artist}
                  type="monotone"
                  dataKey={artist}
                  name={artist}
                  stroke={colorByArtist[artist]}
                  strokeWidth={isHovered ? 3 : 2}
                  strokeOpacity={isDimmed ? 0.18 : 1}
                  dot={{ r: 3, strokeWidth: 0, fillOpacity: isDimmed ? 0.18 : 1 }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                  onMouseEnter={() => handleEnter(artist)}
                  onMouseLeave={handleLeave}
                  isAnimationActive={false}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
