import { useMemo, useState } from 'react'
import { useI18n } from '../i18n/I18nContext'
import libraryData from '../data/library.json'
import '../styles/contribution-grid.css'

const DAYS_PER_WEEK = 7
const WEEK_COLUMNS = 53
// GitHub-style gutter: label alternating rows only, to avoid clutter.
const WEEKDAY_LABEL_ROWS = [1, 3, 5]

function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Quantile breakpoints over non-zero day counts (computed once from the whole
// dataset). A simple count/max ratio collapses almost every day into bucket 1
// because a handful of bulk-import days (1000+ adds) dwarf typical days
// (1-20 adds); quantiles keep the ramp readable regardless of those outliers.
function quantileBreakpoints(dailyAdds) {
  const nonZero = Object.values(dailyAdds).filter((v) => v > 0).sort((a, b) => a - b)
  if (!nonZero.length) return [0, 0, 0]
  const at = (p) => nonZero[Math.min(nonZero.length - 1, Math.floor(p * (nonZero.length - 1)))]
  return [at(0.5), at(0.75), at(0.9)]
}

function bucketFor(count, breakpoints) {
  if (!count || count <= 0) return 0
  const [q50, q75, q90] = breakpoints
  if (count <= q50) return 1
  if (count <= q75) return 2
  if (count <= q90) return 3
  return 4
}

// Build 53 columns x 7 rows (Sunday-first) covering the given year, plus
// transparent placeholder cells for days outside the year in the partial
// first/last weeks.
function buildYearGrid(year) {
  const jan1 = new Date(year, 0, 1)
  const startOffset = jan1.getDay() // 0 = Sunday
  const gridStart = new Date(year, 0, 1 - startOffset)

  const weeks = []
  const cursor = new Date(gridStart)
  for (let w = 0; w < WEEK_COLUMNS; w++) {
    const week = []
    for (let d = 0; d < DAYS_PER_WEEK; d++) {
      const inYear = cursor.getFullYear() === year
      week.push({
        iso: toISODate(cursor),
        inYear,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

export default function ContributionGrid() {
  const { t, fmtDate, fmtWeekday } = useI18n()
  const dailyAdds = libraryData.dailyAdds ?? {}

  const years = useMemo(() => {
    const set = new Set()
    for (const iso of Object.keys(dailyAdds)) {
      if (dailyAdds[iso] > 0) set.add(Number(iso.slice(0, 4)))
    }
    return [...set].sort((a, b) => a - b)
  }, [dailyAdds])

  const breakpoints = useMemo(() => quantileBreakpoints(dailyAdds), [dailyAdds])

  const [selectedYear, setSelectedYear] = useState(
    years.length ? years[years.length - 1] : new Date().getFullYear()
  )

  const activeYear = years.includes(selectedYear)
    ? selectedYear
    : years[years.length - 1] ?? new Date().getFullYear()

  const weeks = useMemo(() => buildYearGrid(activeYear), [activeYear])

  return (
    <div className="card grid-row contribution-grid">
      <h2 className="card__title">{t('grid.title')}</h2>
      <p className="card__caption">{t('grid.caption')}</p>

      <div className="contribution-grid__tabs" role="tablist" aria-label={t('grid.yearTabLabel')}>
        {years.map((year) => (
          <button
            key={year}
            type="button"
            role="tab"
            aria-selected={year === activeYear}
            className="contribution-grid__tab"
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="contribution-grid__scroll">
        <div className="contribution-grid__body">
          <div className="contribution-grid__weekdays" aria-hidden="true">
            {Array.from({ length: DAYS_PER_WEEK }, (_, dayIndex) => (
              <span key={dayIndex} className="contribution-grid__weekday-label">
                {WEEKDAY_LABEL_ROWS.includes(dayIndex) ? fmtWeekday(dayIndex, { weekday: 'short' }) : ''}
              </span>
            ))}
          </div>

          <div className="contribution-grid__weeks">
            {weeks.map((week, weekIndex) => (
              <div className="contribution-grid__week" key={weekIndex}>
                {week.map((day) => {
                  if (!day.inYear) {
                    return (
                      <div
                        key={day.iso}
                        className="contribution-grid__cell contribution-grid__cell--empty"
                        aria-hidden="true"
                      />
                    )
                  }
                  const count = dailyAdds[day.iso] ?? 0
                  const bucket = bucketFor(count, breakpoints)
                  const formattedDate = fmtDate(day.iso)
                  const label =
                    count > 0
                      ? t('grid.tooltip.adds', { n: count, date: formattedDate })
                      : t('grid.tooltip.empty', { date: formattedDate })

                  return (
                    <button
                      key={day.iso}
                      type="button"
                      className={`contribution-grid__cell contribution-grid__cell--r${bucket}`}
                      tabIndex={0}
                      aria-label={label}
                    >
                      <span className="contribution-grid__tooltip" role="tooltip">
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="contribution-grid__legend">
        <span>{t('grid.legend.less')}</span>
        <span className="contribution-grid__legend-swatches">
          {[0, 1, 2, 3, 4].map((bucket) => (
            <span key={bucket} className={`contribution-grid__legend-swatch contribution-grid__cell--r${bucket}`} />
          ))}
        </span>
        <span>{t('grid.legend.more')}</span>
      </div>
    </div>
  )
}
