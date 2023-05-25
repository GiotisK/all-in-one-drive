import React, { useState } from "react";
import { Input } from "./Input";
import { ResponseText } from "./ResponseText";
import { Button } from "./Button";
import { styled } from "styled-components";

const centerAbsoluteDivInPage = `
	position: absolute;
	top: 0;
	bottom: 0;
	margin-top: auto;
	margin-bottom: auto;`;

const FormContainer = styled.form`
	${centerAbsoluteDivInPage}
	display: flex;
	flex-direction: column;
	box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	height: 380px;
	width: 430px;
	border-radius: 5px;
	background-color: white;
`;

const TabsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	border-bottom: 1px solid #ccc;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
`;

const ButtonContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
`;

const TabContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	border-right: 1px solid #ccc;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	background-color: white;
	color: #ccc;
	cursor: pointer;
`;

const ActiveTabContainer = styled(TabContainer)`
	color: ${({ theme }) => theme.colors.textPrimary};
	cursor: default;
`;

const TabText = styled.p`
	font-size: 18px;
	margin: 5%;
	padding: 2px;
`;

const TabUnderline = styled.div`
	border-bottom: 3px solid;
	width: 65px;
	margin-bottom: 5px;
`;

const ActiveTabUnderline = styled(TabUnderline)`
	border-color: ${({ theme }) => theme.colors.bluePrimary};
`;

const InactiveTabUnderline = styled(TabUnderline)`
	border-color: #ccc;
`;

const InputsContainer = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: space-evenly;
`;

enum Mode {
	Login,
	Register,
}

type ResponseText = {
	type: string; //TODO: be more specific
	text: string;
	color: string;
};

export const CredentialsBox = (): JSX.Element => {
	const [mode, setMode] = useState<Mode>(Mode.Login);

	const [responseText, setResponseText] = useState<ResponseText>({
		type: "",
		text: "",
		color: "",
	});

	const [inputValues, setInputValues] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	function onInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value } = event.target;

		setInputValues({
			...inputValues,
			[name]: value,
		});
	}

	const registerUser = async (userData: any): Promise<void> => {
		/* const body = JSON.stringify(userData);
		const res = await myFetch("register", "POST", body).catch((err) => {
			console.log(err);
		});
		handleResponse(res); */
	};

	const loginUser = async (userData: any): Promise<void> => {
		/* const body = JSON.stringify(userData);
		const res = await myFetch("login", "POST", body).catch((err) => {
			console.log(err);
		});

		handleResponse(res); */
	};

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

	const onFormSubmitClick = (e: React.FormEvent): void => {
		e.preventDefault();

		if (mode === Mode.Login) {
			loginUser(inputValues);
		} else {
			if (confirmPassword()) {
				//actually sign up
				registerUser(inputValues);
			} else {
				setResponseText({
					type: "password",
					text: "Passwords must be the same",
					color: "red",
				});
			}
		}
	};

	const confirmPassword = (): boolean => {
		return (
			inputValues.password === inputValues.confirmPassword &&
			inputValues.password !== ""
		);
	};

	const renderErrorMessage = (): JSX.Element | null => {
		return responseText.type !== "" ? (
			<ResponseText text={responseText.text} color={responseText.color} />
		) : null;
	};

	const renderTabs = (): JSX.Element[] => {
		const tabMap = [
			{
				text: "Login",
				onClick: () => {
					setMode(Mode.Login);
				},
				class: mode === Mode.Login ? "tab-active" : "tab-inactive",
			},
			{
				text: "Register",
				onClick: () => {
					setMode(Mode.Register);
				},
				class: mode === Mode.Register ? "tab-active" : "tab-inactive",
			},
		];

		return tabMap.map((tab, index) => {
			const TabContainerComponent =
				tab.class === "tab-active" ? ActiveTabContainer : TabContainer;
			const TabUnderlineComponent =
				tab.class === "tab-active"
					? ActiveTabUnderline
					: InactiveTabUnderline;

			return (
				<TabContainerComponent
					key={index}
					className={tab.class}
					onClick={tab.onClick}
				>
					<TabText>{tab.text}</TabText>
					<TabUnderlineComponent className="login-line" />
				</TabContainerComponent>
			);
		});
	};

	const renderInputs = (): JSX.Element => {
		const inputsMap = [
			{
				title: "Email",
				type: "email",
				value: inputValues.email,
				name: "email",
			},
			{
				title: "Password",
				type: "password",
				value: inputValues.password,
				name: "password",
			},
		];

		if (mode === Mode.Register) {
			inputsMap.push({
				title: "Confirm Password",
				type: "password",
				value: inputValues.confirmPassword,
				name: "confirmPassword",
			});
		}

		return (
			<InputsContainer>
				{inputsMap.map((input, index) => (
					<Input
						key={index}
						name={input.name}
						title={input.title}
						type={input.type}
						value={input.value}
						onChange={onInputChange}
					/>
				))}
			</InputsContainer>
		);
	};

	const buttontext = mode === Mode.Login ? "Login" : "Register";

	return (
		<FormContainer onSubmit={onFormSubmitClick}>
			<TabsContainer>{renderTabs()}</TabsContainer>
			{renderInputs()}
			<ButtonContainer>
				{renderErrorMessage()}
				<Button styles="margin: 3% 10% 4% 0%" text={buttontext} />
			</ButtonContainer>
		</FormContainer>
	);
};
