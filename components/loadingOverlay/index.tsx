import Image from 'next/image';
import logoTextDark from '@/assets/images/logo_text_dark.svg';

interface Props {
  title?: string
  subtitle?: string
}

function LoadingOverlay({ title, subtitle }: Props) {
  return (
    <div className="loading">
      <div className="loading__wrapper">
        <Image className='loading__wrapper-logo' src={logoTextDark} alt="GoForUmrah" height={36} />
        <h6 className='loading__wrapper-title'>{title || 'Please Wait'}</h6>
        <p className='loading__wrapper-text'>{subtitle || 'It might take a while'}</p>
      </div>
    </div>
  );
}

export default LoadingOverlay;