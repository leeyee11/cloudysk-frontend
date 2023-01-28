import { defineConfig } from '@umijs/max';

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
      redirect: '/File',
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
});
