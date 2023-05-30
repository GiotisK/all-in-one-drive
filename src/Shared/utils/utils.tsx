import { useTheme } from "styled-components";
import { Drive } from "../types/types";
import { SvgNames, createSvg } from "./svg-utils";

export const CreateDriveSvg = (drive: Drive): JSX.Element | null => {
	const theme = useTheme();
	let svgName: SvgNames;

	switch (drive) {
		case Drive.GoogleDrive:
			svgName = SvgNames.GoogleDrive;
			break;
		case Drive.Dropbox:
			svgName = SvgNames.Dropbox;
			break;
		case Drive.OneDrive:
			svgName = SvgNames.OneDrive;
			break;
	}

	return createSvg(svgName, 35, theme?.colors.textSecondary);
};
