import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useI18n } from '../i18n/I18nContext'
import libraryData from '../data/library.json'
import '../styles/genre-drift-chart.css'

// Fixed order/color assignment — never re-derived from whichever genres
// happen to be nonzero in a given year, so colors stay stable across toggles.
const GENRE_KEYS = ['hiphop', 'rnb', 'alt-rock', 'pop', 'electronic', 'other']
const GENRE_COLOR_VARS = {
  hiphop: 'var(--genre-hiphop)',
  rnb: 'var(--genre-rnb)',
  'alt-rock': 'var(--genre-alt-rock)',
  pop: 'var(--genre-pop)',
  electronic: 'var(--genre-electronic)',
  other: 'var(--genre-other)',
}

function CustomTooltip({ active, payload, label, mode, t, fmtNumber }) {
  if (!active || !payload || !payload.length) return null
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
      <div style={{ marginBottom: 4, fontWeight: 600 }}>{label}</div>
      {mode === 'total'
        ? payload.map((entry) => (
            <div key={entry.dataKey}>{fmtNumber(entry.value)}</div>
          ))
        : [...payload].reverse().map((entry) => (
            <div key={entry.dataKey} style={{ color: entry.color }}>
              {t('genre.' + entry.dataKey)}: {fmtNumber(entry.value)}
            </div>
          ))}
    </div>
  )
}

export default function GenreDriftChart() {
  const { t, fmtNumber } = useI18n()
  const [mode, setMode] = useState('genres') // 'genres' | 'total'

  const yearlyByGenre = libraryData.yearlyByGenre ?? {}

  const years = useMemo(
    () => Object.keys(yearlyByGenre).sort((a, b) => Number(a) - Number(b)),
    [yearlyByGenre]
  )

  const chartData = useMemo(
    () =>
      years.map((year) => {
        const genreCounts = yearlyByGenre[year] ?? {}
        const row = { year }
        let total = 0
        for (const key of GENRE_KEYS) {
          const value = genreCounts[key] ?? 0
          row[key] = value
          total += value
        }
        row.total = total
        return row
      }),
    [years, yearlyByGenre]
  )

  return (
    <div className="card">
      <div className="genre-drift-chart__header">
        <div>
          <h3 className="card__title">{t('chart.genreDrift.title')}</h3>
          <p className="card__caption">{t('chart.genreDrift.caption')}</p>
        </div>
        <div
          className="genre-drift-chart__toggle"
          role="group"
          aria-label={t('chart.genreDrift.title')}
        >
          <button
            type="button"
            aria-pressed={mode === 'total'}
            onClick={() => setMode('total')}
          >
            {t('chart.genreDrift.toggle.total')}
          </button>
          <button
            type="button"
            aria-pressed={mode === 'genres'}
            onClick={() => setMode('genres')}
          >
            {t('chart.genreDrift.toggle.genres')}
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeWidth={1} />
          <XAxis
            dataKey="year"
            tick={{ fill: 'var(--muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--muted)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => fmtNumber(value)}
          />
          <Tooltip
            content={<CustomTooltip mode={mode} t={t} fmtNumber={fmtNumber} />}
            cursor={{ fill: 'var(--border)', opacity: 0.3 }}
          />
          {mode === 'genres' && (
            <Legend
              wrapperStyle={{ color: 'var(--muted)', fontSize: '0.8rem' }}
              formatter={(value) => t('genre.' + value)}
            />
          )}
          {mode === 'genres'
            ? GENRE_KEYS.map((key) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stackId="genres"
                  stroke={GENRE_COLOR_VARS[key]}
                  fill={GENRE_COLOR_VARS[key]}
                  fillOpacity={0.75}
                />
              ))
            : (
                <Area
                  type="monotone"
                  dataKey="total"
                  name="total"
                  stroke="var(--accent)"
                  fill="var(--accent)"
                  fillOpacity={0.55}
                />
              )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
