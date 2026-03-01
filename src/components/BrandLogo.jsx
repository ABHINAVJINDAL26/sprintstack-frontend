import { Link } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const BrandLogo = ({
  to,
  className = '',
  textClassName = 'text-4xl',
  iconWrapperClassName = 'w-16 h-16',
  animated = true,
}) => {
  const content = (
    <div className={`${animated ? 'brand-float' : ''} inline-flex items-center gap-3 ${className}`.trim()}>
      <div className={`${iconWrapperClassName} flex items-center justify-center overflow-hidden`}>
        <DotLottieReact
          src="https://lottie.host/5cb9be2a-7416-41cc-93cd-fcba6ae30baf/HY2L4sOilw.lottie"
          loop
          autoplay
        />
      </div>
      <span className={`${textClassName} font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent leading-none`}>
        SprintStack
      </span>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
};

export default BrandLogo;
