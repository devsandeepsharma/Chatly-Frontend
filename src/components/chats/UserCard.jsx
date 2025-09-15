import { formatTime } from "../../utils/formatTime";

const UserCard = ({ isSelected = false, avatar, title, subtitle, time, unreadCount = 0, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`flex w-full items-center gap-4 overflow-hidden rounded-xl cursor-pointer transition 
                ${isSelected
                    ? "bg-gradient-to-r from-[#00BFA6]/20 to-[#0AE2C3]/20 ring-2 ring-[#00BFA6]"
                    : "bg-white/70 shadow hover:shadow-md hover:scale-[1.01]"
                }`}
        >
            <img
                className="h-15 w-15 rounded-xl object-cover bg-gray-300"
                src={avatar}
                alt={title}
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h3 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                        {title}
                    </h3>
                    {time && (
                        <span className="mr-4 text-xs text-gray-500 whitespace-nowrap">
                            {formatTime(time)}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    {subtitle && (
                        <div className="truncate text-sm text-gray-500 sm:text-base">
                            {subtitle}
                        </div>
                    )}
                    {unreadCount > 0 && (
                        <span className="mr-4 text-xs font-semibold px-2 py-0.5 rounded-full text-white bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3]">
                            {unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserCard;