// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
	export interface DefaultTheme {
		colors: {
			bluePrimary: string;
			blueSecondary: string;
			textPrimary: string;
			textSecondary: string;
			green: string;
			red: string;
			orange: string;
			background: string;
			backgroundSecondary: string;
			border: string;
			boxShadow: string;
			panel: string;
		};
	}
}
