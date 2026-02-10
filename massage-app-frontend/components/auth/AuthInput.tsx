import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: LucideIcon;
    delay?: number;
}

export function AuthInput({
    label,
    error,
    icon: Icon,
    delay = 0,
    className = "",
    id,
    ...props
}: AuthInputProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay }}
            className={className}
        >
            <label
                htmlFor={id}
                className="block text-xs text-[color:var(--muted-text)] mb-2 transition-colors duration-300"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    className={`w-full px-3 py-2.5 border ${error
                            ? "border-red-500 focus:ring-red-500"
                            : "border-[color:var(--surface-muted)] focus:ring-[color:var(--accent)]"
                        } bg-[color:var(--card)] text-[color:var(--brand)] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${Icon ? "pl-9" : ""
                        } text-sm`}
                    {...props}
                />
                {Icon && (
                    <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[color:var(--muted-text)]" />
                )}
            </div>
            {error && (
                <motion.p
                    className="text-red-500 text-sm mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
}
