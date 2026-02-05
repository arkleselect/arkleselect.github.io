'use client';

import { useRouter } from 'next/navigation';
import Dock from './dock/Dock';
import { VscHome, VscArchive, VscTag, VscNote, VscAccount } from 'react-icons/vsc';

export function DockNav() {
  const router = useRouter();

  const items = [
    { icon: <VscHome size={18} />, label: '首页', onClick: () => router.push('/') },
    { icon: <VscArchive size={18} />, label: '合集', onClick: () => router.push('/posts') },
    { icon: <VscTag size={18} />, label: '分类', onClick: () => router.push('/categories') },
    { icon: <VscNote size={18} />, label: '日常', onClick: () => router.push('/daily') },
    { icon: <VscAccount size={18} />, label: '关于', onClick: () => router.push('/about') },
  ];

  return (
    <Dock
      items={items}
      panelHeight={70}
      baseItemSize={50}
      magnification={70}
    />
  );
}
