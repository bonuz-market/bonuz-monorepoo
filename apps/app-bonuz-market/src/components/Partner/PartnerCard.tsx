import clsxm from "@/lib/frontend/clsxm";
import { backendBaseUrl } from "../../../config";

const PartnerCard = ({ partner }: { partner: any }) => {
  const bg = partner.image?.url
    ? `${backendBaseUrl}${partner.image.url}`
    : '/svg/bonuz-logo.svg';
  return (
    <div
      className={clsxm(
        'relative flex self-start rounded-2xl bg-cover bg-center bg-no-repeat',
      )}
      style={{
        height: '250px',
        backgroundImage: `url('${bg}')`,
        backgroundSize: 'contain',
        backgroundColor: '#00000040',
      }}
      key={partner.id}
    >
      <div className="absolute end-5 top-5">
        <span className="inline-flex items-center rounded-md bg-[#ce09ff] px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-red-600/10">
          {partner.partnerStatus?.replace('_', ' ')}
        </span>
      </div>

      <div className="flex h-fit w-full items-end justify-center self-end rounded-b-2xl bg-[#00000080] p-2 text-center ">
        {partner.title}
      </div>
    </div>
  );
};

export default PartnerCard;