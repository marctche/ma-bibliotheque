import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useI18n } from '../i18n/I18nContext'
import libraryData from '../data/library.json'
import '../styles/top-artists-chart.css'

function CustomTooltip({ active, payload, t, fmtNumber }) {
  if (!active || !payload || !payload.length) return null
  const entry = payload[0].payload
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text)',
        padding: '8px 12px',
        fontSize: '0.85rem',
      }}
    >
      <div style={{ marginBottom: 4, fontWeight: 600 }}>{entry.name}</div>
      <div>
        {fmtNumber(entry.adds)} {t('chart.topArtists.adds')}
      </div>
    </div>
  )
}

export default function TopArtistsChart() {
  const { t, fmtNumber } = useI18n()
  const topArtistsByYear = libraryData.topArtistsByYear ?? {}

  const years = useMemo(
    () =>
      Object.keys(topArtistsByYear)
        .filter((key) => key !== 'all')
        .sort((a, b) => Number(b) - Number(a)),
    [topArtistsByYear]
  )

  const [selectedYear, setSelectedYear] = useState('all')

  const activeKey = selectedYear === 'all' || years.includes(selectedYear) ? selectedYear : 'all'

  const chartData = useMemo(() => {
    const list = topArtistsByYear[activeKey] ?? []
    // Recharts vertical (horizontal-bar) BarChart renders data[0] at the top,
    // so a descending sort already puts the highest value at the top.
    return [...list].sort((a, b) => b.adds - a.adds).slice(0, 10)
  }, [topArtistsByYear, activeKey])

  const chartHeight = 340

  return (
    <div className="card">
      <div className="top-artists-chart__header">
        <div>
          <h3 className="card__title">{t('chart.topArtists.title')}</h3>
          <p className="card__caption">{t('chart.topArtists.caption')}</p>
        </div>
        <label className="top-artists-chart__selector">
          {t('chart.topArtists.yearLabel')}
          <select
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          >
            <option value="all">{t('chart.topArtists.all')}</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ width: '100%', height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              tickFormatter={(value) => fmtNumber(value)}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={160}
            />
            <Tooltip
              content={<CustomTooltip t={t} fmtNumber={fmtNumber} />}
              cursor={{ fill: 'var(--border)', opacity: 0.3 }}
            />
            <Bar dataKey="adds" fill="var(--accent)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
