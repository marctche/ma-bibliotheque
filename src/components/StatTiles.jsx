import { useI18n } from '../i18n/I18nContext'
import library from '../data/library.json'

export default function StatTiles() {
  const { t, fmtNumber } = useI18n()
  const { meta, stats } = library

  const tiles = [
    { label: t('stats.tracks'), value: fmtNumber(meta.totalTracks) },
    { label: t('stats.plays'), value: fmtNumber(meta.totalPlays) },
    { label: t('stats.topArtist'), value: stats.topArtistAllTime },
    {
      label: t('stats.streak'),
      value: t('stats.streakValue', { n: stats.longestStreakDays }),
    },
  ]

  return (
    <div className="stat-tiles">
      {tiles.map((tile) => (
        <div className="stat-tile" key={tile.label}>
          <div className="stat-tile__value">{tile.value}</div>
          <div className="stat-tile__label">{tile.label}</div>
        </div>
      ))}
    </div>
  )
}
