import { useTheme } from "styled-components";
import { DriveType } from "../types/types";
import { SvgNames, createSvg } from "./svg-utils";

export const CreateDriveSvg = (drive: DriveType): JSX.Element | null => {
	const theme = useTheme();
	let svgName: SvgNames;

	switch (drive) {
		case DriveType.GoogleDrive:
			svgName = SvgNames.GoogleDrive;
			break;
		case DriveType.Dropbox:
			svgName = SvgNames.Dropbox;
			break;
		case DriveType.OneDrive:
			svgName = SvgNames.OneDrive;
			break;
	}

	return createSvg(svgName, 35, theme?.colors.textSecondary);
};
