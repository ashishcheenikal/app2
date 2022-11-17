import React from 'react'
import './NewPassword.css'


export default function NewPassword() {
    return (
        <div className="mainDiv">
            <div className="cardStyle">
                <form action="" name="signupForm" id="signupForm">

                    <img src="" id="signupLogo" />

                    <h2 className="formTitle">
                        Reset Your Password
                    </h2>

                    <div className="inputDiv">
                        <label className="inputLabel" htmlFor="password">New Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>

                    <div className="inputDiv">
                        <label className="inputLabel" htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" />
                    </div>

                    <div className="buttonWrapper">
                        <button type="submit" id="submitButton" className="submitButton pure-button pure-button-primary">
                            <span>Continue</span>
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
