import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TwoFactorAuthentication = () => {
    // Data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [googleAuthKey, setGoogleAuthKey] = useState('');
    const [QrImageUrl, setQrImageUrl] = useState('');

    const buttonColor = isChecked ? 'btn-danger' : 'btn-success';

    // Update TwoFactor status for user on server
    const setTwoFactorStatus = async (status) => {
        try {
            const response = await fetch('https://localhost:7088/api/account/SetTwoFactorStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(status),
            });

            if (response.ok) {
                const data = await response.text();
                console.log(data);
            } else {
                throw new Error('Failed to update Two Factor Status');
            }
        } catch (error) {
            console.error('Error updating Two Factor Status:', error);
        }
    };
    // Handler for button press
    const handleCheckboxChange = async () => {
        try {
            setIsChecked(prevState => !prevState);
            await setTwoFactorStatus(!isChecked);
            await getTwoFactorStatus();
        } catch (error) {
            console.error('Error updating checkbox and status:', error);
        }
    };

    // get TwoFactor status from sever
    const getTwoFactorStatus = async () => {
        try {
            const response = await fetch('https://localhost:7088/api/account/GetTwoFactorStatus', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setIsChecked(data.twoFactorEnabled === true);

                if (data.twoFactorEnabled === true) {
                    setGoogleAuthKey(data.googleKey);
                }
                setQrImageUrl(data.barcodeImageUrl);

            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Effect to fetch data from the API and update isChecked state
    useEffect(() => {
        getTwoFactorStatus();
    }, []);

    if (loading) return;
    if (error) return;
    return (
        <div className="container mt-5 text-center">
            <h1>Two Factor Authentication</h1>
            <p>Two-Factor Authentication (2FA) is an added layer of security that protects your account. <br/>
                Once enabled, it requires an additional code beyond your password, making unauthorized access to your account more difficult.</p>
            <h3>Google Authenticator</h3>
            <p>Before enable remember to download Authenticator app on your phone.</p>
            <input
                type="checkbox"
                id="toggle"
                className="toggle-checkbox visually-hidden"
                checked={isChecked}
                onChange={handleCheckboxChange}
            />
            <label htmlFor="toggle" className={`toggle-label btn ${buttonColor}`}>
                {isChecked ? 'Disable' : 'Enable'}
            </label>

            {isChecked && (
                <div className="mt-5">
                    <img src={`${QrImageUrl}`} width="300px" height="300px" alt="QR Code"></img>
                    <p>GoogleAuthKey: {googleAuthKey}</p>
                    <p>Don't share this key with anyone</p>
                </div>
            )}
        </div>
    );
};

export default TwoFactorAuthentication;