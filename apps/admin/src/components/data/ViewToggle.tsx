import galleryBlue from '@/public/data/galleryBlue.svg';
import galleryBlack from '@/public/data/galleryIcon.svg';
import gridBlack from '@/public/data/gridBlack.svg';
import gridBlue from '@/public/data/gridIcon.svg';
import clsx from 'clsx';
import Image from 'next/image';

interface ViewToggle {
  activeTab: string;
  setActiveTab: (tab: 'grid' | 'gallery') => void;
}

const ViewToggle = ({ activeTab, setActiveTab }: ViewToggle) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setActiveTab('grid')}
        className={clsx(
          'flex h-[32px] w-[88px] items-center justify-center gap-1 rounded border border-[#E9E9E7] text-sm font-bold',
          activeTab === 'grid'
            ? 'bg-white text-[#4676FB]'
            : 'bg-[#F6F7F8] text-black hover:opacity-60'
        )}
      >
        <Image
          src={activeTab === 'grid' ? gridBlue : gridBlack}
          alt="grid"
          width={16}
          height={16}
        />
        Grid
      </button>

      <button
        onClick={() => setActiveTab('gallery')}
        className={clsx(
          'flex h-[32px] w-[96px] items-center justify-center gap-1 rounded border border-[#E9E9E7] text-sm font-bold',
          activeTab === 'gallery'
            ? 'bg-white text-[#4676FB]'
            : 'bg-[#F6F7F8] text-black hover:opacity-60'
        )}
      >
        <Image
          src={activeTab === 'gallery' ? galleryBlue : galleryBlack}
          alt="gallery"
          width={16}
          height={16}
        />
        Gallery
      </button>
    </div>
  );
};

export default ViewToggle;
