// Flat key map, one entry per locale. Pluralized strings use { one, other } and are
// resolved via Intl.PluralRules in I18nContext's t(). All components must go through
// t() — zero hardcoded user-visible strings in component files.
export const strings = {
  fr: {
    'app.title': 'Ma Bibliothèque',
    'app.tagline':
      "Un portrait de mes goûts musicaux et de mes habitudes d'écoute sur huit ans.",

    'lang.fr': 'Français',
    'lang.en': 'English',
    'lang.toggleLabel': 'Langue',

    'stats.tracks': 'Titres',
    'stats.plays': 'Écoutes',
    'stats.topArtist': 'Artiste favori',
    'stats.streak': 'Plus longue série',
    'stats.streakValue': { one: '{n} jour', other: '{n} jours' },

    'grid.title': 'Activité de la bibliothèque',
    'grid.caption':
      "Chaque case représente un jour ; plus il y a d'ajouts, plus la couleur est intense.",
    'grid.legend.less': 'Moins',
    'grid.legend.more': 'Plus',
    'grid.tooltip.adds': { one: '{n} ajout le {date}', other: '{n} ajouts le {date}' },
    'grid.tooltip.empty': 'Aucun ajout le {date}',
    'grid.yearTabLabel': 'Année',

    'genre.hiphop': 'Hip-Hop/Rap',
    'genre.rnb': 'R&B/Soul',
    'genre.alt-rock': 'Alternatif/Rock',
    'genre.pop': 'Pop',
    'genre.electronic': 'Électronique',
    'genre.other': 'Autre',

    'chart.genreDrift.title': 'Évolution des genres',
    'chart.genreDrift.caption':
      "La proportion de chaque genre dans les ajouts, année par année.",
    'chart.genreDrift.toggle.total': 'Total',
    'chart.genreDrift.toggle.genres': 'Genres',

    'chart.topArtists.title': 'Artistes les plus écoutés',
    'chart.topArtists.caption': "Les 10 artistes les plus ajoutés pour l'année sélectionnée.",
    'chart.topArtists.yearLabel': 'Année',
    'chart.topArtists.all': 'Toutes les années',
    'chart.topArtists.adds': 'ajouts',

    'chart.loyalty.title': 'Fidélité aux artistes',
    'chart.loyalty.caption':
      "Le classement annuel des 7 artistes les plus ajoutés au total ; survolez une ligne pour l'isoler.",
    'chart.loyalty.rank': 'Rang',

    'chart.playedShelved.title': 'Écoutés vs Ignorés',
    'chart.playedShelved.caption':
      "Part des titres ajoutés qui ont été écoutés au moins une fois, par année.",
    'chart.playedShelved.toggle.count': 'Nombre',
    'chart.playedShelved.toggle.percent': 'Pourcentage',
    'chart.playedShelved.played': 'Écoutés',
    'chart.playedShelved.shelved': 'Ignorés',

    'footer.source': 'Source : export de bibliothèque Apple Music (données personnelles réelles)',
    'footer.exportDate': 'Exporté le {date}',
    'footer.github': 'Code source',
    'footer.inspiration': "Grille inspirée du graphique de contributions de GitHub",
  },
  en: {
    'app.title': 'My Library',
    'app.tagline': "A portrait of one listener's taste and habits over eight years.",

    'lang.fr': 'Français',
    'lang.en': 'English',
    'lang.toggleLabel': 'Language',

    'stats.tracks': 'Tracks',
    'stats.plays': 'Plays',
    'stats.topArtist': 'Top artist',
    'stats.streak': 'Longest streak',
    'stats.streakValue': { one: '{n} day', other: '{n} days' },

    'grid.title': 'Library activity',
    'grid.caption': 'Each cell is one day; more adds means a more intense color.',
    'grid.legend.less': 'Less',
    'grid.legend.more': 'More',
    'grid.tooltip.adds': { one: '{n} add on {date}', other: '{n} adds on {date}' },
    'grid.tooltip.empty': 'No adds on {date}',
    'grid.yearTabLabel': 'Year',

    'genre.hiphop': 'Hip-Hop/Rap',
    'genre.rnb': 'R&B/Soul',
    'genre.alt-rock': 'Alternative/Rock',
    'genre.pop': 'Pop',
    'genre.electronic': 'Electronic',
    'genre.other': 'Other',

    'chart.genreDrift.title': 'Genre drift',
    'chart.genreDrift.caption': 'The share of each genre in yearly adds.',
    'chart.genreDrift.toggle.total': 'Total',
    'chart.genreDrift.toggle.genres': 'Genres',

    'chart.topArtists.title': 'Top artists',
    'chart.topArtists.caption': 'The 10 most-added artists for the selected year.',
    'chart.topArtists.yearLabel': 'Year',
    'chart.topArtists.all': 'All years',
    'chart.topArtists.adds': 'adds',

    'chart.loyalty.title': 'Artist loyalty',
    'chart.loyalty.caption':
      "Yearly rank of the 7 most-added artists overall; hover a line to isolate it.",
    'chart.loyalty.rank': 'Rank',

    'chart.playedShelved.title': 'Played vs Shelved',
    'chart.playedShelved.caption': 'Share of added tracks played at least once, by year.',
    'chart.playedShelved.toggle.count': 'Count',
    'chart.playedShelved.toggle.percent': 'Percent',
    'chart.playedShelved.played': 'Played',
    'chart.playedShelved.shelved': 'Shelved',

    'footer.source': 'Source: Apple Music library export (real personal data)',
    'footer.exportDate': 'Exported on {date}',
    'footer.github': 'Source code',
    'footer.inspiration': "Grid inspired by GitHub's contribution graph",
  },
}
