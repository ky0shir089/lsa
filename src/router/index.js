import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '../store/index'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      Auth: true,
      id: 0,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/change-password',
    name: 'change password',
    component: () => import(/* webpackChunkName: "change-password" */ '../views/ChangePassword.vue'),
    meta: {
      Auth: true,
      id: 0,
    }
  },
  {
    path: '/setup-aplikasi/setup-module',
    name: 'Setup Module',
    component: () => import(/* webpackChunkName: "setup-module" */ '../views/setup_aplikasi/module/Module.vue'),
    meta: {
      Auth: true,
      id: 1
    }
  },
  {
    path: '/setup-aplikasi/setup-module/new',
    name: 'New Module',
    component: () => import(/* webpackChunkName: "new-module" */ '../views/setup_aplikasi/module/New.vue'),
    meta: {
      Auth: true,
      id: 1
    }
  },
  {
    path: '/setup-aplikasi/setup-module/edit/:id',
    name: 'Edit Module',
    component: () => import(/* webpackChunkName: "edit-module" */ '../views/setup_aplikasi/module/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 1
    }
  },
  {
    path: '/setup-aplikasi/setup-menu',
    name: 'Setup Menu',
    component: () => import(/* webpackChunkName: "setup-menu" */ '../views/setup_aplikasi/menu/Menu.vue'),
    meta: {
      Auth: true,
      id: 2
    }
  },
  {
    path: '/setup-aplikasi/setup-menu/new',
    name: 'New Menu',
    component: () => import(/* webpackChunkName: "new-menu" */ '../views/setup_aplikasi/menu/New.vue'),
    meta: {
      Auth: true,
      id: 2
    }
  },
  {
    path: '/setup-aplikasi/setup-menu/edit/:id',
    name: 'Edit Menu',
    component: () => import(/* webpackChunkName: "edit-menu" */ '../views/setup_aplikasi/menu/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 1
    }
  },
  {
    path: '/setup-aplikasi/setup-role',
    name: 'Setup Role',
    component: () => import(/* webpackChunkName: "setup-role" */ '../views/setup_aplikasi/role/Role.vue'),
    meta: {
      Auth: true,
      id: 3
    }
  },
  {
    path: '/setup-aplikasi/setup-role/new',
    name: 'New Role',
    component: () => import(/* webpackChunkName: "new-role" */ '../views/setup_aplikasi/role/New.vue'),
    meta: {
      Auth: true,
      id: 3
    }
  },
  {
    path: '/setup-aplikasi/setup-role/edit/:id',
    name: 'Edit Role',
    component: () => import(/* webpackChunkName: "edit-role" */ '../views/setup_aplikasi/role/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 3
    }
  },
  {
    path: '/setup-aplikasi/setup-role-menu',
    name: 'Setup Role Menu',
    component: () => import(/* webpackChunkName: "setup-role-menu" */ '../views/setup_aplikasi/role_menu/RoleMenu.vue'),
    meta: {
      Auth: true,
      id: 4
    }
  },
  {
    path: '/setup-aplikasi/setup-role-menu/new',
    name: 'New Role Menu',
    component: () => import(/* webpackChunkName: "new-role-menu" */ '../views/setup_aplikasi/role_menu/New.vue'),
    meta: {
      Auth: true,
      id: 4
    }
  },
  {
    path: '/setup-aplikasi/setup-role-menu/edit/:id',
    name: 'Edit Role Menu',
    component: () => import(/* webpackChunkName: "edit-role-menu" */ '../views/setup_aplikasi/role_menu/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 4
    }
  },
  {
    path: '/setup-aplikasi/setup-user-role',
    name: 'Setup User Role',
    component: () => import(/* webpackChunkName: "setup-user-role" */ '../views/setup_aplikasi/user_role/UserRole.vue'),
    meta: {
      Auth: true,
      id: 5
    }
  },
  {
    path: '/setup-aplikasi/setup-user-role/new',
    name: 'New User Role',
    component: () => import(/* webpackChunkName: "new-user-role" */ '../views/setup_aplikasi/user_role/New.vue'),
    meta: {
      Auth: true,
      id: 5
    }
  },
  {
    path: '/setup-aplikasi/setup-user-role/edit/:id',
    name: 'Edit User Role',
    component: () => import(/* webpackChunkName: "edit-user-role" */ '../views/setup_aplikasi/user_role/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 5
    }
  },
  {
    path: '/setup-aplikasi/setup-user',
    name: 'Setup User',
    component: () => import(/* webpackChunkName: "setup-user" */ '../views/setup_aplikasi/user/User.vue'),
    meta: {
      Auth: true,
      id: 6
    }
  },
  {
    path: '/setup-aplikasi/setup-user/new',
    name: 'New User',
    component: () => import(/* webpackChunkName: "new-user" */ '../views/setup_aplikasi/user/New.vue'),
    meta: {
      Auth: true,
      id: 6
    }
  },
  {
    path: '/setup-aplikasi/setup-user/edit/:id',
    name: 'Edit User',
    component: () => import(/* webpackChunkName: "edit-user" */ '../views/setup_aplikasi/user/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 6
    }
  },
  {
    path: '/setup-asset/category',
    name: 'Setup Category',
    component: () => import(/* webpackChunkName: "setup-category" */ '../views/setup_asset/category/Category.vue'),
    meta: {
      Auth: true,
      id: 7
    }
  },
  {
    path: '/setup-asset/category/new',
    name: 'New Category',
    component: () => import(/* webpackChunkName: "new-category" */ '../views/setup_asset/category/New.vue'),
    meta: {
      Auth: true,
      id: 7
    }
  },
  {
    path: '/setup-asset/category/:id/edit',
    name: 'Edit Category',
    component: () => import(/* webpackChunkName: "edit-category" */ '../views/setup_asset/category/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 7
    }
  },
  {
    path: '/setup-asset/unit',
    name: 'Setup Unit',
    component: () => import(/* webpackChunkName: "setup-unit" */ '../views/setup_asset/unit/Unit.vue'),
    meta: {
      Auth: true,
      id: 8
    }
  },
  {
    path: '/setup-asset/unit/new',
    name: 'New Unit',
    component: () => import(/* webpackChunkName: "new-unit" */ '../views/setup_asset/unit/New.vue'),
    meta: {
      Auth: true,
      id: 8
    }
  },
  {
    path: '/setup-asset/unit/:id/edit',
    name: 'Edit Unit',
    component: () => import(/* webpackChunkName: "edit-unit" */ '../views/setup_asset/unit/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 8
    }
  },
  {
    path: '/setup-asset/brand-unit',
    name: 'Setup Brand Unit',
    component: () => import(/* webpackChunkName: "setup-brand-unit" */ '../views/setup_asset/brand_unit/BrandUnit.vue'),
    meta: {
      Auth: true,
      id: 20
    }
  },
  {
    path: '/setup-asset/brand-unit/new',
    name: 'New Brand Unit',
    component: () => import(/* webpackChunkName: "new-brand-unit" */ '../views/setup_asset/brand_unit/New.vue'),
    meta: {
      Auth: true,
      id: 20
    }
  },
  {
    path: '/setup-asset/brand-unit/:id/edit',
    name: 'Edit Brand Unit',
    component: () => import(/* webpackChunkName: "edit-brand-unit" */ '../views/setup_asset/brand_unit/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 20
    }
  },
  {
    path: '/setup-asset/others-info',
    name: 'Setup Info Lain',
    component: () => import(/* webpackChunkName: "setup-komponen" */ '../views/setup_asset/others_info/OthersInfo.vue'),
    meta: {
      Auth: true,
      id: 9
    }
  },
  {
    path: '/setup-asset/others-info/new',
    name: 'New Info Lain',
    component: () => import(/* webpackChunkName: "new-komponen" */ '../views/setup_asset/others_info/New.vue'),
    meta: {
      Auth: true,
      id: 9
    }
  },
  {
    path: '/setup-asset/others-info/:id/edit',
    name: 'Edit Info Lain',
    component: () => import(/* webpackChunkName: "edit-komponen" */ '../views/setup_asset/others_info/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 9
    }
  },
  {
    path: '/setup-asset/setup-condition',
    name: 'Setup Kondisi',
    component: () => import(/* webpackChunkName: "setup-condition" */ '../views/setup_asset/asset_status/AssetStatus.vue'),
    meta: {
      Auth: true,
      id: 13
    }
  },
  {
    path: '/setup-asset/setup-condition/new',
    name: 'New Kondisi',
    component: () => import(/* webpackChunkName: "new-condition" */ '../views/setup_asset/asset_status/New.vue'),
    meta: {
      Auth: true,
      id: 13
    }
  },
  {
    path: '/setup-asset/setup-condition/edit/:id',
    name: 'Edit Kondisi',
    component: () => import(/* webpackChunkName: "edit-condition" */ '../views/setup_asset/asset_status/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 13
    }
  },
  {
    path: '/setup-po/setup-bank',
    name: 'Setup Bank',
    component: () => import(/* webpackChunkName: "setup-bank" */ '../views/setup_po/bank/Bank.vue'),
    meta: {
      Auth: true,
      id: 14
    }
  },
  {
    path: '/setup-po/setup-bank/new',
    name: 'New Bank',
    component: () => import(/* webpackChunkName: "new-bank" */ '../views/setup_po/bank/New.vue'),
    meta: {
      Auth: true,
      id: 14
    }
  },
  {
    path: '/setup-po/setup-bank/edit/:id',
    name: 'Edit Bank',
    component: () => import(/* webpackChunkName: "edit-bank" */ '../views/setup_po/bank/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 14
    }
  },
  {
    path: '/setup-po/setup-supplier',
    name: 'Setup Supplier',
    component: () => import(/* webpackChunkName: "setup-supplier" */ '../views/setup_po/supplier/Supplier.vue'),
    meta: {
      Auth: true,
      id: 10
    }
  },
  {
    path: '/setup-po/setup-supplier/new',
    name: 'New Supplier',
    component: () => import(/* webpackChunkName: "new-supplier" */ '../views/setup_po/supplier/New.vue'),
    meta: {
      Auth: true,
      id: 10,
    }
  },
  {
    path: '/setup-po/setup-supplier/edit/:id',
    name: 'Edit Supplier',
    component: () => import(/* webpackChunkName: "edit-supplier" */ '../views/setup_po/supplier/Edit.vue'),
    meta: {
      Auth: true,
      id: 10,
    }
  },
  {
    path: '/setup-po/setup-courier',
    name: 'Setup Courier',
    component: () => import(/* webpackChunkName: "setup-courier" */ '../views/setup_po/courier/Courier.vue'),
    meta: {
      Auth: true,
      id: 12
    }
  },
  {
    path: '/setup-po/setup-courier/new',
    name: 'New Courier',
    component: () => import(/* webpackChunkName: "new-courier" */ '../views/setup_po/courier/New.vue'),
    meta: {
      Auth: true,
      id: 12
    }
  },
  {
    path: '/setup-po/setup-courier/edit/:id',
    name: 'Edit Courier',
    component: () => import(/* webpackChunkName: "edit-courier" */ '../views/setup_po/courier/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 12
    }
  },
  {
    path: '/setup-po/purchase-order',
    name: 'Purchase Order',
    component: () => import(/* webpackChunkName: "purchase-order" */ '../views/setup_po/purchase_order/PurchaseOrder.vue'),
    meta: {
      Auth: true,
      id: 11
    }
  },
  {
    path: '/setup-po/purchase-order/new',
    name: 'New PO',
    component: () => import(/* webpackChunkName: "new-po" */ '../views/setup_po/purchase_order/New.vue'),
    meta: {
      Auth: true,
      id: 11
    }
  },
  {
    path: '/setup-po/purchase-order/view/:id',
    name: 'View PO',
    component: () => import(/* webpackChunkName: "view-po" */ '../views/setup_po/purchase_order/View.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 11
    }
  },
  {
    path: '/setup-po/receive-item',
    name: 'Receive Asset',
    component: () => import(/* webpackChunkName: "receive-po" */ '../views/setup_po/receive_item/Receive.vue'),
    meta: {
      Auth: true,
      id: 15
    }
  },
  {
    path: '/network/setup-branch',
    name: 'Setup Branch',
    component: () => import(/* webpackChunkName: "setup-branch" */ '../views/network/branch/Branch.vue'),
    meta: {
      Auth: true,
      id: 17
    }
  },
  {
    path: '/network/setup-branch/new',
    name: 'New Branch',
    component: () => import(/* webpackChunkName: "new-branch" */ '../views/network/branch/New.vue'),
    meta: {
      Auth: true,
      id: 17
    }
  },
  {
    path: '/network/setup-branch/:id/edit',
    name: 'Edit Branch',
    component: () => import(/* webpackChunkName: "edit-branch" */ '../views/network/branch/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 17
    }
  },
  {
    path: '/network/setup-outlet',
    name: 'Setup Outlet',
    component: () => import(/* webpackChunkName: "setup-outlet" */ '../views/network/outlet/Outlet.vue'),
    meta: {
      Auth: true,
      id: 18
    }
  },
  {
    path: '/network/setup-outlet/new',
    name: 'New Outlet',
    component: () => import(/* webpackChunkName: "new-outlet" */ '../views/network/outlet/New.vue'),
    meta: {
      Auth: true,
      id: 18
    }
  },
  {
    path: '/network/setup-outlet/:id/edit',
    name: 'Edit Outlet',
    component: () => import(/* webpackChunkName: "edit-outlet" */ '../views/network/outlet/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 18
    }
  },
  {
    path: '/network/setup-room',
    name: 'Setup Room',
    component: () => import(/* webpackChunkName: "setup-room" */ '../views/network/room/Room.vue'),
    meta: {
      Auth: true,
      id: 19
    }
  },
  {
    path: '/network/setup-room/new',
    name: 'New Room',
    component: () => import(/* webpackChunkName: "new-room" */ '../views/network/room/New.vue'),
    meta: {
      Auth: true,
      id: 19
    }
  },
  {
    path: '/network/setup-room/:id/edit',
    name: 'Edit Room',
    component: () => import(/* webpackChunkName: "edit-room" */ '../views/network/room/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 19
    }
  },
  {
    path: '/data-asset/list-unit',
    name: 'List Unit',
    component: () => import(/* webpackChunkName: "list-unit" */ '../views/data_asset/list_unit/ListUnit.vue'),
    meta: {
      Auth: true,
      id: 21
    }
  },
  {
    path: '/data-asset/list-unit/:id/detail',
    name: 'Detail Unit',
    component: () => import(/* webpackChunkName: "list-unit" */ '../views/data_asset/list_unit/Detail.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 21
    }
  },
  {
    path: '/setup-asset/component',
    name: 'Setup Component',
    component: () => import(/* webpackChunkName: "setup-component" */ '../views/setup_asset/component/Component.vue'),
    meta: {
      Auth: true,
      id: 22
    }
  },
  {
    path: '/setup-asset/component/new',
    name: 'New Component',
    component: () => import(/* webpackChunkName: "new-component" */ '../views/setup_asset/component/New.vue'),
    meta: {
      Auth: true,
      id: 22
    }
  },
  {
    path: '/setup-asset/component/:id/edit',
    name: 'Edit Component',
    component: () => import(/* webpackChunkName: "edit-component" */ '../views/setup_asset/component/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 22
    }
  },
  {
    path: '/setup-asset/brand-component',
    name: 'Setup Brand Component',
    component: () => import(/* webpackChunkName: "setup-brand-component" */ '../views/setup_asset/brand_component/BrandComponent.vue'),
    meta: {
      Auth: true,
      id: 23
    }
  },
  {
    path: '/setup-asset/brand-component/new',
    name: 'New Brand Component',
    component: () => import(/* webpackChunkName: "new-brand-component" */ '../views/setup_asset/brand_component/New.vue'),
    meta: {
      Auth: true,
      id: 23
    }
  },
  {
    path: '/setup-asset/brand-component/:id/edit',
    name: 'Edit Brand Component',
    component: () => import(/* webpackChunkName: "edit-brand-component" */ '../views/setup_asset/brand_component/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 23
    }
  },
  {
    path: '/data-asset/list-component',
    name: 'List Component',
    component: () => import(/* webpackChunkName: "list-unit" */ '../views/data_asset/list_component/ListComponent.vue'),
    meta: {
      Auth: true,
      id: 24
    }
  },
  {
    path: '/setup-asset/setup-photo',
    name: 'Setup Photo',
    component: () => import(/* webpackChunkName: "setup-photo" */ '../views/setup_asset/photo/Photo.vue'),
    meta: {
      Auth: true,
      id: 25
    }
  },
  {
    path: '/setup-asset/setup-photo/new',
    name: 'New Photo',
    component: () => import(/* webpackChunkName: "new-photo" */ '../views/setup_asset/photo/New.vue'),
    meta: {
      Auth: true,
      id: 25
    }
  },
  {
    path: '/setup-asset/setup-photo/:id/edit',
    name: 'Edit Photo',
    component: () => import(/* webpackChunkName: "edit-photo" */ '../views/setup_asset/photo/Edit.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 25
    }
  },
  {
    path: '/data-asset/list-component/buy',
    name: 'Buy Component',
    component: () => import(/* webpackChunkName: "buy-component" */ '../views/data_asset/list_component/Buy.vue'),
    meta: {
      Auth: true,
      id: 24
    }
  },
  {
    path: '/data-asset/po-request',
    name: 'PO Request',
    component: () => import(/* webpackChunkName: "po-request" */ '../views/data_asset/po_request/PoRequest.vue'),
    meta: {
      Auth: true,
      id: 26
    }
  },
  {
    path: '/data-asset/po-request/view/:id',
    name: 'View Request',
    component: () => import(/* webpackChunkName: "view-request" */ '../views/data_asset/po_request/View.vue'),
    props: true,
    meta: {
      Auth: true,
      id: 26
    }
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "NotFound" */ '../components/NotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.Auth)) {
    if (index.getters['auth/guest']) {
      index.dispatch('setPrevUrl', to.path)

      index.dispatch('alert/set', {
        status: true,
        text: 'Silahkan login terlebih dahulu',
        color: 'error',
      })

      router.push("/login")
    } else {
      let access = index.getters['nav/nav'].filter((item) => item == to.meta.id)
      if (access.length > 0 || to.meta.id == 0) {
        next()
      } else {
        index.dispatch('alert/set', {
          status: true,
          text: 'Anda tidak bisa mengakses halaman berikut',
          color: 'error',
        })

        next(false)
      }
    }
  } else {
    next()
  }
})

export default router
