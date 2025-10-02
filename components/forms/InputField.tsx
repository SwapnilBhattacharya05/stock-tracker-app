import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      {/*htmlFor -> SO THAT WE KNOW FOR WHICH INPUT IT IS FOR*/}
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn("from-input", {
          "opacity-50 cursor-not-allowed": disabled,
        })}
        // SPREAD ALL THE PROPERTIES OF THE register FUNCTION FOR THIS SPECIFIC FIELD, AND GIVE THE validation MESSAGES FOR THAT SPECIFIC FIELD
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
export default InputField;
