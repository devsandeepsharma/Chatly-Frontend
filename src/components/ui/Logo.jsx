import { Sparkles } from "lucide-react";

const Logo = ({ iconOnly=false }) => {
    return (
        <>
            {
                iconOnly ? (
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg flex items-center justify-center">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-2xl bg-gradient-to-br from-[#00BFA6] to-[#0AE2C3] shadow-lg flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-semibold tracking-tight text-gray-900">Chatly</span>
                    </div>
                )
            }
        </>
    )
}

export default Logo;