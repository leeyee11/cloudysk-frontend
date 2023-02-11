import { defineConfig } from '@umijs/max';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
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
      name: 'Music',
      path: '/music',
      component: './Music',
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
