// webpack.config.js

const path = require('path');

module.exports = {
  entry: './src/index.js', // 프로젝트 진입점 파일
  output: {
    filename: 'bundle.js', // 번들된 파일 이름
    path: path.resolve(__dirname, 'dist'), // 번들된 파일의 출력 경로
  },
  module: {
    rules: [
      // 모듈 로더와 규칙 설정
      {
        test: /\.jsx?$/, // .js 또는 .jsx 확장자를 가진 파일에 적용
        exclude: /node_modules/, // node_modules 폴더는 제외
        use: {
          loader: 'babel-loader', // Babel 로더 사용
        },
      },
    ],
  },
  resolve: {
    alias: {
      // 모듈 별칭 설정
      '@mui/icons-material': '@mui/icons-material', // @mui/icons-material 모듈의 별칭 설정
    },
  },
};
