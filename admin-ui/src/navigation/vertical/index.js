import { Mail, Home,Circle ,FileText} from "react-feather";


export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/home",
    subject:'home',
    action:'read',
  },
  {
    id: 'Blog',
    title: 'Blog',
    icon: <FileText size={20} />,
    children: [
      {
        id: 'blogList',
        title: 'List',
        icon: <FileText size={20} />,
        navLink: '/pages/blog/list'
      },
      {
        id: 'blogEdit',
        title: 'Edit',
        icon: <FileText size={20} />,
        navLink: '/pages/blog/edit'
      },
      {
        id: 'blogAdd',
        title: 'Add Post',
        icon: <FileText size={20} />,
        navLink: '/pages/blog/add-a-post'
      },
    ]
  },
  {
    id: "ExportData",
    title: "Export Data",
    icon: <FileText size={20} />,
    navLink: "/export",
    subject:'export',
    action:'read',
  },
  {
    id: 'BlogImport',
    title: 'Import Posts',
    icon: <FileText size={20} />,
    navLink: '/import'
  },
];
