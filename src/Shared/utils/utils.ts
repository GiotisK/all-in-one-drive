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

export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0 || bytes === undefined) return "-";

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
