export default {
  coverageProvider: "v8",
  //preset: 'ts-jest',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  rootDir: 'src',
  //  roots: [] // Uma lista de caminhos para diretórios que Jest deve usar para pesquisar por arquivos.
};
