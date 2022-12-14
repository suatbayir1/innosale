// Libraries
import { AiOutlineCalendar, AiOutlineShoppingCart, AiOutlineAreaChart, AiOutlineBarChart, AiOutlineStock, AiFillAudio, AiFillFileText } from 'react-icons/ai';
import { FiShoppingBag, FiEdit, FiPieChart, } from 'react-icons/fi';
import { BsKanban, BsBarChart, } from 'react-icons/bs';
import { BiColorFill } from 'react-icons/bi';
import { IoMdContacts } from 'react-icons/io';
import { RiContactsLine, RiStockLine } from 'react-icons/ri';
import { GiLouvrePyramid } from 'react-icons/gi';
import { GrProductHunt } from 'react-icons/gr';
import { MdLocalOffer } from 'react-icons/md';

export const links = [
    {
        title: 'Dashboard',
        links: [
            {
                name: 'Ecommerce',
                icon: <FiShoppingBag />,
                path: 'ecommerce',
                routes: ["ecommerce"]
            },
        ],
    },

    {
        title: 'Pages',
        links: [
            {
                name: 'Orders',
                icon: <AiOutlineShoppingCart />,
                path: 'orders',
                routes: ["orders"]
            },
            {
                name: 'Employees',
                icon: <IoMdContacts />,
                path: 'employees',
                routes: ["employees"]
            },
            {
                name: 'Customers',
                path: 'customers',
                routes: ["customers"],
                icon: <RiContactsLine />,
            },
            {
                name: 'Offers',
                path: 'offers',
                icon: <MdLocalOffer />,
                routes: ["offers", "offer-detail"]
            },
            {
                name: 'All Parts',
                path: 'parts',
                icon: <GrProductHunt />,
                routes: ["parts"]
            },
            {
                name: 'All Operations',
                path: 'operations',
                icon: <GrProductHunt />,
                routes: ["operations"]
            },
        ],
    },
    {
        title: 'NLP',
        links: [
            {
                name: 'Audio Files',
                path: 'audio-files',
                icon: <AiFillAudio />,
                routes: ["audio-files", "audio-player"]
            },
            {
                name: 'Summarization',
                path: 'summ',
                icon: <AiFillFileText />,
                routes: ["summ", "summ-make"]
            },
            {
                name: 'Calendar',
                path: 'calendar',
                icon: <AiOutlineCalendar />,
                routes: ["calendar"]
            },
            {
                name: 'Kanban',
                path: 'kanban',
                icon: <BsKanban />,
                routes: ["kanban"]
            },
            {
                name: 'Editor',
                path: 'editor',
                icon: <FiEdit />,
                routes: ["editor"]
            },
            {
                name: 'Color Picker',
                path: 'color-picker',
                icon: <BiColorFill />,
                routes: ["color-picker"]
            },
            {
                name: '3D Parts',
                path: '3D-parts',
                icon: <BiColorFill />,
                routes: ["3D-parts"]
            },
        ],
    },
    {
        title: 'Charts',
        links: [
            {
                name: 'Line',
                path: 'line',
                icon: <AiOutlineStock />,
                routes: ["line"]
            },
            {
                name: 'Area',
                path: 'area',
                icon: <AiOutlineAreaChart />,
                routes: ["area"]
            },

            {
                name: 'Bar',
                path: 'bar',
                icon: <AiOutlineBarChart />,
                routes: ["bar"]
            },
            {
                name: 'Pie',
                path: 'pie',
                icon: <FiPieChart />,
                routes: ["pie"]
            },
            {
                name: 'Financial',
                path: 'financial',
                icon: <RiStockLine />,
                routes: ["financial"]
            },
            {
                name: 'Color Mapping',
                path: 'color-mapping',
                icon: <BsBarChart />,
                routes: ["color-mapping"]
            },
            {
                name: 'Pyramid',
                path: 'pyramid',
                icon: <GiLouvrePyramid />,
                routes: ["pyramid"]
            },
            {
                name: 'Stacked',
                path: 'stacked',
                routes: ["stacked"],
                icon: <AiOutlineBarChart />,
            },
        ],
    },
];
