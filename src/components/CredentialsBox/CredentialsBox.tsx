import { useState } from "react";
import { Input } from "../Input";
import { ResponseText } from "../ResponseText";

import "./CredentialsBox.css";
import { Button } from "../Button";

export const CredentialsBox = () => {
	const blue = "#24a0ed";
	const gray = "#ccc";
	const inputFieldTitles = ["Email", "Password", "Confirm Password"];
	const inputFieldKeys = ["email", "password", "confirmPassword"];
	const inputFieldTypes = ["email", "password", "password"];

	const [buttonText, setButtonText] = useState("Log In");
	const [inputFieldTitlesTemp, setInputFieldTitlesTemp] = useState(
		inputFieldTitles.slice(0, 2)
	);

	const [loginTabObj, setLoginTabObj] = useState({
		cursorType: "default",
		lineColor: blue,
		textColor: "black",
	});
	const [registerTabObj, setRegisterTabObj] = useState({
		cursorType: "pointer",
		lineColor: gray,
		textColor: gray,
	});
	const [errorObj, setErrorObj] = useState({
		errorType: "",
		errorText: "",
		errorColor: "",
	});
	const [formInputValuesObj, setFormInputValuesObj] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	/* const [redirect, setRedirect] = useState(false); */

	function onRegisterTabClick() {
		setInputFieldTitlesTemp(inputFieldTitles);

		setRegisterTabObj({
			cursorType: "default",
			lineColor: blue,
			textColor: "black",
		});
		setLoginTabObj({
			cursorType: "pointer",
			lineColor: gray,
			textColor: gray,
		});
		setButtonText("Sign Up");
		setErrorObj({
			errorType: "",
			errorText: "",
			errorColor: "",
		});
	}

	function onLoginTabClick() {
		setInputFieldTitlesTemp(inputFieldTitles.slice(0, 2));

		setLoginTabObj({
			cursorType: "default",
			lineColor: blue,
			textColor: "black",
		});
		setRegisterTabObj({
			cursorType: "pointer",
			lineColor: gray,
			textColor: gray,
		});
		setButtonText("Log In");
		setErrorObj({
			errorType: "",
			errorText: "",
			errorColor: "",
		});
	}

	function onFormInputValuesChange(inputType: any, event: any) {
		const tempInputValuesObj: any = { ...formInputValuesObj };
		tempInputValuesObj[inputType] = event.target.value;
		setFormInputValuesObj(tempInputValuesObj);
	}

	async function registerUser(userData: any) {
		/* const body = JSON.stringify(userData);
		const res = await myFetch("register", "POST", body).catch((err) => {
			console.log(err);
		});
		handleResponse(res); */
	}

	async function loginUser(userData: any) {
		/* const body = JSON.stringify(userData);
		const res = await myFetch("login", "POST", body).catch((err) => {
			console.log(err);
		});

		handleResponse(res); */
	}

	function handleResponse(res: any) {
		/* res = JSON.parse(res);
		if (res.resType === "duplicate_email") {
			setErrorObj({
				errorType: res.resType,
				errorText: "This email is already in use.",
				errorColor: "red",
			});
		} else if (res.resType === "register_success") {
			setErrorObj({
				errorType: res.resType,
				errorText: "Sign up successful! You can now log in.",
				errorColor: "green",
			});
		} else if (res.resType === "login_success") {
			setErrorObj({
				errorType: res.resType,
				errorText: "Log in successful",
				errorColor: "green",
			});
			setRedirect(true);
		} else if (
			res.resType === "search_failed" ||
			res.resType === "compare_passwords_failed"
		) {
			setErrorObj({
				errorType: res.resType,
				errorText: "Internal Error...Please try again later.",
				errorColor: "red",
			});
		} else if (res.resType === "user_not_exists") {
			setErrorObj({
				errorType: res.resType,
				errorText: "Username/Password combination is not correct",
				errorColor: "red",
			});
		} else {
			//dunno what else is left
		}
		return false; */
	}

	function onFormSubmitClick(e: any) {
		e.preventDefault();
		e.stopPropagation();

		if (checkIfValidEmail()) {
			if (buttonText === "Log In") {
				loginUser(formInputValuesObj);
			} else if (buttonText === "Sign Up") {
				if (checkIfPasswordSame()) {
					//actually sign up
					registerUser(formInputValuesObj);
				} else {
					setErrorObj({
						errorType: "password",
						errorText: "Passwords must be the same",
						errorColor: "red",
					});
				}
			}
		} else {
			setErrorObj({
				errorType: "email",
				errorText: "This email format is not correct",
				errorColor: "red",
			});
		}
	}

	function checkIfValidEmail() {
		/*regex for email structure*/
		const regex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (regex.test(formInputValuesObj.email)) {
			return true;
		}
		return false;
	}

	function checkIfPasswordSame() {
		if (
			formInputValuesObj.password ===
				formInputValuesObj.confirmPassword &&
			formInputValuesObj.password !== ""
		) {
			return true;
		}
		return false;
	}

	function getCorrectErrorMessage() {
		if (errorObj.errorType !== "") {
			return (
				<ResponseText
					text={errorObj.errorText}
					color={errorObj.errorColor}
				/>
			);
		}
		return null;
	}

	return (
		<form className="credentials-box" onSubmit={onFormSubmitClick}>
			<div className="header-text__container">
				<div
					className="login-text-container"
					style={{ cursor: loginTabObj.cursorType }}
					onClick={onLoginTabClick}
				>
					<p
						className="login-text"
						style={{ color: loginTabObj.textColor }}
					>
						Log In
					</p>

					<div
						className="login-line"
						style={{ borderColor: loginTabObj.lineColor }}
					/>
				</div>

				<div
					className="login-text-container"
					style={{ cursor: registerTabObj.cursorType }}
					onClick={onRegisterTabClick}
				>
					<p
						className="register-text"
						style={{ color: registerTabObj.textColor }}
					>
						Register
					</p>

					<div
						className="register-line"
						style={{ borderColor: registerTabObj.lineColor }}
					/>
				</div>
			</div>

			<div className="input-fields-container">
				{inputFieldTitlesTemp.map((title, index) => (
					<Input
						key={inputFieldKeys[index]}
						title={title}
						type={inputFieldTypes[index]}
						value={formInputValuesObj[inputFieldKeys[index]]}
						onChange={(event: any) => {
							onFormInputValuesChange(
								inputFieldKeys[index],
								event
							);
						}}
					/>
				))}
			</div>

			<div className="button-container">
				{getCorrectErrorMessage()}
				<Button styles="margin: 2% 10% 4% 0%" text={buttonText} />
			</div>
		</form>
	);
};
