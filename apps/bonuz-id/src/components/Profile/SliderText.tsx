interface SliderTextProps {
  currentIndex: number;
}
export const SliderText = ({ currentIndex }: SliderTextProps) => {
  return (
    <div>
      {currentIndex === 0 && (
        <div>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Welcome to your Onchain Social Wallet
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Add your social media links to your profile so new friends can
            easily connect to you everywhere
          </p>
        </div>
      )}
      {currentIndex === 1 && (
        <div>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Make new Friends while exploring Events
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Use QR-code to check-in or to add a new connection
          </p>
        </div>
      )}
      {currentIndex === 2 && (
        <div>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Earn exclusive Rewards by participating in Challenges
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Secure airdrops, vouchers, discounts, certificates, and more from
            Bonuz partners
          </p>
        </div>
      )}
      {currentIndex === 3 && (
        <div>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Connect to Apps & Dapps using your Wallet
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Seamlessly access and use your favorite Web3 applications directly
            from your wallet interface
          </p>
        </div>
      )}
    </div>
  );
};
