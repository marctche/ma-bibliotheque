import Header from './components/Header'
import StatTiles from './components/StatTiles'
import Footer from './components/Footer'
import ContributionGrid from './components/ContributionGrid'
import GenreDriftChart from './components/GenreDriftChart'
import TopArtistsChart from './components/TopArtistsChart'
import LoyaltyBumpChart from './components/LoyaltyBumpChart'
import PlayedShelvedChart from './components/PlayedShelvedChart'

export default function App() {
  return (
    <div className="app">
      <Header />
      <StatTiles />
      <ContributionGrid />
      <div className="two-col">
        <GenreDriftChart />
        <TopArtistsChart />
      </div>
      <div className="two-col">
        <LoyaltyBumpChart />
        <PlayedShelvedChart />
      </div>
      <Footer />
    </div>
  )
}
