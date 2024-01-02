import React, { useState } from 'react';

const Comparison = () => {
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('');

    const years = [2022, 2023, 2024]; // Przykładowe lata do wyboru

    const quarters = ['I', 'II', 'III', 'IV'];
    const halfYear = 'Half Year';
    const fullYear = 'Full Year';

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Selected Year:', selectedYear);
        console.log('Selected Period:', selectedPeriod);
        // Tutaj możesz wykonać akcje na podstawie wybranych wartości
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Select Year:
                <select value={selectedYear} onChange={handleYearChange}>
                    <option value="">-- Select Year --</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Select Period:
                <select value={selectedPeriod} onChange={handlePeriodChange}>
                    <option value="">-- Select Period --</option>
                    {quarters.map((quarter) => (
                        <option key={quarter} value={`Q${quarter}`}>
                            {`Q${quarter}`}
                        </option>
                    ))}
                    <option value={halfYear}>Half Year</option>
                    <option value={fullYear}>Full Year</option>
                </select>
            </label>
            <button type="submit">Compare</button>
        </form>
    );
};

export default Comparison;
