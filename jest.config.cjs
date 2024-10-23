module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files using ts-jest
    '^.+\\.jsx?$': 'babel-jest', // Transform JavaScript/JSX files using Babel
  },
  testEnvironment: 'jsdom', // Required for React component testing
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'], // Extensions Jest will recognize
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Handle CSS imports for Jest
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Optional: for custom setup like Enzyme or React Testing Library
};