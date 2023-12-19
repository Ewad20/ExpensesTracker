import React, { useState,useEffect } from 'react';

const ProfilePage = () => {

    const [userData, setUserData] = useState({
        user: {
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            twoFactorEnabled: false
        },
        logins: [{

        }]
    });

    const fetchUserdata = async () => {
        try {
            const response = await fetch('api/account/GetProfilePageData', {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await response.json();
            console.log(data);
            setUserData(data);
            console.log(userData);
        } catch (error) {
            console.error('Error during fetching user data:', error);
        }
    }

    useEffect(() => {
        fetchUserdata();
    }, []);

    return (
        <div class="container">
            <h3>Account details:</h3>
            <div className="profile__component">
                <table>
                    <tbody>
                        <tr>
                            <label>Firstname:</label> {userData.user.firstName}
                        </tr>
                        <tr>
                            <label>Lastname:</label> {userData.user.lastName}
                        </tr>
                        <tr>
                            <label>Username:</label> {userData.user.userName}
    `                   </tr>
                        <tr>
                            <label>Email:</label> {userData.user.email}
                        </tr>
                        <tr>
                            <label>TwoFactorEnabled:</label> {userData.user.twoFactorEnabled ? "Yes" : "No"}
                        </tr>
                    </tbody>
                </table>
                
            </div>
        </div>
        
    );
}

export default ProfilePage;