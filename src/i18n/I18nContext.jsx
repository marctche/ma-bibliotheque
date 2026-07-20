import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'
import { strings } from './strings'

const I18nContext = createContext(null)

const LOCALE_KEY = 'ma-bibliotheque-locale'
const LOCALES = ['fr', 'en']

function detectDefaultLocale() {
  const stored = localStorage.getItem(LOCALE_KEY)
  if (stored && LOCALES.includes(stored)) return stored
  const browser = (navigator.language || 'fr').slice(0, 2)
  return LOCALES.includes(browser) ? browser : 'fr'
}

function interpolate(str, vars) {
  if (!vars) return str
  return str.replace(/\{(\w+)\}/g, (_, key) => (key in vars ? vars[key] : `{${key}}`))
}

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(detectDefaultLocale)

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const pluralRules = useMemo(() => new Intl.PluralRules(locale), [locale])
  const numberFormat = useMemo(() => new Intl.NumberFormat(locale), [locale])
  const collator = useMemo(() => new Intl.Collator(locale), [locale])
  const relativeFormat = useMemo(
    () => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
    [locale]
  )

  const t = useCallback(
    (key, vars) => {
      const entry = strings[locale][key] ?? strings.fr[key] ?? key
      if (typeof entry === 'object') {
        const category = pluralRules.select(vars?.n ?? 0)
        const template = entry[category] ?? entry.other
        return interpolate(template, vars)
      }
      return interpolate(entry, vars)
    },
    [locale, pluralRules]
  )

  const fmtNumber = useCallback((n) => numberFormat.format(n), [numberFormat])

  const fmtDate = useCallback(
    (isoDate, opts) => {
      const d = typeof isoDate === 'string' ? new Date(isoDate + 'T00:00:00') : isoDate
      return new Intl.DateTimeFormat(locale, opts ?? { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
    },
    [locale]
  )

  const fmtWeekday = useCallback(
    (dayIndex, opts) => {
      // dayIndex: 0 = Sunday .. 6 = Saturday. Weeks are fixed to start Sunday in both locales.
      const reference = new Date(Date.UTC(2023, 0, 1 + dayIndex)) // 2023-01-01 is a Sunday
      return new Intl.DateTimeFormat(locale, opts ?? { weekday: 'short' }).format(reference)
    },
    [locale]
  )

  const fmtRelative = useCallback(
    (value, unit) => relativeFormat.format(value, unit),
    [relativeFormat]
  )

  const sortByLocale = useCallback(
    (list, getter = (x) => x) => [...list].sort((a, b) => collator.compare(getter(a), getter(b))),
    [collator]
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, fmtNumber, fmtDate, fmtWeekday, fmtRelative, sortByLocale }),
    [locale, t, fmtNumber, fmtDate, fmtWeekday, fmtRelative, sortByLocale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
