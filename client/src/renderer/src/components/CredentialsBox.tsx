import React, { useEffect, useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { styled } from 'styled-components';
import { toast } from 'react-toastify';
import { useLoginUserMutation, useRegisterUserMutation } from '../redux/rtk/userApi';

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
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
	height: 300px;
	width: 400px;
	border-radius: 5px;
	background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const TabsContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
	border-right: 1px solid ${({ theme }) => theme.colors.border};
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;
	background-color: ${({ theme }) => theme.colors.backgroundSecondary};
	color: ${({ theme }) => theme.colors.textPrimary};
	cursor: pointer;
`;

const ActiveTabContainer = styled(TabContainer)`
	color: ${({ theme }) => theme.colors.textPrimary};
	cursor: default;
`;

const TabText = styled.p`
	font-size: 14px;
	margin: 2%;
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
	border-color: ${({ theme }) => theme.colors.textSecondary};
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

export const CredentialsBox = (): JSX.Element => {
	const [mode, setMode] = useState<Mode>(Mode.Login);
	const [inputValues, setInputValues] = useState({
		email: '',
		password: '',
		confirmedPassword: '',
	});
	const [loginUser, { isError: isLoginUserError }] = useLoginUserMutation();
	const [registerUser, { isError: registerUserError, isSuccess: isRegisterUserSuccess }] =
		useRegisterUserMutation();

	useEffect(() => {
		if (isRegisterUserSuccess) {
			toast.success('User registered successfully');
		}
	}, [isRegisterUserSuccess]);

	useEffect(() => {
		if (registerUserError || isLoginUserError) {
			toast.error('Something went wrong');
		}
	}, [registerUserError, isLoginUserError]);

	function onInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value } = event.target;
		setInputValues({
			...inputValues,
			[name]: value,
		});
	}

	const onFormSubmitClick = async (e: React.FormEvent): Promise<void> => {
		e.preventDefault();
		const { email, password } = inputValues;

		if (mode === Mode.Login) {
			loginUser({ email, password });
		} else if (mode === Mode.Register) {
			registerUser({ email, password });
		}
	};

	const renderTabs = (): JSX.Element[] => {
		const tabMap = [
			{
				text: 'Login',
				onClick: () => {
					setMode(Mode.Login);
				},
				class: mode === Mode.Login ? 'tab-active' : 'tab-inactive',
			},
			{
				text: 'Register',
				onClick: () => {
					setMode(Mode.Register);
				},
				class: mode === Mode.Register ? 'tab-active' : 'tab-inactive',
			},
		];

		return tabMap.map((tab, index) => {
			const TabContainerComponent =
				tab.class === 'tab-active' ? ActiveTabContainer : TabContainer;
			const TabUnderlineComponent =
				tab.class === 'tab-active' ? ActiveTabUnderline : InactiveTabUnderline;

			return (
				<TabContainerComponent key={index} className={tab.class} onClick={tab.onClick}>
					<TabText>{tab.text}</TabText>
					<TabUnderlineComponent className='login-line' />
				</TabContainerComponent>
			);
		});
	};

	const renderInputs = (): JSX.Element => {
		const inputsMap = [
			{
				title: 'Email',
				type: 'email',
				value: inputValues.email,
				name: 'email',
			},
			{
				title: 'Password',
				type: 'password',
				value: inputValues.password,
				name: 'password',
			},
		];

		if (mode === Mode.Register) {
			inputsMap.push({
				title: 'Confirm Password',
				type: 'password',
				value: inputValues.confirmedPassword,
				name: 'confirmedPassword',
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
						required
					/>
				))}
			</InputsContainer>
		);
	};

	const buttontext = mode === Mode.Login ? 'Login' : 'Register';

	return (
		<FormContainer onSubmit={onFormSubmitClick}>
			<TabsContainer>{renderTabs()}</TabsContainer>
			{renderInputs()}
			<ButtonContainer>
				<Button style={{ margin: '3% 10% 4% 0' }} text={buttontext} />
			</ButtonContainer>
		</FormContainer>
	);
};
