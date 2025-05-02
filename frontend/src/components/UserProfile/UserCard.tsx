import { Calendar } from 'lucide-react';

interface UserCardProps {
  title: any;
  date: any;
  plan: any;
}

const UserCard: React.FC<UserCardProps> = ({ title, date, plan }) => {
  return (
    <div className="relative p-5 bg-white border border-gray-200 task rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
      <div className="space-y-4">
        <div>
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
      </div>
    </div>
  );
};

export default UserCard;
