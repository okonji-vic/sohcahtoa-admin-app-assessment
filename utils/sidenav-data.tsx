import { CalculatorIcon, CardsIcon, DashboardIcon,  TransactionsIcon } from "@/assets/icons";
import { TSideNavProps } from "@/interfaces/general";
import { ROUTE_PATH } from "@/utils/constants";
import { ROLES } from "@/utils/roles-enum";



const ALL_ROLES = [
  ROLES.ADMIN,
  ROLES.ANALYST,
];

export const SideNavData: TSideNavProps[] = [
  {
    title: "Home",
    icon: <DashboardIcon />,
    link: ROUTE_PATH.DASHBOARD.DASHBOARD_PATH,
    roles: ALL_ROLES,
    type: "link",
  },
  {
    title: "Calculator",
    icon: <CalculatorIcon />,
    link: ROUTE_PATH.DASHBOARD.CALCULATOR_PATH,
    roles: ALL_ROLES,
    type: "link",
  },
  {
    title: "Transactions",
    icon: <TransactionsIcon />,
    link: ROUTE_PATH.DASHBOARD.TRANSACTIONS_PATH,
    roles: [ROLES.ADMIN, ROLES.ANALYST],
    type: "link",
  },
  {
    title: "Cards",
    icon: <CardsIcon />,
    link: ROUTE_PATH.DASHBOARD.CARDS_PATH,
    roles: [ROLES.ADMIN],
    type: "link",
  },
];
