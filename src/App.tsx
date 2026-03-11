import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Define the shape of our data for TypeScript
interface Country {
    name: string;
    capital: string;
    region: string;
    population: number;
    flag: string;
}

const App: React.FC = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState<Country | null>(null);

    // We handle the search on the client-side for better performance.
    useEffect(() => {
        axios.get('http://localhost:8080/api/countries')
            .then(res => setCountries(res.data))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    const filteredCountries = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            <h2>Country Directory</h2>

            {/* Search Input */}
            <input
                type="text"
                className="search-input"
                placeholder="Search countries..."
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Countries Table */}
            <table className="country-table">
                <thead>
                <tr>
                    <th>Flag</th>
                    <th>Name</th>
                    <th>Capital</th>
                    <th>Region</th>
                    <th>Population</th>
                </tr>
                </thead>
                <tbody>
                {filteredCountries.map((country) => (
                    <tr key={country.name} onClick={() => setSelected(country)}>
                        <td><img src={country.flag} className="flag-img" alt="flag" /></td>
                        <td>{country.name}</td>
                        <td>{country.capital}</td>
                        <td>{country.region}</td>
                        <td>{country.population.toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Country Details Modal */}
            {selected && (
                <div className="modal-overlay" onClick={() => setSelected(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <img src={selected.flag} style={{width: '100px', marginBottom: '10px'}} alt="flag" />
                        <h3>{selected.name}</h3>
                        <p><strong>Capital:</strong> {selected.capital}</p>
                        <p><strong>Region:</strong> {selected.region}</p>
                        <p><strong>Population:</strong> {selected.population.toLocaleString()}</p>
                        <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;