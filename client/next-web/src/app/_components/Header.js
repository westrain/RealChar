'use client';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/svgs/logo.svg';

import { ConnectButton } from 'thirdweb/react';
import client from '@/lib/thirdweb-client';
import { generatePayload, isLoggedIn, login, logout } from '../actions/auth';
import UserDropdown from './UserDropdown';
import { useAppStore } from '@/zustand/store';

export default function Header() {
  const { setUser, setToken, clearUser } = useAppStore();


  return (
    <Navbar className='h-20 bg-header'>
      <div className='flex items-end'>
        {' '}
        {/* Align items to the bottom */}
        <NavbarBrand>
          <Link href='/'>
            <Image priority src={logo} alt='RealChar.ai' className='block' />
          </Link>
        </NavbarBrand>
        <span className='ml-2 flex items-end text-sm'>
          {' '}
          {/* Space after the image */}
          powered by&nbsp;
          <a href='https://rebyte.ai/' className='text-base'>
            {' '}
            ReByte.ai
          </a>
        </span>
      </div>
      <NavbarContent justify='end' className='h-full flex items-center'>
        <NavbarItem>
          <ConnectButton
            client={client}
            auth={{
              isLoggedIn: async () => {
                const isLogged = await isLoggedIn();

                if (isLogged?.status === 'success') {
                  setUser(isLogged.user);
                } else {
                  clearUser();
                }

                return await isLoggedIn();
              },
              doLogin: async (params) => {
                const logged = await login(params);

                console.log('logged-----', logged);


                if (logged?.status === 'success') {
                  setToken(logged.token);
                }
              },
              getLoginPayload: async ({ address }) => generatePayload({ address }),
              doLogout: async () => {
                await logout();
                clearUser();
              },
            }}
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
