import { PropsWithChildren } from 'react';
import { IconButton } from '../IconButton';
import { SvgNames } from '../../shared/utils/svg-utils';
import { styled, useTheme } from 'styled-components';
import { Button } from '../Button';
import { useDispatch } from 'react-redux';
import { closeModals } from '../../redux/slices/modalSlice';

const Container = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.4);
`;

const Backdrop = styled.div`
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1;
	height: 100%;
	width: 100%;
`;

const ModalContainer = styled.div`
	display: flex;
	z-index: 2;
	position: relative;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	border-radius: 5px;
	background-color: ${props => props.theme.colors.background};
	box-shadow: ${({ theme }) => theme.colors.boxShadow};
`;

const Header = styled.div`
	align-self: flex-start;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	align-items: baseline;
	width: 90%;
	margin: 3% 0% 1% 5%;
	border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderText = styled.p`
	margin: 0;
	margin-bottom: 3px;
	font-size: 25px;
	color: ${props => props.theme.colors.textPrimary};
`;

const Footer = styled.div`
	display: flex;
	width: 90%;
	justify-content: flex-end;
	border-top: 1px solid ${props => props.theme.colors.border};
`;

export interface BaseModalProps {
	visible: boolean;
}

interface IProps extends BaseModalProps {
	title?: string;
	showHeader?: boolean;
	showFooter?: boolean;
	leftButtonText?: string;
	rightButtonText?: string;
}

export const BaseModal = ({
	visible,
	title = '',
	showHeader = true,
	showFooter = false,
	leftButtonText = '',
	rightButtonText = '',
	children,
}: PropsWithChildren<IProps>): JSX.Element => {
	const dispatch = useDispatch();
	const theme = useTheme();

	const closeModal = (): void => {
		dispatch(closeModals());
	};

	return (
		<>
			{visible && (
				<Container>
					<Backdrop onClick={closeModal} />
					<ModalContainer>
						{showHeader && (
							<Header>
								<HeaderText>{title}</HeaderText>
								<IconButton
									style={{ marginLeft: 'auto' }}
									icon={SvgNames.Close}
									onClick={closeModal}
									color={theme?.colors.textPrimary}
								/>
							</Header>
						)}
						{children}
						{showFooter && (
							<Footer>
								<Button
									text={leftButtonText}
									style={{ margin: '3%' }}
									onClick={closeModal}
									type='secondary'
								/>
								<Button text={rightButtonText} style={{ marginTop: '3%' }} />
							</Footer>
						)}
					</ModalContainer>
				</Container>
			)}
		</>
	);
};
