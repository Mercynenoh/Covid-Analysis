import { useEffect, useState } from 'react';
import './App.css';
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { sortData, prettyPrintStat } from './util';
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
import Table from './components/Table';

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    const getData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(item => (
            {
              name: item.country,
              value: item.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getData()
  }, [])
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => setCountryInfo(data))
  },[])
  const onCountryChange = async e => {
    const url = e.target.value === 'worldwide' ? 
    'https://disease.sh/v3/covid-19/all' : 
    `https://disease.sh/v3/covid-19/countries/${e.target.value}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCountry(e.target.value)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
      })
  }
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID Statistics</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem value="worldwide">Search by Country</MenuItem>
              {countries.map(country => <MenuItem value={country.value}>{country.name} </MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div>
  <table>
  <tr>
    <th>Cases</th>
    <th>Recoveries</th>
    <th>Deaths</th>
    <th>Totals</th>
  </tr>
  <tr>
    <td>{prettyPrintStat(countryInfo.todayCases)} </td>
    <td>{prettyPrintStat(countryInfo.todayRecovered)}</td>
    <td>{prettyPrintStat(countryInfo.todayDeaths)} </td>
    <td>{numeral(countryInfo.cases).format("0.0a")} </td>
  </tr>
  </table>
        </div>
      </div>
      {/* <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 style={{ marginTop: '25px'}}>World wide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card> */}
    </div>
  );
}

export default App;
