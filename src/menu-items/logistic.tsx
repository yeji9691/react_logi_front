// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconUserCheck, IconBasket, IconMessages, IconLayoutKanban, IconMail, IconCalendar, IconNfc } from '@tabler/icons';
import { NavItemType } from 'types';

// constant
const icons = {
  IconApps,
  IconUserCheck,
  IconBasket,
  IconMessages,
  IconLayoutKanban,
  IconMail,
  IconCalendar,
  IconNfc
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const logistic: NavItemType = {
  id: 'logi',
  title: <FormattedMessage id="logi" />,
  icon: icons.IconApps,
  type: 'group',
  children: [
    {
      id: 'logibase',
      title: <FormattedMessage id="logibase" />,
      type: 'collapse',
      icon: icons.IconUserCheck,
      children: [
        {
          id: 'companyonfo',
          title: <FormattedMessage id="companyonfo" />,
          type: 'item',
          url: '/logi/basicinfo/companyInfo/CompanyInfo'
        },
        {
          id: 'workplaceinfo',
          title: <FormattedMessage id="workplaceinfo" />,
          type: 'item',
          url: '/logi/basicinfo/workplaceInfo/WorkplaceInfo'
        },
        {
          id: 'deptinfo',
          title: <FormattedMessage id="deptinfo" />,
          type: 'item',
          url: '/logi/basicinfo/deptInfo/DeptInfo'
        },
        {
          id: 'clientinfo',
          title: <FormattedMessage id="clientinfo" />,
          type: 'item',
          url: '/logi/basicinfo/clientInfo/ClientInfo'
        }
      ]
    },
    {
      id: 'iteminfo',
      title: <FormattedMessage id="iteminfo" />,
      type: 'collapse',
      icon: icons.IconBasket,
      children: [
        {
          id: 'warehouseinfo',
          title: <FormattedMessage id="warehouseinfo" />,
          type: 'item',
          url: '/logi/basicinfo/wareHouseInfo/WareHouseInfo'
        },
        {
          id: 'codeinfo',
          title: <FormattedMessage id="codeinfo" />,
          type: 'item',
          url: '/app/user/social-profile/posts'
        }
      ]
    },
    {
      id: 'estimate',
      title: <FormattedMessage id="estimate" />,
      type: 'collapse',
      icon: icons.IconNfc,
      children: [
        {
          id: 'estimateregiste',
          title: <FormattedMessage id="estimateregiste" />,
          type: 'item',
          url: '/logi/estimate/estimateRegister/containers/estimateRegister'
        },
        {
          id: 'estimateinfo',
          title: <FormattedMessage id="estimateinfo" />,
          type: 'item',
          url: '/logi/estimate/estimateInfo/containers/estimateInfo'
        }
      ]
    },
    {
      id: 'contract',
      title: <FormattedMessage id="contract" />,
      type: 'collapse',
      icon: icons.IconNfc,
      children: [
        {
          id: 'registcontract',
          title: <FormattedMessage id="registcontract" />,
          type: 'item',
          url: '/logi/contract/ContractRegist'
        },
        {
          id: 'contractinfo',
          title: <FormattedMessage id="contractinfo" />,
          type: 'item',
          url: '/logi/contract/ContractSearch'
        }
      ]
    },
    {
      id: 'salesprocessplan',
      title: <FormattedMessage id="salesprocessplan" />,
      type: 'collapse',
      icon: icons.IconNfc,
      children: [
        {
          id: 'processplan',
          title: <FormattedMessage id="processplan" />,
          type: 'item',
          url: '/app/contact/c-card',
          breadcrumbs: false
        },
        {
          id: 'salesplan',
          title: <FormattedMessage id="salesplan" />,
          type: 'item',
          url: '/app/contact/c-list',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'production',
      title: <FormattedMessage id="production" />,
      type: 'collapse',
      icon: icons.IconBasket,
      children: [
        {
          id: 'contractregismps',
          title: <FormattedMessage id="contractregismps" />,
          type: 'item',
          url: '/logi/mps/mpspage'
        }
      ]
    },
    {
      id: 'purchase',
      title: <FormattedMessage id="purchase" />,
      type: 'collapse',
      icon: icons.IconBasket,
      children: [
        {
          id: 'mrpRegister',
          title: <FormattedMessage id="mrpRegister" />,
          type: 'item',
          url: '/logi/mrp/mrppage'
        },
        {
          id: 'mrpinfo',
          title: <FormattedMessage id="mrpinfo" />,
          type: 'item',
          url: '/logi/mrp/MrpInfo'
        },
        {
          id: 'logisticsbom',
          title: <FormattedMessage id="logisticsbom" />,
          type: 'item',
          url: '/logi/logisticsBOM/LogisticsBOM'
        },
        {
          id: 'stockinfo',
          title: <FormattedMessage id="stockinfo" />,
          type: 'item',
          url: '/hr/salary/SalaryAwardManage/SalaryAwardManagePage'
        },
        {
          id: 'orderregister',
          title: <FormattedMessage id="orderregister" />,
          type: 'item',
          url: '/hr/salary/SeverancePay/SeverancePayPage'
        },
        {
          id: 'stockloginfo',
          title: <FormattedMessage id="stockloginfo" />,
          type: 'item',
          url: '/hr/salary/SeverancePay/SeverancePayPage'
        }
      ]
    },
    {
      id: 'orderinfo',
      title: <FormattedMessage id="orderinfo" />,
      type: 'collapse',
      icon: icons.IconBasket,
      children: [
        {
          id: 'outsourceinfo',
          title: <FormattedMessage id="outsourceinfo" />,
          type: 'item',
          url: '/hr/salary/BaseSalaryManage/BaseSalaryManagePage'
        },
        {
          id: 'outsourceforward',
          title: <FormattedMessage id="outsourceforward" />,
          type: 'item',
          url: '/hr/salary/BaseExtSalManage/BaseExtSalManagePage'
        },
        {
          id: 'outsourceinspection',
          title: <FormattedMessage id="outsourceinspection" />,
          type: 'item',
          url: '/hr/salary/SocialInsure/SocialInsurePage'
        }
      ]
    },
    {
      id: 'workinfo',
      title: <FormattedMessage id="workinfo" />,
      type: 'collapse',
      icon: icons.IconBasket,
      children: [
        {
          id: 'workinstrcution',
          title: <FormattedMessage id="workinstrcution" />,
          type: 'item',
          url: '/logi/production/workinstruction/WorkInstructionPage'
        },
        {
          id: 'productionworkplace',
          title: <FormattedMessage id="productionworkplace" />,
          type: 'item',
          url: '/logi/production/worksite/WorkSitePage',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'delivery',
      title: <FormattedMessage id="delivery" />,
      type: 'collapse',
      icon: icons.IconBasket,
      children: [
        {
          id: 'deliveryInfoPage',
          title: <FormattedMessage id="deliveryInfoPage" />,
          type: 'item',
          url: '/logi/delivery/Delivery',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default logistic;
