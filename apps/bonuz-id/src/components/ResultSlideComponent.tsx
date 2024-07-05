import ResultCarousel from "./ResultCarousel";

interface ResultSlideData {
  slidedata: any[];
}
export const ResultSlideComponent = ({ slidedata }: ResultSlideData) => {
  return (
    <div className="grid flex-row gap-4 grid-cols-1 md:grid-cols-2">
      {slidedata.map((data, index) => (
        <div
          key={index}
          className="rounded-[30px] bg-[#a2a2a20a] p-3 h-[250px] w-[300px] md:w-[450px] flex flex-col justify-center items-center"
        >
          <div className="flex flex-row gap-2 justify-between w-full">
            <div className="flex flex-row justify-center items-center gap-2">
              <p>{data.topic}</p>
              {data.count !== "" && (
                <div className="flex w-[32px] h-[20px] rounded-[50px] bg-[#a2a2a20a] text-center justify-center items-center text-[13px]">
                  {data.count}
                </div>
              )}
            </div>
            {data.status === "true" && (
              <div className="flex w-[75px] h-[25px] rounded-[50px] bg-[url('/images/third-baackground.svg')] text-center justify-center items-center text-[13px] cursor-pointer">
                View All
              </div>
            )}
          </div>
          <ResultCarousel slides={data.images} />
        </div>
      ))}
    </div>
  );
};
