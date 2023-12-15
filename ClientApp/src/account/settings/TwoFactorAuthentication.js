import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TwoFactorAuthentication = () => {
    const [TwoFactorStatus, setTwoFactorStatus] = useState(null);
    const [googleAuthKey, setGoogleAuthKey] = useState('');

    const activateTwoFactor = async (status) => {
        try {
            const enteredValue = document.getElementById('userAuthKey').value;

            const sendData = {
                authKey: googleAuthKey,
                enteredAuthKey: enteredValue
            };

            const response = await fetch('/api/account/enableTwoFactor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(sendData),
            });

            if (response.ok) {
                const data = await response.json();

                var displayDiv = document.createElement("div");
                displayDiv.setAttribute("role", "alert");

                if (data) {
                    setTwoFactorStatus(true);
                    updateStatusInfo(true);
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

    const disableTwoFactor = async (status) => {
        try {
            const enteredValue = document.getElementById('userAuthKey').value;

            const sendData = {
                enteredAuthKey: enteredValue
            };

            const response = await fetch('/api/account/disableTwoFactor', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(sendData),
            });

            if (response.ok) {
                const data = await response.json();

                var displayDiv = document.createElement("div");
                displayDiv.setAttribute("role", "alert");

                if (data) {
                    setTwoFactorStatus(false);
                    updateStatusInfo(false);
                    displayDiv.classList.add("alert", "alert-success");
                    displayDiv.textContent = "Disabled!";
                }
                else {
                    displayDiv.classList.add("alert", "alert-danger");
                    displayDiv.textContent = "Code is expired or wrong!";
                }
                var x = document.getElementById('activation-alert');
                x.innerHTML = "";

                x.appendChild(displayDiv);
                await fetchTwoFactorKey();
            }
            else {
                throw new Error('Failed to disable 2FA');
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
            const response = await fetch('api/account/GetTwoFactorStatus', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // Process received data
                setTwoFactorStatus(data.twoFactorEnabled);
                updateStatusInfo(data.twoFactorEnabled);
                if (!data.twoFactorEnabled) {
                    await fetchTwoFactorKey();
                }
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
            const response = await fetch('/api/account/GetTwoFactorKey', {
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
            {!TwoFactorStatus ? (
                <div className="row mb-2">
                    <div className="col-2">
                        <img src="" className="img-fluid" alt="QR Code" id="QR_image"></img>
                        <figcaption className="figure-caption text-center"></figcaption>
                    </div>
                    <div className="col-10 align-items-center">
                        <h4>How to Enable</h4>
                        <ol>
                            <li>Download and install the Google Authenticator app from the app store on your mobile device. This app will generate codes for your 2FA.</li>
                            <li>Open the Authenticator app and choose the option to add a new account. Use the app to scan the provided QR code or manually enter the secret key provided.</li>
                            <li>Once the QR code is scanned or the secret key is entered, the app will generate a unique code for your account. Enter this code on the website to confirm setup.</li>
                        </ol>
                    </div>
                </div>
            ):(
                    <div className="row mb-2">
                        <div>
                            <p>Your Two-Factor Authentication is currently active.</p>
                            <p>To disable 2FA, please follow these steps:</p>
                            <ol>
                                <li>Open your Google Authenticator app.</li>
                                <li>Enter the code generated by Google Authenticator below:</li>
                            </ol>
                        </div>
                    </div>
            ) }
            <div className="row mt-4">
                <div className="col h4">
                    <input type="number" className="form-control" placeholder="enter the digit code" id="userAuthKey" maxLength="6"></input>
                </div>
                <div className="col-8 status-info">
                    <input className="btn btn-dark" type="button" value={!TwoFactorStatus ? ("Enable") : ("Disable")} onClick={!TwoFactorStatus ? (activateTwoFactor) : (disableTwoFactor)}></input>
                </div>
            </div>

            <div className="row mt-4" id="activation-alert">
            </div>
        </div>
    );
};

export default TwoFactorAuthentication;