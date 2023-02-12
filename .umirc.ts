import { defineConfig } from '@umijs/max';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Cloudysk',
  },
  routes: [
    {
      path: '/',
      redirect: '/file',
      icon: 'FileTextOutlined',
    },
    {
      name: 'File',
      path: '/file',
      component: './File',
      icon: 'FileTextOutlined',
    },
    {
      name: 'Star',
      path: '/star',
      component: './Star',
      icon: 'StarOutlined',
    },
    {
      name: 'Player',
      path: '/player',
      component: './Player',
      icon: 'PlayCircleOutlined',
    },
  ],
  npmClient: 'npm',
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
  moment2dayjs: {
    preset: 'antd',
    plugins: ['duration'],
  },
  chainWebpack: (memo, { webpack }) => {
    memo.plugin('monaco').use(
      new MonacoWebpackPlugin({
        languages: ['json'],
      }),
    );
  },
});
