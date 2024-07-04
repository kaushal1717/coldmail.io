import { z } from "zod";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailFormType } from "@/app/shared/EmailFormSchema";

function MessageTonesSection() {
  const emailTones = ["Simple", "Shorter", "Longer", "Professional", "Casual"];
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<emailFormType>();
  const emailTone = watch("emailTone");
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Email Tone</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {emailTones.map((tone) => (
          <label
            key={tone}
            className={
              emailTone === tone
                ? "border border-gray-200 flex justify-center items-center cursor-pointer bg-primary text-sm rounded-full px-4 py-2 font-semibold text-gray-600"
                : "border border-gray-200 flex justify-center items-center cursor-pointer bg-seconday text-sm rounded-full px-4 py-2 font-semibold "
            }
          >
            <input
              type="radio"
              value={tone}
              {...register("emailTone", { required: "This field is required" })}
              className="hidden"
            />
            <span>{tone}</span>
          </label>
        ))}
      </div>
      {errors.emailTone && (
        <span className="text-red-500 text-sm font-bold">
          {errors.emailTone?.message}
        </span>
      )}
    </div>
  );
}

export default MessageTonesSection;
