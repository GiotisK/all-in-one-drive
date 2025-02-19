import { PropsWithChildren } from 'react';
import { SvgNames, createSvg } from '../../shared/utils/svg-utils';
import { styled, css } from 'styled-components';
import { Keyframes } from 'styled-components/dist/types';
import { Loader } from '../Loader';

const Container = styled.div<{
	$backgroundColor: string;
	$animation?: Keyframes;
}>`
	z-index: 1;
	margin-top: 7px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50px;
	width: 50px;
	border-radius: 50%;
	box-shadow: ${({ theme }) => theme.boxShadow};
	cursor: pointer;
	user-select: none;
	box-sizing: border-box;
	background-color: ${({ $backgroundColor }) => $backgroundColor};
	${({ $animation }) =>
		$animation &&
		css`
			animation: ${$animation} 0.3s;
			animation-fill-mode: forwards;
			animation-duration: 0.3s;
		`}
`;

interface IProps {
	color: string;
	icon: SvgNames;
	animation?: Keyframes;
	onClick?: () => void;
	isLoading?: boolean;
}

const FloatingAddButton = ({
	color,
	icon,
	onClick = undefined,
	animation = undefined,
	children,
	isLoading = false,
}: PropsWithChildren<IProps>): JSX.Element => {
	return (
		<Container $backgroundColor={color} $animation={animation} onClick={onClick}>
			{children}
			{isLoading ? (
				<Loader size={15} backgroundColor='transparent' borderColor='white' />
			) : (
				createSvg(icon, 25, 'white')
			)}
		</Container>
	);
};

export default FloatingAddButton;
