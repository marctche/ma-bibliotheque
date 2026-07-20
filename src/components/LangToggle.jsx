import { useI18n } from '../i18n/I18nContext'

export default function LangToggle() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className="lang-toggle" role="group" aria-label={t('lang.toggleLabel')}>
      <button type="button" aria-pressed={locale === 'fr'} onClick={() => setLocale('fr')}>
        {t('lang.fr')}
      </button>
      <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>
        {t('lang.en')}
      </button>
    </div>
  )
}
