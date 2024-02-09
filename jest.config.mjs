export default {
	transform: {
		"^.+\\.[t|j]sx?$": "babel-jest",
	},
	moduleNameMapper: {
		"\\.(scss|sass|css)$": "identity-obj-proxy",
	},
	testEnvironment: "jsdom",
	setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
