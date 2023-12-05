import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Temp = () => {
    // Ustawienie stanu dla przechowywania danych z API
    const [userData, setUserData] = useState(null);

    // Funkcja do pobierania danych z API
    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:7088/api/account/userrr');
            const data = await response.json();
            setUserData(data); // Ustawienie danych w stanie
        } catch (error) {
            console.error('B³¹d podczas pobierania danych:', error);
        }
    };

    // Wywo³anie funkcji fetchData przy pierwszym renderowaniu komponentu
    useEffect(() => {
        fetchData();
    }, []); // Pusty dependency array oznacza, ¿e useEffect zostanie wywo³any tylko raz po pierwszym renderowaniu

    return (
        <div className="container">
            <h2>{userData ? userData.userName : '£adowanie...'}</h2>
        </div>
    );
};

export default Temp;
