import { PropsWithChildren } from 'react';
import { IconButton } from '../IconButton';
import { SvgNames } from '../../shared/utils/svg-utils';
import { styled, useTheme } from 'styled-components';
import { Button } from '../Button';
import { useDispatch } from 'react-redux';
import { closeModals } from '../../redux/slices/modal/modalSlice';
import { Loader } from '../Loader';

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
    justify-content: space-between;
    width: 90%;
`;

const ButtonsContainer = styled.div`
    display: flex;
    flex: 1;
    justify-content: flex-end;
    min-height: 30px;
`;

type ButtonProps = {
    text: string;
    onClick?: () => void;
};

type HeaderProps = {
    title: string;
};

type FooterProps = {
    leftButton?: ButtonProps;
    rightButton?: ButtonProps;
    showLoader?: boolean;
};

interface IProps {
    headerProps?: HeaderProps;
    footerProps?: FooterProps;
}

export const BaseModal = ({
    headerProps,
    footerProps,
    children,
}: PropsWithChildren<IProps>): JSX.Element => {
    const dispatch = useDispatch();
    const theme = useTheme();

    const onCloseModals = (): void => {
        dispatch(closeModals());
    };

    return (
        <Container>
            <Backdrop onClick={onCloseModals} />
            <ModalContainer>
                {headerProps && (
                    <Header>
                        <HeaderText>{headerProps.title}</HeaderText>
                        <IconButton
                            style={{ marginLeft: 'auto' }}
                            icon={SvgNames.Close}
                            onClick={onCloseModals}
                            color={theme?.colors.textPrimary}
                        />
                    </Header>
                )}
                {children}
                {footerProps && (
                    <Footer>
                        {footerProps.showLoader && <Loader size={10} />}
                        <ButtonsContainer>
                            {footerProps.leftButton && (
                                <Button
                                    text={footerProps.leftButton.text}
                                    style={{ margin: '3%' }}
                                    type='secondary'
                                    onClick={() => {
                                        footerProps.leftButton?.onClick?.();
                                        onCloseModals();
                                    }}
                                />
                            )}
                            {footerProps.rightButton && (
                                <Button
                                    text={footerProps.rightButton.text}
                                    style={{ marginTop: '3%' }}
                                    onClick={footerProps.rightButton.onClick}
                                />
                            )}
                        </ButtonsContainer>
                    </Footer>
                )}
            </ModalContainer>
        </Container>
    );
};
