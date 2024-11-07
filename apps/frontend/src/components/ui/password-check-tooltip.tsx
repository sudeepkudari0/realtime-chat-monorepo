import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface InputRequiredHintProps {
  value: string;
}

export const PasswordTooltipHint = ({ value }: InputRequiredHintProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger className="flex items-center justify-center rounded-xl text-center text-sm font-bold">
          <span className="relative top-[2px]">
            <InfoIcon className="text-gray-500 font-semibold h-5 w-5" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <ul className="">
            <li
              className={`text-sm ${
                value.length >= 6 ? "text-green-500" : "text-gray-500"
              }`}
            >
              {value.length >= 6 ? "✓" : "✕"} At least 6 characters
            </li>
            <li
              className={`text-sm ${
                /[a-z]/.test(value) ? "text-green-500" : "text-gray-500"
              }`}
            >
              {/[a-z]/.test(value) ? "✓" : "✕"} Contains a lowercase letter
            </li>
            <li
              className={`text-sm ${
                /[A-Z]/.test(value) ? "text-green-500" : "text-gray-500"
              }`}
            >
              {/[A-Z]/.test(value) ? "✓" : "✕"} Contains an uppercase letter
            </li>
            <li
              className={`text-sm ${
                /\d/.test(value) ? "text-green-500" : "text-gray-500"
              }`}
            >
              {/\d/.test(value) ? "✓" : "✕"} Contains a number
            </li>
            <li
              className={`text-sm ${
                /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
                  ? "text-green-500"
                  : "text-gray-500"
              }`}
            >
              {/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) ? "✓" : "✕"}{" "}
              Contains a special character
            </li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
