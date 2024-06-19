import { cn } from '@/lib/utils'
import ConnectButton from './ConnectButton'



const Header = () => {
  return (
    <>
      <div
        className={cn(
          'flex flex-row justify-between items-center gap-2 px-16 h-[86px]',
          'navbar'
          // ' backdrop-blur-sm bg-white/30',
          // 'bg-fill-bonuz-theme-300 bg-blend-overlay rounded-custom backdrop-blur-lg'
        )}>
        <div className='flex gap-0.5 justify-between items-start self-stretch my-auto'>
          <img src='/svg/Logo.svg' alt='logo' />
        </div>
        <div className='flex justify-center items-center backdrop-blur-sm bg-white/30 rounded-full p-1'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/61405f0e1398ee7af0f800513fcbc9347b933dbf6cb2f9a4c17bb428dd04468d?'
            className='aspect-[0.87] w-[26px]'
          />
        </div>

        <ConnectButton />

      </div>
    </>
  )
}

export default Header