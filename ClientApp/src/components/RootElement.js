import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import React from 'react';
import { Link } from 'react-router-dom';

export default function RootElement() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
              <div className="container-fluid">
                <Link className="navbar-brand" to="/">Expenses tracker aplication</Link>
                <button className="navbar-toggler d-lg-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="collapsibleNavId">
                    <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/" aria-current="page">Home <span className="visually-hidden">(current)</span></Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/export">Export</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/import">Import</Link>
                        </li>

                        {/* <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="dropdownId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</Link>
                            <div className="dropdown-menu" aria-labelledby="dropdownId">
                                <Link className="dropdown-item" to="#">Action 1</Link>
                                <Link className="dropdown-item" to="#">Action 2</Link>
                            </div>
                        </li> */}
                    </ul>
                </div>
          </div>
        </nav>
        
    );
}