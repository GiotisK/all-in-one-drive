import { ReactComponent as AddFile } from "../../assets/svgs/add-file.svg";
import { ReactComponent as AddFolder } from "../../assets/svgs/add-folder.svg";
import { ReactComponent as Burger } from "../../assets/svgs/burger.svg";
import { ReactComponent as Close } from "../../assets/svgs/close.svg";
import { ReactComponent as Plus } from "../../assets/svgs/plus.svg";

export enum SvgNames {
	AddFile = "add-file",
	AddFolder = "add-folder",
	Burger = "burger",
	Close = "close",
	Plus = "plus",
}

export const createSvg = (name: SvgNames, size = 24): JSX.Element | null => {
	switch (name) {
		case SvgNames.AddFile:
			return <AddFile width={size} height={size} />;
		case SvgNames.AddFolder:
			return <AddFolder width={size} height={size} />;
		case SvgNames.Burger:
			return <Burger width={size} height={size} />;
		case SvgNames.Close:
			return <Close width={size} height={size} />;
		case SvgNames.Plus:
			return <Plus width={size} height={size} />;
		default:
			return null;
	}
};
