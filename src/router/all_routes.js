/*
 * @Descripttion: 动态添加的路由，后端数据返回
 * @Date: 2020-08-28 10:55:36
 * @LastEditors: thh
 * @LastEditTime: 2020-09-16 17:42:08
 * @FilePath: \crm-mobile\src\router\all_routes.js
 */


export const allRoutes = [
    {
        path: '/workorder',
        redirect: '/workorder/order',
        component: 'LayoutFull',
        alwaysShow: true,
        name: 'Workorder',
        id: '1',
        label: '工单管理',
        meta: {
            title: '工单管理',
            icon: 'workorder',
            haveCache: true,
            bgColor: '#7a93ac'
        },
        children: [
            {
                path: 'order',
                component: 'workorder/allOrder/index',
                name: 'AllOrder',
                id: '1-1',
                label: '订单列表',
                meta: {
                    title: '订单列表',
                    haveCache: true
                }
            },
            {
                path: 'self',
                component: 'workorder/myOrder/order/list/index',
                name: 'MyWorkorder',
                id: '1-2',
                label: '我的工单',
                meta: {
                    title: '我的工单',
                    haveCache: true
                }
            },
            {
                path: 'audit',
                component: 'workorder/myAudit/order/list/index',
                name: 'AuditOrder',
                id: '1-3',
                label: '我审批的',
                meta: {
                    title: '我审批的',
                    haveCache: true
                }
            },
            {
                path: 'task',
                component: 'workorder/task/list/index',
                name: 'TaskOrder',
                id: '1-4',
                label: '任务系统',
                meta: {
                    title: '任务系统',
                    haveCache: true
                }
            },
        ]
    },
    {
        path: '/org',
        component: 'LayoutFull',
        redirect: '/org/plan',
        alwaysShow: true,
        name: 'Org',
        id: '6',
        label: '机构管理',
        meta: {
            title: '机构管理',
            icon: 'org',
            haveCache: true,
            bgColor: '#de9845'
        },
        children: [
            {
                path: 'index',
                component: 'organization/myOrg/list/index',
                name: 'MyOrg',
                id: '6-1',
                label: '机构列表',
                meta: {
                    title: '机构列表',
                    haveCache: true
                }
            },
            {
                path: 'plan',
                component: 'organization/plan/list/index',
                name: 'OrgPlan',
                id: '6-2',
                label: '工作计划',
                meta: {
                    title: '工作计划',
                    haveCache: true
                }
            },
            {
                path: 'task',
                component: 'organization/task/list/index',
                name: 'OrgTask',
                id: '6-3',
                label: '任务管理',
                meta: {
                    title: '任务管理',
                    haveCache: true
                }
            },
            {
                path: 'partyActiveSignUp',
                component: 'organization/partyActiveSignUp/list/index',
                name: 'PartyActiveSignUp',
                id: '6-9',
                label: '党建活动',
                meta: {
                    title: '党建活动',
                    haveCache: true
                }
            },
            {
                path: 'embassy',
                component: 'organization/embassy/list/index',
                name: 'Embassy',
                id: '6-11',
                label: '馆建信息',
                meta: {
                    title: '馆建信息',
                    haveCache: true
                }
            }
        ]
    },
    {
        path: '/housekeeper',
        component: 'LayoutFull',
        redirect: '/housekeeper/index',
        alwaysShow: true,
        name: 'Housekeeper',
        id: '13',
        label: 'CRM馆家',
        meta: {
          title: 'CRM馆家',
          icon: 'housekeeper',
          haveCache: true,
          bgColor: '#de9845'
        },
        children: [
            {
                path: 'index',
                component: 'housekeeper/orgData/index',
                name: 'OrgData',
                id: '13-1',
                label: '试用申请数据',
                meta: {
                    title: '试用申请数据',
                    haveCache: true
                }
            },
        ]
    },
    {
        path: '/statistics',
        component: 'LayoutFull',
        redirect: '/statistics/task',
        alwaysShow: true,
        name: 'Statistics',
        id: '4',
        label: '统计',
        meta: {
            title: '统计',
            icon: 'org',
            haveCache: true,
            bgColor: '#de9845'
        },
        children: [
            {
                path: 'task',
                component: 'statistics/task/index',
                name: 'StatisticsTask',
                id: '4-7',
                label: '任务统计',
                meta: {
                    title: '任务统计',
                    haveCache: true
                }
            },
            {
                path: 'org',
                component: 'statistics/org/index',
                name: 'StatisticsOrg',
                id: '4-8',
                label: '日志统计',
                meta: {
                    title: '日志统计',
                    haveCache: true
                }
            },
            {
                path: 'billingReport',
                component: 'report/billingReport/index',
                name: 'BillingReport',
                id: '4-14',
                label: '开票报表',
                meta: {
                    title: '开票报表',
                    haveCache: true
                }
            }
        ]
    },
    {
        path: '/bidding',
        component: 'LayoutFull',
        redirect: '/bidding/index',
        alwaysShow: true,
        name: 'Bidding',
        id: '9',
        label: '招标信息',
        meta: {
          title: '招标信息',
          icon: 'bidding'
        },
        children:[
            {
                path: 'index',
                component: 'bidding/index',
                name: 'BiddingIndex',
                id: '9-7',
                label: '招标信息',
                meta: {
                  title: '招标信息',
                  haveCache: true
                }
            },
        ]
    },
    {
        path: '/contractMange',
        component: 'LayoutFull',
        redirect: '/contractMange/invoiceAccept',
        alwaysShow: true,
        name: 'ContractMange',
        id: '15',
        label: '合同管理',
        meta: {
          title: '合同管理',
        },
        children:[
            {
                path: 'invoiceAccept',
                component: 'contractMange/invoiceAccept/index',
                name: 'InvoiceAccept',
                id: '15-3',
                label: '合同发票办理',
                meta: {
                  title: '合同发票办理',
                  haveCache: true
                }
            },
        ]
    },
]
