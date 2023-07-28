export interface AsPictureModule {
	sources: {
		[format: string]: {
			src: string;
			w: number;
		}[];
	};

	img: {
		src: string;
		w: number;
		h: number;
	};
}
