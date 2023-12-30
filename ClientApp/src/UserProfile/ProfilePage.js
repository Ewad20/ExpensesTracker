import React, { useState, useEffect } from 'react';

const ProfilePage = () => {
    const [userData, setUserData] = useState({
        user: {
            firstName: '',
            lastName: '',
            userName: '',
            email: '',
            password: '********',
            twoFactorEnabled: false,
        },
        logins: [],
    });
    const [isEditing, setIsEditing] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const fetchUserdata = async () => {
        try {
            const response = await fetch('api/account/GetProfilePageData', {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            data.user.password = "********";
            setUserData(data);
        } catch (error) {
            console.error('Error during fetching user data:', error);
        }
    };

    useEffect(() => {
        fetchUserdata();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const validationErrors = validateUserData();
            if (Object.keys(validationErrors).length > 0) {
                setValidationErrors(validationErrors);
                return;
            }

            setIsEditing(false);
            setValidationErrors({});

            const response = await fetch('api/account/UpdateProfilePageData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userData.user.id,
                    firstName: userData.user.firstName,
                    lastName: userData.user.lastName,
                    userName: userData.user.userName,
                    email: userData.user.email,
                    password: userData.user.password
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }

            fetchUserdata();
        } catch (error) {
            console.error('Error during saving user data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            user: {
                ...prevUserData.user,
                [name]: type === 'checkbox' ? checked : value,
            },
        }));
    };

    const validateUserData = () => {
        const errors = {};

        if (!userData.user.firstName.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!userData.user.lastName.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!userData.user.userName.trim()) {
            errors.userName = 'Username is required';
        }

        if (!userData.user.email.trim()) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(userData.user.email)) {
            errors.email = 'Invalid email format';
        }

        if (!userData.user.password.trim()) {
            errors.password = 'Password is required';
        } else if (!isValidPassword(userData.user.password)) {
            errors.password = 'Invalid password format';
        }         

        return errors;
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password) => {
        if (password.length < 8) {
            return false;
        } else if (!/[A-Z]/.test(password)) {
            return false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return false;
        }
        else if (!/[0-9]/.test(password)) {
            return false;
        }
        return true;
    };

    return (
        <div className="container">
            <h3>Account details:</h3>
            <div className="profile__component">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label>First Name:</label>
                            </td>
                            <td>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={userData.user.firstName}
                                            onChange={handleInputChange}
                                        />
                                        <div className="error">{validationErrors.firstName}</div>
                                    </>
                                ) : (
                                    userData.user.firstName
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Last Name:</label>
                            </td>
                            <td>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={userData.user.lastName}
                                            onChange={handleInputChange}
                                        />
                                        <div className="error">{validationErrors.lastName}</div>
                                    </>
                                ) : (
                                    userData.user.lastName
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Username:</label>
                            </td>
                            <td>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="userName"
                                            value={userData.user.userName}
                                            onChange={handleInputChange}
                                        />
                                        <div className="error">{validationErrors.userName}</div>
                                    </>
                                ) : (
                                    userData.user.userName
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Email:</label>
                            </td>
                            <td>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="text"
                                            name="email"
                                            value={userData.user.email}
                                            onChange={handleInputChange}
                                        />
                                        <div className="error">{validationErrors.email}</div>
                                    </>
                                ) : (
                                    userData.user.email
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Password:</label>
                            </td>
                            <td>
                                {isEditing ? (
                                    <>
                                        <input
                                            type="password"
                                            name="password"
                                            value={userData.user.password}
                                            onChange={handleInputChange}
                                        />
                                        <div className="error">{validationErrors.password}</div>
                                    </>
                                ) : (
                                    userData.user.password
                                )}
                            </td>
                        </tr>
                         <tr>
                            <label>TwoFactorEnabled:</label> {userData.user.twoFactorEnabled ? "Yes" : "No"}
                        </tr>


                    </tbody>
                </table>
                {isEditing ? (
                    <div className="edit-button-container">
                        <button onClick={handleSaveClick}>Save</button>
                    </div>
                ) : (
                    <div className="edit-button-container">
                        <button onClick={handleEditClick}>Edit</button>
                    </div>
                )}
            </div>
        </div>
        
    );
}

export default ProfilePage;