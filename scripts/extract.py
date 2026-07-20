"""
Extract Apple Music library export (Bibliotheque.xml) into aggregated JSON
for the dashboard. Run once at build time: python3 scripts/extract.py
"""
import json
import plistlib
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC_XML = ROOT / "Bibliothèque.xml"
OUT_JSON = ROOT / "src" / "data" / "library.json"

GENRE_MAP = {
    "Hip-Hop/Rap": "hiphop",
    "Hip-Hop": "hiphop",
    "Rap": "hiphop",
    "Dirty South": "hiphop",
    "Alternative Rap": "hiphop",
    "R&B/Soul": "rnb",
    "Alternative": "alt-rock",
    "Indie Rock": "alt-rock",
    "Rock": "alt-rock",
    "Pop": "pop",
    "Dance": "electronic",
    "Electronic": "electronic",
    "Electronica": "electronic",
}


def normalize_genre(raw):
    return GENRE_MAP.get(raw, "other")


def main():
    with open(SRC_XML, "rb") as f:
        lib = plistlib.load(f)

    tracks = list(lib["Tracks"].values())
    export_date = lib.get("Date")

    total_tracks = len(tracks)
    total_plays = sum(t.get("Play Count", 0) for t in tracks)

    daily_adds = defaultdict(int)
    yearly_by_genre = defaultdict(lambda: defaultdict(int))
    artist_adds_by_year = defaultdict(lambda: defaultdict(lambda: {"adds": 0, "plays": 0}))
    artist_adds_all = defaultdict(lambda: {"adds": 0, "plays": 0})
    played_vs_shelved = defaultdict(lambda: {"played": 0, "shelved": 0})

    for t in tracks:
        added = t.get("Date Added")
        if added is None:
            continue
        added_date = added.date() if hasattr(added, "date") else added
        day_key = added_date.isoformat()
        year_key = str(added_date.year)

        daily_adds[day_key] += 1

        genre = normalize_genre(t.get("Genre", ""))
        yearly_by_genre[year_key][genre] += 1

        artist = t.get("Artist") or "Unknown"
        plays = t.get("Play Count", 0)
        artist_adds_by_year[year_key][artist]["adds"] += 1
        artist_adds_by_year[year_key][artist]["plays"] += plays
        artist_adds_all[artist]["adds"] += 1
        artist_adds_all[artist]["plays"] += plays

        if plays > 0:
            played_vs_shelved[year_key]["played"] += 1
        else:
            played_vs_shelved[year_key]["shelved"] += 1

    # top artists per year + all-time
    def top_n(d, n=10):
        return [
            {"name": name, "adds": v["adds"], "plays": v["plays"]}
            for name, v in sorted(d.items(), key=lambda kv: (-kv[1]["adds"], kv[0]))[:n]
        ]

    top_artists_by_year = {year: top_n(artists) for year, artists in artist_adds_by_year.items()}
    top_artists_by_year["all"] = top_n(artist_adds_all)

    # artist loyalty bump chart: rank per year for top 7 artists overall (by all-time adds)
    top7_overall = [a["name"] for a in top_artists_by_year["all"][:7]]
    years_sorted = sorted(artist_adds_by_year.keys())

    artist_rank_by_year = []
    for year in years_sorted:
        ranked = sorted(
            artist_adds_by_year[year].items(), key=lambda kv: (-kv[1]["adds"], kv[0])
        )
        rank_lookup = {name: i + 1 for i, (name, _) in enumerate(ranked)}
        row = {"year": int(year)}
        for artist in top7_overall:
            row[artist] = rank_lookup.get(artist)  # None -> null, Recharts skips
        artist_rank_by_year.append(row)

    # stats: longest streak of consecutive add-days, busiest day, top artist all-time
    all_days = sorted(daily_adds.keys())
    longest_streak = 0
    streak_start = None
    cur_streak = 0
    cur_start = None
    prev_date = None
    for day_str in all_days:
        d = date.fromisoformat(day_str)
        if prev_date is not None and (d - prev_date).days == 1:
            cur_streak += 1
        else:
            cur_streak = 1
            cur_start = day_str
        if cur_streak > longest_streak:
            longest_streak = cur_streak
            streak_start = cur_start
        prev_date = d

    busiest_day_key = max(daily_adds, key=daily_adds.get) if daily_adds else None
    busiest_day = (
        {"date": busiest_day_key, "count": daily_adds[busiest_day_key]}
        if busiest_day_key
        else None
    )
    top_artist_all_time = top_artists_by_year["all"][0]["name"] if top_artists_by_year["all"] else None

    output = {
        "meta": {
            "exportDate": export_date.date().isoformat() if hasattr(export_date, "date") else str(export_date),
            "totalTracks": total_tracks,
            "totalPlays": total_plays,
        },
        "dailyAdds": dict(sorted(daily_adds.items())),
        "yearlyByGenre": {y: dict(g) for y, g in sorted(yearly_by_genre.items())},
        "topArtistsByYear": top_artists_by_year,
        "artistRankByYear": artist_rank_by_year,
        "playedVsShelved": {y: dict(v) for y, v in sorted(played_vs_shelved.items())},
        "stats": {
            "longestStreakDays": longest_streak,
            "streakStart": streak_start,
            "busiestDay": busiest_day,
            "topArtistAllTime": top_artist_all_time,
        },
    }

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Validation output against known profile
    print(f"Total tracks: {total_tracks} (expected 5115)")
    print(f"Total plays: {total_plays} (expected 49038)")
    print("Adds by year:")
    for year in sorted(yearly_by_genre.keys()):
        year_total = sum(yearly_by_genre[year].values())
        print(f"  {year}: {year_total}")
    print(f"Longest streak: {longest_streak} days starting {streak_start}")
    print(f"Busiest day: {busiest_day}")
    print(f"Top artist all-time: {top_artist_all_time}")
    print(f"Wrote {OUT_JSON}")


if __name__ == "__main__":
    main()
