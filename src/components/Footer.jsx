import { useI18n } from '../i18n/I18nContext'
import library from '../data/library.json'

const GITHUB_URL = 'https://github.com/marctche/ma-bibliotheque'

export default function Footer() {
  const { t, fmtDate } = useI18n()

  return (
    <footer className="footer">
      <span>
        {t('footer.source')} · {t('footer.exportDate', { date: fmtDate(library.meta.exportDate) })}
      </span>
      <span>
        {t('footer.inspiration')} ·{' '}
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          {t('footer.github')}
        </a>
      </span>
    </footer>
  )
}
