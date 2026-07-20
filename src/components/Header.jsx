import { useI18n } from '../i18n/I18nContext'
import LangToggle from './LangToggle'

export default function Header() {
  const { t } = useI18n()

  return (
    <header className="header">
      <div className="header__titles">
        <h1>{t('app.title')}</h1>
        <p>{t('app.tagline')}</p>
      </div>
      <LangToggle />
    </header>
  )
}
