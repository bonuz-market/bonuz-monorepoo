interface TextViewInterface {
  currentIndex: number;
}
const TextView = ({ currentIndex }: TextViewInterface) => {
  return (
    <div>
      {currentIndex === 0 && (
        <>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Welcome to your <br />
            Onchain Social Wallet
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Add links to your profile so new friends can easily find you
          </p>
        </>
      )}
      {currentIndex === 1 && (
        <>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Make new friends <br />
            while exploring new events
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Use QR-code to add a new connections
          </p>
        </>
      )}
      {currentIndex === 2 && (
        <>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Earn exclusive rewards <br />
            by participating in <br />
            challenges
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Secure vouchers, discounts, certificates and more from Bonuz
            partners
          </p>
        </>
      )}
      {currentIndex === 3 && (
        <>
          <h2 className="mt-[62px] font-inter font-bold text-[20px] text-center text-white w-[300px] md:w-[360px]">
            Connect to Apps & DApps <br />
            using your wallet
          </h2>
          <p className="font-inter font-normal text-[16px] text-center text-white opacity-60 w-[300px] md:w-[360px]">
            Seamlessly access and use your favorite Web3 applications directly
            from the integrated wallet interface
          </p>
        </>
      )}
    </div>
  );
};

export default TextView;
