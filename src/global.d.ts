interface Document {
	startViewTransition?(callback: () => void | PromiseLike<void>): {
		updateCallbackDone: PromiseLike<void>;
		ready: PromiseLike<void>;
		finished: PromiseLike<void>;
		skipTransition(): void;
	};
}
