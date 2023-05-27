import FloatingButton from "../components/FloatingButtons/FloatingButton";
import { FloatingButtonsContainer } from "../components/FloatingButtons/FloatingButtonsContainer";
import { SvgNames } from "../Shared/utils/svg-utils";

export const DrivePage = (): JSX.Element => {
	return (
		<>
			<FloatingButton color="red" icon={SvgNames.AddFile} />
			<FloatingButtonsContainer />
		</>
	);
};
