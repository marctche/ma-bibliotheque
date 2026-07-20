import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useI18n } from '../i18n/I18nContext'
import library from '../data/library.json'
import '../styles/played-shelved-chart.css'

export default function PlayedShelvedChart() {
  const { t, fmtNumber } = useI18n()
  const [mode, setMode] = useState('count') // 'count' | 'percent'

  const years = useMemo(
    () => Object.keys(library.playedVsShelved).sort((a, b) => Number(a) - Number(b)),
    []
  )

  const data = useMemo(() => {
    return years.map((year) => {
      const { played, shelved } = library.playedVsShelved[year]
      if (mode === 'percent') {
        const total = played + shelved
        return {
          year,
          played: total > 0 ? (played / total) * 100 : 0,
          shelved: total > 0 ? (shelved / total) * 100 : 0,
        }
      }
      return { year, played, shelved }
    })
  }, [years, mode])

  function formatValue(value) {
    if (mode === 'percent') return `${fmtNumber(Math.round(value))}%`
    return fmtNumber(value)
  }

  function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null
    return (
      <div className="played-shelved-chart__tooltip">
        <div className="played-shelved-chart__tooltip-year">{label}</div>
        {payload.map((p) => (
          <div key={p.dataKey} className="played-shelved-chart__tooltip-row">
            <span className="played-shelved-chart__tooltip-dot" style={{ background: p.fill }} />
            <span className="played-shelved-chart__tooltip-name">
              {p.dataKey === 'played'
                ? t('chart.playedShelved.played')
                : t('chart.playedShelved.shelved')}
            </span>
            <span className="played-shelved-chart__tooltip-value">{formatValue(p.value)}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="played-shelved-chart__header">
        <div>
          <h2 className="card__title">{t('chart.playedShelved.title')}</h2>
          <p className="card__caption">{t('chart.playedShelved.caption')}</p>
        </div>
        <div className="played-shelved-chart__toggle" role="group">
          <button
            type="button"
            aria-pressed={mode === 'count'}
            onClick={() => setMode('count')}
          >
            {t('chart.playedShelved.toggle.count')}
          </button>
          <button
            type="button"
            aria-pressed={mode === 'percent'}
            onClick={() => setMode('percent')}
          >
            {t('chart.playedShelved.toggle.percent')}
          </button>
        </div>
      </div>
      <div className="played-shelved-chart__chart">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="year"
              stroke="var(--muted)"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              stroke="var(--muted)"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
              tickFormatter={(v) => (mode === 'percent' ? `${fmtNumber(v)}%` : fmtNumber(v))}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--border)', opacity: 0.3 }} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: 'var(--muted)' }}
              formatter={(value) =>
                value === 'played'
                  ? t('chart.playedShelved.played')
                  : t('chart.playedShelved.shelved')
              }
            />
            <Bar
              dataKey="played"
              stackId="ps"
              fill="var(--accent)"
              radius={[0, 0, 4, 4]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="shelved"
              stackId="ps"
              fill="var(--muted)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
