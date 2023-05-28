import { ReactComponent as AddFile } from "../../assets/svgs/add-file.svg";
import { ReactComponent as AddFolder } from "../../assets/svgs/add-folder.svg";
import { ReactComponent as Burger } from "../../assets/svgs/burger.svg";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import { ReactComponent as Plus } from "../../assets/svgs/plus.svg";
import { ReactComponent as Trashcan } from "../../assets/svgs/trashcan.svg";
import { ReactComponent as OneDrive } from "../../assets/svgs/onedrive.svg";
import { ReactComponent as GoogleDrive } from "../../assets/svgs/googledrive.svg";
import { ReactComponent as Dropbox } from "../../assets/svgs/dropbox.svg";

export enum SvgNames {
	AddFile = "add-file",
	AddFolder = "add-folder",
	Burger = "burger",
	Close = "close",
	Plus = "plus",
	Trashcan = "trashcan",
	OneDrive = "onedrive",
	GoogleDrive = "googledrive",
	Dropbox = "dropbox",
}

export const createSvg = (
	name: SvgNames,
	size = 24,
	color = "black"
): JSX.Element | null => {
	switch (name) {
		case SvgNames.AddFile:
			return <AddFile color={color} width={size} height={size} />;
		case SvgNames.AddFolder:
			return <AddFolder color={color} width={size} height={size} />;
		case SvgNames.Burger:
			return <Burger color={color} width={size} height={size} />;
		case SvgNames.Close:
			return <Close color={color} width={size} height={size} />;
		case SvgNames.Plus:
			return <Plus color={color} width={size} height={size} />;
		case SvgNames.Trashcan:
			return <Trashcan color={color} width={size} height={size} />;
		case SvgNames.OneDrive:
			return <OneDrive color={color} width={size} height={size} />;
		case SvgNames.GoogleDrive:
			return <GoogleDrive color={color} width={size} height={size} />;
		case SvgNames.Dropbox:
			return <Dropbox color={color} width={size} height={size} />;
		default:
			return null;
	}
};
