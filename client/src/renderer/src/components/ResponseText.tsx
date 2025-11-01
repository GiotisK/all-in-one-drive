import styled from 'styled-components';

const ErrorTextContainer = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
    margin-left: 5%;
    margin-right: 1%;
    margin-bottom: 2%;
`;

const LoginErrorText = styled.p`
    color: red;
    font-size: 16px;
    margin-left: 1%;

    @media only screen and (max-width: 1366px) {
        font-size: 13px;
    }
`;

interface IProps {
    text: string;
    color: string;
}

export const ResponseText = ({ text, color }: IProps): JSX.Element => {
    return (
        <ErrorTextContainer>
            <LoginErrorText style={{ color: color }}>{text}</LoginErrorText>
        </ErrorTextContainer>
    );
};
