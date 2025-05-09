import { Calendar } from "lucide-react";
import Button from "../ui/button/Button";

interface UserCardProps {
  title: any;
  date: any;
  plan: any;
  buttonText: any;
  placeButton: boolean;
  clickFunction: any;
}

const UserCard: React.FC<UserCardProps> = ({
  title,
  date,
  plan,
  buttonText,
  placeButton,
  clickFunction,
}) => {
  return (
    <div className="relative p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
      <div className="flex justify-between">
        <div className="w-1/2">
          <h4 className="mb-5 mr-10 text-base text-gray-800 dark:text-white/90">
            {title}
          </h4>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer dark:text-gray-400">
              <Calendar />
              {date}
            </span>
          </div>
          <span className="mt-3 inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400">
            {plan}
          </span>
        </div>
        {placeButton && (
          <div className="w-1/2 self-start mt-0">
          <Button size="sm" onClick={clickFunction}>
            <span className="text-xs">{buttonText}</span>
          </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
