'use client';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/navbar';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/svgs/logo.svg';
import AuthButton from './AuthButton';
import UserDropdown from './UserDropdown';

import { useAuthContext } from '@/context/AuthContext';

export default function Header() {
  const { user } = useAuthContext();

  return (
    <Navbar className='h-20 bg-header'>
      <div className="flex items-end"> {/* Align items to the bottom */}
        <NavbarBrand>
          <Link href='/'>
            <Image priority src={logo} alt='RealChar.ai' className="block" />
          </Link>
        </NavbarBrand>
        <span className="ml-2 flex items-end text-sm"> {/* Space after the image */}
          powered by&nbsp;<a href="https://rebyte.ai/" className="text-base"> ReByte.ai</a>
        </span>
      </div>
      <NavbarContent justify='end' className="h-full flex items-center">
        <NavbarItem>
          <AuthButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
