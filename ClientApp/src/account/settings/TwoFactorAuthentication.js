import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TwoFactorAuthentication = () => {
    const [TwoFactorStatus, setTwoFactorStatus] = useState(null);
    const [googleAuthKey, setGoogleAuthKey] = useState('');

    // Update TwoFactor status for user on server
    const activateTwoFactor = async (status) => {
        try {
            const enteredValue = document.getElementById('userAuthKey').value;

            const sendData = {
                authKey: googleAuthKey,
                enteredAuthKey: enteredValue
            };

            const response = await fetch('https://localhost:7088/api/account/enableTwoFactor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(sendData),
            });

            if (response.ok) {
                const data = await response.json();

                var displayDiv = document.createElement("div");
                displayDiv.setAttribute("role", "alert");

                console.log(data);

                if (data) {
                    displayDiv.classList.add("alert", "alert-success");
                    displayDiv.textContent = "Activated!";
                }
                else {
                    displayDiv.classList.add("alert", "alert-danger");
                    displayDiv.textContent = "Code is expired or wrong!";
                }
                var x = document.getElementById('activation-alert');
                x.innerHTML = "";

                x.appendChild(displayDiv);
            }
            else {
                throw new Error('Failed to update Two Factor Status');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Update two factor status on page
    const updateStatusInfo = (status) => {
        const spinner = document.querySelector('.status-info .spinner-border');
        if (status != null) {
            if (spinner)
                spinner.remove();
            
            if (status === true) {
                document.getElementsByClassName('status-info')[0].innerHTML = "<div class=\"h5 text-success\">Enabled</div>";
            }
            else if (status === false) {
                document.getElementsByClassName('status-info')[0].innerHTML = "<div class=\"h5 text-danger\">Disabled</div>";
            }
        }
    };
    // Get two factor status
    const fetchTwoFactorStatus = async () => {
        try {
            const response = await fetch('https://localhost:7088/api/account/GetTwoFactorStatus', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // Process received data
                setTwoFactorStatus(data.twoFactorEnabled);
                updateStatusInfo(data.twoFactorEnabled);
                setTwoFactorStatus(data.twoFactorEnabled);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // Get two factor status
    const fetchTwoFactorKey = async () => {
        try {
            const response = await fetch('https://localhost:7088/api/account/GetTwoFactorKey', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // Process received data
                document.getElementById('QR_image').src = data.barcodeImageUrl;
                document.querySelector('.figure-caption').textContent = "Key: " + data.authKey;
                setGoogleAuthKey(data.authKey);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Effect to fetch data from the API and update isChecked state
    useEffect(() => {
        fetchTwoFactorStatus();
        fetchTwoFactorKey();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <h1>Two-Factor Authentication</h1>
            </div> <hr></hr>
            <div className="row mb-2">
                <div className="col h4">
                    Status
                </div> 
                <div className="col-8 status-info">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div> 
            </div> <hr></hr>
            <div className="row mb-2">
                <div className="col-2">
                    <img src="" className="img-fluid" alt="QR Code" id="QR_image"></img>
                    <figcaption className="figure-caption text-center"></figcaption>
                </div>
                <div className="col-10 d-flex align-items-center">
                    <p>Install Google Authenticator app from store on your mobile device.<br></br>
                        Using the authenticator app, scan the QR code. Alternatively, you can manually enter the secret key.<br></br>
                    If authentication is enabled and you activate it again, the previous one will be deactivated</p>
                </div>
            </div> <hr></hr>
            <div className="row mt-4">
                <div className="col h4">
                    <input type="number" className="form-control" placeholder="enter the digit code" id="userAuthKey" maxLength="6"></input>
                </div>
                <div className="col-8 status-info">
                    <input className="btn btn-dark" type="button" value="Confirm & Enable" onClick={activateTwoFactor}></input>
                </div>
            </div>

            <div className="row mt-4" id="activation-alert">
            </div>
        </div>
    );
};

export default TwoFactorAuthentication;