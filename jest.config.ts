export default {
  coverageProvider: "v8",
  //preset: 'ts-jest',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
};
