import { createRouter, createWebHistory } from 'vue-router'
import NotFound from '@/components/common/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'signpage',
    component: () => import('@/views/signpage/SignPage.vue')
  },
  {
    path: '/selectexam',
    name: 'selectexam',
    component: () => import('@/views/selectexam/SelectPage.vue')
  },
  {
    path: '/questionzone',
    name: 'questionzone',
    component: () => import('@/views/questionzone/MainPage.vue'),
    props: (route) => ({ category: route.query.category })
  },
  {
    path: '/addquestion',
    name: 'addquestion',
    component: () => import('@/views/questionzone/AddQuestion.vue'),
    props: (route) => ({ category: route.query.category }) // 여기에 props 설정을 추가
  },
  {
    path: '/solvingquestion/:questionId',
    name: 'solvingquestion',
    component: () => import('@/views/questionzone/SolvingQuestion.vue'),
    props: true,
  },
  {
    path: '/discussquestion/:questionId',
    name: 'discussquestion',
    component: () => import('@/views/questionzone/DiscussQuestion.vue'),
    props: true,
  },
  //   {
  //     path: '/',
  //     name: 'signpage',
  //     component: () => import('@/views/signpage/SignPage.vue')
  //   },
  //   {
  //     path: '/',
  //     name: 'signpage',
  //     component: () => import('@/views/signpage/SignPage.vue')
  //   },
  //   {
  //     path: '/about',
  //     name: 'about',
  //     component: () => import('@/views/AboutView.vue')
  //   },
  // 기타 라우트 설정

  {
    path: "/:catchAll(.*)",
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
