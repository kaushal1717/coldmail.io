import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array(8)
        .fill(0)
        .map((_, index) => {
          return (
            <div>
              <Skeleton key={index} height={180} />
              <Skeleton key={index} height={25} className="mt-2" />
            </div>
          );
        })}
    </div>
  );
};
export default LoadingSkeleton;
