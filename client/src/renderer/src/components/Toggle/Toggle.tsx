import { styled } from 'styled-components';
import { PropsWithChildren } from 'react';

const Switch = styled.label`
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
`;
const Slider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;

    &:before {
        position: absolute;
        content: '';
        height: 15px;
        width: 15px;
        left: 3px;
        bottom: 2.5px;
        background-color: red;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 50%;
    }
`;

const Input = styled.input`
	opacity: 0;
	width: 0;
	height: 0;

	&:checked + ${Slider} {
		background-color: black;
	}

	&:not(:checked) + ${Slider} {
		background-color: white;
	}

	&:focus + ${Slider} {
		box-shadow: ${({ theme }) => theme.boxShadow}};
	}

	&:checked + ${Slider}:before {
		background-color: white;
		-webkit-transform: translateX(17px);
		-ms-transform: translateX(17px);
	}

	&:not(:checked) + ${Slider}:before {
		background-color: #24a0ed;
	}
`;

interface IProps {
    checked: boolean;
    onChange: () => void;
}

export const Toggle = ({ checked, onChange, children }: PropsWithChildren<IProps>): JSX.Element => {
    return (
        <Switch>
            <Input type='checkbox' checked={checked} onChange={onChange} />
            <Slider>{children}</Slider>
        </Switch>
    );
};
