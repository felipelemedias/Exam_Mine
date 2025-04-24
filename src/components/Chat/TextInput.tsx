import React, { KeyboardEvent } from "react";
import { Button } from "../ui/button";
import { ClipLoader } from "react-spinners";
import { cn } from "../../lib/utils";

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  placeholder: string;
  buttonText: string;
  buttonColor: string;
  isProcessing: boolean;
  disabled: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  buttonText,
  buttonColor,
  isProcessing,
  disabled
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className={cn("h-10", buttonColor, "hover:opacity-90 text-white")}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <ClipLoader size={16} color="#ffffff" />
              <span>Processando...</span>
            </div>
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </div>
  );
};