import path from 'path';

const config = {
  entry: './src/index.ts',  // Điểm đầu vào của ứng dụng
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
        fs: false,
    }  // Webpack sẽ tìm kiếm các tệp .ts và .js
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',  // Sử dụng ts-loader để biên dịch TypeScript
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
