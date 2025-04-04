interface LoaderProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

export const Loader = ({
    message = "Loading...",
    size = 'md',
    fullWidth = false
}: LoaderProps) => {
    const sizeClasses = {
        sm: 'w-8 h-8 border-3',
        md: 'w-12 h-12 border-4',
        lg: 'w-16 h-16 border-4'
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${fullWidth ? 'w-full' : ''}`}>
            {/* Spinner */}
            <div className="relative">
                <div className={`rounded-full border border-gray-200 ${sizeClasses[size]}`}></div>
                <div className={`absolute inset-0 rounded-full border border-transparent border-t-blue-500 border-r-blue-600 animate-spin ${sizeClasses[size]}`}></div>
            </div>

            {/* Message with animated dots */}
            <div className="flex items-center gap-1">
                <span className="text-gray-700 font-medium">{message}</span>
                <span className="flex gap-1">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite]"></span>
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0.2s]"></span>
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0.4s]"></span>
                </span>
            </div>
        </div>
    );
};