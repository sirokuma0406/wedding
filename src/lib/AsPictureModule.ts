export interface AsPictureModule<Format extends string> {
	sources: {
		[format in Format]?: {
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
